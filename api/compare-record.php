<?php
declare(strict_types=1);

require_once __DIR__ . '/common/auth.php';
require_once __DIR__ . '/common/db.php';
require_once __DIR__ . '/common/compare.php';

require_method('GET');
require_auth();

$projectId = trim((string)($_GET['project_id'] ?? ''));
$tableName = trim((string)($_GET['table_name'] ?? ''));

if ($projectId === '' || $tableName === '') {
    json_response(false, 'Validation error', [], ['Missing project_id or table_name'], 422);
}

$mysqli = db();
$ctx = metadata_context($mysqli, $projectId, $tableName);
$scope = resolve_search_scope($ctx['project'], $_GET);
$searchMode = $scope['search_mode'];
$searchId = $scope['search_id'];
$records = fetch_compare_records($mysqli, $ctx, $searchMode, $searchId);

json_response(true, 'compare records', ['records' => $records]);
