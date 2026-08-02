<?php

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST' && isset($_GET['_method'])) {
    $method = strtoupper($_GET['_method']);
}

ensureTable();

switch ($method) {
    case 'GET':
        listBudgets();
        break;
    case 'POST':
        createBudget();
        break;
    case 'PUT':
        updateBudget();
        break;
    case 'DELETE':
        deleteBudget();
        break;
    default:
        jsonError('Método no permitido', 405);
}

function ensureTable(): void
{
    global $pdo;
    try {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS " . TABLE_PREFIX . "budgets (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category_id INT NOT NULL,
                subcategory_id INT NULL,
                type ENUM('gasto','ingreso') NOT NULL DEFAULT 'gasto',
                year INT NOT NULL,
                month VARCHAR(2) NOT NULL DEFAULT '00',
                amount DECIMAL(10,2) NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE KEY uq_budget (category_id, subcategory_id, type, year, month)
            )
        ");
    } catch (PDOException $e) {
        jsonError('Error al inicializar la tabla de presupuestos', 500);
    }
}

function listBudgets(): void
{
    global $pdo;

    $year = (int) ($_GET['year'] ?? 0);
    $month = $_GET['month'] ?? '';
    $type = trim($_GET['type'] ?? '');

    $where = [];
    $params = [];

    if ($year > 0) {
        $where[] = "b.year = :year";
        $params[':year'] = $year;
    }
    if ($month !== '' && $month !== 'todos') {
        $where[] = "b.month = :month";
        $params[':month'] = $month;
    }
    if ($type !== '' && in_array($type, ['gasto', 'ingreso'])) {
        $where[] = "b.type = :type";
        $params[':type'] = $type;
    }

    $whereClause = count($where) > 0 ? 'WHERE ' . implode(' AND ', $where) : '';

    $stmt = $pdo->prepare("
        SELECT b.id, b.category_id, b.subcategory_id, b.type, b.year, b.month, b.amount,
               c.name AS cat_name, s.name AS sub_name
        FROM " . TABLE_PREFIX . "budgets b
        LEFT JOIN " . TABLE_PREFIX . "categories c ON b.category_id = c.id
        LEFT JOIN " . TABLE_PREFIX . "subcategories s ON b.subcategory_id = s.id
        $whereClause
        ORDER BY b.year DESC, b.type ASC, c.name ASC, b.month ASC
    ");
    $stmt->execute($params);

    $rows = [];
    foreach ($stmt->fetchAll() as $b) {
        $rows[] = [
            'id' => (int) $b['id'],
            'category_id' => (int) $b['category_id'],
            'subcategory_id' => $b['subcategory_id'] ? (int) $b['subcategory_id'] : null,
            'category' => $b['cat_name'],
            'subcategory' => $b['sub_name'] ?? '',
            'type' => $b['type'],
            'year' => (int) $b['year'],
            'month' => $b['month'],
            'amount' => (float) $b['amount'],
        ];
    }

    jsonResponse($rows);
}

function createBudget(): void
{
    global $pdo;

    $input = getInput();
    $categoryId = (int) ($input['category_id'] ?? 0);
    $subcategoryId = isset($input['subcategory_id']) && $input['subcategory_id'] !== '' ? (int) $input['subcategory_id'] : null;
    $type = trim($input['type'] ?? 'gasto');
    $year = (int) ($input['year'] ?? 0);
    $month = trim($input['month'] ?? '00');
    $amount = (float) ($input['amount'] ?? 0);

    if ($categoryId <= 0) {
        jsonError('La categoría es obligatoria');
    }
    if (!in_array($type, ['gasto', 'ingreso'])) {
        jsonError('El tipo debe ser gasto o ingreso');
    }
    if ($year <= 0) {
        jsonError('El año es obligatorio');
    }
    if ($month === '' || (strlen($month) === 2 && ($month < '00' || $month > '12'))) {
        jsonError('El mes no es válido');
    }
    if ($amount < 0) {
        jsonError('El importe no puede ser negativo');
    }

    $stmt = $pdo->prepare("
        INSERT INTO " . TABLE_PREFIX . "budgets (category_id, subcategory_id, type, year, month, amount)
        VALUES (:category_id, :subcategory_id, :type, :year, :month, :amount)
    ");
    $stmt->execute([
        ':category_id' => $categoryId,
        ':subcategory_id' => $subcategoryId,
        ':type' => $type,
        ':year' => $year,
        ':month' => $month,
        ':amount' => $amount,
    ]);

    $newId = (int) $pdo->lastInsertId();

    $stmt = $pdo->prepare("
        SELECT b.*, c.name AS cat_name, s.name AS sub_name
        FROM " . TABLE_PREFIX . "budgets b
        LEFT JOIN " . TABLE_PREFIX . "categories c ON b.category_id = c.id
        LEFT JOIN " . TABLE_PREFIX . "subcategories s ON b.subcategory_id = s.id
        WHERE b.id = :id
    ");
    $stmt->execute([':id' => $newId]);
    $b = $stmt->fetch();

    jsonResponse([
        'id' => (int) $b['id'],
        'category_id' => (int) $b['category_id'],
        'subcategory_id' => $b['subcategory_id'] ? (int) $b['subcategory_id'] : null,
        'category' => $b['cat_name'],
        'subcategory' => $b['sub_name'] ?? '',
        'type' => $b['type'],
        'year' => (int) $b['year'],
        'month' => $b['month'],
        'amount' => (float) $b['amount'],
    ], 201);
}

function updateBudget(): void
{
    global $pdo;

    $input = getInput();
    $id = (int) ($input['id'] ?? 0);
    $categoryId = (int) ($input['category_id'] ?? 0);
    $subcategoryId = isset($input['subcategory_id']) && $input['subcategory_id'] !== '' ? (int) $input['subcategory_id'] : null;
    $type = trim($input['type'] ?? 'gasto');
    $year = (int) ($input['year'] ?? 0);
    $month = trim($input['month'] ?? '00');
    $amount = (float) ($input['amount'] ?? 0);

    if ($id <= 0) {
        jsonError('ID de presupuesto no válido');
    }
    if ($categoryId <= 0) {
        jsonError('La categoría es obligatoria');
    }
    if (!in_array($type, ['gasto', 'ingreso'])) {
        jsonError('El tipo debe ser gasto o ingreso');
    }
    if ($year <= 0) {
        jsonError('El año es obligatorio');
    }
    if ($month === '' || (strlen($month) === 2 && ($month < '00' || $month > '12'))) {
        jsonError('El mes no es válido');
    }
    if ($amount < 0) {
        jsonError('El importe no puede ser negativo');
    }

    $stmt = $pdo->prepare("
        UPDATE " . TABLE_PREFIX . "budgets
        SET category_id = :category_id, subcategory_id = :subcategory_id, type = :type,
            year = :year, month = :month, amount = :amount
        WHERE id = :id
    ");
    $stmt->execute([
        ':id' => $id,
        ':category_id' => $categoryId,
        ':subcategory_id' => $subcategoryId,
        ':type' => $type,
        ':year' => $year,
        ':month' => $month,
        ':amount' => $amount,
    ]);

    $stmt = $pdo->prepare("
        SELECT b.*, c.name AS cat_name, s.name AS sub_name
        FROM " . TABLE_PREFIX . "budgets b
        LEFT JOIN " . TABLE_PREFIX . "categories c ON b.category_id = c.id
        LEFT JOIN " . TABLE_PREFIX . "subcategories s ON b.subcategory_id = s.id
        WHERE b.id = :id
    ");
    $stmt->execute([':id' => $id]);
    $b = $stmt->fetch();

    jsonResponse([
        'id' => (int) $b['id'],
        'category_id' => (int) $b['category_id'],
        'subcategory_id' => $b['subcategory_id'] ? (int) $b['subcategory_id'] : null,
        'category' => $b['cat_name'],
        'subcategory' => $b['sub_name'] ?? '',
        'type' => $b['type'],
        'year' => (int) $b['year'],
        'month' => $b['month'],
        'amount' => (float) $b['amount'],
    ]);
}

function deleteBudget(): void
{
    global $pdo;

    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) {
        jsonError('ID de presupuesto no válido');
    }

    $stmt = $pdo->prepare("DELETE FROM " . TABLE_PREFIX . "budgets WHERE id = :id");
    $stmt->execute([':id' => $id]);

    jsonResponse(['message' => 'Presupuesto eliminado']);
}
