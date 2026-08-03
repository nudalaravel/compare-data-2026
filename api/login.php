<?php
declare(strict_types=1);

require_once __DIR__ . '/common/response.php';
require_once __DIR__ . '/common/auth.php';

require_method('POST');
$body = input_json();
$username = require_string($body, 'username');
$password = require_string($body, 'password');

if (!CMP_ENABLE_DEMO_LOGIN) {
    json_response(false, 'Login endpoint is disabled. Use your existing authentication service.', [], ['LOGIN_DISABLED'], 403);
}

$_SESSION['cmp_user'] = [
    'username' => $username,
    'role' => $username === 'admin' ? 'Administrator' : 'Operator',
];

json_response(true, 'เข้าสู่ระบบสำเร็จ', [
    'username' => $_SESSION['cmp_user']['username'],
    'role' => $_SESSION['cmp_user']['role'],
]);
