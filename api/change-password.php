<?php

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Método no permitido', 405);
}

$input = getInput();
$username = trim($input['username'] ?? '');
$currentPassword = $input['current_password'] ?? '';
$newPassword = $input['new_password'] ?? '';

if ($username === '' || $currentPassword === '' || $newPassword === '') {
    jsonError('Todos los campos son obligatorios');
}

if (strlen($newPassword) < 6) {
    jsonError('La nueva contraseña debe tener al menos 6 caracteres');
}

$stmt = $pdo->prepare("SELECT id, password_hash FROM " . TABLE_PREFIX . "users WHERE username = :username");
$stmt->execute([':username' => $username]);
$user = $stmt->fetch();

if (!$user) {
    jsonError('Usuario no encontrado', 404);
}

if (!password_verify($currentPassword, $user['password_hash'])) {
    jsonError('La contraseña actual no es correcta', 401);
}

$newHash = password_hash($newPassword, PASSWORD_BCRYPT);

$stmt = $pdo->prepare("UPDATE " . TABLE_PREFIX . "users SET password_hash = :hash WHERE id = :id");
$stmt->execute([':hash' => $newHash, ':id' => $user['id']]);

jsonResponse(['message' => 'Contraseña actualizada correctamente']);
