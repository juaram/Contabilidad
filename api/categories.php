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
        if (isset($_GET['_action']) && $_GET['_action'] === 'reorder') {
            reorderCategories();
        } else {
            createCategory();
        }
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
    try { $pdo->exec("ALTER TABLE " . TABLE_PREFIX . "categories ADD COLUMN sort_order INT UNSIGNED NOT NULL DEFAULT 0 AFTER color_text"); } catch (PDOException $e) { }
    try { $pdo->exec("ALTER TABLE " . TABLE_PREFIX . "subcategories ADD COLUMN active TINYINT(1) NOT NULL DEFAULT 1 AFTER name"); } catch (PDOException $e) { }

    $stmt = $pdo->query("
        SELECT c.*, 
               (SELECT COUNT(*) FROM " . TABLE_PREFIX . "movements m WHERE m.category_id = c.id) AS movement_count
        FROM " . TABLE_PREFIX . "categories c
        ORDER BY c.sort_order ASC, c.name ASC
    ");
    $categories = $stmt->fetchAll();

    $stmtSub = $pdo->query("
        SELECT * FROM " . TABLE_PREFIX . "subcategories
        ORDER BY name ASC
    ");
    $subcategories = $stmtSub->fetchAll();

    $subByCategory = [];
    foreach ($subcategories as $sub) {
        $sub['id'] = (int) $sub['id'];
        $sub['category_id'] = (int) $sub['category_id'];
        $sub['active'] = (int) ($sub['active'] ?? 1);
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
    try { $pdo->exec("ALTER TABLE " . TABLE_PREFIX . "categories ADD COLUMN sort_order INT UNSIGNED NOT NULL DEFAULT 0 AFTER color_text"); } catch (PDOException $e) { }

    $input = getInput();
    $name = trim($input['name'] ?? '');
    $icon = trim($input['icon'] ?? 'category');
    $colorBg = trim($input['color_bg'] ?? 'bg-primary-fixed');
    $colorText = trim($input['color_text'] ?? 'text-on-primary-fixed');

    if ($name === '') {
        jsonError('El nombre de la categoría es obligatorio');
    }

    // Get max sort_order for new category
    $stmt = $pdo->query("SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM " . TABLE_PREFIX . "categories");
    $nextOrder = (int) $stmt->fetchColumn();

    $stmt = $pdo->prepare("
        INSERT INTO " . TABLE_PREFIX . "categories (name, icon, color_bg, color_text, sort_order)
        VALUES (:name, :icon, :color_bg, :color_text, :sort_order)
    ");
    $stmt->execute([
        ':name' => $name,
        ':icon' => $icon,
        ':color_bg' => $colorBg,
        ':color_text' => $colorText,
        ':sort_order' => $nextOrder,
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
    $sortOrder = isset($input['sort_order']) ? (int) $input['sort_order'] : null;

    if ($id <= 0) {
        jsonError('ID de categoría no válido');
    }
    if ($name === '') {
        jsonError('El nombre de la categoría es obligatorio');
    }

    $sql = "
        UPDATE " . TABLE_PREFIX . "categories
        SET name = :name, icon = :icon, color_bg = :color_bg, color_text = :color_text
    ";
    $params = [
        ':id' => $id,
        ':name' => $name,
        ':icon' => $icon,
        ':color_bg' => $colorBg,
        ':color_text' => $colorText,
    ];

    if ($sortOrder !== null) {
        $sql .= ", sort_order = :sort_order";
        $params[':sort_order'] = $sortOrder;
    }

    $sql .= " WHERE id = :id";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

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

function reorderCategories(): void
{
    global $pdo;

    $input = getInput();
    $order = $input['order'] ?? [];

    if (!is_array($order) || count($order) === 0) {
        jsonError('Datos de ordenación inválidos');
    }

    try {
        $pdo->beginTransaction();

        $stmt = $pdo->prepare("
            UPDATE " . TABLE_PREFIX . "categories
            SET sort_order = :sort_order
            WHERE id = :id
        ");

        foreach ($order as $index => $item) {
            $id = (int) ($item['id'] ?? 0);
            $sortOrder = (int) ($item['sort_order'] ?? $index);
            if ($id > 0) {
                $stmt->execute([
                    ':id' => $id,
                    ':sort_order' => $sortOrder,
                ]);
            }
        }

        $pdo->commit();
        jsonResponse(['message' => 'Orden actualizado']);
    } catch (Exception $e) {
        $pdo->rollBack();
        jsonError('Error al reordenar: ' . $e->getMessage());
    }
}
