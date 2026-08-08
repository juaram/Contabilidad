<?php

/**
 * Utilidades TOTP (RFC 6238) en PHP puro para la verificación en dos pasos.
 * Compatibles con Google Authenticator, Microsoft Authenticator, Aegis, etc.
 */

function base32_encode(string $data): string
{
    $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    $binary = '';
    foreach (str_split($data) as $byte) {
        $binary .= str_pad(decbin(ord($byte)), 8, '0', STR_PAD_LEFT);
    }
    $binary = str_pad($binary, (int) ceil(strlen($binary) / 5) * 5, '0', STR_PAD_RIGHT);
    $result = '';
    foreach (str_split($binary, 5) as $chunk) {
        $result .= $alphabet[bindec($chunk)];
    }
    return $result;
}

function base32_decode(string $base32): string
{
    $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    $base32 = strtoupper(trim($base32));
    $binary = '';
    foreach (str_split($base32) as $char) {
        $pos = strpos($alphabet, $char);
        if ($pos === false) {
            continue;
        }
        $binary .= str_pad(decbin($pos), 5, '0', STR_PAD_LEFT);
    }
    $result = '';
    foreach (str_split($binary, 8) as $chunk) {
        if (strlen($chunk) < 8) {
            continue;
        }
        $result .= chr(bindec($chunk));
    }
    return $result;
}

function generate_totp_secret(int $bytes = 16): string
{
    return base32_encode(random_bytes($bytes));
}

function totp_code(string $secretBase32, int $counter, int $digits = 6): string
{
    $key = base32_decode($secretBase32);
    $binary = pack('N', 0) . pack('N', $counter);
    $hash = hash_hmac('sha1', $binary, $key, true);
    $offset = ord($hash[19]) & 0x0f;
    $value = (
        (ord($hash[$offset]) & 0x7f) << 24
        | (ord($hash[$offset + 1]) & 0xff) << 16
        | (ord($hash[$offset + 2]) & 0xff) << 8
        | (ord($hash[$offset + 3]) & 0xff)
    );
    return str_pad((string) ($value % (10 ** $digits)), $digits, '0', STR_PAD_LEFT);
}

function verify_totp(string $secretBase32, string $code, int $window = 1): bool
{
    $code = trim($code);
    if (!preg_match('/^\d{6}$/', $code)) {
        return false;
    }
    $counter = intdiv(time(), 30);
    for ($i = -$window; $i <= $window; $i++) {
        if (hash_equals(totp_code($secretBase32, $counter + $i), $code)) {
            return true;
        }
    }
    return false;
}

function otpauth_uri(string $username, string $secretBase32): string
{
    $label = rawurlencode('Mis Cuentas') . ':' . rawurlencode($username);
    $params = http_build_query([
        'secret' => $secretBase32,
        'issuer' => 'Mis Cuentas',
        'algorithm' => 'SHA1',
        'digits' => 6,
        'period' => 30,
    ]);
    return 'otpauth://totp/' . $label . '?' . $params;
}