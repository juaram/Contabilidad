<?php

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'POST') {
    jsonError('Método no permitido', 405);
}

$input = getInput();

$filterCategory    = trim($input['filter_category'] ?? '');
$filterSubcategory = trim($input['filter_subcategory'] ?? '');
$filterDescription = trim($input['filter_description'] ?? '');
$finalCategory     = trim($input['final_category'] ?? '');
$finalSubcategory  = trim($input['final_subcategory'] ?? '');
$finalDescription  = trim($input['final_description'] ?? '');
$preview           = !empty($input['preview']);

if ($filterCategory === '' || $filterSubcategory === '' || $finalCategory === '' || $finalSubcategory === '') {
    jsonError('Categoría y subcategoría iniciales y finales son obligatorias');
}

function findCategoryIdByName(string $name): ?int
{
    global $pdo;
    $stmt = $pdo->prepare("SELECT id FROM " . TABLE_PREFIX . "categories WHERE name = :name LIMIT 1");
    $stmt->execute([':name' => $name]);
    $row = $stmt->fetch();
    return $row ? (int) $row['id'] : null;
}

function findSubcategoryIdByName(string $name, int $categoryId): ?int
{
    global $pdo;
    $stmt = $pdo->prepare("SELECT id FROM " . TABLE_PREFIX . "subcategories WHERE name = :name AND category_id = :cid LIMIT 1");
    $stmt->execute([':name' => $name, ':cid' => $categoryId]);
    $row = $stmt->fetch();
    return $row ? (int) $row['id'] : null;
}

$filterCatId = findCategoryIdByName($filterCategory);
if ($filterCatId === null) {
    jsonError("La categoría inicial '$filterCategory' no existe");
}
$filterSubId = findSubcategoryIdByName($filterSubcategory, $filterCatId);
if ($filterSubId === null) {
    jsonError("La subcategoría inicial '$filterSubcategory' no existe en '$filterCategory'");
}

$finalCatId = findCategoryIdByName($finalCategory);
if ($finalCatId === null) {
    jsonError("La categoría final '$finalCategory' no existe");
}
$finalSubId = findSubcategoryIdByName($finalSubcategory, $finalCatId);
$createdSub = null;
if ($finalSubId === null) {
    $stmt = $pdo->prepare("INSERT INTO " . TABLE_PREFIX . "subcategories (category_id, name) VALUES (:cid, :name)");
    $stmt->execute([':cid' => $finalCatId, ':name' => $finalSubcategory]);
    $finalSubId = (int) $pdo->lastInsertId();
    $createdSub = $finalSubcategory;
}

$where = "m.category_id = :fcat AND m.subcategory_id = :fsub";
$params = [':fcat' => $filterCatId, ':fsub' => $filterSubId];

if ($filterDescription !== '') {
    $tokens = preg_split('/\s+OR\s+/i', $filterDescription);
    $ors = [];
    $i = 0;
    foreach ($tokens as $token) {
        $token = trim($token);
        if ($token === '') {
            continue;
        }
        $key = ':pat' . $i;
        $ors[] = "m.description LIKE " . $key;
        $params[$key] = str_replace('*', '%', $token);
        $i++;
    }
    if (count($ors) > 0) {
        $where .= ' AND (' . implode(' OR ', $ors) . ')';
    }
}

$monthLiterals = [
    1 => 'enero', 2 => 'febrero', 3 => 'marzo', 4 => 'abril', 5 => 'mayo', 6 => 'junio',
    7 => 'julio', 8 => 'agosto', 9 => 'septiembre', 10 => 'octubre', 11 => 'noviembre', 12 => 'diciembre',
];

$selectStmt = $pdo->prepare("
    SELECT m.id, m.date, m.description, m.type, m.amount,
           c.name AS category, s.name AS subcategory
    FROM " . TABLE_PREFIX . "movements m
    JOIN " . TABLE_PREFIX . "categories c ON m.category_id = c.id
    JOIN " . TABLE_PREFIX . "subcategories s ON m.subcategory_id = s.id
    WHERE $where
    ORDER BY m.date, m.id
");
$selectStmt->execute($params);
$matched = $selectStmt->fetchAll();

if ($preview) {
    jsonResponse([
        'preview' => true,
        'total' => count($matched),
        'movements' => array_map(function ($m) {
            return [
                'id' => (int) $m['id'],
                'date' => $m['date'],
                'description' => $m['description'],
                'category' => $m['category'],
                'subcategory' => $m['subcategory'],
                'type' => $m['type'],
                'amount' => (float) $m['amount'],
            ];
        }, $matched),
    ]);
}

$pdo->beginTransaction();
try {
    $updateStmt = $pdo->prepare("
        UPDATE " . TABLE_PREFIX . "movements
        SET category_id = :ccat, subcategory_id = :csub, description = :cdesc
        WHERE id = :id
    ");
    $updated = 0;
    foreach ($matched as $m) {
        $desc = $m['description'];
        if ($finalDescription !== '') {
            $desc = $finalDescription;
            if (strpos($desc, '#mes') !== false) {
                $monthNum = (int) date('n', strtotime($m['date']));
                $desc = str_replace('#mes', $monthLiterals[$monthNum] ?? '', $desc);
            }
        }
        $updateStmt->execute([
            ':ccat' => $finalCatId,
            ':csub' => $finalSubId,
            ':cdesc' => $desc,
            ':id' => (int) $m['id'],
        ]);
        $updated++;
    }
    $pdo->commit();
} catch (Exception $e) {
    $pdo->rollBack();
    jsonError('Error al aplicar la actualización de movimientos', 500);
}

$response = [
    'preview' => false,
    'updated' => $updated,
];
if ($createdSub !== null) {
    $response['created_subcategories'] = [$createdSub];
}
jsonResponse($response);
