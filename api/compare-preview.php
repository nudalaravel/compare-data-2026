<?php
declare(strict_types=1);

require_once __DIR__ . '/common/auth.php';
require_once __DIR__ . '/common/db.php';
require_once __DIR__ . '/common/compare.php';

require_method('POST');
require_auth();

$body = input_json();
$projectId = require_string($body, 'project_id');
$tableName = require_string($body, 'table_name');
$debugEnabled = in_array(strtolower(trim((string)($body['debug'] ?? ($_GET['debug'] ?? '')))), ['1', 'true', 'yes', 'on'], true);

$mysqli = db();
$ctx = metadata_context($mysqli, $projectId, $tableName);
$scope = resolve_search_scope($ctx['project'], $body);
$searchMode = $scope['search_mode'];
$searchId = $scope['search_id'];
$preview = compare_preview($mysqli, $ctx, $searchMode, $searchId, true, $debugEnabled);

json_response(true, 'compare preview', ['preview' => $preview]);
