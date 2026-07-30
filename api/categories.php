<?php

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getCategories();
        break;
    case 'POST':
        createCategory();
        break;
    case 'DELETE':
        deleteCategory();
        break;
    default:
        jsonError('Método no permitido', 405);
}

function getCategories(): void
{
    global $pdo;

    $stmt = $pdo->query("
        SELECT c.*, 
               (SELECT COUNT(*) FROM " . TABLE_PREFIX . "movements m WHERE m.category_id = c.id) AS movement_count
        FROM " . TABLE_PREFIX . "categories c
        ORDER BY c.name ASC
    ");
    $categories = $stmt->fetchAll();

    $stmtSub = $pdo->query("
        SELECT * FROM " . TABLE_PREFIX . "subcategories
        ORDER BY name ASC
    ");
    $subcategories = $stmtSub->fetchAll();

    $subByCategory = [];
    foreach ($subcategories as $sub) {
        $subByCategory[$sub['category_id']][] = $sub;
    }

    foreach ($categories as &$cat) {
        $cat['subcategories'] = $subByCategory[$cat['id']] ?? [];
        $cat['movement_count'] = (int) $cat['movement_count'];
        $cat['id'] = (int) $cat['id'];
    }

    jsonResponse($categories);
}

function createCategory(): void
{
    global $pdo;

    $input = getInput();
    $name = trim($input['name'] ?? '');
    $code = strtoupper(trim($input['code'] ?? ''));
    $icon = trim($input['icon'] ?? 'category');

    if ($name === '') {
        jsonError('El nombre de la categoría es obligatorio');
    }

    if ($code === '') {
        $code = strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $name), 0, 3));
    }

    $stmt = $pdo->prepare("
        INSERT INTO " . TABLE_PREFIX . "categories (code, name, icon)
        VALUES (:code, :name, :icon)
    ");
    $stmt->execute([':code' => $code, ':name' => $name, ':icon' => $icon]);

    $newId = (int) $pdo->lastInsertId();

    $stmt = $pdo->prepare("SELECT * FROM " . TABLE_PREFIX . "categories WHERE id = :id");
    $stmt->execute([':id' => $newId]);
    $category = $stmt->fetch();
    $category['id'] = (int) $category['id'];
    $category['subcategories'] = [];
    $category['movement_count'] = 0;

    jsonResponse($category, 201);
}

function deleteCategory(): void
{
    global $pdo;

    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) {
        jsonError('ID de categoría no válido');
    }

    $check = $pdo->prepare("SELECT COUNT(*) AS cnt FROM " . TABLE_PREFIX . "movements WHERE category_id = :id");
    $check->execute([':id' => $id]);
    $result = $check->fetch();

    if ((int) $result['cnt'] > 0) {
        jsonError('No se puede eliminar: la categoría tiene movimientos asociados', 409);
    }

    $stmt = $pdo->prepare("DELETE FROM " . TABLE_PREFIX . "categories WHERE id = :id");
    $stmt->execute([':id' => $id]);

    jsonResponse(['message' => 'Categoría eliminada']);
}
