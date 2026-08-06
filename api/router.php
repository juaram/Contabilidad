<?php

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$prefix = '/conta/api/';

if (str_starts_with($uri, $prefix)) {
    $file = basename(substr($uri, strlen($prefix)));
    if ($file !== '' && is_file(__DIR__ . '/' . $file)) {
        require __DIR__ . '/' . $file;
        return true;
    }
}

return false;
