<?php
declare(strict_types=1);

function load_env_file(string $path): void
{
    if (!is_file($path)) {
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }

    foreach ($lines as $line) {
        $trimmed = trim($line);
        if ($trimmed === '' || strpos($trimmed, '#') === 0 || strpos($trimmed, '=') === false) {
            continue;
        }

        [$key, $value] = explode('=', $trimmed, 2);
        $key = trim($key);
        $value = trim($value, " \t\n\r\0\x0B\"'");
        if ($key !== '' && getenv($key) === false) {
            putenv($key . '=' . $value);
            $_ENV[$key] = $value;
        }
    }
}

load_env_file(dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . '.env');

function env_value(string $key, string $default = ''): string
{
    $value = $_ENV[$key] ?? getenv($key);
    if ($value === false || $value === null || $value === '') {
        return $default;
    }

    return (string)$value;
}

define('CMP_DB_HOST', env_value('CMP_DB_HOST', 'tsrs-test.c5oh51usgj2f.ap-southeast-1.rds.amazonaws.com'));
define('CMP_DB_PORT', (int)env_value('CMP_DB_PORT', '3306'));
define('CMP_DB_USER', env_value('CMP_DB_USER', 'admin'));
define('CMP_DB_PASSWORD', env_value('CMP_DB_PASSWORD', 'ripedadmin1234'));
define('CMP_CORE_DB', env_value('CMP_CORE_DB', '_riped_survey_compare'));
define('CMP_ENABLE_DEMO_LOGIN', env_value('CMP_ENABLE_DEMO_LOGIN', '0') === '1');
define('CMP_MANAGE_ADMIN_USERS', env_value('CMP_MANAGE_ADMIN_USERS', 'admin,nuda,tuannurlaila.riped'));
define('CMP_AUTH_JWT_SECRET', env_value('CMP_AUTH_JWT_SECRET', env_value('CMP_MANAGE_JWT_SECRET', '')));
define('CMP_AUTH_ALLOW_UNVERIFIED_JWT', env_value('CMP_AUTH_ALLOW_UNVERIFIED_JWT', '1') === '1');
define('CMP_MANAGE_JWT_SECRET', env_value('CMP_MANAGE_JWT_SECRET', CMP_AUTH_JWT_SECRET));
define('CMP_MANAGE_ALLOW_UNVERIFIED_JWT', CMP_AUTH_ALLOW_UNVERIFIED_JWT || env_value('CMP_MANAGE_ALLOW_UNVERIFIED_JWT', '0') === '1');
