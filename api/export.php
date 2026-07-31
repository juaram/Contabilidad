<?php

require_once __DIR__ . '/config.php';

$format = $_GET['format'] ?? 'csv';

if ($format !== 'csv') {
    jsonError('Formato no soportado. Use format=csv', 400);
}

$stmt = $pdo->query("
    SELECT m.date, c.name AS category, s.name AS subcategory,
           m.description, m.type, m.amount
    FROM " . TABLE_PREFIX . "movements m
    LEFT JOIN " . TABLE_PREFIX . "categories c ON m.category_id = c.id
    LEFT JOIN " . TABLE_PREFIX . "subcategories s ON m.subcategory_id = s.id
    ORDER BY m.date DESC, m.id DESC
");
$movements = $stmt->fetchAll();

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="Mis_Cuentas_Movimientos_' . date('Y-m-d') . '.csv"');

$output = fopen('php://output', 'w');
fprintf($output, chr(0xEF) . chr(0xBB) . chr(0xBF));

fputcsv($output, ['Fecha', 'Categoría', 'Subcategoría', 'Descripción', 'Tipo', 'Importe'], ';');

foreach ($movements as $m) {
    fputcsv($output, [
        $m['date'],
        $m['category'],
        $m['subcategory'] ?? '',
        $m['description'],
        $m['type'],
        number_format((float) $m['amount'], 2, ',', '.'),
    ], ';');
}

fclose($output);
