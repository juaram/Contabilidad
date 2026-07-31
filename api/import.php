<?php

require_once __DIR__ . '/config.php';

function parseAmount(string $s): float
{
    $s = trim($s);
    $s = str_replace(' ', '', $s);
    $s = preg_replace('/[^0-9.,]/', '', $s);

    $hasComma = strpos($s, ',') !== false;
    $hasDot = strpos($s, '.') !== false;

    if ($hasComma && $hasDot) {
        // Separador decimal = coma, separador de miles = punto
        $s = str_replace('.', '', $s);
        $s = str_replace(',', '.', $s);
    } elseif ($hasComma) {
        $s = str_replace(',', '.', $s);
    } elseif ($hasDot && substr_count($s, '.') === 1 && preg_match('/\.\d{1,2}$/', $s)) {
        // Un único punto al final: se interpreta como decimal
        $s = str_replace(',', '.', $s);
    } elseif ($hasDot) {
        // Múltiples puntos: se interpretan como separadores de miles
        $s = str_replace('.', '', $s);
    }

    return (float) $s;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Método no permitido', 405);
}

$file = $_FILES['file'] ?? null;
if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
    jsonError('No se recibió ningún archivo o hubo un error al subirlo');
}

$handle = fopen($file['tmp_name'], 'r');
if (!$handle) {
    jsonError('No se pudo abrir el archivo');
}

$header = fgetcsv($handle, 0, ';');
if (!$header) {
    fclose($handle);
    jsonError('El archivo CSV no tiene cabecera');
}

$header[0] = preg_replace('/^\xEF\xBB\xBF/', '', $header[0]);
$header = array_map('trim', $header);
$expected = ['Fecha', 'Categoría', 'Subcategoría', 'Descripción', 'Tipo', 'Importe'];
$colMap = [];
foreach ($expected as $col) {
    $idx = array_search($col, $header);
    if ($idx === false) {
        fclose($handle);
        jsonError("Columna '$col' no encontrada en la cabecera del CSV");
    }
    $colMap[$col] = $idx;
}

$stmtCat = $pdo->prepare("SELECT id, name FROM " . TABLE_PREFIX . "categories WHERE name = :name");
$stmtSub = $pdo->prepare("SELECT id FROM " . TABLE_PREFIX . "subcategories WHERE name = :name AND category_id = :cat_id");

$insertMov = $pdo->prepare("
    INSERT INTO " . TABLE_PREFIX . "movements (date, category_id, subcategory_id, description, type, amount)
    VALUES (:date, :category_id, :subcategory_id, :description, :type, :amount)
");

// Pass 1: validate every row BEFORE inserting anything.
$lineNum = 1;
$validRows = [];
$invalidRecords = [];

while (($row = fgetcsv($handle, 0, ';')) !== false) {
    $lineNum++;
    $row = array_map('trim', $row);

    $dateRaw = $row[$colMap['Fecha']] ?? '';
    $catName = $row[$colMap['Categoría']] ?? '';
    $subName = $row[$colMap['Subcategoría']] ?? '';
    $desc = $row[$colMap['Descripción']] ?? '';
    $type = $row[$colMap['Tipo']] ?? '';
    $amountStr = $row[$colMap['Importe']] ?? '';

    $recordInfo = [
        'line' => $lineNum,
        'date' => $dateRaw,
        'category' => $catName,
        'subcategory' => $subName,
        'description' => $desc,
        'type' => $type,
        'amount' => $amountStr,
        'reason' => '',
    ];

    if (empty($dateRaw) || empty($catName) || empty($type) || empty($amountStr)) {
        $recordInfo['reason'] = 'Campos obligatorios vacíos';
        $invalidRecords[] = $recordInfo;
        continue;
    }

    $amount = parseAmount($amountStr);
    if (!is_numeric($amount) || $amount <= 0) {
        $recordInfo['reason'] = "Importe inválido '$amountStr'";
        $invalidRecords[] = $recordInfo;
        continue;
    }

    $stmtCat->execute([':name' => $catName]);
    $cat = $stmtCat->fetch();
    if (!$cat) {
        $recordInfo['reason'] = "Categoría '$catName' no encontrada";
        $invalidRecords[] = $recordInfo;
        continue;
    }

    $subId = null;
    if (!empty($subName)) {
        $stmtSub->execute([':name' => $subName, ':cat_id' => $cat['id']]);
        $sub = $stmtSub->fetch();
        if (!$sub) {
            $recordInfo['reason'] = "Subcategoría '$subName' no encontrada en la categoría '$catName'";
            $invalidRecords[] = $recordInfo;
            continue;
        }
        $subId = $sub['id'];
    }

    $parts = explode('/', $dateRaw);
    $date = count($parts) === 3 ? "$parts[2]-$parts[1]-$parts[0]" : $dateRaw;

    $validRows[] = [
        ':date' => $date,
        ':category_id' => $cat['id'],
        ':subcategory_id' => $subId,
        ':description' => $desc,
        ':type' => $type,
        ':amount' => (float) $amount,
    ];
}

fclose($handle);

// If any record fails validation, do NOT insert anything and list the problems.
if (count($invalidRecords) > 0) {
    jsonResponse([
        'success' => false,
        'message' => count($invalidRecords) . ' registro(s) no cumplen las validaciones. No se ha importado nada.',
        'invalid_records' => $invalidRecords,
    ], 422);
}

// Pass 2: all records are valid, insert them.
$imported = 0;
foreach ($validRows as $params) {
    $insertMov->execute($params);
    $imported++;
}

jsonResponse([
    'success' => true,
    'message' => "Se importaron $imported movimientos correctamente",
    'imported' => $imported,
]);
