<?php
declare(strict_types=1);

require_once __DIR__ . '/common/auth.php';
require_once __DIR__ . '/common/db.php';
require_once __DIR__ . '/common/compare.php';

require_method('GET');
$user = require_auth();
$mysqli = db();

if (compare_run_tables_ready($mysqli)) {
    $sql = 'SELECT run_id AS task_id,
                   database_code AS project_id,
                   table_name,
                   status,
                   assigned_to,
                   total_records,
                   completed_records,
                   started_at,
                   completed_at,
                   created_at,
                   updated_at
            FROM ' . core_table('cmp_compare_runs') . '
            WHERE assigned_to = ?
            ORDER BY created_at DESC
            LIMIT 200';
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('s', $user['username']);
    $stmt->execute();

    json_response(true, 'tasks', [
        'source' => 'cmp_compare_runs',
        'tasks' => $stmt->get_result()->fetch_all(MYSQLI_ASSOC),
    ]);
}

json_response(true, 'tasks', [
    'source' => 'phase2_not_migrated',
    'tasks' => [],
]);
