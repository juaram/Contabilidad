<?php

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST' && isset($_GET['_method'])) {
    $method = strtoupper($_GET['_method']);
}

switch ($method) {
    case 'GET':
        listUsers();
        break;
    case 'POST':
        createUser();
        break;
    case 'PUT':
        updateUser();
        break;
    case 'DELETE':
        deleteUser();
        break;
    default:
        jsonError('Método no permitido', 405);
}

function listUsers(): void
{
    global $pdo;

    $stmt = $pdo->query("SELECT id, username, totp_enabled, created_at FROM " . TABLE_PREFIX . "users ORDER BY username ASC");
    $users = [];
    foreach ($stmt->fetchAll() as $u) {
        $users[] = [
            'id' => (int) $u['id'],
            'username' => $u['username'],
            'totp_enabled' => (int) $u['totp_enabled'] === 1,
            'created_at' => $u['created_at'],
        ];
    }

    jsonResponse($users);
}

function createUser(): void
{
    global $pdo;

    $input = getInput();
    $username = trim($input['username'] ?? '');
    $password = $input['password'] ?? '';
    $totpEnabled = !empty($input['totp_enabled']) ? 1 : 0;

    if ($username === '' || $password === '') {
        jsonError('Usuario y contraseña son obligatorios');
    }
    if (strlen($password) < 6) {
        jsonError('La contraseña debe tener al menos 6 caracteres');
    }

    $stmt = $pdo->prepare("SELECT id FROM " . TABLE_PREFIX . "users WHERE username = :username");
    $stmt->execute([':username' => $username]);
    if ($stmt->fetch()) {
        jsonError('Ya existe un usuario con ese nombre', 409);
    }

    $hash = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("INSERT INTO " . TABLE_PREFIX . "users (username, password_hash, totp_enabled) VALUES (:username, :hash, :totp_enabled)");
    $stmt->execute([':username' => $username, ':hash' => $hash, ':totp_enabled' => $totpEnabled]);

    jsonResponse([
        'message' => 'Usuario creado correctamente',
        'id' => (int) $pdo->lastInsertId(),
        'username' => $username,
    ], 201);
}

function updateUser(): void
{
    global $pdo;

    $input = getInput();
    $id = (int) ($input['id'] ?? 0);
    $username = trim($input['username'] ?? '');
    $password = $input['password'] ?? '';
    $totpEnabled = array_key_exists('totp_enabled', $input) ? (bool) $input['totp_enabled'] : null;

    if ($id <= 0) {
        jsonError('ID de usuario no válido');
    }
    if ($username === '') {
        jsonError('El nombre de usuario es obligatorio');
    }

    $stmt = $pdo->prepare("SELECT id FROM " . TABLE_PREFIX . "users WHERE username = :username AND id <> :id");
    $stmt->execute([':username' => $username, ':id' => $id]);
    if ($stmt->fetch()) {
        jsonError('Ya existe otro usuario con ese nombre', 409);
    }

    $sets = ['username = :username'];
    $params = [':username' => $username, ':id' => $id];

    if ($password !== '') {
        if (strlen($password) < 6) {
            jsonError('La contraseña debe tener al menos 6 caracteres');
        }
        $sets[] = 'password_hash = :hash';
        $params[':hash'] = password_hash($password, PASSWORD_BCRYPT);
    }

    if ($totpEnabled !== null) {
        if ($totpEnabled) {
            $sets[] = 'totp_enabled = 1';
        } else {
            $sets[] = 'totp_enabled = 0';
            $sets[] = 'totp_secret = NULL';
        }
    }

    $sql = "UPDATE " . TABLE_PREFIX . "users SET " . implode(', ', $sets) . " WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    jsonResponse(['message' => 'Usuario actualizado correctamente']);
}

function deleteUser(): void
{
    global $pdo;

    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) {
        jsonError('ID de usuario no válido');
    }

    $stmt = $pdo->prepare("SELECT COUNT(*) AS cnt FROM " . TABLE_PREFIX . "users");
    $stmt->execute();
    if ((int) $stmt->fetch()['cnt'] <= 1) {
        jsonError('No se puede eliminar el último usuario', 409);
    }

    $stmt = $pdo->prepare("DELETE FROM " . TABLE_PREFIX . "users WHERE id = :id");
    $stmt->execute([':id' => $id]);

    jsonResponse(['message' => 'Usuario eliminado']);
}
