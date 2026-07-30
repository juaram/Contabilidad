<?php

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        createSubcategory();
        break;
    case 'DELETE':
        deleteSubcategory();
        break;
    default:
        jsonError('Método no permitido', 405);
}

function createSubcategory(): void
{
    global $pdo;

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

    jsonResponse($sub, 201);
}

function deleteSubcategory(): void
{
    global $pdo;

    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) {
        jsonError('ID de subcategoría no válido');
    }

    $stmt = $pdo->prepare("DELETE FROM " . TABLE_PREFIX . "subcategories WHERE id = :id");
    $stmt->execute([':id' => $id]);

    jsonResponse(['message' => 'Subcategoría eliminada']);
}
