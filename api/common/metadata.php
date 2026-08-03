<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

function assert_identifier(string $identifier): string
{
    if (!preg_match('/^[A-Za-z0-9_]+$/', $identifier)) {
        json_response(false, 'Invalid identifier', [], ['INVALID_IDENTIFIER'], 422);
    }

    return $identifier;
}

function qi(string $identifier): string
{
    assert_identifier($identifier);
    return '`' . str_replace('`', '``', $identifier) . '`';
}

function qt(string $database, string $table): string
{
    return qi($database) . '.' . qi($table);
}

function core_table(string $table): string
{
    return qt(CMP_CORE_DB, $table);
}

function metadata_table_exists(mysqli $mysqli, string $database, string $tableName): bool
{
    $sql = 'SELECT COUNT(*) AS total
            FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?';
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('ss', $database, $tableName);
    $stmt->execute();

    return (int)$stmt->get_result()->fetch_assoc()['total'] > 0;
}

function metadata_column_exists(mysqli $mysqli, string $database, string $tableName, string $columnName): bool
{
    $sql = 'SELECT COUNT(*) AS total
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?';
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('sss', $database, $tableName, $columnName);
    $stmt->execute();

    return (int)$stmt->get_result()->fetch_assoc()['total'] > 0;
}

function metadata_project_search_config_columns_exist(mysqli $mysqli): bool
{
    foreach ([
        'search_column',
        'search_id1_start',
        'search_id1_length',
        'search_id2_start',
        'search_id2_length',
        'search_id2_mode',
    ] as $columnName) {
        if (!metadata_column_exists($mysqli, CMP_CORE_DB, 'project_databases', $columnName)) {
            return false;
        }
    }

    return true;
}

function admin_config_available(mysqli $mysqli): bool
{
    foreach (['projects', 'project_databases', 'project_tables'] as $tableName) {
        if (!metadata_table_exists($mysqli, CMP_CORE_DB, $tableName)) {
            return false;
        }
    }

    return true;
}

function require_admin_config(mysqli $mysqli): void
{
    if (!admin_config_available($mysqli)) {
        json_response(false, 'Compare admin config tables are not migrated', [], ['ADMIN_CONFIG_REQUIRED'], 500);
    }
}

function fetch_compare_projects_for_user(mysqli $mysqli, string $username): array
{
    require_admin_config($mysqli);
    return fetch_admin_compare_projects($mysqli);
}

function fetch_admin_compare_projects(mysqli $mysqli): array
{
    $hasRoundConfig = metadata_column_exists($mysqli, CMP_CORE_DB, 'project_databases', 'round1_value')
        && metadata_column_exists($mysqli, CMP_CORE_DB, 'project_databases', 'round2_value')
        && metadata_column_exists($mysqli, CMP_CORE_DB, 'project_databases', 'completed_round_value');
    $hasCompareEnabled = metadata_column_exists($mysqli, CMP_CORE_DB, 'project_databases', 'compare_enabled');
    $hasQuestionnaireName = metadata_column_exists($mysqli, CMP_CORE_DB, 'project_databases', 'questionnaire_name');
    $hasSearchScopeConfig = metadata_project_search_config_columns_exist($mysqli);
    $roundSelect = $hasRoundConfig
        ? 'd.round1_value, d.round2_value, d.completed_round_value'
        : "'1' AS round1_value, '2' AS round2_value, '0' AS completed_round_value";
    $questionnaireSelect = $hasQuestionnaireName ? 'd.questionnaire_name' : 'NULL AS questionnaire_name';
    $searchScopeSelect = $hasSearchScopeConfig
        ? 'd.search_column, d.search_id1_start, d.search_id1_length, d.search_id2_start, d.search_id2_length, d.search_id2_mode'
        : "NULL AS search_column, 1 AS search_id1_start, 12 AS search_id1_length, 13 AS search_id2_start, NULL AS search_id2_length, 'exact' AS search_id2_mode";
    $compareEnabledWhere = $hasCompareEnabled ? ' AND d.compare_enabled = 1' : '';

    $sql = 'SELECT d.database_id,
                   d.project_code,
                   d.database_code,
                   d.raw_database,
                   d.compare_database,
                   d.round_field,
                   ' . $roundSelect . ',
                   ' . $questionnaireSelect . ',
                   ' . $searchScopeSelect . ',
                   d.description,
                   d.status AS database_status,
                   d.is_prepared,
                   d.display_order,
                   p.project_name,
                   p.compare_ready,
                   COALESCE(t.table_count, 0) AS table_count
            FROM ' . core_table('project_databases') . ' d
            INNER JOIN ' . core_table('projects') . ' p ON p.project_code = d.project_code
            LEFT JOIN (
                SELECT database_id, COUNT(*) AS table_count
                FROM ' . core_table('project_tables') . '
                WHERE allow_compare = 1
                GROUP BY database_id
            ) t ON t.database_id = d.database_id
            WHERE p.is_visible = 1
              AND p.compare_ready = 1
              AND d.status <> ?
              ' . $compareEnabledWhere . '
            ORDER BY p.display_order, d.display_order, d.database_code';
    $disabled = 'disabled';
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('s', $disabled);
    $stmt->execute();
    $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    return array_map(static function (array $row): array {
        $databaseCode = assert_identifier((string)$row['database_code']);
        $rawDatabase = assert_identifier((string)$row['raw_database']);
        $cmpDatabase = assert_identifier((string)$row['compare_database']);
        $roundField = assert_identifier((string)$row['round_field']);
        $tableCount = (int)($row['table_count'] ?? 0);
        $questionnaireName = trim((string)($row['questionnaire_name'] ?? ''));
        $displayName = $questionnaireName !== '' ? $questionnaireName : ($row['description'] ?: $databaseCode);

        return [
            'source' => 'admin_config',
            'project_id' => $databaseCode,
            'id' => $databaseCode,
            'project_code' => $databaseCode,
            'survey_project_code' => $row['project_code'],
            'database_id' => (int)$row['database_id'],
            'database_code' => $databaseCode,
            'display_name' => $displayName,
            'questionnaire_name' => $questionnaireName,
            'project_name' => $row['project_name'],
            'raw_database' => $rawDatabase,
            'cmp_database' => $cmpDatabase,
            'round_field' => $roundField,
            'round1_value' => (string)($row['round1_value'] ?? '1'),
            'round2_value' => (string)($row['round2_value'] ?? '2'),
            'completed_round_value' => (string)($row['completed_round_value'] ?? '0'),
            'search_column' => $row['search_column'] ?? '',
            'search_id1_start' => (int)($row['search_id1_start'] ?? 1),
            'search_id1_length' => (int)($row['search_id1_length'] ?? 12),
            'search_id2_start' => (int)($row['search_id2_start'] ?? 13),
            'search_id2_length' => isset($row['search_id2_length']) ? (int)$row['search_id2_length'] : null,
            'search_id2_mode' => (string)($row['search_id2_mode'] ?? 'exact'),
            'active' => $tableCount > 0,
            'table_count' => $tableCount,
            'tables' => $tableCount > 0 ? array_fill(0, $tableCount, true) : [],
        ];
    }, $rows);
}

function fetch_project(mysqli $mysqli, string $projectId, bool $activeOnly = true): array
{
    require_admin_config($mysqli);
    $project = fetch_admin_project($mysqli, $projectId, $activeOnly);
    if (!$project) {
        json_response(false, 'Project not found or not allowed', [], ['PROJECT_NOT_FOUND'], 404);
    }

    assert_identifier($project['raw_database']);
    assert_identifier($project['cmp_database']);
    assert_identifier($project['round_field']);

    return $project;
}

function fetch_admin_project(mysqli $mysqli, string $projectId, bool $activeOnly = true): ?array
{
    $hasRoundConfig = metadata_column_exists($mysqli, CMP_CORE_DB, 'project_databases', 'round1_value')
        && metadata_column_exists($mysqli, CMP_CORE_DB, 'project_databases', 'round2_value')
        && metadata_column_exists($mysqli, CMP_CORE_DB, 'project_databases', 'completed_round_value');
    $hasCompareEnabled = metadata_column_exists($mysqli, CMP_CORE_DB, 'project_databases', 'compare_enabled');
    $hasQuestionnaireName = metadata_column_exists($mysqli, CMP_CORE_DB, 'project_databases', 'questionnaire_name');
    $hasSampleIdsSql = metadata_column_exists($mysqli, CMP_CORE_DB, 'project_databases', 'sample_ids_sql');
    $hasSearchScopeConfig = metadata_project_search_config_columns_exist($mysqli);
    $roundSelect = $hasRoundConfig
        ? 'd.round1_value, d.round2_value, d.completed_round_value'
        : "'1' AS round1_value, '2' AS round2_value, '0' AS completed_round_value";
    $questionnaireSelect = $hasQuestionnaireName ? 'd.questionnaire_name' : 'NULL AS questionnaire_name';
    $sampleIdsSqlSelect = $hasSampleIdsSql ? 'd.sample_ids_sql' : 'NULL AS sample_ids_sql';
    $searchScopeSelect = $hasSearchScopeConfig
        ? 'd.search_column, d.search_id1_start, d.search_id1_length, d.search_id2_start, d.search_id2_length, d.search_id2_mode'
        : "NULL AS search_column, 1 AS search_id1_start, 12 AS search_id1_length, 13 AS search_id2_start, NULL AS search_id2_length, 'exact' AS search_id2_mode";
    $where = 'WHERE (d.database_code = ?
                OR d.raw_database = ?
                OR d.compare_database = ?
                OR CAST(d.database_id AS CHAR) = ?
                OR p.project_code = ?)';
    if ($activeOnly) {
        $where .= ' AND p.compare_ready = 1 AND d.status <> ?';
        if ($hasCompareEnabled) {
            $where .= ' AND d.compare_enabled = 1';
        }
    }

    $sql = 'SELECT d.database_id,
                   d.project_code,
                   d.database_code,
                   d.raw_database,
                   d.compare_database,
                   d.round_field,
                   ' . $roundSelect . ',
                   ' . $questionnaireSelect . ',
                   ' . $sampleIdsSqlSelect . ',
                   ' . $searchScopeSelect . ',
                   d.description,
                   d.status AS database_status,
                   d.display_order,
                   p.project_name,
                   p.compare_ready
            FROM ' . core_table('project_databases') . ' d
            INNER JOIN ' . core_table('projects') . ' p ON p.project_code = d.project_code
            ' . $where . '
            ORDER BY
              CASE
                WHEN d.database_code = ? THEN 0
                WHEN d.raw_database = ? THEN 1
                WHEN d.compare_database = ? THEN 2
                WHEN p.project_code = ? THEN 3
                ELSE 4
              END,
              d.display_order,
              d.database_code
            LIMIT 1';

    $disabled = 'disabled';
    $params = [$projectId, $projectId, $projectId, $projectId, $projectId];
    $types = 'sssss';
    if ($activeOnly) {
        $params[] = $disabled;
        $types .= 's';
    }
    array_push($params, $projectId, $projectId, $projectId, $projectId);
    $types .= 'ssss';

    $stmt = $mysqli->prepare($sql);
    bind_params($stmt, $types, $params);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    if (!$row) {
        return null;
    }

    $databaseCode = assert_identifier((string)$row['database_code']);
    $questionnaireName = trim((string)($row['questionnaire_name'] ?? ''));
    $displayName = $questionnaireName !== '' ? $questionnaireName : ($row['description'] ?: $databaseCode);

    return [
        'source' => 'admin_config',
        'project_id' => $databaseCode,
        'project_code' => $databaseCode,
        'survey_project_code' => $row['project_code'],
        'database_id' => (int)$row['database_id'],
        'database_code' => $databaseCode,
        'display_name' => $displayName,
        'questionnaire_name' => $questionnaireName,
        'sample_ids_sql' => (string)($row['sample_ids_sql'] ?? ''),
        'project_name' => $row['project_name'],
        'raw_database' => assert_identifier((string)$row['raw_database']),
        'cmp_database' => assert_identifier((string)$row['compare_database']),
        'round_field' => assert_identifier((string)$row['round_field']),
        'round1_value' => (string)($row['round1_value'] ?? '1'),
        'round2_value' => (string)($row['round2_value'] ?? '2'),
        'completed_round_value' => (string)($row['completed_round_value'] ?? '0'),
        'search_column' => $row['search_column'] ?? '',
        'search_id1_start' => (int)($row['search_id1_start'] ?? 1),
        'search_id1_length' => (int)($row['search_id1_length'] ?? 12),
        'search_id2_start' => (int)($row['search_id2_start'] ?? 13),
        'search_id2_length' => isset($row['search_id2_length']) ? (int)$row['search_id2_length'] : null,
        'search_id2_mode' => (string)($row['search_id2_mode'] ?? 'exact'),
        'active' => true,
    ];
}

function fetch_project_table(mysqli $mysqli, string $projectId, string $tableName): array
{
    assert_identifier($tableName);
    $project = fetch_project($mysqli, $projectId);

    $sql = 'SELECT table_id, database_id, table_name, display_name, primary_keys_json, allow_compare, display_order
            FROM ' . core_table('project_tables') . '
            WHERE database_id = ? AND table_name = ? AND allow_compare = 1';
    $stmt = $mysqli->prepare($sql);
    $databaseId = (int)$project['database_id'];
    $stmt->bind_param('is', $databaseId, $tableName);
    $stmt->execute();
    $table = $stmt->get_result()->fetch_assoc();
    if (!$table) {
        json_response(false, 'Table is not allowed', [], ['TABLE_NOT_ALLOWED'], 403);
    }

    assert_identifier($table['table_name']);
    $table['project_id'] = $project['project_id'];
    $table['allowed'] = (int)$table['allow_compare'];

    return $table;
}

function fetch_project_tables(mysqli $mysqli, string $projectId): array
{
    $project = fetch_project($mysqli, $projectId);
    $sql = 'SELECT table_id,
                   database_id,
                   table_name,
                   display_name,
                   allow_compare AS allowed,
                   display_order AS sort_order
            FROM ' . core_table('project_tables') . '
            WHERE database_id = ?
            ORDER BY display_order, table_name';
    $stmt = $mysqli->prepare($sql);
    $databaseId = (int)$project['database_id'];
    $stmt->bind_param('i', $databaseId);
    $stmt->execute();
    $tables = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    foreach ($tables as &$table) {
        $table['table_name'] = assert_identifier($table['table_name']);
        $table['allowed'] = !empty($table['allowed']) ? 1 : 0;
        if ($table['allowed']) {
            $table['primary_keys'] = fetch_primary_keys($mysqli, $projectId, $table['table_name']);
            $table['excluded_columns'] = fetch_excluded_columns($mysqli, $projectId, $table['table_name']);
        } else {
            $table['primary_keys'] = [];
            $table['excluded_columns'] = [];
        }
    }
    unset($table);

    return $tables;
}

function fetch_primary_keys(mysqli $mysqli, string $projectId, string $tableName): array
{
    $project = fetch_project($mysqli, $projectId);
    $table = fetch_project_table($mysqli, $projectId, $tableName);
    $decoded = json_decode((string)($table['primary_keys_json'] ?? ''), true);
    $keys = is_array($decoded) ? array_values(array_filter(array_map('strval', $decoded))) : [];
    if (!$keys) {
        $keys = fetch_raw_primary_keys($mysqli, $project['raw_database'], $tableName);
    }

    $roundField = strtolower((string)$project['round_field']);
    $keys = array_values(array_filter($keys, static function ($key) use ($roundField) {
        return strtolower((string)$key) !== $roundField;
    }));

    return validate_primary_keys($keys);
}

function fetch_raw_primary_keys(mysqli $mysqli, string $rawDatabase, string $tableName): array
{
    $sql = 'SELECT COLUMN_NAME
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND CONSTRAINT_NAME = ?
            ORDER BY ORDINAL_POSITION';
    $constraint = 'PRIMARY';
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('sss', $rawDatabase, $tableName, $constraint);
    $stmt->execute();
    $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    return array_map(static function ($row) {
        return assert_identifier($row['COLUMN_NAME']);
    }, $rows);
}

function validate_primary_keys(array $keys): array
{
    $keys = array_values(array_unique(array_map('assert_identifier', $keys)));
    if (!$keys) {
        json_response(false, 'Primary key not found in metadata', [], ['PRIMARY_KEY_NOT_FOUND'], 422);
    }

    return $keys;
}

function fetch_excluded_columns(mysqli $mysqli, string $projectId, string $tableName): array
{
    if (!metadata_table_exists($mysqli, CMP_CORE_DB, 'project_table_hidden_columns')) {
        return [];
    }

    $table = fetch_project_table($mysqli, $projectId, $tableName);
    $sql = 'SELECT column_name
            FROM ' . core_table('project_table_hidden_columns') . '
            WHERE table_id = ?';
    $stmt = $mysqli->prepare($sql);
    $tableId = (int)$table['table_id'];
    $stmt->bind_param('i', $tableId);
    $stmt->execute();
    $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    return array_map(static function ($row) {
        return assert_identifier($row['column_name']);
    }, $rows);
}

function fetch_compare_columns(mysqli $mysqli, array $project, string $tableName, array $primaryKeys, array $excludedColumns): array
{
    $rawDatabase = $project['raw_database'];
    $sql = 'SELECT COLUMN_NAME, DATA_TYPE
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
            ORDER BY ORDINAL_POSITION';
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('ss', $rawDatabase, $tableName);
    $stmt->execute();
    $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $skip = array_flip(array_merge($primaryKeys, $excludedColumns, [$project['round_field']]));

    return array_values(array_filter(array_map(static function ($row) use ($skip) {
        $name = assert_identifier($row['COLUMN_NAME']);
        if (isset($skip[$name])) {
            return null;
        }

        return ['name' => $name, 'type' => $row['DATA_TYPE'], 'label' => $name];
    }, $rows)));
}

function metadata_context(mysqli $mysqli, string $projectId, string $tableName): array
{
    $project = fetch_project($mysqli, $projectId);
    $table = fetch_project_table($mysqli, $projectId, $tableName);
    $primaryKeys = fetch_primary_keys($mysqli, $projectId, $tableName);
    $excludedColumns = fetch_excluded_columns($mysqli, $projectId, $tableName);
    $columns = fetch_compare_columns($mysqli, $project, $tableName, $primaryKeys, $excludedColumns);

    return [
        'project' => $project,
        'table' => $table,
        'primaryKeys' => $primaryKeys,
        'excludedColumns' => $excludedColumns,
        'columns' => $columns,
    ];
}

function key_expression(string $alias, array $primaryKeys): string
{
    $parts = array_map(static function ($key) use ($alias) {
        return "COALESCE(CAST({$alias}." . qi($key) . " AS CHAR), '')";
    }, $primaryKeys);
    return 'CONCAT(' . implode(', ', $parts) . ')';
}

function key_join_condition(string $leftAlias, string $rightAlias, array $primaryKeys): string
{
    $conditions = array_map(static function ($key) use ($leftAlias, $rightAlias) {
        return "{$leftAlias}." . qi($key) . " <=> {$rightAlias}." . qi($key);
    }, $primaryKeys);

    return implode(' AND ', $conditions);
}

function project_search_config(array $project): array
{
    $searchColumn = trim((string)($project['search_column'] ?? ''));
    if ($searchColumn !== '') {
        $searchColumn = assert_identifier($searchColumn);
    }

    $searchId1Start = max(1, (int)($project['search_id1_start'] ?? 1));
    $searchId1Length = max(1, (int)($project['search_id1_length'] ?? 12));
    $searchId2Start = max(1, (int)($project['search_id2_start'] ?? ($searchId1Start + $searchId1Length)));
    $searchId2Length = isset($project['search_id2_length']) && (int)$project['search_id2_length'] > 0
        ? (int)$project['search_id2_length']
        : null;
    $searchId2Mode = strtolower(trim((string)($project['search_id2_mode'] ?? 'exact')));
    if (!in_array($searchId2Mode, ['exact', 'prefix'], true)) {
        $searchId2Mode = 'exact';
    }

    $searchId1End = $searchId1Start + $searchId1Length - 1;
    if ($searchId2Start <= $searchId1End) {
        json_response(false, 'Invalid search id split config', [], ['SEARCH_ID_SEGMENTS_OVERLAP'], 422);
    }

    return [
        'search_column' => $searchColumn,
        'search_id1_start' => $searchId1Start,
        'search_id1_length' => $searchId1Length,
        'search_id1_end' => $searchId1End,
        'search_id2_start' => $searchId2Start,
        'search_id2_length' => $searchId2Length,
        'search_id2_mode' => $searchId2Mode,
    ];
}

function split_search_id(array $project, string $searchId): array
{
    $config = project_search_config($project);
    $searchId = trim($searchId);
    $searchId1 = substr($searchId, $config['search_id1_start'] - 1, $config['search_id1_length']);
    $searchId2 = $config['search_id2_length'] === null
        ? substr($searchId, $config['search_id2_start'] - 1)
        : substr($searchId, $config['search_id2_start'] - 1, $config['search_id2_length']);

    return [
        'search_id1' => $searchId1,
        'search_id2' => $searchId2,
    ];
}

function resolve_search_scope(array $project, array $source): array
{
    $config = project_search_config($project);
    $searchId1 = trim((string)($source['search_id1'] ?? ($source['searchId1'] ?? '')));
    $searchId2 = trim((string)($source['search_id2'] ?? ($source['searchId2'] ?? '')));
    $searchId = trim((string)($source['search_id'] ?? ($source['searchId'] ?? '')));

    if ($searchId1 === '' && $searchId !== '') {
        $parts = split_search_id($project, $searchId);
        $searchId1 = $parts['search_id1'];
        $searchId2 = $parts['search_id2'];
    }

    if ($searchId1 === '') {
        json_response(false, 'Validation error', [], ['Missing search_id1'], 422);
    }

    $combinedSearchId = $searchId1 . $searchId2;
    if ($searchId2 === '') {
        $searchMode = 'prefix';
    } else {
        $searchMode = $config['search_id2_mode'];
    }

    return [
        'search_id1' => $searchId1,
        'search_id2' => $searchId2,
        'search_id' => $combinedSearchId,
        'search_mode' => $searchMode,
        'config' => $config,
    ];
}

function bind_search(mysqli_stmt $stmt, string $roundValue, string $searchMode, string $searchId): void
{
    $needle = $searchMode === 'exact' ? $searchId : $searchId . '%';
    $stmt->bind_param('ss', $roundValue, $needle);
}

function bind_params(mysqli_stmt $stmt, string $types, array &$params): void
{
    $refs = [];
    foreach ($params as $key => &$value) {
        $refs[$key] = &$value;
    }

    array_unshift($refs, $types);
    call_user_func_array([$stmt, 'bind_param'], $refs);
}
