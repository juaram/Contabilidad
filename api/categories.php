<?php

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST' && isset($_GET['_method'])) {
    $method = strtoupper($_GET['_method']);
}

switch ($method) {
    case 'GET':
        getCategories();
        break;
    case 'POST':
        createCategory();
        break;
    case 'PUT':
        updateCategory();
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

    try { $pdo->exec("ALTER TABLE " . TABLE_PREFIX . "categories MODIFY icon VARCHAR(255) NOT NULL DEFAULT 'category'"); } catch (PDOException $e) { }

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

    try { $pdo->exec("ALTER TABLE " . TABLE_PREFIX . "categories DROP COLUMN code"); } catch (PDOException $e) { }

    $input = getInput();
    $name = trim($input['name'] ?? '');
    $icon = trim($input['icon'] ?? 'category');
    $colorBg = trim($input['color_bg'] ?? 'bg-primary-fixed');
    $colorText = trim($input['color_text'] ?? 'text-on-primary-fixed');

    if ($name === '') {
        jsonError('El nombre de la categoría es obligatorio');
    }

    $stmt = $pdo->prepare("
        INSERT INTO " . TABLE_PREFIX . "categories (name, icon, color_bg, color_text)
        VALUES (:name, :icon, :color_bg, :color_text)
    ");
    $stmt->execute([
        ':name' => $name,
        ':icon' => $icon,
        ':color_bg' => $colorBg,
        ':color_text' => $colorText,
    ]);

    $newId = (int) $pdo->lastInsertId();

    $stmt = $pdo->prepare("SELECT * FROM " . TABLE_PREFIX . "categories WHERE id = :id");
    $stmt->execute([':id' => $newId]);
    $category = $stmt->fetch();
    $category['id'] = (int) $category['id'];
    $category['subcategories'] = [];
    $category['movement_count'] = 0;

    jsonResponse($category, 201);
}

function updateCategory(): void
{
    global $pdo;

    $input = getInput();
    $id = (int) ($input['id'] ?? 0);
    $name = trim($input['name'] ?? '');
    $icon = trim($input['icon'] ?? 'category');
    $colorBg = trim($input['color_bg'] ?? 'bg-primary-fixed');
    $colorText = trim($input['color_text'] ?? 'text-on-primary-fixed');

    if ($id <= 0) {
        jsonError('ID de categoría no válido');
    }
    if ($name === '') {
        jsonError('El nombre de la categoría es obligatorio');
    }

    $stmt = $pdo->prepare("
        UPDATE " . TABLE_PREFIX . "categories
        SET name = :name, icon = :icon, color_bg = :color_bg, color_text = :color_text
        WHERE id = :id
    ");
    $stmt->execute([
        ':id' => $id,
        ':name' => $name,
        ':icon' => $icon,
        ':color_bg' => $colorBg,
        ':color_text' => $colorText,
    ]);

    $stmt = $pdo->prepare("SELECT * FROM " . TABLE_PREFIX . "categories WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $category = $stmt->fetch();

    if (!$category) {
        jsonError('Categoría no encontrada', 404);
    }

    $category['id'] = (int) $category['id'];
    $category['subcategories'] = [];
    $category['movement_count'] = 0;

    jsonResponse($category);
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
