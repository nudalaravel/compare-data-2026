<?php
declare(strict_types=1);

require_once __DIR__ . '/admin-common.php';

function admin_round_value(array $body, string $field, string $default): string
{
    $value = trim((string)($body[$field] ?? $default));
    return $value === '' ? $default : admin_string($value, 32);
}

function admin_positive_int_value($value, int $default): int
{
    if ($value === null || $value === '') {
        return $default;
    }

    $number = (int)$value;
    if ($number <= 0) {
        json_response(false, 'Validation error', [], ['SEARCH_SCOPE_POSITIVE_INTEGER_REQUIRED'], 422);
    }

    return $number;
}

function admin_nullable_positive_int_value($value, ?int $default = null): ?int
{
    if ($value === null || $value === '') {
        return $default;
    }

    $number = (int)$value;
    if ($number <= 0) {
        json_response(false, 'Validation error', [], ['SEARCH_SCOPE_POSITIVE_INTEGER_REQUIRED'], 422);
    }

    return $number;
}

function admin_search_mode_value($value, string $default = 'exact'): string
{
    $mode = strtolower(trim((string)($value ?? $default)));
    if ($mode === '') {
        return $default;
    }

    if (!in_array($mode, ['exact', 'prefix'], true)) {
        json_response(false, 'Validation error', [], ['INVALID_SEARCH_ID2_MODE'], 422);
    }

    return $mode;
}

function admin_validate_search_split(int $id1Start, int $id1Length, int $id2Start): void
{
    $id1End = $id1Start + $id1Length - 1;
    if ($id2Start <= $id1End) {
        json_response(false, 'Validation error', [], ['SEARCH_ID_SEGMENTS_OVERLAP'], 422);
    }
}

function admin_body_has_value(array $body, string $field): bool
{
    return array_key_exists($field, $body) && trim((string)$body[$field]) !== '';
}

function admin_identifier_or_existing(array $body, string $field, string $existing = '', string $default = '', bool $required = false): string
{
    $value = trim((string)($body[$field] ?? ''));
    if ($value !== '') {
        return assert_identifier($value);
    }

    $fallback = trim($existing !== '' ? $existing : $default);
    if ($fallback !== '') {
        return assert_identifier($fallback);
    }

    if ($required) {
        json_response(false, 'Validation error', [], ["Missing field: {$field}"], 422);
    }

    return '';
}

try {
    $mysqli = db();
    $method = admin_request_method();
    require_manage_admin();

    if ($method === 'GET') {
        $databaseId = (int)($_GET['database_id'] ?? 0);
        if ($databaseId > 0) {
            $row = admin_fetch_database($mysqli, $databaseId);
            json_response(true, 'database', ['database' => admin_database_payload($row)]);
        }

        $projectCode = admin_project_code((string)($_GET['project_code'] ?? ($_GET['project_key'] ?? '')), 'project_code');
        $sql = 'SELECT d.*,
                       COALESCE(t.table_count, 0) AS table_count,
                       COALESCE(c.column_count, 0) AS column_count
                FROM ' . admin_config_table('project_databases') . ' d
                LEFT JOIN (
                    SELECT database_id, COUNT(*) AS table_count
                    FROM ' . admin_config_table('project_tables') . '
                    GROUP BY database_id
                ) t ON t.database_id = d.database_id
                LEFT JOIN (
                    SELECT pt.database_id, COUNT(*) AS column_count
                    FROM ' . admin_config_table('project_tables') . ' pt
                    INNER JOIN ' . admin_config_table('project_table_hidden_columns') . ' pc ON pc.table_id = pt.table_id
                    GROUP BY pt.database_id
                ) c ON c.database_id = d.database_id
                WHERE d.project_code = ?
                ORDER BY d.display_order, d.database_code';
        $params = [$projectCode];
        $rows = admin_fetch_all($mysqli, $sql, 's', $params);
        $databases = array_map('admin_database_payload', $rows);

        json_response(true, 'databases', ['databases' => $databases]);
    }

    if (!in_array($method, ['POST', 'PUT'], true)) {
        json_response(false, 'Method not allowed', [], ['Expected GET, POST, or PUT'], 405);
    }

    $admin = require_manage_admin();
    $body = input_json();
    $databaseId = (int)($body['database_id'] ?? 0);
    $projectCode = admin_project_code_from_body($body);
    if (!admin_fetch_project($mysqli, $projectCode)) {
        json_response(false, 'Project not found', [], ['PROJECT_NOT_FOUND'], 404);
    }

    $requestedDatabaseCode = admin_body_has_value($body, 'database_code')
        ? assert_identifier(trim((string)$body['database_code']))
        : '';
    $before = null;
    if ($databaseId > 0) {
        $before = admin_fetch_database($mysqli, $databaseId);
    } elseif ($requestedDatabaseCode !== '') {
        $sql = 'SELECT * FROM ' . admin_config_table('project_databases') . '
                WHERE project_code = ? AND database_code = ?';
        $params = [$projectCode, $requestedDatabaseCode];
        $before = admin_fetch_one($mysqli, $sql, 'ss', $params);
        if ($before) {
            $databaseId = (int)$before['database_id'];
        }
    } elseif (!admin_body_has_value($body, 'raw_database')) {
        json_response(false, 'Validation error', [], [
            'Missing database_id or database_code for update',
            'Missing field: raw_database for create',
        ], 422);
    }

    $rawDatabase = admin_identifier_or_existing($body, 'raw_database', $before['raw_database'] ?? '', '', true);
    $databaseCode = $requestedDatabaseCode !== ''
        ? $requestedDatabaseCode
        : admin_identifier_or_existing($body, 'database_code', $before['database_code'] ?? '', $rawDatabase, true);
    $compareDatabase = admin_identifier_or_existing($body, 'compare_database', $before['compare_database'] ?? '', $rawDatabase . '_cmp', true);
    $roundField = admin_identifier_or_existing($body, 'round_field', $before['round_field'] ?? '', 'round', true);
    $questionnaireName = admin_nullable_string(
        $body['questionnaire_name']
            ?? ($body['questionnaireName']
                ?? ($body['display_name']
                    ?? ($before['questionnaire_name'] ?? ''))),
        255
    );
    $tablePreface = admin_nullable_string(
        $body['table_preface'] ?? ($body['tablePreface'] ?? ($before['table_preface'] ?? '')),
        128
    );
    if ($tablePreface !== null) {
        $tablePreface = assert_identifier($tablePreface);
    }
    $sampleIdsSql = admin_nullable_string(
        $body['sample_ids_sql'] ?? ($body['sampleIdsSql'] ?? ($before['sample_ids_sql'] ?? '')),
        0
    );
    $searchColumn = admin_nullable_string(
        $body['search_column'] ?? ($body['searchColumn'] ?? ($before['search_column'] ?? '')),
        128
    );
    if ($searchColumn !== null) {
        $searchColumn = assert_identifier($searchColumn);
    }
    $searchId1Start = admin_positive_int_value(
        $body['search_id1_start'] ?? ($body['searchId1Start'] ?? ($before['search_id1_start'] ?? 1)),
        1
    );
    $searchId1Length = admin_positive_int_value(
        $body['search_id1_length'] ?? ($body['searchId1Length'] ?? ($before['search_id1_length'] ?? 12)),
        12
    );
    $searchId2Start = admin_positive_int_value(
        $body['search_id2_start'] ?? ($body['searchId2Start'] ?? ($before['search_id2_start'] ?? 13)),
        13
    );
    $searchId2Length = admin_nullable_positive_int_value(
        $body['search_id2_length'] ?? ($body['searchId2Length'] ?? ($before['search_id2_length'] ?? null)),
        null
    );
    $searchId2Mode = admin_search_mode_value(
        $body['search_id2_mode'] ?? ($body['searchId2Mode'] ?? ($before['search_id2_mode'] ?? 'exact')),
        'exact'
    );
    admin_validate_search_split($searchId1Start, $searchId1Length, $searchId2Start);
    $round1Value = admin_round_value($body, 'round1_value', (string)($before['round1_value'] ?? '1'));
    $round2Value = admin_round_value($body, 'round2_value', (string)($before['round2_value'] ?? '2'));
    $completedRoundValue = admin_round_value($body, 'completed_round_value', (string)($before['completed_round_value'] ?? '0'));
    $compareEnabled = admin_bool_value($body['compare_enabled'] ?? ($before['compare_enabled'] ?? null), true);
    $description = admin_nullable_string($body['description'] ?? ($before['description'] ?? ''), 5000);
    $status = admin_status_value($body['status'] ?? ($before['status'] ?? ''), ['draft', 'ready', 'prepared', 'disabled'], 'draft');
    $displayOrder = admin_int_value($body['display_order'] ?? ($before['display_order'] ?? 0));
    $color = admin_status_value($body['color'] ?? ($before['color'] ?? 'blue'), ['green', 'blue', 'red', 'yellow'], 'blue');
    $username = $admin['username'];

    $mysqli->begin_transaction();

    if ($databaseId > 0) {
        $sql = 'UPDATE ' . admin_config_table('project_databases') . '
                SET project_code = ?,
                    database_code = ?,
                    raw_database = ?,
                    compare_database = ?,
                    round_field = ?,
                    description = ?,
                    status = ?,
                    display_order = ?,
                    updated_by = ?
                WHERE database_id = ?';
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param(
            'sssssssisi',
            $projectCode,
            $databaseCode,
            $rawDatabase,
            $compareDatabase,
            $roundField,
            $description,
            $status,
            $displayOrder,
            $username,
            $databaseId
        );
        $stmt->execute();
    } else {
        $sql = 'INSERT INTO ' . admin_config_table('project_databases') . '
                (project_code, database_code, raw_database, compare_database, round_field,
                 description, status, display_order, created_by, updated_by)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                  database_id = LAST_INSERT_ID(database_id),
                  raw_database = VALUES(raw_database),
                  compare_database = VALUES(compare_database),
                  round_field = VALUES(round_field),
                  description = VALUES(description),
                  status = VALUES(status),
                  display_order = VALUES(display_order),
                  updated_by = VALUES(updated_by)';
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param(
            'sssssssiss',
            $projectCode,
            $databaseCode,
            $rawDatabase,
            $compareDatabase,
            $roundField,
            $description,
            $status,
            $displayOrder,
            $username,
            $username
        );
        $stmt->execute();
        $databaseId = (int)$mysqli->insert_id;
    }

    $phase2Set = [];
    $phase2Types = '';
    $phase2Params = [];
    if (metadata_column_exists($mysqli, CMP_CORE_DB, 'project_databases', 'round1_value')
        && metadata_column_exists($mysqli, CMP_CORE_DB, 'project_databases', 'round2_value')
        && metadata_column_exists($mysqli, CMP_CORE_DB, 'project_databases', 'completed_round_value')) {
        $phase2Set[] = 'round1_value = ?';
        $phase2Set[] = 'round2_value = ?';
        $phase2Set[] = 'completed_round_value = ?';
        $phase2Types .= 'sss';
        array_push($phase2Params, $round1Value, $round2Value, $completedRoundValue);
    }
    if (metadata_column_exists($mysqli, CMP_CORE_DB, 'project_databases', 'compare_enabled')) {
        $phase2Set[] = 'compare_enabled = ?';
        $phase2Types .= 'i';
        $phase2Params[] = $compareEnabled;
    }
    if ($phase2Set) {
        $phase2Sql = 'UPDATE ' . admin_config_table('project_databases') . '
                      SET ' . implode(', ', $phase2Set) . '
                      WHERE database_id = ?';
        $phase2Types .= 'i';
        $phase2Params[] = $databaseId;
        $phase2Stmt = $mysqli->prepare($phase2Sql);
        bind_params($phase2Stmt, $phase2Types, $phase2Params);
        $phase2Stmt->execute();
    }

    if (metadata_column_exists($mysqli, CMP_CORE_DB, 'project_databases', 'questionnaire_name')) {
        $nameSql = 'UPDATE ' . admin_config_table('project_databases') . '
                    SET questionnaire_name = ?
                    WHERE database_id = ?';
        $nameStmt = $mysqli->prepare($nameSql);
        $nameStmt->bind_param('si', $questionnaireName, $databaseId);
        $nameStmt->execute();
    }

    if (metadata_column_exists($mysqli, CMP_CORE_DB, 'project_databases', 'table_preface')) {
        $prefaceSql = 'UPDATE ' . admin_config_table('project_databases') . '
                       SET table_preface = ?
                       WHERE database_id = ?';
        $prefaceStmt = $mysqli->prepare($prefaceSql);
        $prefaceStmt->bind_param('si', $tablePreface, $databaseId);
        $prefaceStmt->execute();
    }

    if (metadata_column_exists($mysqli, CMP_CORE_DB, 'project_databases', 'sample_ids_sql')) {
        $sampleSql = 'UPDATE ' . admin_config_table('project_databases') . '
                      SET sample_ids_sql = ?
                      WHERE database_id = ?';
        $sampleStmt = $mysqli->prepare($sampleSql);
        $sampleStmt->bind_param('si', $sampleIdsSql, $databaseId);
        $sampleStmt->execute();
    }

    if (metadata_column_exists($mysqli, CMP_CORE_DB, 'project_databases', 'color')) {
        $colorSql = 'UPDATE ' . admin_config_table('project_databases') . '
                     SET color = ?
                     WHERE database_id = ?';
        $colorStmt = $mysqli->prepare($colorSql);
        $colorStmt->bind_param('si', $color, $databaseId);
        $colorStmt->execute();
    }

    if (metadata_project_search_config_columns_exist($mysqli)) {
        $searchId2LengthSql = $searchId2Length === null ? 'NULL' : '?';
        $searchScopeSql = 'UPDATE ' . admin_config_table('project_databases') . "
                           SET search_column = ?,
                               search_id1_start = ?,
                               search_id1_length = ?,
                               search_id2_start = ?,
                               search_id2_length = {$searchId2LengthSql},
                               search_id2_mode = ?
                           WHERE database_id = ?";
        $searchScopeStmt = $mysqli->prepare($searchScopeSql);
        if ($searchId2Length === null) {
            $searchScopeStmt->bind_param(
                'siiisi',
                $searchColumn,
                $searchId1Start,
                $searchId1Length,
                $searchId2Start,
                $searchId2Mode,
                $databaseId
            );
        } else {
            $searchScopeStmt->bind_param(
                'siiiisi',
                $searchColumn,
                $searchId1Start,
                $searchId1Length,
                $searchId2Start,
                $searchId2Length,
                $searchId2Mode,
                $databaseId
            );
        }
        $searchScopeStmt->execute();
    }

    $after = admin_fetch_database($mysqli, $databaseId);
    admin_audit_log($mysqli, 'database', (string)$databaseId, $before ? 'update' : 'create', $before, $after, $username);

    $mysqli->commit();

    json_response(true, 'database saved', ['database' => admin_database_payload($after)]);
} catch (Throwable $exception) {
    if (isset($mysqli) && $mysqli instanceof mysqli) {
        try {
            $mysqli->rollback();
        } catch (Throwable $ignored) {
        }
    }
    admin_safe_error($exception, 'ไม่สามารถจัดการฐานข้อมูลของโครงการได้');
}
