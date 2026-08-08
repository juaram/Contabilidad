<?php

if (file_exists(__DIR__ . '/config.local.php')) {
    require __DIR__ . '/config.local.php';
} else {
    $host = strtolower(trim($_SERVER['HTTP_HOST'] ?? ''));
    $host = preg_replace('/^www\./', '', $host);
    $host = explode(':', $host)[0];

    // Mapa de bases de datos por dominio en producción.
    // Cada dominio despliega su propia instalación y usa su propia base de datos.
    $domains = [
        'jramirez.eu' => [
            'host' => 'POAPMYSQL143.dns-servicio.com',
            'port' => 3306,
            'db' => '8600814_compartida',
            'user' => '8600814_usuario',
            'pass' => '7Ps3u&iJuvO#5jvp',
        ],
'twinbrosburger.com' => [
            'host' => 'PMYSQL170.dns-servicio.com',
            'port' => 3306,
            'db' => '9903378_conta',
            'user' => '9903378_usuario',
            'pass' => '7Ps3u&iJuvO#5jvp',
        ],
    ];

    // Dominio desconocido (p. ej. localhost/127.0.0.1 sin config.local.php) → jramirez.eu por defecto.
    $cfg = $domains[$host] ?? $domains['jramirez.eu'];

    define('DB_HOST', $cfg['host']);
    define('DB_PORT', $cfg['port']);
    define('DB_NAME', $cfg['db']);
    define('DB_USER', $cfg['user']);
    define('DB_PASS', $cfg['pass']);
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
