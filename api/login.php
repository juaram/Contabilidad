<?php

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/totp_functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Método no permitido', 405);
}

$input = getInput();
$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';
$code = trim($input['code'] ?? '');

if ($username === '' || $password === '') {
    jsonError('Usuario y contraseña son obligatorios');
}

$stmt = $pdo->prepare("SELECT id, username, password_hash, totp_enabled, totp_secret FROM " . TABLE_PREFIX . "users WHERE username = :username");
$stmt->execute([':username' => $username]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    jsonError('Usuario o contraseña incorrectos', 401);
}

if ((int) $user['totp_enabled'] === 1) {
    if ($code === '') {
        if ($user['totp_secret'] === null || $user['totp_secret'] === '') {
            jsonResponse(['totp_required' => true, 'needs_setup' => true]);
        }
        jsonResponse(['totp_required' => true]);
    }
    if (!verify_totp($user['totp_secret'], $code)) {
        jsonError('Código de verificación incorrecto', 401);
    }
}

$token = bin2hex(random_bytes(32));

jsonResponse([
    'token' => $token,
    'user' => [
        'id' => (int) $user['id'],
        'username' => $user['username'],
        'totp_enabled' => (int) $user['totp_enabled'] === 1,
    ],
]);
