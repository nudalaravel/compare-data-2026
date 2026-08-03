<?php
declare(strict_types=1);

require_once __DIR__ . '/common/auth.php';
require_once __DIR__ . '/common/db.php';
require_once __DIR__ . '/common/compare.php';

require_method('GET');
$user = require_auth();
$mysqli = db();

$projectId = trim((string)($_GET['project_id'] ?? ''));
$keyword = '%' . trim((string)($_GET['q'] ?? '')) . '%';

$projects = fetch_log_projects($mysqli, $user['username'], $projectId);
$logs = [];

foreach ($projects as $project) {
    $cmpDatabase = assert_identifier($project['cmp_database']);
    if (!table_exists($mysqli, $cmpDatabase, 'chk_user')) {
        continue;
    }

    $chkUserTable = qt($cmpDatabase, 'chk_user');
    $sql = "SELECT `user`, tab, hhid, `date`, `time`, keyfields, val_r1, val_r2, val
            FROM {$chkUserTable}
            WHERE hhid LIKE ? OR tab LIKE ? OR keyfields LIKE ? OR `user` LIKE ?
            ORDER BY `date` DESC, `time` DESC
            LIMIT 500";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('ssss', $keyword, $keyword, $keyword, $keyword);
    $stmt->execute();
    $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    foreach ($rows as $index => $row) {
        $changedAt = trim((string)$row['date'] . ' ' . (string)$row['time']);
        $logs[] = [
            'audit_id' => $project['project_id'] . ':' . $index . ':' . $changedAt,
            'task_id' => null,
            'project_id' => $project['project_id'],
            'table_name' => $row['tab'],
            'primary_key_json' => json_encode(['compare_key' => $row['hhid']], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            'hhid' => $row['hhid'],
            'column_name' => $row['keyfields'],
            'round1_value' => $row['val_r1'],
            'round2_value' => $row['val_r2'],
            'selected_value' => $row['val'],
            'selected_source' => 'chk_user',
            'username' => $row['user'],
            'changed_at' => $changedAt,
        ];
    }
}

usort($logs, static function ($a, $b) {
    return strcmp((string)$b['changed_at'], (string)$a['changed_at']);
});

json_response(true, 'audit logs', ['logs' => array_slice($logs, 0, 500)]);

function fetch_log_projects(mysqli $mysqli, string $username, string $projectId): array
{
    $whereProject = '';
    $types = '';
    $params = [];

    if ($projectId !== '') {
        assert_identifier($projectId);
        $whereProject = ' AND (d.database_code = ? OR d.raw_database = ? OR d.compare_database = ? OR p.project_code = ?)';
        $types .= 'ssss';
        array_push($params, $projectId, $projectId, $projectId, $projectId);
    }

    $compareEnabledWhere = metadata_column_exists($mysqli, CMP_CORE_DB, 'project_databases', 'compare_enabled')
        ? ' AND d.compare_enabled = 1'
        : '';
    $sql = 'SELECT d.database_code AS project_id, d.compare_database AS cmp_database
            FROM ' . core_table('project_databases') . ' d
            INNER JOIN ' . core_table('projects') . ' p ON p.project_code = d.project_code
            WHERE p.compare_ready = 1
              AND d.status <> ?
              ' . $compareEnabledWhere . '
              ' . $whereProject . '
            ORDER BY p.display_order, d.display_order, d.database_code';
    $disabled = 'disabled';
    $types = 's' . $types;
    array_unshift($params, $disabled);
    $stmt = $mysqli->prepare($sql);
    bind_params($stmt, $types, $params);
    $stmt->execute();

    return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
}
