<?php
declare(strict_types=1);

require_once __DIR__ . '/common/auth.php';
require_once __DIR__ . '/common/db.php';
require_once __DIR__ . '/common/compare.php';

require_method('POST');
$user = require_auth();
$body = input_json();

$projectId = require_string($body, 'project_id');
$tableName = require_string($body, 'table_name');
$primaryKey = $body['primary_key'] ?? null;
$values = $body['values'] ?? null;
$runId = trim((string)($body['run_id'] ?? $body['task_id'] ?? ''));

if (!is_array($primaryKey) || !is_array($values)) {
    json_response(false, 'Validation error', [], ['primary_key and values are required'], 422);
}

function compare_save_value(array $row, string $snakeKey, string $camelKey, string $default = ''): string
{
    if (array_key_exists($snakeKey, $row)) {
        return (string)$row[$snakeKey];
    }
    if (array_key_exists($camelKey, $row)) {
        return (string)$row[$camelKey];
    }

    return $default;
}

function compare_save_selected_source(string $source): string
{
    return in_array($source, ['round1', 'round2', 'custom'], true) ? $source : 'custom';
}

$mysqli = db();
$ctx = metadata_context($mysqli, $projectId, $tableName);
$project = $ctx['project'];
$allowedColumns = array_flip(array_column($ctx['columns'], 'name'));
$cmpTable = qt($project['cmp_database'], $ctx['table']['table_name']);
$roundField = qi($project['round_field']);
ensure_chk_user_table($mysqli, $project['cmp_database']);

$where = [];
$whereTypes = '';
$whereParams = [];
foreach ($ctx['primaryKeys'] as $key) {
    if (!array_key_exists($key, $primaryKey)) {
        json_response(false, 'Validation error', [], ["Missing primary key: {$key}"], 422);
    }
    $where[] = qi($key) . ' = ?';
    $whereTypes .= 's';
    $whereParams[] = (string)$primaryKey[$key];
}
$whereSql = implode(' AND ', $where);
$compareKey = compare_key_from_primary_key($primaryKey, $ctx['primaryKeys']);

$set = [];
$types = '';
$params = [];
$auditRows = [];

foreach ($values as $valueRow) {
    if (!is_array($valueRow)) {
        continue;
    }

    $columnName = assert_identifier(compare_save_value($valueRow, 'column_name', 'columnName'));
    if (!isset($allowedColumns[$columnName])) {
        json_response(false, 'Column is not allowed for compare save', [], ["COLUMN_NOT_ALLOWED: {$columnName}"], 422);
    }

    $selectedValue = compare_save_value($valueRow, 'selected_value', 'selectedValue');
    $round1Value = compare_save_value($valueRow, 'round1_value', 'round1Value');
    $round2Value = compare_save_value($valueRow, 'round2_value', 'round2Value');
    $selectedSource = compare_save_selected_source(compare_save_value($valueRow, 'selected_source', 'selectedSource', 'custom'));

    $set[] = qi($columnName) . ' = ?';
    $types .= 's';
    $params[] = $selectedValue;

    if ($selectedValue !== $round1Value) {
        $auditRows[] = [
            'column_name' => $columnName,
            'round1_value' => $round1Value,
            'round2_value' => $round2Value,
            'selected_value' => $selectedValue,
            'selected_source' => $selectedSource,
        ];
    }
}

$mysqli->begin_transaction();
try {
    $roundOne = compare_round_value($project, 'round1_value', '1');
    $completedRound = compare_round_value($project, 'completed_round_value', '0');

    $lockSql = "SELECT 1 FROM {$cmpTable} WHERE {$whereSql} AND {$roundField} = ? FOR UPDATE";
    $lockStmt = $mysqli->prepare($lockSql);
    $lockParams = array_merge($whereParams, [$roundOne]);
    bind_params($lockStmt, $whereTypes . 's', $lockParams);
    $lockStmt->execute();
    if (!$lockStmt->get_result()->fetch_assoc()) {
        throw new RuntimeException('Record is not pending or not found');
    }

    $set[] = $roundField . ' = ?';
    $types .= 's';
    $params[] = $completedRound;

    $updateSql = "UPDATE {$cmpTable} SET " . implode(', ', $set) . " WHERE {$whereSql} AND {$roundField} = ?";
    $updateStmt = $mysqli->prepare($updateSql);
    $updateParams = array_merge($params, $whereParams, [$roundOne]);
    bind_params($updateStmt, $types . $whereTypes . 's', $updateParams);
    $updateStmt->execute();

    $primaryKeyJson = json_encode($primaryKey, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $chkUserTable = qt($project['cmp_database'], 'chk_user');
    $auditSql = "INSERT INTO {$chkUserTable}
        (`user`, tab, hhid, `date`, `time`, keyfields, val_r1, val_r2, val)
        VALUES (?, ?, ?, CURDATE(), CURTIME(), ?, ?, ?, ?)";
    $auditStmt = $mysqli->prepare($auditSql);
    foreach ($auditRows as $row) {
        $auditParams = [
            $user['username'],
            $tableName,
            $compareKey !== '' ? $compareKey : $primaryKeyJson,
            $row['column_name'],
            $row['round1_value'],
            $row['round2_value'],
            $row['selected_value'],
        ];
        bind_params($auditStmt, 'sssssss', $auditParams);
        $auditStmt->execute();
    }

    $runRecordId = complete_compare_run_record(
        $mysqli,
        $runId !== '' ? $runId : null,
        $compareKey,
        $user['username']
    );
    insert_compare_field_logs(
        $mysqli,
        $ctx,
        $runId !== '' ? $runId : null,
        $runRecordId,
        $primaryKey,
        $compareKey !== '' ? $compareKey : $primaryKeyJson,
        $auditRows,
        $user['username']
    );

    $mysqli->commit();
    json_response(true, 'บันทึกสำเร็จ', [
        'updated_rows' => $updateStmt->affected_rows,
        'audit_rows' => count($auditRows),
        'round' => $completedRound,
        'run_id' => $runId !== '' ? $runId : null,
    ]);
} catch (Throwable $exception) {
    $mysqli->rollback();
    error_log('Compare save failed: ' . $exception->getMessage());
    json_response(false, 'บันทึกไม่สำเร็จ', [], ['COMPARE_SAVE_FAILED'], 500);
}
