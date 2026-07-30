<?php

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getPreferences();
        break;
    case 'PUT':
        updatePreferences();
        break;
    default:
        jsonError('Método no permitido', 405);
}

function getPreferences(): void
{
    global $pdo;

    $stmt = $pdo->query("SELECT * FROM " . TABLE_PREFIX . "preferences WHERE id = 1");
    $prefs = $stmt->fetch();

    if (!$prefs) {
        $stmt = $pdo->query("INSERT INTO " . TABLE_PREFIX . "preferences (id) VALUES (1)");
        $prefs = [
            'id' => 1,
            'currency' => 'Euro (€) - EUR',
            'date_format' => 'DD / MM / AAAA (31/12/2024)',
            'high_contrast' => 0,
            'app_title' => 'Mis Cuentas',
            'app_subtitle' => 'Control Financiero',
        ];
    }

    $prefs['id'] = (int) $prefs['id'];
    $prefs['high_contrast'] = (bool) $prefs['high_contrast'];

    jsonResponse($prefs);
}

function updatePreferences(): void
{
    global $pdo;

    $input = getInput();
    $fields = [];
    $params = [];

    if (isset($input['currency'])) {
        $fields[] = "currency = :currency";
        $params[':currency'] = trim($input['currency']);
    }
    if (isset($input['date_format'])) {
        $fields[] = "date_format = :date_format";
        $params[':date_format'] = trim($input['date_format']);
    }
    if (isset($input['high_contrast'])) {
        $fields[] = "high_contrast = :high_contrast";
        $params[':high_contrast'] = $input['high_contrast'] ? 1 : 0;
    }
    if (isset($input['app_title'])) {
        $fields[] = "app_title = :app_title";
        $params[':app_title'] = trim($input['app_title']);
    }
    if (isset($input['app_subtitle'])) {
        $fields[] = "app_subtitle = :app_subtitle";
        $params[':app_subtitle'] = trim($input['app_subtitle']);
    }

    if (count($fields) === 0) {
        jsonError('No hay campos para actualizar');
    }

    $params[':id'] = 1;
    $sql = "UPDATE " . TABLE_PREFIX . "preferences SET " . implode(', ', $fields) . " WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    getPreferences();
}
