<?php
declare(strict_types=1);

require_once __DIR__ . '/common/auth.php';
require_once __DIR__ . '/common/db.php';
require_once __DIR__ . '/common/metadata.php';

require_method('GET');
require_auth();

$projectId = trim((string)($_GET['project_id'] ?? ''));
$tableName = trim((string)($_GET['table_name'] ?? ''));
if ($projectId === '' || $tableName === '') {
    json_response(false, 'Validation error', [], ['Missing project_id or table_name'], 422);
}

$mysqli = db();
$ctx = metadata_context($mysqli, $projectId, $tableName);

json_response(true, 'table schema', [
    'project' => $ctx['project'],
    'table' => $ctx['table'],
    'primary_keys' => $ctx['primaryKeys'],
    'excluded_columns' => $ctx['excludedColumns'],
    'columns' => $ctx['columns'],
]);
