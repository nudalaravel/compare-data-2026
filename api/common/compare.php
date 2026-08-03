<?php
declare(strict_types=1);

require_once __DIR__ . '/metadata.php';

function compare_preview(
    mysqli $mysqli,
    array $ctx,
    string $searchMode,
    string $searchId,
    bool $strictSearchColumn = true,
    bool $includeSqlDebug = false
): array {
    $project = $ctx['project'];
    $tableName = $ctx['table']['table_name'];
    $rawTable = qt($project['raw_database'], $tableName);
    $cmpTable = qt($project['cmp_database'], $tableName);
    $roundField = qi($project['round_field']);
    $roundOne = compare_round_value($project, 'round1_value', '1');
    $roundTwo = compare_round_value($project, 'round2_value', '2');
    $completedRound = compare_round_value($project, 'completed_round_value', '0');
    $cmpTableExists = table_exists($mysqli, $project['cmp_database'], $tableName);
    $searchExpr = compare_search_expression($mysqli, $project, $tableName, 'r', $ctx['primaryKeys'], $strictSearchColumn);
    $searchExprR1 = compare_search_expression($mysqli, $project, $tableName, 'r1', $ctx['primaryKeys'], $strictSearchColumn);
    if ($searchExpr === null || $searchExprR1 === null) {
        return [
            'round1Count' => 0,
            'round2Count' => 0,
            'intersectionCount' => 0,
            'onlyRound1Count' => 0,
            'onlyRound2Count' => 0,
            'rawDatabase' => $project['raw_database'],
            'cmpDatabase' => $project['cmp_database'],
            'targetTable' => $tableName,
            'targetFullName' => $project['cmp_database'] . '.' . $tableName,
            'willCreateTable' => !table_exists($mysqli, $project['cmp_database'], $tableName),
            'copiedRows' => 0,
            'searchId' => $searchId,
            'searchMode' => $searchMode,
            'searchColumn' => (string)($project['search_column'] ?? ''),
            'compareTableExists' => $cmpTableExists,
            'compare_table_exists' => $cmpTableExists,
            'comparePendingCount' => 0,
            'compare_pending_count' => 0,
            'compareCompletedCount' => 0,
            'compare_completed_count' => 0,
            'intersectionCmpCount' => 0,
            'intersection_cmp_count' => 0,
            'compareStatus' => 'not_prepared',
            'compare_status' => 'not_prepared',
            'error' => 'SEARCH_COLUMN_NOT_FOUND',
        ];
    }
    $operator = $searchMode === 'exact' ? '=' : 'LIKE';
    $needle = $searchMode === 'exact' ? $searchId : $searchId . '%';

    $round1Debug = [];
    $round2Debug = [];
    $comparePendingDebug = [];
    $compareCompletedDebug = [];
    $intersectionCmpDebug = [];
    if ($includeSqlDebug) {
        $round1 = count_round_rows($mysqli, $rawTable, $roundField, $searchExpr, $roundOne, $operator, $needle, $round1Debug);
        $round2 = count_round_rows($mysqli, $rawTable, $roundField, $searchExpr, $roundTwo, $operator, $needle, $round2Debug);
    } else {
        $round1 = count_round_rows($mysqli, $rawTable, $roundField, $searchExpr, $roundOne, $operator, $needle);
        $round2 = count_round_rows($mysqli, $rawTable, $roundField, $searchExpr, $roundTwo, $operator, $needle);
    }

    $comparePendingCount = 0;
    $compareCompletedCount = 0;
    $intersectionCmpCount = 0;
    if ($cmpTableExists) {
        if ($includeSqlDebug) {
            $comparePendingCount = count_round_rows($mysqli, $cmpTable, $roundField, $searchExpr, $roundOne, $operator, $needle, $comparePendingDebug);
            $compareCompletedCount = count_round_rows($mysqli, $cmpTable, $roundField, $searchExpr, $completedRound, $operator, $needle, $compareCompletedDebug);
            $intersectionCmpCount = count_cmp_scope_rows($mysqli, $ctx, $searchMode, $searchId, $intersectionCmpDebug);
        } else {
            $comparePendingCount = count_round_rows($mysqli, $cmpTable, $roundField, $searchExpr, $roundOne, $operator, $needle);
            $compareCompletedCount = count_round_rows($mysqli, $cmpTable, $roundField, $searchExpr, $completedRound, $operator, $needle);
            $intersectionCmpCount = count_cmp_scope_rows($mysqli, $ctx, $searchMode, $searchId);
        }
    }
    $compareScopeCount = $comparePendingCount + $compareCompletedCount;

    $join = key_join_condition('r1', 'r2', $ctx['primaryKeys']);
    $sql = "SELECT COUNT(*) AS total
            FROM {$rawTable} r1
            INNER JOIN {$rawTable} r2 ON {$join}
            WHERE r1.{$roundField} = ? AND r2.{$roundField} = ? AND {$searchExprR1} {$operator} ?";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('sss', $roundOne, $roundTwo, $needle);
    $stmt->execute();
    $intersection = (int)$stmt->get_result()->fetch_assoc()['total'];
    $compareStatus = 'not_prepared';
    if ($cmpTableExists && $compareScopeCount > 0) {
        $compareStatus = ($round2 > 0 && $intersectionCmpCount === $round2 && $compareCompletedCount >= $round2 && $comparePendingCount === 0)
            ? 'complete'
            : 'pending';
    }

    $preview = [
        'round1Count' => $round1,
        'round2Count' => $round2,
        'intersectionCount' => $intersection,
        'onlyRound1Count' => max(0, $round1 - $intersection),
        'onlyRound2Count' => max(0, $round2 - $intersection),
        'rawDatabase' => $project['raw_database'],
        'cmpDatabase' => $project['cmp_database'],
        'targetTable' => $tableName,
        'targetFullName' => $project['cmp_database'] . '.' . $tableName,
        'willCreateTable' => !table_exists($mysqli, $project['cmp_database'], $tableName),
        'copiedRows' => $round1,
        'searchId' => $searchId,
        'searchMode' => $searchMode,
        'searchColumn' => (string)($project['search_column'] ?? ''),
        'compareTableExists' => $cmpTableExists,
        'compare_table_exists' => $cmpTableExists,
        'comparePendingCount' => $comparePendingCount,
        'compare_pending_count' => $comparePendingCount,
        'compareCompletedCount' => $compareCompletedCount,
        'compare_completed_count' => $compareCompletedCount,
        'compareScopeCount' => $compareScopeCount,
        'compare_scope_count' => $compareScopeCount,
        'intersectionCmpCount' => $intersectionCmpCount,
        'intersection_cmp_count' => $intersectionCmpCount,
        'compareStatus' => $compareStatus,
        'compare_status' => $compareStatus
    ];

    if ($includeSqlDebug) {
        $intersectionParams = [$roundOne, $roundTwo, $needle];
        $preview['debug'] = [
            'queries' => [
                'round1_count' => $round1Debug,
                'round2_count' => $round2Debug,
                'intersection_count' => compare_debug_sql_query($sql, $intersectionParams),
                'compare_pending_count' => $cmpTableExists ? $comparePendingDebug : ['skipped' => 'COMPARE_TABLE_NOT_FOUND'],
                'compare_completed_count' => $cmpTableExists ? $compareCompletedDebug : ['skipped' => 'COMPARE_TABLE_NOT_FOUND'],
                'intersection_cmp_count' => $cmpTableExists ? $intersectionCmpDebug : ['skipped' => 'COMPARE_TABLE_NOT_FOUND'],
            ],
        ];
    }

    return $preview;
}

function compare_search_expression(
    mysqli $mysqli,
    array $project,
    string $tableName,
    string $alias,
    array $primaryKeys,
    bool $strict = true
): ?string {
    $config = project_search_config($project);
    $searchColumn = $config['search_column'];
    if ($searchColumn === '') {
        return key_expression($alias, $primaryKeys);
    }

    if (metadata_column_exists($mysqli, $project['raw_database'], $tableName, $searchColumn)) {
        return "COALESCE(CAST({$alias}." . qi($searchColumn) . " AS CHAR), '')";
    }

    if ($strict) {
        json_response(false, 'Search column is not found in table', [], ['SEARCH_COLUMN_NOT_FOUND'], 422);
    }

    return null;
}

function compare_round_value(array $project, string $key, string $default): string
{
    $value = trim((string)($project[$key] ?? ''));
    return $value === '' ? $default : $value;
}

function count_round_rows(
    mysqli $mysqli,
    string $table,
    string $roundField,
    string $keyExpr,
    string $roundValue,
    string $operator,
    string $needle,
    ?array &$debugQuery = null
): int
{
    $sql = "SELECT COUNT(*) AS total FROM {$table} r WHERE r.{$roundField} = ? AND {$keyExpr} {$operator} ?";
    if ($debugQuery !== null) {
        $debugQuery = compare_debug_sql_query($sql, [$roundValue, $needle]);
    }

    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('ss', $roundValue, $needle);
    $stmt->execute();

    return (int)$stmt->get_result()->fetch_assoc()['total'];
}

function count_cmp_scope_rows(
    mysqli $mysqli,
    array $ctx,
    string $searchMode,
    string $searchId,
    ?array &$debugQuery = null
): int {
    $project = $ctx['project'];
    $tableName = $ctx['table']['table_name'];
    $cmpTable = qt($project['cmp_database'], $tableName);
    $roundField = qi($project['round_field']);
    $roundOne = compare_round_value($project, 'round1_value', '1');
    $completedRound = compare_round_value($project, 'completed_round_value', '0');
    $operator = $searchMode === 'exact' ? '=' : 'LIKE';
    $needle = $searchMode === 'exact' ? $searchId : $searchId . '%';
    $searchExpr = compare_search_expression($mysqli, $project, $tableName, 'c', $ctx['primaryKeys']);
    $sql = "SELECT COUNT(*) AS total
            FROM {$cmpTable} c
            WHERE c.{$roundField} IN (?, ?)
              AND {$searchExpr} {$operator} ?";

    if ($debugQuery !== null) {
        $debugQuery = compare_debug_sql_query($sql, [$roundOne, $completedRound, $needle]);
    }

    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('sss', $roundOne, $completedRound, $needle);
    $stmt->execute();

    return (int)$stmt->get_result()->fetch_assoc()['total'];
}

function compare_debug_sql_query(string $sql, array $params): array
{
    return [
        'sql' => $sql,
        'params' => $params,
        'interpolated_sql' => compare_debug_interpolate_sql($sql, $params),
    ];
}

function compare_debug_interpolate_sql(string $sql, array $params): string
{
    foreach ($params as $param) {
        $sql = preg_replace('/\?/', compare_debug_sql_literal((string)$param), $sql, 1) ?? $sql;
    }

    return $sql;
}

function compare_debug_sql_literal(string $value): string
{
    return "'" . str_replace(["\\", "'"], ["\\\\", "\\'"], $value) . "'";
}

function table_exists(mysqli $mysqli, string $database, string $tableName): bool
{
    $sql = 'SELECT COUNT(*) AS total
            FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?';
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('ss', $database, $tableName);
    $stmt->execute();

    return (int)$stmt->get_result()->fetch_assoc()['total'] > 0;
}

function ensure_chk_user_table(mysqli $mysqli, string $cmpDatabase): void
{
    $chkUserTable = qt($cmpDatabase, 'chk_user');
    $mysqli->query("CREATE TABLE IF NOT EXISTS {$chkUserTable} (
        `user` VARCHAR(100) NOT NULL,
        tab VARCHAR(128) NOT NULL,
        hhid VARCHAR(255) NOT NULL,
        `date` DATE NOT NULL,
        `time` TIME NOT NULL,
        keyfields VARCHAR(128) NOT NULL,
        val_r1 TEXT NULL,
        val_r2 TEXT NULL,
        val TEXT NULL,
        INDEX idx_chk_user_hhid (hhid),
        INDEX idx_chk_user_tab_hhid (tab, hhid),
        INDEX idx_chk_user_user_datetime (`user`, `date`, `time`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
}

function compare_key_from_primary_key(array $primaryKey, array $primaryKeys): string
{
    $parts = [];
    foreach ($primaryKeys as $key) {
        $parts[] = (string)($primaryKey[$key] ?? '');
    }

    return implode('', $parts);
}

function prepare_compare_table(mysqli $mysqli, array $ctx, string $searchMode = '', string $searchId = '', string $username = ''): array
{
    $project = $ctx['project'];
    $tableName = $ctx['table']['table_name'];
    $rawTable = qt($project['raw_database'], $tableName);
    $cmpDatabase = qi($project['cmp_database']);
    $cmpTable = qt($project['cmp_database'], $tableName);
    $roundField = qi($project['round_field']);
    $roundOne = compare_round_value($project, 'round1_value', '1');
    $runId = null;
    $runRecords = [];

    $mysqli->begin_transaction();
    try {
        $mysqli->query("CREATE DATABASE IF NOT EXISTS {$cmpDatabase} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        ensure_chk_user_table($mysqli, $project['cmp_database']);
        $created = !table_exists($mysqli, $project['cmp_database'], $tableName);
        if ($created) {
            $mysqli->query("CREATE TABLE {$cmpTable} LIKE {$rawTable}");
        }

        $rawColumns = fetch_table_columns($mysqli, $project['raw_database'], $tableName);
        $insertColumns = implode(', ', array_map('qi', $rawColumns));
        $selectColumns = implode(', ', array_map(static function ($column) {
            return 'r.' . qi($column);
        }, $rawColumns));
        if ($searchMode !== '' && $searchId !== '' && in_array($searchMode, ['exact', 'prefix'], true)) {
            $operator = $searchMode === 'exact' ? '=' : 'LIKE';
            $needle = $searchMode === 'exact' ? $searchId : $searchId . '%';
            $searchExpr = compare_search_expression($mysqli, $project, $tableName, 'r', $ctx['primaryKeys']);
            $sql = "INSERT IGNORE INTO {$cmpTable} ({$insertColumns})
                    SELECT {$selectColumns}
                    FROM {$rawTable} r
                    WHERE r.{$roundField} = ?
                      AND {$searchExpr} {$operator} ?";
            $stmt = $mysqli->prepare($sql);
            $stmt->bind_param('ss', $roundOne, $needle);
        } else {
            $sql = "INSERT IGNORE INTO {$cmpTable} ({$insertColumns})
                    SELECT {$selectColumns}
                    FROM {$rawTable} r
                    WHERE r.{$roundField} = ?";
            $stmt = $mysqli->prepare($sql);
            $stmt->bind_param('s', $roundOne);
        }
        $stmt->execute();
        $copiedRows = $stmt->affected_rows;

        if ($searchMode !== '' && $searchId !== '' && in_array($searchMode, ['exact', 'prefix'], true)) {
            $runRecords = fetch_compare_key_rows($mysqli, $ctx, $searchMode, $searchId);
            $runId = create_compare_run($mysqli, $ctx, $searchMode, $searchId, $username, $runRecords);
        }

        $mysqli->commit();

        return [
            'created' => $created,
            'copiedRows' => $copiedRows,
            'targetTable' => $project['cmp_database'] . '.' . $tableName,
            'runId' => $runId,
            'taskId' => $runId,
            'runRecords' => count($runRecords),
        ];
    } catch (Throwable $exception) {
        $mysqli->rollback();
        error_log('Compare prepare failed: ' . $exception->getMessage());
        json_response(false, 'เตรียมข้อมูล Compare ไม่สำเร็จ', [], ['COMPARE_PREPARE_FAILED'], 500);
    }
}

function fetch_table_columns(mysqli $mysqli, string $database, string $tableName): array
{
    $sql = 'SELECT COLUMN_NAME
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
            ORDER BY ORDINAL_POSITION';
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('ss', $database, $tableName);
    $stmt->execute();
    $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    return array_map(static function ($row) {
        return assert_identifier($row['COLUMN_NAME']);
    }, $rows);
}

function fetch_compare_records(mysqli $mysqli, array $ctx, string $searchMode, string $searchId): array
{
    $project = $ctx['project'];
    $tableName = $ctx['table']['table_name'];
    $keys = fetch_compare_key_rows($mysqli, $ctx, $searchMode, $searchId);

    return array_map(static function ($row) use ($mysqli, $ctx, $project, $tableName) {
        return fetch_record_diff($mysqli, $ctx, $project, $tableName, $row);
    }, $keys);
}

function fetch_compare_key_rows(mysqli $mysqli, array $ctx, string $searchMode, string $searchId): array
{
    $project = $ctx['project'];
    $tableName = $ctx['table']['table_name'];
    $cmpTable = qt($project['cmp_database'], $tableName);
    $rawTable = qt($project['raw_database'], $tableName);
    $roundField = qi($project['round_field']);
    $roundOne = compare_round_value($project, 'round1_value', '1');
    $roundTwo = compare_round_value($project, 'round2_value', '2');
    $completedRound = compare_round_value($project, 'completed_round_value', '0');
    $join = key_join_condition('c', 'r', $ctx['primaryKeys']);
    $keyExpr = key_expression('c', $ctx['primaryKeys']);
    $searchExpr = compare_search_expression($mysqli, $project, $tableName, 'c', $ctx['primaryKeys']);
    $operator = $searchMode === 'exact' ? '=' : 'LIKE';
    $needle = $searchMode === 'exact' ? $searchId : $searchId . '%';
    $selectKeys = implode(', ', array_map(static function ($key) {
        return 'c.' . qi($key) . ' AS ' . qi($key);
    }, $ctx['primaryKeys']));

    $sql = "SELECT {$selectKeys},
                   {$keyExpr} AS compare_key,
                   c.{$roundField} AS compare_round,
                   CASE WHEN c.{$roundField} = ? THEN 'complete' ELSE 'pending' END AS record_status
            FROM {$cmpTable} c
            INNER JOIN {$rawTable} r ON {$join}
            WHERE c.{$roundField} IN (?, ?)
              AND r.{$roundField} = ?
              AND {$searchExpr} {$operator} ?
            ORDER BY compare_key
            LIMIT 100";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('sssss', $completedRound, $roundOne, $completedRound, $roundTwo, $needle);
    $stmt->execute();

    return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
}

function fetch_record_diff(mysqli $mysqli, array $ctx, array $project, string $tableName, array $keyRow): array
{
    $cmpTable = qt($project['cmp_database'], $tableName);
    $rawTable = qt($project['raw_database'], $tableName);
    $roundField = qi($project['round_field']);
    $where = [];
    $types = '';
    $params = [];
    foreach ($ctx['primaryKeys'] as $key) {
        $where[] = qi($key) . ' = ?';
        $types .= 's';
        $params[] = (string)$keyRow[$key];
    }

    $whereSql = implode(' AND ', $where);
    $roundOne = compare_round_value($project, 'round1_value', '1');
    $roundTwo = compare_round_value($project, 'round2_value', '2');
    $completedRound = compare_round_value($project, 'completed_round_value', '0');
    $compareRound = (string)($keyRow['compare_round'] ?? $roundOne);
    $recordStatus = (string)($keyRow['record_status'] ?? ($compareRound === $completedRound ? 'complete' : 'pending'));

    $cmpSql = "SELECT * FROM {$cmpTable} WHERE {$roundField} = ? AND {$whereSql} LIMIT 1";
    $cmpStmt = $mysqli->prepare($cmpSql);
    $cmpTypes = 's' . $types;
    $cmpParams = array_merge([$compareRound], $params);
    bind_params($cmpStmt, $cmpTypes, $cmpParams);
    $cmpStmt->execute();
    $round1 = $cmpStmt->get_result()->fetch_assoc();

    $rawSql = "SELECT * FROM {$rawTable} WHERE {$roundField} = ? AND {$whereSql} LIMIT 1";
    $rawStmt = $mysqli->prepare($rawSql);
    $rawTypes = 's' . $types;
    $rawParams = array_merge([$roundTwo], $params);
    bind_params($rawStmt, $rawTypes, $rawParams);
    $rawStmt->execute();
    $round2 = $rawStmt->get_result()->fetch_assoc();

    $fields = array_map(static function ($column) use ($round1, $round2) {
        $name = $column['name'];
        $r1 = (string)($round1[$name] ?? '');
        $r2 = (string)($round2[$name] ?? '');

        return [
            'key' => $name,
            'type' => $column['type'],
            'round1Value' => $r1,
            'round2Value' => $r2,
            'same' => $r1 === $r2,
        ];
    }, $ctx['columns']);

    return [
        'id' => $keyRow['compare_key'],
        'primaryKey' => $keyRow['compare_key'],
        'primaryKeyValues' => array_intersect_key($keyRow, array_flip($ctx['primaryKeys'])),
        'status' => $recordStatus,
        'compareRound' => $compareRound,
        'compare_round' => $compareRound,
        'fields' => $fields,
    ];
}

function compare_run_tables_ready(mysqli $mysqli): bool
{
    if (metadata_table_exists($mysqli, CMP_CORE_DB, 'survey_system_settings')) {
        $sql = 'SELECT JSON_UNQUOTE(setting_value) AS setting_value
                FROM ' . core_table('survey_system_settings') . '
                WHERE setting_key = ?
                LIMIT 1';
        $settingKey = 'compare_phase2_enabled';
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param('s', $settingKey);
        $stmt->execute();
        $setting = $stmt->get_result()->fetch_assoc();
        $value = strtolower(trim((string)($setting['setting_value'] ?? 'true')));
        if (in_array($value, ['0', 'false', 'off', 'disabled'], true)) {
            return false;
        }
    }

    return table_exists($mysqli, CMP_CORE_DB, 'cmp_compare_runs')
        && table_exists($mysqli, CMP_CORE_DB, 'cmp_compare_run_records')
        && table_exists($mysqli, CMP_CORE_DB, 'cmp_compare_field_logs');
}

function create_compare_run(
    mysqli $mysqli,
    array $ctx,
    string $searchMode,
    string $searchId,
    string $username,
    array $keyRows
): ?string {
    if (!compare_run_tables_ready($mysqli)) {
        return null;
    }

    $project = $ctx['project'];
    $tableName = $ctx['table']['table_name'];
    $runId = 'run_' . bin2hex(random_bytes(16));
    $projectCode = (string)($project['survey_project_code'] ?? $project['project_code'] ?? '');
    $databaseCode = (string)($project['database_code'] ?? $project['project_id'] ?? '');
    $databaseId = isset($project['database_id']) ? (int)$project['database_id'] : null;
    $rawDatabase = (string)$project['raw_database'];
    $cmpDatabase = (string)$project['cmp_database'];
    $roundFieldName = (string)$project['round_field'];
    $primaryKeysJson = json_encode($ctx['primaryKeys'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $status = count($keyRows) > 0 ? 'in_progress' : 'pending';
    $totalRecords = count($keyRows);
    $completedRecords = count(array_filter($keyRows, static function ($row) {
        return ($row['record_status'] ?? '') === 'complete';
    }));
    if ($totalRecords > 0 && $completedRecords === $totalRecords) {
        $status = 'complete';
    }
    $roundOne = compare_round_value($project, 'round1_value', '1');
    $roundTwo = compare_round_value($project, 'round2_value', '2');
    $completedRound = compare_round_value($project, 'completed_round_value', '0');

    $sql = 'INSERT INTO ' . core_table('cmp_compare_runs') . '
            (run_id, project_code, database_id, database_code,
             raw_database, cmp_database, table_name, search_mode, search_id,
             primary_keys_json, round_field, round1_value, round2_value,
             completed_round_value, status, total_records, completed_records,
             assigned_to, started_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())';
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param(
        'ssissssssssssssiis',
        $runId,
        $projectCode,
        $databaseId,
        $databaseCode,
        $rawDatabase,
        $cmpDatabase,
        $tableName,
        $searchMode,
        $searchId,
        $primaryKeysJson,
        $roundFieldName,
        $roundOne,
        $roundTwo,
        $completedRound,
        $status,
        $totalRecords,
        $completedRecords,
        $username
    );
    $stmt->execute();

    if ($keyRows) {
        $recordSql = 'INSERT INTO ' . core_table('cmp_compare_run_records') . '
                      (run_id, primary_key_json, compare_key, status)
                      VALUES (?, ?, ?, ?)
                      ON DUPLICATE KEY UPDATE status = VALUES(status)';
        $recordStmt = $mysqli->prepare($recordSql);
        foreach ($keyRows as $row) {
            $primaryKeyValues = array_intersect_key($row, array_flip($ctx['primaryKeys']));
            $primaryKeyJson = json_encode($primaryKeyValues, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            $compareKey = (string)$row['compare_key'];
            $recordStatus = ($row['record_status'] ?? '') === 'complete' ? 'complete' : 'pending';
            $recordStmt->bind_param('ssss', $runId, $primaryKeyJson, $compareKey, $recordStatus);
            $recordStmt->execute();
        }
    }

    return $runId;
}

function complete_compare_run_record(
    mysqli $mysqli,
    ?string $runId,
    string $compareKey,
    string $username
): ?int {
    if (!$runId || !compare_run_tables_ready($mysqli)) {
        return null;
    }

    $recordSql = 'SELECT run_record_id
                  FROM ' . core_table('cmp_compare_run_records') . '
                  WHERE run_id = ? AND compare_key = ?
                  LIMIT 1';
    $recordStmt = $mysqli->prepare($recordSql);
    $recordStmt->bind_param('ss', $runId, $compareKey);
    $recordStmt->execute();
    $record = $recordStmt->get_result()->fetch_assoc();
    if (!$record) {
        return null;
    }

    $runRecordId = (int)$record['run_record_id'];
    $complete = 'complete';
    $updateSql = 'UPDATE ' . core_table('cmp_compare_run_records') . '
                  SET status = ?, locked_by = ?, completed_at = NOW()
                  WHERE run_record_id = ?';
    $updateStmt = $mysqli->prepare($updateSql);
    $updateStmt->bind_param('ssi', $complete, $username, $runRecordId);
    $updateStmt->execute();

    $runSql = 'UPDATE ' . core_table('cmp_compare_runs') . ' r
               SET completed_records = (
                     SELECT COUNT(*)
                     FROM ' . core_table('cmp_compare_run_records') . ' rr
                     WHERE rr.run_id = r.run_id AND rr.status = ?
                   ),
                   status = CASE
                     WHEN (
                       SELECT COUNT(*)
                       FROM ' . core_table('cmp_compare_run_records') . ' rr2
                       WHERE rr2.run_id = r.run_id AND rr2.status <> ?
                     ) = 0 THEN ?
                     ELSE r.status
                   END,
                   completed_at = CASE
                     WHEN (
                       SELECT COUNT(*)
                       FROM ' . core_table('cmp_compare_run_records') . ' rr3
                       WHERE rr3.run_id = r.run_id AND rr3.status <> ?
                     ) = 0 THEN NOW()
                     ELSE r.completed_at
                   END
               WHERE r.run_id = ?';
    $runStmt = $mysqli->prepare($runSql);
    $runStmt->bind_param('sssss', $complete, $complete, $complete, $complete, $runId);
    $runStmt->execute();

    return $runRecordId;
}

function insert_compare_field_logs(
    mysqli $mysqli,
    array $ctx,
    ?string $runId,
    ?int $runRecordId,
    array $primaryKey,
    string $compareKey,
    array $auditRows,
    string $username
): void {
    if (!$auditRows || !compare_run_tables_ready($mysqli)) {
        return;
    }

    $project = $ctx['project'];
    $projectCode = (string)($project['survey_project_code'] ?? $project['project_code'] ?? '');
    $databaseCode = (string)($project['database_code'] ?? $project['project_id'] ?? '');
    $primaryKeyJson = json_encode($primaryKey, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $tableName = $ctx['table']['table_name'];

    if ($runId !== null) {
        $runSql = 'SELECT 1 FROM ' . core_table('cmp_compare_runs') . ' WHERE run_id = ? LIMIT 1';
        $runStmt = $mysqli->prepare($runSql);
        $runStmt->bind_param('s', $runId);
        $runStmt->execute();
        if (!$runStmt->get_result()->fetch_assoc()) {
            $runId = null;
            $runRecordId = null;
        }
    }

    $sql = 'INSERT INTO ' . core_table('cmp_compare_field_logs') . '
            (run_id, run_record_id, project_code, database_code,
             table_name, compare_key, primary_key_json, column_name, round1_value,
             round2_value, selected_value, selected_source, edited_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    $stmt = $mysqli->prepare($sql);

    foreach ($auditRows as $row) {
        $columnName = (string)($row['column_name'] ?? '');
        $round1Value = (string)($row['round1_value'] ?? '');
        $round2Value = (string)($row['round2_value'] ?? '');
        $selectedValue = (string)($row['selected_value'] ?? '');
        $source = (string)($row['selected_source'] ?? 'custom');
        $stmt->bind_param(
            'sisssssssssss',
            $runId,
            $runRecordId,
            $projectCode,
            $databaseCode,
            $tableName,
            $compareKey,
            $primaryKeyJson,
            $columnName,
            $round1Value,
            $round2Value,
            $selectedValue,
            $source,
            $username
        );
        $stmt->execute();
    }
}
