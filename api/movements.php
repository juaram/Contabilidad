<?php

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST' && isset($_GET['_method'])) {
    $method = strtoupper($_GET['_method']);
}

switch ($method) {
    case 'GET':
        listMovements();
        break;
    case 'POST':
        createMovement();
        break;
    case 'DELETE':
        deleteMovement();
        break;
    default:
        jsonError('Método no permitido', 405);
}

function listMovements(): void
{
    global $pdo;

    $year = $_GET['year'] ?? '';
    $month = $_GET['month'] ?? '';
    $categoryId = (int) ($_GET['category_id'] ?? 0);
    $subcategoryId = (int) ($_GET['subcategory_id'] ?? 0);
    $search = trim($_GET['search'] ?? '');
    $page = max(1, (int) ($_GET['page'] ?? 1));
    $pageSize = 8;

    $where = [];
    $params = [];

    if ($year !== '') {
        $where[] = "YEAR(m.date) = :year";
        $params[':year'] = (int) $year;
    }
    if ($month !== '' && $month !== 'todos') {
        $where[] = "MONTH(m.date) = :month";
        $params[':month'] = (int) $month;
    }
    if ($categoryId > 0) {
        $where[] = "m.category_id = :category_id";
        $params[':category_id'] = $categoryId;
    }
    if ($subcategoryId > 0) {
        $where[] = "m.subcategory_id = :subcategory_id";
        $params[':subcategory_id'] = $subcategoryId;
    }
    if ($search !== '') {
        $where[] = "(m.description LIKE :search OR c.name LIKE :search2 OR s.name LIKE :search3)";
        $params[':search'] = "%$search%";
        $params[':search2'] = "%$search%";
        $params[':search3'] = "%$search%";
    }

    $whereClause = count($where) > 0 ? 'WHERE ' . implode(' AND ', $where) : '';

    $countStmt = $pdo->prepare("
        SELECT COUNT(*) AS total
        FROM " . TABLE_PREFIX . "movements m
        LEFT JOIN " . TABLE_PREFIX . "categories c ON m.category_id = c.id
        LEFT JOIN " . TABLE_PREFIX . "subcategories s ON m.subcategory_id = s.id
        $whereClause
    ");
    $countStmt->execute($params);
    $totalRecords = (int) $countStmt->fetch()['total'];
    $totalPages = max(1, (int) ceil($totalRecords / $pageSize));
    $offset = ($page - 1) * $pageSize;

    $stmt = $pdo->prepare("
        SELECT m.id, m.date, m.category_id, m.subcategory_id, m.description, m.type, m.amount, m.created_at,
               c.id AS cat_id, c.name AS cat_name, c.icon AS cat_icon,
               s.id AS sub_id, s.name AS sub_name
        FROM " . TABLE_PREFIX . "movements m
        LEFT JOIN " . TABLE_PREFIX . "categories c ON m.category_id = c.id
        LEFT JOIN " . TABLE_PREFIX . "subcategories s ON m.subcategory_id = s.id
        $whereClause
        ORDER BY m.date DESC, m.id DESC
        LIMIT :limit OFFSET :offset
    ");
    foreach ($params as $key => $val) {
        $stmt->bindValue($key, $val);
    }
    $stmt->bindValue(':limit', $pageSize, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $movements = $stmt->fetchAll();

    $income = 0;
    $expense = 0;
    $balance = 0;

    $allStmt = $pdo->prepare("
        SELECT m.type, m.amount
        FROM " . TABLE_PREFIX . "movements m
        LEFT JOIN " . TABLE_PREFIX . "categories c ON m.category_id = c.id
        LEFT JOIN " . TABLE_PREFIX . "subcategories s ON m.subcategory_id = s.id
        $whereClause
    ");
    $allStmt->execute($params);
    foreach ($allStmt as $row) {
        if ($row['type'] === 'ingreso') {
            $income += (float) $row['amount'];
            $balance += (float) $row['amount'];
        } else {
            $expense += (float) $row['amount'];
            $balance -= (float) $row['amount'];
        }
    }

    $rows = [];
    foreach ($movements as $m) {
        $rows[] = [
            'id' => (int) $m['id'],
            'date' => $m['date'],
            'category_id' => (int) $m['category_id'],
            'subcategory_id' => $m['subcategory_id'] ? (int) $m['subcategory_id'] : null,
            'category' => $m['cat_name'],
            'subcategory' => $m['sub_name'] ?? '',
            'description' => $m['description'],
            'type' => $m['type'],
            'amount' => (float) $m['amount'],
        ];
    }

    jsonResponse([
        'movements' => $rows,
        'totals' => [
            'income' => $income,
            'expense' => $expense,
            'balance' => $balance,
        ],
        'pagination' => [
            'page' => $page,
            'page_size' => $pageSize,
            'total_records' => $totalRecords,
            'total_pages' => $totalPages,
        ],
    ]);
}

function createMovement(): void
{
    global $pdo;

    $input = getInput();
    $date = trim($input['date'] ?? '');
    $categoryId = (int) ($input['category_id'] ?? 0);
    $subcategoryId = isset($input['subcategory_id']) && $input['subcategory_id'] !== '' ? (int) $input['subcategory_id'] : null;
    $description = trim($input['description'] ?? '');
    $type = trim($input['type'] ?? '');
    $amount = (float) ($input['amount'] ?? 0);

    if ($date === '') {
        jsonError('La fecha es obligatoria');
    }
    if ($categoryId <= 0) {
        jsonError('La categoría es obligatoria');
    }
    if ($description === '') {
        jsonError('La descripción es obligatoria');
    }
    if (!in_array($type, ['ingreso', 'gasto'])) {
        jsonError('El tipo debe ser ingreso o gasto');
    }
    if ($amount <= 0) {
        jsonError('El importe debe ser mayor que cero');
    }

    $stmt = $pdo->prepare("
        INSERT INTO " . TABLE_PREFIX . "movements (date, category_id, subcategory_id, description, type, amount)
        VALUES (:date, :category_id, :subcategory_id, :description, :type, :amount)
    ");
    $stmt->execute([
        ':date' => $date,
        ':category_id' => $categoryId,
        ':subcategory_id' => $subcategoryId,
        ':description' => $description,
        ':type' => $type,
        ':amount' => $amount,
    ]);

    $newId = (int) $pdo->lastInsertId();

    $stmt = $pdo->prepare("
        SELECT m.*, c.name AS cat_name, s.name AS sub_name
        FROM " . TABLE_PREFIX . "movements m
        LEFT JOIN " . TABLE_PREFIX . "categories c ON m.category_id = c.id
        LEFT JOIN " . TABLE_PREFIX . "subcategories s ON m.subcategory_id = s.id
        WHERE m.id = :id
    ");
    $stmt->execute([':id' => $newId]);
    $mov = $stmt->fetch();

    jsonResponse([
        'id' => (int) $mov['id'],
        'date' => $mov['date'],
        'category_id' => (int) $mov['category_id'],
        'subcategory_id' => $mov['subcategory_id'] ? (int) $mov['subcategory_id'] : null,
        'category' => $mov['cat_name'],
        'subcategory' => $mov['sub_name'] ?? '',
        'description' => $mov['description'],
        'type' => $mov['type'],
        'amount' => (float) $mov['amount'],
    ], 201);
}

function deleteMovement(): void
{
    global $pdo;

    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) {
        jsonError('ID de movimiento no válido');
    }

    $stmt = $pdo->prepare("DELETE FROM " . TABLE_PREFIX . "movements WHERE id = :id");
    $stmt->execute([':id' => $id]);

    jsonResponse(['message' => 'Movimiento eliminado']);
}
