<?php

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Método no permitido', 405);
}

$input = getInput();
$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';

if ($username === '' || $password === '') {
    jsonError('Usuario y contraseña son obligatorios');
}

$stmt = $pdo->prepare("SELECT id, username, password_hash FROM " . TABLE_PREFIX . "users WHERE username = :username");
$stmt->execute([':username' => $username]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    jsonError('Usuario o contraseña incorrectos', 401);
}

$token = bin2hex(random_bytes(32));

jsonResponse([
    'token' => $token,
    'user' => [
        'id' => (int) $user['id'],
        'username' => $user['username'],
    ],
]);
