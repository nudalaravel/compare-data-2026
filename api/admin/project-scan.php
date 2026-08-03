<?php
declare(strict_types=1);

require_once __DIR__ . '/../common/auth.php';
require_once __DIR__ . '/../common/db.php';
require_once __DIR__ . '/../common/metadata.php';

require_method('POST');
$user = require_auth();
require_admin($user);

$body = input_json();
$projectId = require_string($body, 'project_id');

$mysqli = db();
$project = fetch_project($mysqli, $projectId, false);

$tablesSql = 'SELECT TABLE_NAME
              FROM INFORMATION_SCHEMA.TABLES
              WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = ?
              ORDER BY TABLE_NAME';
$stmt = $mysqli->prepare($tablesSql);
$baseTable = 'BASE TABLE';
$stmt->bind_param('ss', $project['raw_database'], $baseTable);
$stmt->execute();
$tables = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

$result = [];
foreach ($tables as $table) {
    $tableName = assert_identifier($table['TABLE_NAME']);
    $pkSql = 'SELECT COLUMN_NAME
              FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
              WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND CONSTRAINT_NAME = ?
              ORDER BY ORDINAL_POSITION';
    $pkStmt = $mysqli->prepare($pkSql);
    $constraint = 'PRIMARY';
    $pkStmt->bind_param('sss', $project['raw_database'], $tableName, $constraint);
    $pkStmt->execute();
    $keys = array_map(static function ($row) {
        return $row['COLUMN_NAME'];
    }, $pkStmt->get_result()->fetch_all(MYSQLI_ASSOC));
    $result[] = [
        'table_name' => $tableName,
        'primary_keys' => $keys,
        'allowed' => false,
    ];
}

json_response(true, 'scan complete', ['tables' => $result]);
