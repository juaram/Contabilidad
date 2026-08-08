<?php

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST' && isset($_GET['_method'])) {
    $method = strtoupper($_GET['_method']);
}

switch ($method) {
    case 'POST':
        createSubcategory();
        break;
    case 'PUT':
        updateSubcategory();
        break;
    case 'DELETE':
        deleteSubcategory();
        break;
    default:
        jsonError('Método no permitido', 405);
}

function ensureActiveColumn(): void
{
    global $pdo;
    try { $pdo->exec("ALTER TABLE " . TABLE_PREFIX . "subcategories ADD COLUMN active TINYINT(1) NOT NULL DEFAULT 1 AFTER name"); } catch (PDOException $e) { }
}

function createSubcategory(): void
{
    global $pdo;

    ensureActiveColumn();

    $input = getInput();
    $categoryId = (int) ($input['category_id'] ?? 0);
    $name = trim($input['name'] ?? '');

    if ($categoryId <= 0) {
        jsonError('ID de categoría no válido');
    }
    if ($name === '') {
        jsonError('El nombre de la subcategoría es obligatorio');
    }

    $stmt = $pdo->prepare("SELECT id FROM " . TABLE_PREFIX . "categories WHERE id = :id");
    $stmt->execute([':id' => $categoryId]);
    if (!$stmt->fetch()) {
        jsonError('La categoría no existe', 404);
    }

    $stmt = $pdo->prepare("
        INSERT INTO " . TABLE_PREFIX . "subcategories (category_id, name)
        VALUES (:category_id, :name)
    ");
    $stmt->execute([':category_id' => $categoryId, ':name' => $name]);

    $newId = (int) $pdo->lastInsertId();

    $stmt = $pdo->prepare("SELECT * FROM " . TABLE_PREFIX . "subcategories WHERE id = :id");
    $stmt->execute([':id' => $newId]);
    $sub = $stmt->fetch();
    $sub['id'] = (int) $sub['id'];
    $sub['category_id'] = (int) $sub['category_id'];
    $sub['active'] = (int) ($sub['active'] ?? 1);

    jsonResponse($sub, 201);
}

function updateSubcategory(): void
{
    global $pdo;

    ensureActiveColumn();

    $input = getInput();
    $id = (int) ($input['id'] ?? 0);
    $active = isset($input['active']) ? (int) $input['active'] : null;

    if ($id <= 0) {
        jsonError('ID de subcategoría no válido');
    }

    if ($active === null) {
        jsonError('Debe indicar el estado activo/inactivo de la subcategoría');
    }

    $stmt = $pdo->prepare("UPDATE " . TABLE_PREFIX . "subcategories SET active = :active WHERE id = :id");
    $stmt->execute([':active' => $active ? 1 : 0, ':id' => $id]);

    $stmt = $pdo->prepare("SELECT * FROM " . TABLE_PREFIX . "subcategories WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $sub = $stmt->fetch();

    if (!$sub) {
        jsonError('Subcategoría no encontrada', 404);
    }

    $sub['id'] = (int) $sub['id'];
    $sub['category_id'] = (int) $sub['category_id'];
    $sub['active'] = (int) ($sub['active'] ?? 1);

    jsonResponse($sub);
}

function deleteSubcategory(): void
{
    global $pdo;

    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) {
        jsonError('ID de subcategoría no válido');
    }

    $check = $pdo->prepare("SELECT COUNT(*) AS cnt FROM " . TABLE_PREFIX . "movements WHERE subcategory_id = :id");
    $check->execute([':id' => $id]);
    $result = $check->fetch();

    if ((int) $result['cnt'] > 0) {
        jsonError('No se puede eliminar: la subcategoría tiene movimientos asociados', 409);
    }

    $stmt = $pdo->prepare("DELETE FROM " . TABLE_PREFIX . "subcategories WHERE id = :id");
    $stmt->execute([':id' => $id]);

    jsonResponse(['message' => 'Subcategoría eliminada']);
}
