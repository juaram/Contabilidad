<?php

if (file_exists(__DIR__ . '/config.local.php')) {
    require __DIR__ . '/config.local.php';
} else {
    define('DB_HOST', 'POAPMYSQL143.dns-servicio.com');
    define('DB_PORT', 3306);
    define('DB_NAME', '8600814_compartida');
    define('DB_USER', '8600814_usuario');
    define('DB_PASS', '7Ps3u&iJuvO#5jvp');

    define('TABLE_PREFIX', 'conta_');
}

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión a la base de datos']);
    exit;
}

function jsonResponse(mixed $data, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function jsonError(string $message, int $code = 400): void
{
    jsonResponse(['error' => $message], $code);
}

function getInput(): array
{
    $input = json_decode(file_get_contents('php://input'), true);
    return is_array($input) ? $input : [];
}
