<?php

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getPreferences();
        break;
    case 'POST':
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
            'list_font' => 'sans',
            'multi_registro' => 1,
            'dropdown_bg' => '#bfdbfe',
            'dropdown_border' => '#93c5fd',
            'dropdown_border_width' => 2,
            'dropdown_radius' => 12,
        ];
    }

    $prefs['id'] = (int) $prefs['id'];
    $prefs['high_contrast'] = (bool) $prefs['high_contrast'];
    $prefs['list_font'] = isset($prefs['list_font']) ? $prefs['list_font'] : 'sans';
    $prefs['multi_registro'] = isset($prefs['multi_registro']) ? (bool) $prefs['multi_registro'] : true;
    $prefs['dropdown_bg'] = isset($prefs['dropdown_bg']) ? $prefs['dropdown_bg'] : '#bfdbfe';
    $prefs['dropdown_border'] = isset($prefs['dropdown_border']) ? $prefs['dropdown_border'] : '#93c5fd';
    $prefs['dropdown_border_width'] = isset($prefs['dropdown_border_width']) ? (int) $prefs['dropdown_border_width'] : 2;
    $prefs['dropdown_radius'] = isset($prefs['dropdown_radius']) ? (int) $prefs['dropdown_radius'] : 12;

    jsonResponse($prefs);
}

function updatePreferences(): void
{
    global $pdo;

    try { $pdo->exec("ALTER TABLE " . TABLE_PREFIX . "preferences ADD COLUMN app_title VARCHAR(100) NOT NULL DEFAULT 'Mis Cuentas' AFTER high_contrast"); } catch (PDOException $e) { }
    try { $pdo->exec("ALTER TABLE " . TABLE_PREFIX . "preferences ADD COLUMN app_subtitle VARCHAR(200) NOT NULL DEFAULT 'Control Financiero' AFTER app_title"); } catch (PDOException $e) { }
    try { $pdo->exec("ALTER TABLE " . TABLE_PREFIX . "preferences ADD COLUMN list_font VARCHAR(20) NOT NULL DEFAULT 'sans' AFTER app_subtitle"); } catch (PDOException $e) { }
    try { $pdo->exec("ALTER TABLE " . TABLE_PREFIX . "preferences ADD COLUMN multi_registro TINYINT(1) NOT NULL DEFAULT 1 AFTER list_font"); } catch (PDOException $e) { }
    try { $pdo->exec("ALTER TABLE " . TABLE_PREFIX . "preferences ADD COLUMN dropdown_bg VARCHAR(20) NOT NULL DEFAULT '#bfdbfe' AFTER multi_registro"); } catch (PDOException $e) { }
    try { $pdo->exec("ALTER TABLE " . TABLE_PREFIX . "preferences ADD COLUMN dropdown_border VARCHAR(20) NOT NULL DEFAULT '#93c5fd' AFTER dropdown_bg"); } catch (PDOException $e) { }
    try { $pdo->exec("ALTER TABLE " . TABLE_PREFIX . "preferences ADD COLUMN dropdown_border_width INT NOT NULL DEFAULT 2 AFTER dropdown_border"); } catch (PDOException $e) { }
    try { $pdo->exec("ALTER TABLE " . TABLE_PREFIX . "preferences ADD COLUMN dropdown_radius INT NOT NULL DEFAULT 12 AFTER dropdown_border_width"); } catch (PDOException $e) { }

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
    if (isset($input['list_font'])) {
        $fields[] = "list_font = :list_font";
        $params[':list_font'] = trim($input['list_font']);
    }
    if (isset($input['multi_registro'])) {
        $fields[] = "multi_registro = :multi_registro";
        $params[':multi_registro'] = $input['multi_registro'] ? 1 : 0;
    }
    if (isset($input['dropdown_bg'])) {
        $fields[] = "dropdown_bg = :dropdown_bg";
        $params[':dropdown_bg'] = trim($input['dropdown_bg']);
    }
    if (isset($input['dropdown_border'])) {
        $fields[] = "dropdown_border = :dropdown_border";
        $params[':dropdown_border'] = trim($input['dropdown_border']);
    }
    if (isset($input['dropdown_border_width'])) {
        $fields[] = "dropdown_border_width = :dropdown_border_width";
        $params[':dropdown_border_width'] = (int) $input['dropdown_border_width'];
    }
    if (isset($input['dropdown_radius'])) {
        $fields[] = "dropdown_radius = :dropdown_radius";
        $params[':dropdown_radius'] = (int) $input['dropdown_radius'];
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
