<?php

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST' && isset($_GET['_method'])) {
    $method = strtoupper($_GET['_method']);
}

ensureTable();

$action = $_GET['action'] ?? '';

switch ($method) {
    case 'GET':
        if ($action === 'dict') {
            listDictionary();
        } else {
            jsonError('Acción no válida');
        }
        break;
    case 'POST':
        if ($action === 'add_word') {
            addWord();
        } elseif ($action === 'replace') {
            replaceWords();
        } else {
            jsonError('Acción no válida');
        }
        break;
    default:
        jsonError('Método no permitido', 405);
}

function ensureTable(): void
{
    global $pdo;
    try {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS " . TABLE_PREFIX . "dictionary (
                id INT AUTO_INCREMENT PRIMARY KEY,
                word VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY uq_word (word)
            )
        ");
    } catch (PDOException $e) {
        jsonError('Error al inicializar el diccionario', 500);
    }
}

function listDictionary(): void
{
    global $pdo;
    $rows = $pdo->query("SELECT word FROM " . TABLE_PREFIX . "dictionary ORDER BY word")->fetchAll();
    jsonResponse(['words' => array_map(fn ($r) => $r['word'], $rows)]);
}

function lowerUtf(string $s): string
{
    return function_exists('mb_strtolower') ? mb_strtolower($s, 'UTF-8') : strtolower($s);
}

function upperUtf(string $s): string
{
    return function_exists('mb_strtoupper') ? mb_strtoupper($s, 'UTF-8') : strtoupper($s);
}

function titleUtf(string $s): string
{
    return function_exists('mb_convert_case') ? mb_convert_case($s, MB_CASE_TITLE, 'UTF-8') : ucfirst($s);
}

function addWord(): void
{
    global $pdo;
    $input = getInput();
    $word = lowerUtf(trim($input['word'] ?? ''));
    if ($word === '' || !preg_match('/^[a-záéíóúüñ]+$/iu', $word)) {
        jsonError('Palabra no válida');
    }
    $stmt = $pdo->prepare("INSERT IGNORE INTO " . TABLE_PREFIX . "dictionary (word) VALUES (:word)");
    $stmt->execute([':word' => $word]);
    jsonResponse(['message' => 'Palabra añadida al diccionario']);
}

function replaceWords(): void
{
    global $pdo;
    $input = getInput();
    $word = lowerUtf(trim($input['word'] ?? ''));
    $replacement = trim($input['replacement'] ?? '');
    $movementId = isset($input['movement_id']) ? (int) $input['movement_id'] : 0;

    if ($word === '' || $replacement === '') {
        jsonError('Faltan la palabra o el reemplazo');
    }
    if ($word === lowerUtf($replacement)) {
        jsonError('El reemplazo es igual a la palabra');
    }

    $pattern = '/(?<![\p{L}\p{N}])' . preg_quote($word, '/') . '(?![\p{L}\p{N}])/iu';

    if ($movementId > 0) {
        $stmt = $pdo->prepare("SELECT id, description FROM " . TABLE_PREFIX . "movements WHERE id = :id");
        $stmt->execute([':id' => $movementId]);
        $rows = $stmt->fetchAll();
    } else {
        $stmt = $pdo->prepare(
            "SELECT id, description FROM " . TABLE_PREFIX . "movements WHERE LOWER(description) LIKE :like"
        );
        $stmt->execute([':like' => '%' . $word . '%']);
        $rows = $stmt->fetchAll();
    }

    $upd = $pdo->prepare("UPDATE " . TABLE_PREFIX . "movements SET description = :desc WHERE id = :id");
    $updated = 0;
    foreach ($rows as $r) {
        $newDesc = preg_replace_callback($pattern, function ($matches) use ($replacement) {
            $orig = $matches[0];
            if ($orig === upperUtf($orig)) {
                return upperUtf($replacement);
            }
            if ($orig === titleUtf($orig)) {
                return titleUtf($replacement);
            }
            return lowerUtf($replacement);
        }, $r['description']);

        if ($newDesc !== $r['description']) {
            $upd->execute([':desc' => $newDesc, ':id' => $r['id']]);
            $updated++;
        }
    }

    jsonResponse(['updated' => $updated]);
}
