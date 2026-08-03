<?php
declare(strict_types=1);

require_once __DIR__ . '/../common/db.php';
require_once __DIR__ . '/../common/metadata.php';

function manage_table(string $table): string
{
    assert_identifier(CMP_CORE_DB);
    assert_identifier($table);

    return '`' . CMP_CORE_DB . '`.`' . $table . '`';
}

function manage_sql_value(mysqli $mysqli, $value): string
{
    if ($value === null) {
        return 'NULL';
    }

    return "'" . $mysqli->real_escape_string((string)$value) . "'";
}

function manage_sql_in_list(mysqli $mysqli, array $values): string
{
    $items = [];
    foreach ($values as $value) {
        $items[] = manage_sql_value($mysqli, $value);
    }

    return implode(', ', $items);
}

function manage_value_list($value): array
{
    $values = [];
    if (is_array($value)) {
        foreach ($value as $item) {
            foreach (manage_value_list($item) as $nestedItem) {
                $values[] = $nestedItem;
            }
        }

        return $values;
    }

    $text = trim((string)$value);
    if ($text === '') {
        return [];
    }

    $parts = preg_split('/[\s,;]+/', $text);
    if (!is_array($parts)) {
        return [];
    }

    foreach ($parts as $part) {
        $part = trim($part);
        if ($part !== '') {
            $values[] = $part;
        }
    }

    return $values;
}

function manage_identifier_list($value, string $field): array
{
    $items = [];
    foreach (manage_value_list($value) as $item) {
        $identifier = assert_identifier((string)$item);
        if (!in_array($identifier, $items, true)) {
            $items[] = $identifier;
        }
    }

    return $items;
}

function manage_admin_usernames(): array
{
    $usernames = [];
    foreach (explode(',', CMP_MANAGE_ADMIN_USERS) as $value) {
        $username = strtolower(trim($value));
        if ($username !== '') {
            $usernames[] = $username;
        }
    }

    return $usernames;
}

function manage_bearer_token(): string
{
    $header = manage_authorization_header();
    if (!preg_match('/^Bearer\s+(.+)$/i', $header, $matches)) {
        json_response(false, 'Authentication required', [], ['BEARER_TOKEN_REQUIRED'], 401);
    }

    return trim($matches[1]);
}

function manage_authorization_header(): string
{
    foreach (['HTTP_AUTHORIZATION', 'REDIRECT_HTTP_AUTHORIZATION', 'Authorization'] as $key) {
        $value = trim((string)($_SERVER[$key] ?? ''));
        if ($value !== '') {
            return $value;
        }
    }

    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        if (is_array($headers)) {
            foreach ($headers as $key => $value) {
                if (strtolower((string)$key) === 'authorization') {
                    return trim((string)$value);
                }
            }
        }
    }

    if (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        if (is_array($headers)) {
            foreach ($headers as $key => $value) {
                if (strtolower((string)$key) === 'authorization') {
                    return trim((string)$value);
                }
            }
        }
    }

    return '';
}

function manage_base64url_decode(string $value): string
{
    $padded = str_pad(strtr($value, '-_', '+/'), strlen($value) % 4 === 0 ? strlen($value) : strlen($value) + 4 - strlen($value) % 4, '=', STR_PAD_RIGHT);
    $decoded = base64_decode($padded, true);
    if ($decoded === false) {
        json_response(false, 'Invalid token', [], ['INVALID_TOKEN_ENCODING'], 401);
    }

    return $decoded;
}

function manage_base64url_encode(string $value): string
{
    return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
}

function manage_decode_jwt(string $token): array
{
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        json_response(false, 'Invalid token', [], ['INVALID_JWT'], 401);
    }

    [$headerPart, $payloadPart, $signaturePart] = $parts;
    $header = json_decode(manage_base64url_decode($headerPart), true);
    $payload = json_decode(manage_base64url_decode($payloadPart), true);

    if (!is_array($header) || !is_array($payload)) {
        json_response(false, 'Invalid token', [], ['INVALID_JWT_PAYLOAD'], 401);
    }

    if (($header['alg'] ?? '') !== 'HS256') {
        json_response(false, 'Unsupported token algorithm', [], ['UNSUPPORTED_JWT_ALG'], 401);
    }

    if (CMP_MANAGE_JWT_SECRET !== '') {
        $expected = manage_base64url_encode(hash_hmac('sha256', $headerPart . '.' . $payloadPart, CMP_MANAGE_JWT_SECRET, true));
        if (!hash_equals($expected, $signaturePart)) {
            json_response(false, 'Invalid token signature', [], ['INVALID_JWT_SIGNATURE'], 401);
        }
    } elseif (!CMP_MANAGE_ALLOW_UNVERIFIED_JWT) {
        json_response(false, 'Manage JWT verification is not configured', [], ['JWT_SECRET_REQUIRED'], 500);
    }

    if (isset($payload['exp']) && (int)$payload['exp'] < time()) {
        json_response(false, 'Token expired', [], ['JWT_EXPIRED'], 401);
    }

    return $payload;
}

function require_manage_admin(): array
{
    $demoUser = strtolower(trim((string)($_SERVER['HTTP_X_DEMO_ADMIN_USER'] ?? '')));
    if (CMP_ENABLE_DEMO_LOGIN && $demoUser !== '' && in_array($demoUser, manage_admin_usernames(), true)) {
        return ['username' => $demoUser, 'ttype' => 'cvriped'];
    }

    $payload = manage_decode_jwt(manage_bearer_token());
    $username = strtolower(trim((string)($payload['username'] ?? '')));
    $ttype = strtolower(trim((string)($payload['ttype'] ?? '')));

    if ($ttype !== 'cvriped' || !in_array($username, manage_admin_usernames(), true)) {
        json_response(false, 'Permission denied', [], ['ADMIN_REQUIRED'], 403);
    }

    return [
        'username' => $username,
        'ttype' => $ttype,
        'payload' => $payload,
    ];
}

function manage_project_key(string $value, string $field = 'project_key'): string
{
    $key = strtolower(trim($value));
    if ($key === '' || !preg_match('/^[a-z0-9_]+$/', $key)) {
        json_response(false, 'Validation error', [], ["Invalid {$field}"], 422);
    }

    return $key;
}

function manage_optional_identifier(array $body, string $field): string
{
    $value = trim((string)($body[$field] ?? ''));
    return $value === '' ? '' : assert_identifier($value);
}

function manage_bool(array $body, string $field, bool $default = false): int
{
    if (!array_key_exists($field, $body)) {
        return $default ? 1 : 0;
    }

    return !empty($body[$field]) ? 1 : 0;
}
