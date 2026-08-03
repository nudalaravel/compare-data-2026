<?php
declare(strict_types=1);

require_once __DIR__ . '/common/auth.php';
require_once __DIR__ . '/common/db.php';
require_once __DIR__ . '/common/compare.php';

require_method('POST');
$user = require_auth();

$body = input_json();
$taskId = require_string($body, 'task_id');

$mysqli = db();
$mysqli->begin_transaction();
try {
    $complete = 'complete';

    if (!compare_run_tables_ready($mysqli)) {
        json_response(false, 'Compare run tables are not migrated', [], ['COMPARE_RUN_TABLES_REQUIRED'], 500);
    }

    $sql = 'UPDATE ' . core_table('cmp_compare_runs') . '
            SET status = ?,
                completed_at = COALESCE(completed_at, NOW())
            WHERE run_id = ?
              AND assigned_to = ?
              AND NOT EXISTS (
                SELECT 1
                FROM ' . core_table('cmp_compare_run_records') . '
                WHERE run_id = ? AND status <> ?
              )';
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('sssss', $complete, $taskId, $user['username'], $taskId, $complete);
    $stmt->execute();
    $mysqli->commit();

    json_response(true, 'Compare Complete', [
        'source' => 'cmp_compare_runs',
        'updated_rows' => $stmt->affected_rows,
    ]);
} catch (Throwable $exception) {
    $mysqli->rollback();
    error_log('Compare complete failed: ' . $exception->getMessage());
    json_response(false, 'ปิดงานไม่สำเร็จ', [], ['COMPARE_COMPLETE_FAILED'], 500);
}
