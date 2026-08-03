<?php
declare(strict_types=1);

require_once __DIR__ . '/admin-common.php';

try {
    $mysqli = db();
    $method = admin_request_method();

    if ($method === 'GET') {
        $adminMode = strtolower((string)($_GET['scope'] ?? 'public')) === 'admin';
        if ($adminMode) {
            require_manage_admin();
        }

        $where = $adminMode ? '' : 'WHERE p.is_visible = 1';
        $sql = 'SELECT p.*,
                       COALESCE(d.database_count, 0) AS database_count,
                       COALESCE(d.prepared_count, 0) AS prepared_count,
                       COALESCE(t.table_count, 0) AS table_count
                FROM ' . admin_config_table('projects') . ' p
                LEFT JOIN (
                    SELECT project_code,
                           COUNT(*) AS database_count,
                           SUM(CASE WHEN is_prepared = 1 THEN 1 ELSE 0 END) AS prepared_count
                    FROM ' . admin_config_table('project_databases') . '
                    GROUP BY project_code
                ) d ON d.project_code = p.project_code
                LEFT JOIN (
                    SELECT d2.project_code,
                           COUNT(*) AS table_count
                    FROM ' . admin_config_table('project_databases') . ' d2
                    INNER JOIN ' . admin_config_table('project_tables') . ' t2
                        ON t2.database_id = d2.database_id AND t2.allow_compare = 1
                    GROUP BY d2.project_code
                ) t ON t.project_code = p.project_code
                ' . $where . '
                ORDER BY p.display_order, p.project_code';
        $rows = admin_fetch_all($mysqli, $sql);
        $projects = array_map('admin_project_payload', $rows);

        json_response(true, 'projects', ['projects' => $projects]);
    }

    if (!in_array($method, ['POST', 'PUT'], true)) {
        json_response(false, 'Method not allowed', [], ['Expected GET, POST, or PUT'], 405);
    }

    $admin = require_manage_admin();
    $body = input_json();

    $projectCode = admin_project_code_from_body($body);
    $projectName = admin_string($body['project_name'] ?? ($body['title'] ?? ''), 255);
    if ($projectName === '') {
        json_response(false, 'Validation error', [], ['Missing field: project_name'], 422);
    }

    $status = admin_status_value(
        $body['status'] ?? ($body['status_mode'] ?? ''),
        ['draft', 'preparing', 'active', 'ready', 'key_closed', 'ended'],
        'draft'
    );
    $keyinDefault = !in_array($status, ['draft', 'ended'], true);
    $compareDefault = $status === 'ready';

    $keyinActive = array_key_exists('keyin_active', $body)
        ? admin_bool_value($body['keyin_active'])
        : admin_bool_value($body['keyinActive'] ?? null, $keyinDefault);
    $compareReady = array_key_exists('compare_ready', $body)
        ? admin_bool_value($body['compare_ready'])
        : admin_bool_value($body['compareReady'] ?? null, $compareDefault);

    $keyinUrl = admin_url_value($body['keyin_url'] ?? ($body['survey_url'] ?? ''), 'keyin_url');
    $compareUrl = admin_url_value($body['compare_url'] ?? '', 'compare_url');
    $description = admin_nullable_string($body['description'] ?? ($body['summary'] ?? ''), 5000);
    $startDate = admin_date_value($body['start_date'] ?? '');
    $endDate = admin_date_value($body['end_date'] ?? '');
    $isVisible = admin_bool_value($body['is_visible'] ?? null, true);
    $displayOrder = admin_int_value($body['display_order'] ?? 0);
    $username = $admin['username'];

    $before = admin_fetch_project($mysqli, $projectCode);

    $mysqli->begin_transaction();

    $sql = 'INSERT INTO ' . admin_config_table('projects') . '
            (project_code, project_name, keyin_url, compare_url, description,
             start_date, end_date, status, keyin_active, compare_ready,
             is_visible, display_order, created_by, updated_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              project_name = VALUES(project_name),
              keyin_url = VALUES(keyin_url),
              compare_url = VALUES(compare_url),
              description = VALUES(description),
              start_date = VALUES(start_date),
              end_date = VALUES(end_date),
              status = VALUES(status),
              keyin_active = VALUES(keyin_active),
              compare_ready = VALUES(compare_ready),
              is_visible = VALUES(is_visible),
              display_order = VALUES(display_order),
              updated_by = VALUES(updated_by)';
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param(
        'ssssssssiiiiss',
        $projectCode,
        $projectName,
        $keyinUrl,
        $compareUrl,
        $description,
        $startDate,
        $endDate,
        $status,
        $keyinActive,
        $compareReady,
        $isVisible,
        $displayOrder,
        $username,
        $username
    );
    $stmt->execute();

    $after = admin_fetch_project($mysqli, $projectCode);
    admin_audit_log($mysqli, 'project', $projectCode, $before ? 'update' : 'create', $before, $after, $username);

    $mysqli->commit();

    json_response(true, 'project saved', ['project' => admin_project_payload($after)]);
} catch (Throwable $exception) {
    if (isset($mysqli) && $mysqli instanceof mysqli) {
        try {
            $mysqli->rollback();
        } catch (Throwable $ignored) {
        }
    }
    admin_safe_error($exception, 'ไม่สามารถจัดการข้อมูลโครงการได้');
}
