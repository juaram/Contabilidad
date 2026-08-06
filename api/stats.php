<?php

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    jsonError('Método no permitido', 405);
}

$balanceStmt = $pdo->query("
    SELECT
        COALESCE(SUM(CASE WHEN type = 'ingreso' THEN amount ELSE 0 END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN type = 'gasto' THEN amount ELSE 0 END), 0) AS total_expense
    FROM " . TABLE_PREFIX . "movements
");
$balanceData = $balanceStmt->fetch();
$totalIncome = (float) $balanceData['total_income'];
$totalExpense = (float) $balanceData['total_expense'];
$balance = $totalIncome - $totalExpense;

$monthlyStmt = $pdo->query("
    SELECT
        DATE_FORMAT(date, '%Y-%m') AS `year_month`,
        DATE_FORMAT(date, '%m') AS month_num,
        DATE_FORMAT(date, '%b') AS month_abbr,
        YEAR(date) AS year,
        COALESCE(SUM(CASE WHEN type = 'ingreso' THEN amount ELSE 0 END), 0) AS income,
        COALESCE(SUM(CASE WHEN type = 'gasto' THEN amount ELSE 0 END), 0) AS expense
    FROM " . TABLE_PREFIX . "movements
    GROUP BY `year_month`, month_num, month_abbr, year
    ORDER BY `year_month` DESC
    LIMIT 6
");
$monthlyData = $monthlyStmt->fetchAll();

$months = [];
foreach ($monthlyData as $row) {
    $months[] = [
        'month_name' => $row['month_abbr'],
        'month_num' => $row['month_num'],
        'year' => (int) $row['year'],
        'income' => (float) $row['income'],
        'expense' => (float) $row['expense'],
    ];
}
$months = array_reverse($months);

$lastStmt = $pdo->query("
    SELECT m.*, c.name AS cat_name, c.icon AS cat_icon, s.name AS sub_name
    FROM " . TABLE_PREFIX . "movements m
    LEFT JOIN " . TABLE_PREFIX . "categories c ON m.category_id = c.id
    LEFT JOIN " . TABLE_PREFIX . "subcategories s ON m.subcategory_id = s.id
    ORDER BY m.date DESC, m.id DESC
    LIMIT 3
");
$lastMovements = [];
foreach ($lastStmt as $m) {
    $lastMovements[] = [
        'id' => (int) $m['id'],
        'date' => $m['date'],
        'category' => $m['cat_name'],
        'category_icon' => $m['cat_icon'],
        'subcategory' => $m['sub_name'] ?? '',
        'description' => $m['description'],
        'type' => $m['type'],
        'amount' => (float) $m['amount'],
    ];
}

jsonResponse([
    'balance' => $balance,
    'total_income' => $totalIncome,
    'total_expense' => $totalExpense,
    'monthly_history' => $months,
    'last_movements' => $lastMovements,
]);
