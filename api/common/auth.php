<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/response.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start([
        'cookie_httponly' => true,
        'cookie_samesite' => 'Lax',
    ]);
}

function current_user(): ?array
{
    if (isset($_SESSION['cmp_user']) && is_array($_SESSION['cmp_user'])) {
        return $_SESSION['cmp_user'];
    }

    $tokenUser = auth_user_from_bearer_token();
    if ($tokenUser !== null) {
        return $tokenUser;
    }

    $headerUser = trim((string)($_SERVER['HTTP_X_DEMO_USER'] ?? ''));
    if (CMP_ENABLE_DEMO_LOGIN && $headerUser !== '') {
        return ['username' => $headerUser, 'role' => 'Administrator'];
    }

    return null;
}

function auth_user_from_bearer_token(): ?array
{
    $header = auth_authorization_header();
    if ($header === '' || !preg_match('/^Bearer\s+(.+)$/i', $header, $matches)) {
        return null;
    }

    $payload = auth_decode_jwt(trim($matches[1]));
    $username = strtolower(trim((string)($payload['username'] ?? '')));
    if ($username === '') {
        return null;
    }

    return [
        'username' => $username,
        'role' => auth_role_from_payload($payload),
        'ttype' => strtolower(trim((string)($payload['ttype'] ?? ''))),
        'payload' => $payload,
    ];
}

function auth_authorization_header(): string
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

function auth_decode_jwt(string $token): array
{
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        json_response(false, 'Invalid token', [], ['INVALID_JWT'], 401);
    }

    $headerPart = $parts[0];
    $payloadPart = $parts[1];
    $signaturePart = $parts[2];
    $header = json_decode(auth_base64url_decode($headerPart), true);
    $payload = json_decode(auth_base64url_decode($payloadPart), true);

    if (!is_array($header) || !is_array($payload)) {
        json_response(false, 'Invalid token', [], ['INVALID_JWT_PAYLOAD'], 401);
    }

    if (($header['alg'] ?? '') !== 'HS256') {
        json_response(false, 'Unsupported token algorithm', [], ['UNSUPPORTED_JWT_ALG'], 401);
    }

    if (CMP_AUTH_JWT_SECRET !== '') {
        $expected = auth_base64url_encode(hash_hmac('sha256', $headerPart . '.' . $payloadPart, CMP_AUTH_JWT_SECRET, true));
        if (!hash_equals($expected, $signaturePart)) {
            json_response(false, 'Invalid token signature', [], ['INVALID_JWT_SIGNATURE'], 401);
        }
    } elseif (!CMP_AUTH_ALLOW_UNVERIFIED_JWT) {
        json_response(false, 'JWT verification is not configured', [], ['JWT_SECRET_REQUIRED'], 500);
    }

    if (isset($payload['exp']) && (int)$payload['exp'] < time()) {
        json_response(false, 'Token expired', [], ['JWT_EXPIRED'], 401);
    }

    return $payload;
}

function auth_base64url_decode(string $value): string
{
    $padded = str_pad(strtr($value, '-_', '+/'), strlen($value) % 4 === 0 ? strlen($value) : strlen($value) + 4 - strlen($value) % 4, '=', STR_PAD_RIGHT);
    $decoded = base64_decode($padded, true);
    if ($decoded === false) {
        json_response(false, 'Invalid token', [], ['INVALID_TOKEN_ENCODING'], 401);
    }

    return $decoded;
}

function auth_base64url_encode(string $value): string
{
    return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
}

function auth_role_from_payload(array $payload): string
{
    $levelLabel = strtolower(trim((string)($payload['level_label'] ?? '')));
    $role = strtolower(trim((string)($payload['role'] ?? '')));
    $userLevel = strtolower(trim((string)($payload['userlev'] ?? '')));

    if ($levelLabel === 'admin' || $role === '1' || $userLevel === '1') {
        return 'Administrator';
    }

    return 'Operator';
}

function require_auth(): array
{
    $user = current_user();
    if ($user === null) {
        json_response(false, 'Authentication required', [], ['AUTH_REQUIRED'], 401);
    }

    return $user;
}

function require_admin(array $user): void
{
    if (($user['role'] ?? '') !== 'Administrator') {
        json_response(false, 'Permission denied', [], ['ADMIN_REQUIRED'], 403);
    }
}
