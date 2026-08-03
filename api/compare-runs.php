<?php
declare(strict_types=1);

require_once __DIR__ . '/common/auth.php';
require_once __DIR__ . '/common/db.php';
require_once __DIR__ . '/common/compare.php';

require_method('GET');
$user = require_auth();
$mysqli = db();

if (!compare_run_tables_ready($mysqli)) {
    json_response(true, 'compare phase 2 is disabled or not migrated', [
        'phase2_enabled' => false,
        'runs' => [],
        'records' => [],
        'logs' => [],
    ]);
}

$runId = trim((string)($_GET['run_id'] ?? ''));
$projectId = trim((string)($_GET['project_id'] ?? ''));

if ($runId !== '') {
    $sql = 'SELECT *
            FROM ' . core_table('cmp_compare_runs') . '
            WHERE run_id = ? AND assigned_to = ?
            LIMIT 1';
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('ss', $runId, $user['username']);
    $stmt->execute();
    $run = $stmt->get_result()->fetch_assoc();
    if (!$run) {
        json_response(false, 'Compare run not found', [], ['RUN_NOT_FOUND'], 404);
    }

    $recordsSql = 'SELECT *
                   FROM ' . core_table('cmp_compare_run_records') . '
                   WHERE run_id = ?
                   ORDER BY run_record_id';
    $recordsStmt = $mysqli->prepare($recordsSql);
    $recordsStmt->bind_param('s', $runId);
    $recordsStmt->execute();

    $logsSql = 'SELECT *
                FROM ' . core_table('cmp_compare_field_logs') . '
                WHERE run_id = ?
                ORDER BY created_at DESC, log_id DESC';
    $logsStmt = $mysqli->prepare($logsSql);
    $logsStmt->bind_param('s', $runId);
    $logsStmt->execute();

    json_response(true, 'compare run', [
        'phase2_enabled' => true,
        'run' => $run,
        'records' => $recordsStmt->get_result()->fetch_all(MYSQLI_ASSOC),
        'logs' => $logsStmt->get_result()->fetch_all(MYSQLI_ASSOC),
    ]);
}

$where = 'WHERE assigned_to = ?';
$types = 's';
$params = [$user['username']];
if ($projectId !== '') {
    assert_identifier($projectId);
    $where .= ' AND (project_code = ? OR database_code = ?)';
    $types .= 'ss';
    array_push($params, $projectId, $projectId);
}

$sql = 'SELECT run_id, project_code, database_code, table_name,
               search_mode, search_id, status, total_records, completed_records,
               assigned_to, started_at, completed_at, created_at, updated_at
        FROM ' . core_table('cmp_compare_runs') . '
        ' . $where . '
        ORDER BY created_at DESC
        LIMIT 200';
$stmt = $mysqli->prepare($sql);
bind_params($stmt, $types, $params);
$stmt->execute();

json_response(true, 'compare runs', [
    'phase2_enabled' => true,
    'runs' => $stmt->get_result()->fetch_all(MYSQLI_ASSOC),
]);
