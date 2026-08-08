<?php

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/totp_functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Método no permitido', 405);
}

$action = $_GET['action'] ?? '';
$input = getInput();
$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';

if ($username === '' || $password === '') {
    jsonError('Usuario y contraseña son obligatorios');
}

$stmt = $pdo->prepare("SELECT id, username, password_hash, totp_enabled, totp_secret FROM " . TABLE_PREFIX . "users WHERE username = :username");
$stmt->execute([':username' => $username]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    jsonError('Usuario o contraseña incorrectos', 401);
}

switch ($action) {
    case 'setup':
        if ((int) $user['totp_enabled'] !== 1) {
            jsonError('La verificación en dos pasos no está activada para este usuario', 400);
        }
        $secret = generate_totp_secret();
        $stmt = $pdo->prepare("UPDATE " . TABLE_PREFIX . "users SET totp_secret = :secret WHERE id = :id");
        $stmt->execute([':secret' => $secret, ':id' => $user['id']]);
        jsonResponse([
            'secret_base32' => $secret,
            'otpauth_uri' => otpauth_uri($user['username'], $secret),
        ]);
        break;

    case 'activate':
        if ((int) $user['totp_enabled'] !== 1) {
            jsonError('La verificación en dos pasos no está activada para este usuario', 400);
        }
        $code = trim($input['code'] ?? '');
        if ($code === '') {
            jsonError('Introduce el código de verificación');
        }
        if (!$user['totp_secret']) {
            jsonError('No hay verificación en dos pasos pendiente de configurar', 400);
        }
        if (!verify_totp($user['totp_secret'], $code)) {
            jsonError('Código de verificación incorrecto', 401);
        }
        $token = bin2hex(random_bytes(32));
        jsonResponse([
            'token' => $token,
            'user' => [
                'id' => (int) $user['id'],
                'username' => $user['username'],
                'totp_enabled' => true,
            ],
        ]);
        break;

case 'disable':
        $code = trim($input['code'] ?? '');
        if ($code === '') {
            jsonError('Introduce el código de verificación');
        }
        if (!$user['totp_secret'] || !verify_totp($user['totp_secret'], $code)) {
            jsonError('Código de verificación incorrecto', 401);
        }
        $stmt = $pdo->prepare("UPDATE " . TABLE_PREFIX . "users SET totp_enabled = 0, totp_secret = NULL WHERE id = :id");
        $stmt->execute([':id' => $user['id']]);
        jsonResponse(['message' => 'Verificación en dos pasos desactivada']);
        break;

    default:
        jsonError('Acción no válida', 400);
}