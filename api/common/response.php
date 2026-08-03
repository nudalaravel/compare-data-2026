<?php
declare(strict_types=1);

apply_cors_headers();
header('Content-Type: application/json; charset=utf-8');

function apply_cors_headers(): void
{
    $origin = (string)($_SERVER['HTTP_ORIGIN'] ?? '');
    $allowed = false;

    if ($origin !== '') {
        $allowed = preg_match('/^https:\/\/([A-Za-z0-9-]+\.)?ripedresearch\.org$/', $origin) === 1
            || preg_match('/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/', $origin) === 1;
    }

    if ($allowed) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Credentials: true');
        header('Vary: Origin');
    }

    header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
    header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Demo-User, X-Demo-Admin-User');

    if (strtoupper($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function json_response(bool $success, string $message = '', array $data = [], array $errors = [], int $status = 200): void
{
    http_response_code($status);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data,
        'errors' => $errors,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function require_method(string $method): void
{
    if (strtoupper($_SERVER['REQUEST_METHOD'] ?? '') !== strtoupper($method)) {
        json_response(false, 'Method not allowed', [], ['Expected ' . strtoupper($method)], 405);
    }
}

function input_json(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_response(false, 'Invalid JSON body', [], ['Request body must be valid JSON'], 400);
    }

    return $data;
}

function require_string(array $data, string $key): string
{
    $value = trim((string)($data[$key] ?? ''));
    if ($value === '') {
        json_response(false, 'Validation error', [], ["Missing field: {$key}"], 422);
    }

    return $value;
}
