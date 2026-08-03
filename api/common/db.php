<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/response.php';

function db(): mysqli
{
    static $mysqli = null;

    if ($mysqli instanceof mysqli) {
        return $mysqli;
    }

    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    try {
        $mysqli = new mysqli(CMP_DB_HOST, CMP_DB_USER, CMP_DB_PASSWORD, '', CMP_DB_PORT);
        $mysqli->set_charset('utf8mb4');
        return $mysqli;
    } catch (mysqli_sql_exception $exception) {
        error_log('Database connection failed: ' . $exception->getMessage());
        json_response(false, 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้', [], ['DATABASE_CONNECTION_FAILED'], 500);
    }
}
