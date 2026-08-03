<?php
declare(strict_types=1);

require_once __DIR__ . '/common/auth.php';
require_once __DIR__ . '/common/db.php';
require_once __DIR__ . '/common/metadata.php';

require_method('GET');
require_auth();

$projectId = trim((string)($_GET['project_id'] ?? ''));
if ($projectId === '') {
    json_response(false, 'Validation error', [], ['Missing project_id'], 422);
}

$mysqli = db();
$tables = fetch_project_tables($mysqli, $projectId);

json_response(true, 'project tables', ['tables' => $tables]);
