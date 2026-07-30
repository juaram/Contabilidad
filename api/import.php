<?php

require_once __DIR__ . '/config.php';

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

$lineNum = 1;
$imported = 0;
$errors = [];

while (($row = fgetcsv($handle, 0, ';')) !== false) {
    $lineNum++;
    $row = array_map('trim', $row);

    $dateRaw = $row[$colMap['Fecha']] ?? '';
    $catName = $row[$colMap['Categoría']] ?? '';
    $subName = $row[$colMap['Subcategoría']] ?? '';
    $desc = $row[$colMap['Descripción']] ?? '';
    $type = $row[$colMap['Tipo']] ?? '';
    $amountStr = $row[$colMap['Importe']] ?? '';

    if (empty($dateRaw) || empty($catName) || empty($type) || empty($amountStr)) {
        $errors[] = "Línea $lineNum: campos obligatorios vacíos";
        continue;
    }

    $parts = explode('/', $dateRaw);
    $date = count($parts) === 3 ? "$parts[2]-$parts[1]-$parts[0]" : $dateRaw;

    $amount = str_replace(['.', ','], ['', '.'], $amountStr);
    if (!is_numeric($amount)) {
        $errors[] = "Línea $lineNum: importe inválido '$amountStr'";
        continue;
    }

    $stmtCat->execute([':name' => $catName]);
    $cat = $stmtCat->fetch();
    if (!$cat) {
        $errors[] = "Línea $lineNum: categoría '$catName' no encontrada";
        continue;
    }

    $subId = null;
    if (!empty($subName)) {
        $stmtSub->execute([':name' => $subName, ':cat_id' => $cat['id']]);
        $sub = $stmtSub->fetch();
        if ($sub) {
            $subId = $sub['id'];
        }
    }

    $insertMov->execute([
        ':date' => $date,
        ':category_id' => $cat['id'],
        ':subcategory_id' => $subId,
        ':description' => $desc,
        ':type' => $type,
        ':amount' => (float) $amount,
    ]);
    $imported++;
}

fclose($handle);

jsonResponse([
    'message' => "Se importaron $imported movimientos correctamente",
    'imported' => $imported,
    'errors' => $errors,
]);
