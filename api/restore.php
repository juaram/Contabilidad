<?php

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Método no permitido', 405);
}

$input = getInput();
$categories = $input['categories'] ?? null;
$movements = $input['movements'] ?? null;
$preferences = $input['preferences'] ?? null;

if (!is_array($categories) || !is_array($movements)) {
    jsonError('El archivo de copia de seguridad no es válido');
}

try {
    $pdo->beginTransaction();

    $pdo->exec("DELETE FROM " . TABLE_PREFIX . "movements");
    $pdo->exec("DELETE FROM " . TABLE_PREFIX . "subcategories");
    $pdo->exec("DELETE FROM " . TABLE_PREFIX . "categories");

    $catIdMap = [];
    $catStmt = $pdo->prepare("
        INSERT INTO " . TABLE_PREFIX . "categories (name, icon, color_bg, color_text)
        VALUES (:name, :icon, :color_bg, :color_text)
    ");
    foreach ($categories as $cat) {
        $oldId = (int) ($cat['id'] ?? 0);
        $catStmt->execute([
            ':name' => trim($cat['name'] ?? ''),
            ':icon' => trim($cat['icon'] ?? 'category'),
            ':color_bg' => $cat['colorBgClass'] ?? $cat['color_bg'] ?? 'bg-primary-fixed',
            ':color_text' => $cat['colorTextClass'] ?? $cat['color_text'] ?? 'text-on-primary-fixed',
        ]);
        $catIdMap[$oldId] = (int) $pdo->lastInsertId();
    }

    $subIdMap = [];
    $subStmt = $pdo->prepare("
        INSERT INTO " . TABLE_PREFIX . "subcategories (category_id, name)
        VALUES (:category_id, :name)
    ");
    foreach ($categories as $cat) {
        $oldCatId = (int) ($cat['id'] ?? 0);
        foreach (($cat['subcategories'] ?? []) as $sub) {
            $oldSubId = (int) ($sub['id'] ?? 0);
            $subStmt->execute([
                ':category_id' => $catIdMap[$oldCatId] ?? 0,
                ':name' => trim($sub['name'] ?? ''),
            ]);
            $subIdMap[$oldSubId] = (int) $pdo->lastInsertId();
        }
    }

    $movStmt = $pdo->prepare("
        INSERT INTO " . TABLE_PREFIX . "movements (date, category_id, subcategory_id, description, type, amount)
        VALUES (:date, :category_id, :subcategory_id, :description, :type, :amount)
    ");
    foreach ($movements as $m) {
        $oldSubId = isset($m['subcategory_id']) ? (int) $m['subcategory_id'] : 0;
        $movStmt->execute([
            ':date' => trim($m['date'] ?? ''),
            ':category_id' => $catIdMap[(int) $m['category_id']] ?? 0,
            ':subcategory_id' => $oldSubId > 0 ? ($subIdMap[$oldSubId] ?? null) : null,
            ':description' => trim($m['description'] ?? ''),
            ':type' => ($m['type'] ?? '') === 'ingreso' ? 'ingreso' : 'gasto',
            ':amount' => (float) $m['amount'],
        ]);
    }

    if (is_array($preferences)) {
        $prefSql = [];
        $prefParams = [':id' => 1];
        if (isset($preferences['currency'])) { $prefSql[] = "currency = :currency"; $prefParams[':currency'] = trim($preferences['currency']); }
        if (isset($preferences['dateFormat'])) { $prefSql[] = "date_format = :date_format"; $prefParams[':date_format'] = trim($preferences['dateFormat']); }
        if (isset($preferences['highContrast'])) { $prefSql[] = "high_contrast = :high_contrast"; $prefParams[':high_contrast'] = $preferences['highContrast'] ? 1 : 0; }
        if (isset($preferences['appTitle'])) { $prefSql[] = "app_title = :app_title"; $prefParams[':app_title'] = trim($preferences['appTitle']); }
        if (isset($preferences['appSubtitle'])) { $prefSql[] = "app_subtitle = :app_subtitle"; $prefParams[':app_subtitle'] = trim($preferences['appSubtitle']); }
        if (count($prefSql) > 0) {
            $stmt = $pdo->prepare("UPDATE " . TABLE_PREFIX . "preferences SET " . implode(', ', $prefSql) . " WHERE id = :id");
            $stmt->execute($prefParams);
        }
    }

    $pdo->commit();

    jsonResponse(['message' => 'Copia de seguridad restaurada correctamente']);
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    jsonError('Error al restaurar la copia de seguridad', 500);
}
