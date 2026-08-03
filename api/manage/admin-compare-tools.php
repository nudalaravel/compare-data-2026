<?php
declare(strict_types=1);

require_once __DIR__ . '/admin-common.php';
require_once __DIR__ . '/../common/compare.php';

function admin_tools_search_mode($value): string
{
    $mode = strtolower(trim((string)($value ?? 'exact')));
    if (!in_array($mode, ['exact', 'prefix'], true)) {
        json_response(false, 'Validation error', [], ['INVALID_SEARCH_MODE'], 422);
    }

    return $mode;
}

function admin_tools_search_id($value): string
{
    $searchId = trim((string)$value);
    if ($searchId === '') {
        json_response(false, 'Validation error', [], ['SEARCH_ID_REQUIRED'], 422);
    }

    return $searchId;
}

function admin_tools_optional_search_id($value): string
{
    return trim((string)$value);
}

function admin_tools_limit($value, int $default = 500, int $max = 5000): int
{
    $limit = (int)($value ?? $default);
    if ($limit <= 0) {
        $limit = $default;
    }

    return min($limit, $max);
}

function admin_tools_table_payload(array $row): array
{
    $primaryKeys = [];
    $decoded = json_decode((string)($row['primary_keys_json'] ?? ''), true);
    if (is_array($decoded)) {
        $primaryKeys = array_values(array_filter(array_map('strval', $decoded)));
    }

    return [
        'table_id' => (int)($row['table_id'] ?? 0),
        'database_id' => (int)($row['database_id'] ?? 0),
        'table_name' => $row['table_name'],
        'display_name' => $row['display_name'] ?: $row['table_name'],
        'primary_keys' => $primaryKeys,
        'primary_keys_text' => implode(', ', $primaryKeys),
        'allow_compare' => !empty($row['allow_compare']),
        'display_order' => (int)($row['display_order'] ?? 0),
    ];
}

function admin_tools_options(mysqli $mysqli): array
{
    $projectSql = 'SELECT p.project_code,
                          p.project_name,
                          p.status,
                          p.keyin_active,
                          p.compare_ready,
                          p.is_visible,
                          p.display_order,
                          COALESCE(d.database_count, 0) AS database_count
                   FROM ' . admin_config_table('projects') . ' p
                   LEFT JOIN (
                     SELECT project_code, COUNT(*) AS database_count
                     FROM ' . admin_config_table('project_databases') . '
                     GROUP BY project_code
                   ) d ON d.project_code = p.project_code
                   ORDER BY p.display_order, p.project_code';
    $projects = array_map(static function (array $row): array {
        return [
            'project_code' => $row['project_code'],
            'project_name' => $row['project_name'],
            'status' => $row['status'],
            'keyin_active' => !empty($row['keyin_active']),
            'compare_ready' => !empty($row['compare_ready']),
            'is_visible' => !empty($row['is_visible']),
            'database_count' => (int)($row['database_count'] ?? 0),
        ];
    }, admin_fetch_all($mysqli, $projectSql));

    $databaseSql = 'SELECT d.*,
                           p.project_name,
                           COALESCE(t.table_count, 0) AS table_count
                    FROM ' . admin_config_table('project_databases') . ' d
                    INNER JOIN ' . admin_config_table('projects') . ' p ON p.project_code = d.project_code
                    LEFT JOIN (
                      SELECT database_id, COUNT(*) AS table_count
                      FROM ' . admin_config_table('project_tables') . '
                      WHERE allow_compare = 1
                      GROUP BY database_id
                    ) t ON t.database_id = d.database_id
                    ORDER BY p.display_order, d.display_order, d.database_code';
    $databases = array_map('admin_database_payload', admin_fetch_all($mysqli, $databaseSql));

    return [
        'projects' => $projects,
        'databases' => $databases,
    ];
}

function admin_tools_tables(mysqli $mysqli, int $databaseId): array
{
    $database = admin_fetch_database($mysqli, $databaseId);
    $sql = 'SELECT *
            FROM ' . admin_config_table('project_tables') . '
            WHERE database_id = ? AND allow_compare = 1
            ORDER BY display_order, table_name';
    $params = [$databaseId];
    $tables = array_map('admin_tools_table_payload', admin_fetch_all($mysqli, $sql, 'i', $params));

    return [
        'database' => admin_database_payload($database),
        'tables' => $tables,
    ];
}

function admin_tools_project_from_database(array $database): array
{
    return [
        'source' => 'admin_config',
        'project_id' => $database['database_code'],
        'project_code' => $database['database_code'],
        'survey_project_code' => $database['project_code'],
        'database_id' => (int)$database['database_id'],
        'database_code' => $database['database_code'],
        'project_name' => $database['project_name'] ?? $database['project_code'],
        'questionnaire_name' => $database['questionnaire_name'] ?? '',
        'table_preface' => $database['table_preface'] ?? '',
        'tablePreface' => $database['table_preface'] ?? '',
        'raw_database' => assert_identifier($database['raw_database']),
        'cmp_database' => assert_identifier($database['compare_database']),
        'round_field' => assert_identifier($database['round_field']),
        'round1_value' => (string)($database['round1_value'] ?? '1'),
        'round2_value' => (string)($database['round2_value'] ?? '2'),
        'completed_round_value' => (string)($database['completed_round_value'] ?? '0'),
        'search_column' => $database['search_column'] ?? '',
        'search_id1_start' => (int)($database['search_id1_start'] ?? 1),
        'search_id1_length' => (int)($database['search_id1_length'] ?? 12),
        'search_id2_start' => (int)($database['search_id2_start'] ?? 13),
        'search_id2_length' => isset($database['search_id2_length']) ? (int)$database['search_id2_length'] : null,
        'search_id2_mode' => (string)($database['search_id2_mode'] ?? 'exact'),
    ];
}

function admin_tools_context(mysqli $mysqli, int $databaseId, string $tableName): array
{
    $database = admin_fetch_database($mysqli, $databaseId);
    $tableName = assert_identifier($tableName);
    $sql = 'SELECT *
            FROM ' . admin_config_table('project_tables') . '
            WHERE database_id = ? AND table_name = ? AND allow_compare = 1
            LIMIT 1';
    $params = [$databaseId, $tableName];
    $table = admin_fetch_one($mysqli, $sql, 'is', $params);
    if (!$table) {
        json_response(false, 'Table is not allowed for compare', [], ['TABLE_NOT_ALLOWED'], 403);
    }

    $decoded = json_decode((string)($table['primary_keys_json'] ?? ''), true);
    $primaryKeys = is_array($decoded) ? array_values(array_filter(array_map('strval', $decoded))) : [];
    if (!$primaryKeys) {
        $primaryKeys = fetch_raw_primary_keys($mysqli, $database['raw_database'], $tableName);
    }

    $roundField = strtolower((string)($database['round_field'] ?? 'round'));
    $primaryKeys = array_values(array_filter($primaryKeys, static function ($key) use ($roundField) {
        return strtolower((string)$key) !== $roundField;
    }));
    $primaryKeys = validate_primary_keys($primaryKeys);

    return [
        'database' => $database,
        'project' => admin_tools_project_from_database($database),
        'table' => $table,
        'primaryKeys' => $primaryKeys,
    ];
}

function admin_tools_scope_parts(mysqli $mysqli, array $ctx, string $mode, string $searchId, string $alias): array
{
    $operator = $mode === 'exact' ? '=' : 'LIKE';
    $needle = $mode === 'exact' ? $searchId : $searchId . '%';
    $searchExpr = admin_tools_search_expression($mysqli, $ctx, $alias);

    return [$operator, $needle, $searchExpr];
}

function admin_tools_search_expression(mysqli $mysqli, array $ctx, string $alias): string
{
    $project = $ctx['project'];
    $tableName = (string)$ctx['table']['table_name'];
    $config = project_search_config($project);
    $searchColumn = (string)($config['search_column'] ?? '');
    if ($searchColumn !== '' && metadata_column_exists($mysqli, $project['raw_database'], $tableName, $searchColumn)) {
        return "COALESCE(CAST({$alias}." . qi($searchColumn) . " AS CHAR), '')";
    }

    return key_expression($alias, $ctx['primaryKeys']);
}

function admin_tools_recompare_counts(mysqli $mysqli, array $ctx, string $mode, string $searchId): array
{
    $project = $ctx['project'];
    $tableName = (string)$ctx['table']['table_name'];
    $hasSearch = $searchId !== '';
    $operator = '=';
    $needle = '';
    $searchExpr = '';
    $whereSql = '';
    if ($hasSearch) {
        [$operator, $needle, $searchExpr] = admin_tools_scope_parts($mysqli, $ctx, $mode, $searchId, 'c');
        $whereSql = "WHERE {$searchExpr} {$operator} ?";
    }
    $cmpExists = table_exists($mysqli, $project['cmp_database'], $tableName);
    $chkExists = table_exists($mysqli, $project['cmp_database'], 'chk_user');
    $completedRound = compare_round_value($project, 'completed_round_value', '0');

    $cmpTotal = 0;
    $cmpCompleted = 0;
    $cmpPending = 0;
    if ($cmpExists) {
        $cmpTable = qt($project['cmp_database'], $tableName);
        $roundField = qi($project['round_field']);
        $sql = "SELECT COUNT(*) AS total,
                       SUM(CASE WHEN c.{$roundField} = ? THEN 1 ELSE 0 END) AS completed,
                       SUM(CASE WHEN c.{$roundField} <> ? THEN 1 ELSE 0 END) AS pending
                FROM {$cmpTable} c
                {$whereSql}";
        $stmt = $mysqli->prepare($sql);
        $params = [$completedRound, $completedRound];
        $types = 'ss';
        if ($hasSearch) {
            $params[] = $needle;
            $types .= 's';
        }
        bind_params($stmt, $types, $params);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc() ?: [];
        $cmpTotal = (int)($row['total'] ?? 0);
        $cmpCompleted = (int)($row['completed'] ?? 0);
        $cmpPending = (int)($row['pending'] ?? 0);
    }

    $chkTotal = 0;
    if ($chkExists) {
        $chkTable = qt($project['cmp_database'], 'chk_user');
        $chkWhere = $hasSearch ? "WHERE tab = ? AND hhid {$operator} ?" : 'WHERE tab = ?';
        $sql = "SELECT COUNT(*) AS total
                FROM {$chkTable}
                {$chkWhere}";
        $stmt = $mysqli->prepare($sql);
        if ($hasSearch) {
            $stmt->bind_param('ss', $tableName, $needle);
        } else {
            $stmt->bind_param('s', $tableName);
        }
        $stmt->execute();
        $chkTotal = (int)($stmt->get_result()->fetch_assoc()['total'] ?? 0);
    }

    return [
        'cmp_table_exists' => $cmpExists,
        'chk_user_exists' => $chkExists,
        'cmp_rows' => $cmpTotal,
        'cmp_completed_rows' => $cmpCompleted,
        'cmp_pending_rows' => $cmpPending,
        'chk_user_rows' => $chkTotal,
        'search_mode' => $mode,
        'search_id' => $searchId,
        'target_table' => $project['cmp_database'] . '.' . $tableName,
        'chk_user_table' => $project['cmp_database'] . '.chk_user',
    ];
}

function admin_tools_limited_ids(array &$ids, string $id, int $limit): void
{
    $id = trim($id);
    if ($id === '' || isset($ids[$id]) || count($ids) >= $limit) {
        return;
    }

    $ids[$id] = true;
}

function admin_tools_recompare_group_counts(mysqli $mysqli, array $ctx, string $mode, string $searchId, int $limit): array
{
    $project = $ctx['project'];
    $tableName = (string)$ctx['table']['table_name'];
    $hasSearch = $searchId !== '';
    $completedRound = compare_round_value($project, 'completed_round_value', '0');
    $groups = [];

    if (table_exists($mysqli, $project['cmp_database'], $tableName)) {
        [$operator, $needle, $searchExpr] = $hasSearch
            ? admin_tools_scope_parts($mysqli, $ctx, $mode, $searchId, 'c')
            : ['=', '', admin_tools_search_expression($mysqli, $ctx, 'c')];
        $cmpTable = qt($project['cmp_database'], $tableName);
        $roundField = qi($project['round_field']);
        $whereSql = $hasSearch ? "AND {$searchExpr} {$operator} ?" : '';
        $sql = "SELECT {$searchExpr} AS id,
                       COUNT(*) AS cmp_rows,
                       SUM(CASE WHEN c.{$roundField} = ? THEN 1 ELSE 0 END) AS cmp_completed_rows,
                       SUM(CASE WHEN c.{$roundField} <> ? THEN 1 ELSE 0 END) AS cmp_pending_rows
                FROM {$cmpTable} c
                WHERE {$searchExpr} <> ''
                  {$whereSql}
                GROUP BY id
                ORDER BY id
                LIMIT ?";
        $stmt = $mysqli->prepare($sql);
        $params = [$completedRound, $completedRound];
        $types = 'ss';
        if ($hasSearch) {
            $params[] = $needle;
            $types .= 's';
        }
        $params[] = $limit;
        $types .= 'i';
        bind_params($stmt, $types, $params);
        $stmt->execute();

        foreach ($stmt->get_result()->fetch_all(MYSQLI_ASSOC) as $row) {
            $id = trim((string)($row['id'] ?? ''));
            if ($id === '') {
                continue;
            }
            $groups[$id] = [
                'cmp_rows' => (int)($row['cmp_rows'] ?? 0),
                'cmp_completed_rows' => (int)($row['cmp_completed_rows'] ?? 0),
                'cmp_pending_rows' => (int)($row['cmp_pending_rows'] ?? 0),
                'chk_user_rows' => 0,
            ];
        }
    }

    if (table_exists($mysqli, $project['cmp_database'], 'chk_user')) {
        $operator = $mode === 'exact' ? '=' : 'LIKE';
        $needle = $mode === 'exact' ? $searchId : $searchId . '%';
        $chkTable = qt($project['cmp_database'], 'chk_user');
        $whereSql = $hasSearch ? "AND hhid {$operator} ?" : '';
        $sql = "SELECT hhid AS id,
                       COUNT(*) AS chk_user_rows
                FROM {$chkTable}
                WHERE tab = ?
                  AND hhid <> ''
                  {$whereSql}
                GROUP BY hhid
                ORDER BY MAX(`date`) DESC, MAX(`time`) DESC, hhid
                LIMIT ?";
        $stmt = $mysqli->prepare($sql);
        if ($hasSearch) {
            $stmt->bind_param('ssi', $tableName, $needle, $limit);
        } else {
            $stmt->bind_param('si', $tableName, $limit);
        }
        $stmt->execute();

        foreach ($stmt->get_result()->fetch_all(MYSQLI_ASSOC) as $row) {
            $id = trim((string)($row['id'] ?? ''));
            if ($id === '') {
                continue;
            }
            if (!isset($groups[$id])) {
                $groups[$id] = [
                    'cmp_rows' => 0,
                    'cmp_completed_rows' => 0,
                    'cmp_pending_rows' => 0,
                    'chk_user_rows' => 0,
                ];
            }
            $groups[$id]['chk_user_rows'] = (int)($row['chk_user_rows'] ?? 0);
        }
    }

    return $groups;
}

function admin_tools_primary_keys_for_table(mysqli $mysqli, array $database, string $tableName): array
{
    $keys = [];
    $sql = 'SELECT primary_keys_json
            FROM ' . admin_config_table('project_tables') . '
            WHERE database_id = ? AND table_name = ?
            LIMIT 1';
    $databaseId = (int)$database['database_id'];
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('is', $databaseId, $tableName);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    if ($row) {
        $decoded = json_decode((string)($row['primary_keys_json'] ?? ''), true);
        $keys = is_array($decoded) ? array_values(array_filter(array_map('strval', $decoded))) : [];
    }

    if (!$keys) {
        $keys = fetch_raw_primary_keys($mysqli, (string)$database['raw_database'], $tableName);
    }

    $roundField = strtolower((string)($database['round_field'] ?? 'round'));
    $keys = array_values(array_filter($keys, static function ($key) use ($roundField) {
        return strtolower((string)$key) !== $roundField;
    }));

    return validate_primary_keys($keys);
}

function admin_tools_preface_table(array $database, array $tables): string
{
    $configured = trim((string)($database['table_preface'] ?? ''));
    if ($configured !== '') {
        return assert_identifier($configured);
    }

    foreach ($tables as $table) {
        $tableName = (string)($table['table_name'] ?? '');
        if (strpos($tableName, 'preface_') === 0) {
            return assert_identifier($tableName);
        }
    }

    return '';
}

function admin_tools_operator_values(mysqli $mysqli, array $database, array $tables, array $ids): array
{
    $ids = array_values(array_filter(array_unique(array_map('strval', $ids)), static function ($id) {
        return trim($id) !== '';
    }));
    if (!$ids) {
        return [];
    }

    $tableName = admin_tools_preface_table($database, $tables);
    if ($tableName === ''
        || !metadata_table_exists($mysqli, (string)$database['raw_database'], $tableName)
        || !metadata_column_exists($mysqli, (string)$database['raw_database'], $tableName, 'recp')) {
        return [];
    }

    $project = admin_tools_project_from_database($database);
    $primaryKeys = admin_tools_primary_keys_for_table($mysqli, $database, $tableName);
    $ctx = [
        'project' => $project,
        'table' => ['table_name' => $tableName],
        'primaryKeys' => $primaryKeys,
    ];
    $searchExpr = admin_tools_search_expression($mysqli, $ctx, 'r');
    [$inSql, $idTypes, $idParams] = admin_tools_in_clause($ids);
    $round1 = compare_round_value($project, 'round1_value', '1');
    $round2 = compare_round_value($project, 'round2_value', '2');
    $params = array_merge([$round1, $round2, $round1, $round2], $idParams);
    $types = 'ssss' . $idTypes;
    $sql = 'SELECT CAST(' . $searchExpr . ' AS CHAR) AS id,
                   MAX(CASE WHEN r.' . qi($project['round_field']) . ' = ? THEN CAST(r.' . qi('recp') . ' AS CHAR) ELSE \'\' END) AS user_r1,
                   MAX(CASE WHEN r.' . qi($project['round_field']) . ' = ? THEN CAST(r.' . qi('recp') . ' AS CHAR) ELSE \'\' END) AS user_r2
            FROM ' . qt($project['raw_database'], $tableName) . ' r
            WHERE r.' . qi($project['round_field']) . ' IN (?, ?)
              AND ' . $searchExpr . ' IN (' . $inSql . ')
            GROUP BY id';
    $stmt = $mysqli->prepare($sql);
    bind_params($stmt, $types, $params);
    $stmt->execute();

    $values = [];
    foreach ($stmt->get_result()->fetch_all(MYSQLI_ASSOC) as $row) {
        $id = trim((string)($row['id'] ?? ''));
        if ($id === '') {
            continue;
        }
        $values[$id] = [
            'user_r1' => (string)($row['user_r1'] ?? ''),
            'user_r2' => (string)($row['user_r2'] ?? ''),
        ];
    }

    return $values;
}

function admin_tools_in_clause(array $values): array
{
    $params = array_values(array_map('strval', $values));
    return [
        implode(', ', array_fill(0, count($params), '?')),
        str_repeat('s', count($params)),
        $params,
    ];
}

function admin_tools_recompare_preview(mysqli $mysqli): array
{
    $databaseId = admin_required_id($_GET['database_id'] ?? 0, 'database_id');
    $tableName = admin_identifier_from_body($_GET, 'table_name');
    $mode = admin_tools_search_mode($_GET['search_mode'] ?? 'exact');
    $searchId = admin_tools_search_id($_GET['search_id'] ?? '');
    $ctx = admin_tools_context($mysqli, $databaseId, $tableName);

    return [
        'database' => admin_database_payload($ctx['database']),
        'table' => admin_tools_table_payload($ctx['table']),
        'primary_keys' => $ctx['primaryKeys'],
        'preview' => admin_tools_recompare_counts($mysqli, $ctx, $mode, $searchId),
    ];
}

function admin_tools_recompare_preview_all(mysqli $mysqli): array
{
    $databaseId = admin_required_id($_GET['database_id'] ?? 0, 'database_id');
    $mode = admin_tools_search_mode($_GET['search_mode'] ?? 'exact');
    $searchId = admin_tools_optional_search_id($_GET['search_id'] ?? '');
    $limit = admin_tools_limit($_GET['limit'] ?? 100, 100, 500);
    $tablesData = admin_tools_tables($mysqli, $databaseId);
    $database = admin_fetch_database($mysqli, $databaseId);
    $rows = [];
    $matrixIds = [];
    $matrixRows = [];
    $totals = [
        'tables' => 0,
        'ids' => 0,
        'tables_with_cmp_rows' => 0,
        'tables_with_chk_user_rows' => 0,
        'cmp_rows' => 0,
        'cmp_completed_rows' => 0,
        'cmp_pending_rows' => 0,
        'chk_user_rows' => 0,
    ];

    foreach ($tablesData['tables'] as $table) {
        $ctx = admin_tools_context($mysqli, $databaseId, (string)$table['table_name']);
        $counts = admin_tools_recompare_counts($mysqli, $ctx, $mode, $searchId);
        $groupCounts = admin_tools_recompare_group_counts($mysqli, $ctx, $mode, $searchId, $limit);
        $row = array_merge($table, $counts);
        $row['has_compare_data'] = ((int)$counts['cmp_rows'] > 0 || (int)$counts['chk_user_rows'] > 0);
        $rows[] = $row;

        $totals['tables']++;
        $totals['cmp_rows'] += (int)$counts['cmp_rows'];
        $totals['cmp_completed_rows'] += (int)$counts['cmp_completed_rows'];
        $totals['cmp_pending_rows'] += (int)$counts['cmp_pending_rows'];
        $totals['chk_user_rows'] += (int)$counts['chk_user_rows'];
        if ((int)$counts['cmp_rows'] > 0) {
            $totals['tables_with_cmp_rows']++;
        }
        if ((int)$counts['chk_user_rows'] > 0) {
            $totals['tables_with_chk_user_rows']++;
        }

        foreach ($groupCounts as $id => $group) {
            admin_tools_limited_ids($matrixIds, (string)$id, $limit);
            if (!isset($matrixIds[$id])) {
                continue;
            }
            if (!isset($matrixRows[$id])) {
                $matrixRows[$id] = [
                    'id' => (string)$id,
                    'user_r1' => '',
                    'user_r2' => '',
                    'cells' => [],
                ];
            }

            $cell = array_merge($table, $group);
            $cell['cmp_table_exists'] = !empty($counts['cmp_table_exists']);
            $cell['chk_user_exists'] = !empty($counts['chk_user_exists']);
            $cell['search_id'] = (string)$id;
            $cell['target_table'] = $ctx['project']['cmp_database'] . '.' . (string)$table['table_name'];
            $cell['has_compare_data'] = ((int)$group['cmp_rows'] > 0 || (int)$group['chk_user_rows'] > 0);
            $matrixRows[$id]['cells'][(string)$table['table_name']] = $cell;
        }
    }

    $operators = admin_tools_operator_values($mysqli, $database, $tablesData['tables'], array_keys($matrixRows));
    foreach ($matrixRows as $id => &$matrixRow) {
        $matrixRow['user_r1'] = (string)($operators[$id]['user_r1'] ?? '');
        $matrixRow['user_r2'] = (string)($operators[$id]['user_r2'] ?? '');
    }
    unset($matrixRow);

    $totals['ids'] = count($matrixRows);

    return [
        'database' => $tablesData['database'],
        'search_mode' => $mode,
        'search_id' => $searchId,
        'columns' => $tablesData['tables'],
        'matrix_rows' => array_values($matrixRows),
        'rows' => $rows,
        'totals' => $totals,
    ];
}

function admin_tools_recompare_delete(mysqli $mysqli, array $admin, array $body): array
{
    $confirm = !empty($body['confirm']);
    if (!$confirm) {
        json_response(false, 'Confirmation required', [], ['CONFIRM_REQUIRED'], 422);
    }

    $databaseId = admin_required_id($body['database_id'] ?? 0, 'database_id');
    $tableName = admin_identifier_from_body($body, 'table_name');
    $mode = admin_tools_search_mode($body['search_mode'] ?? 'exact');
    $searchId = admin_tools_search_id($body['search_id'] ?? '');
    $ctx = admin_tools_context($mysqli, $databaseId, $tableName);
    $project = $ctx['project'];
    $before = admin_tools_recompare_counts($mysqli, $ctx, $mode, $searchId);
    [$operator, $needle, $searchExpr] = admin_tools_scope_parts($mysqli, $ctx, $mode, $searchId, 'c');

    $deletedCmpRows = 0;
    $deletedChkRows = 0;

    $mysqli->begin_transaction();
    try {
        if (table_exists($mysqli, $project['cmp_database'], $tableName)) {
            $cmpTable = qt($project['cmp_database'], $tableName);
            $deleteSql = "DELETE c
                          FROM {$cmpTable} c
                          WHERE {$searchExpr} {$operator} ?";
            $deleteStmt = $mysqli->prepare($deleteSql);
            $deleteStmt->bind_param('s', $needle);
            $deleteStmt->execute();
            $deletedCmpRows = $deleteStmt->affected_rows;
        }

        if (table_exists($mysqli, $project['cmp_database'], 'chk_user')) {
            $chkTable = qt($project['cmp_database'], 'chk_user');
            $deleteChkSql = "DELETE FROM {$chkTable}
                             WHERE tab = ? AND hhid {$operator} ?";
            $deleteChkStmt = $mysqli->prepare($deleteChkSql);
            $deleteChkStmt->bind_param('ss', $tableName, $needle);
            $deleteChkStmt->execute();
            $deletedChkRows = $deleteChkStmt->affected_rows;
        }

        $after = [
            'deleted_cmp_rows' => $deletedCmpRows,
            'deleted_chk_user_rows' => $deletedChkRows,
            'database_id' => $databaseId,
            'database_code' => $project['database_code'],
            'cmp_database' => $project['cmp_database'],
            'table_name' => $tableName,
            'search_mode' => $mode,
            'search_id' => $searchId,
        ];
        admin_audit_log(
            $mysqli,
            'recompare',
            $project['database_code'] . ':' . $tableName . ':' . $searchId,
            'delete_cmp_scope',
            $before,
            $after,
            $admin['username']
        );

        $mysqli->commit();

        return [
            'database' => admin_database_payload($ctx['database']),
            'table' => admin_tools_table_payload($ctx['table']),
            'before' => $before,
            'result' => $after,
        ];
    } catch (Throwable $exception) {
        $mysqli->rollback();
        throw $exception;
    }
}

function admin_tools_recompare_delete_all(mysqli $mysqli, array $admin, array $body): array
{
    $confirm = !empty($body['confirm']);
    if (!$confirm) {
        json_response(false, 'Confirmation required', [], ['CONFIRM_REQUIRED'], 422);
    }

    $databaseId = admin_required_id($body['database_id'] ?? 0, 'database_id');
    $mode = admin_tools_search_mode($body['search_mode'] ?? 'exact');
    $searchId = admin_tools_search_id($body['search_id'] ?? '');
    $tablesData = admin_tools_tables($mysqli, $databaseId);
    $results = [];
    $deletedCmpRows = 0;
    $deletedChkRows = 0;

    foreach ($tablesData['tables'] as $table) {
        $tableName = (string)$table['table_name'];
        $result = admin_tools_recompare_delete($mysqli, $admin, [
            'confirm' => true,
            'database_id' => $databaseId,
            'table_name' => $tableName,
            'search_mode' => $mode,
            'search_id' => $searchId,
        ]);
        $tableResult = $result['result'] ?? [];
        $deletedCmpRows += (int)($tableResult['deleted_cmp_rows'] ?? 0);
        $deletedChkRows += (int)($tableResult['deleted_chk_user_rows'] ?? 0);
        $results[] = [
            'table_name' => $tableName,
            'display_name' => $table['display_name'] ?: $tableName,
            'deleted_cmp_rows' => (int)($tableResult['deleted_cmp_rows'] ?? 0),
            'deleted_chk_user_rows' => (int)($tableResult['deleted_chk_user_rows'] ?? 0),
        ];
    }

    return [
        'database' => $tablesData['database'],
        'search_mode' => $mode,
        'search_id' => $searchId,
        'deleted_cmp_rows' => $deletedCmpRows,
        'deleted_chk_user_rows' => $deletedChkRows,
        'tables' => $results,
    ];
}

function admin_tools_chk_user_filters(array $source): array
{
    $filters = [
        'database_id' => admin_required_id($source['database_id'] ?? 0, 'database_id'),
        'table_name' => trim((string)($source['table_name'] ?? '')),
        'search_id' => trim((string)($source['search_id'] ?? '')),
        'date_from' => admin_date_value($source['date_from'] ?? ''),
        'date_to' => admin_date_value($source['date_to'] ?? ''),
        'limit' => admin_tools_limit($source['limit'] ?? 500),
    ];
    if ($filters['table_name'] !== '') {
        $filters['table_name'] = assert_identifier($filters['table_name']);
    }

    return $filters;
}

function admin_tools_chk_user_rows(mysqli $mysqli, array $filters, bool $forExport = false): array
{
    $database = admin_fetch_database($mysqli, (int)$filters['database_id']);
    $cmpDatabase = assert_identifier($database['compare_database']);
    if (!table_exists($mysqli, $cmpDatabase, 'chk_user')) {
        return [
            'database' => admin_database_payload($database),
            'rows' => [],
            'total' => 0,
            'chk_user_exists' => false,
        ];
    }

    $where = [];
    $types = '';
    $params = [];
    if ($filters['table_name'] !== '') {
        $where[] = 'tab = ?';
        $types .= 's';
        $params[] = $filters['table_name'];
    }
    if ($filters['search_id'] !== '') {
        $where[] = 'hhid LIKE ?';
        $types .= 's';
        $params[] = $filters['search_id'] . '%';
    }
    if ($filters['date_from'] !== null) {
        $where[] = '`date` >= ?';
        $types .= 's';
        $params[] = $filters['date_from'];
    }
    if ($filters['date_to'] !== null) {
        $where[] = '`date` <= ?';
        $types .= 's';
        $params[] = $filters['date_to'];
    }

    $whereSql = $where ? 'WHERE ' . implode(' AND ', $where) : '';
    $chkTable = qt($cmpDatabase, 'chk_user');

    $countSql = "SELECT COUNT(*) AS total FROM {$chkTable} {$whereSql}";
    $countStmt = $mysqli->prepare($countSql);
    if ($types !== '') {
        bind_params($countStmt, $types, $params);
    }
    $countStmt->execute();
    $total = (int)($countStmt->get_result()->fetch_assoc()['total'] ?? 0);

    $limit = $forExport ? 50000 : (int)$filters['limit'];
    $projectCode = (string)$database['project_code'];
    $databaseCode = (string)$database['database_code'];
    $sql = "SELECT `user`, tab, hhid, `date`, `time`, keyfields, val_r1, val_r2, val
            FROM {$chkTable}
            {$whereSql}
            ORDER BY `date` DESC, `time` DESC, tab, hhid, keyfields
            LIMIT ?";
    $stmt = $mysqli->prepare($sql);
    $rowTypes = $types . 'i';
    $rowParams = array_merge($params, [$limit]);
    bind_params($stmt, $rowTypes, $rowParams);
    $stmt->execute();
    $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    foreach ($rows as &$row) {
        $row['project'] = $projectCode;
        $row['database'] = $databaseCode;
    }
    unset($row);

    return [
        'database' => admin_database_payload($database),
        'rows' => $rows,
        'total' => $total,
        'limit' => $limit,
        'chk_user_exists' => true,
    ];
}

function admin_tools_send_csv(string $filename, array $rows): void
{
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    echo "\xEF\xBB\xBF";

    $out = fopen('php://output', 'w');
    fputcsv($out, ['Project', 'Database', 'User', 'Tab', 'HHID', 'date', 'time', 'keyfields', 'val_r1', 'val_r2', 'val']);
    foreach ($rows as $row) {
        fputcsv($out, [
            $row['project'] ?? '',
            $row['database'] ?? '',
            $row['user'] ?? '',
            $row['tab'] ?? '',
            $row['hhid'] ?? '',
            $row['date'] ?? '',
            $row['time'] ?? '',
            $row['keyfields'] ?? '',
            $row['val_r1'] ?? '',
            $row['val_r2'] ?? '',
            $row['val'] ?? '',
        ]);
    }
    fclose($out);
    exit;
}

function admin_tools_export_columns(): array
{
    return [
        ['label' => 'Project', 'key' => 'project'],
        ['label' => 'Database', 'key' => 'database'],
        ['label' => 'User', 'key' => 'user'],
        ['label' => 'Tab', 'key' => 'tab'],
        ['label' => 'HHID', 'key' => 'hhid'],
        ['label' => 'date', 'key' => 'date'],
        ['label' => 'time', 'key' => 'time'],
        ['label' => 'keyfields', 'key' => 'keyfields'],
        ['label' => 'val_r1', 'key' => 'val_r1'],
        ['label' => 'val_r2', 'key' => 'val_r2'],
        ['label' => 'val', 'key' => 'val'],
    ];
}

function admin_tools_xlsx_col(int $number): string
{
    $name = '';
    while ($number > 0) {
        $number--;
        $name = chr(65 + ($number % 26)) . $name;
        $number = intdiv($number, 26);
    }

    return $name;
}

function admin_tools_xml_text($value): string
{
    $text = str_replace(["\r\n", "\r"], "\n", (string)($value ?? ''));
    $clean = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/u', '', $text);
    if ($clean === null) {
        $clean = $text;
    }

    return htmlspecialchars($clean, ENT_XML1 | ENT_COMPAT | ENT_SUBSTITUTE, 'UTF-8');
}

function admin_tools_xlsx_cell(int $rowNumber, int $columnNumber, $value, bool $header = false): string
{
    $ref = admin_tools_xlsx_col($columnNumber) . $rowNumber;
    $style = $header ? ' s="1"' : '';

    return '<c r="' . $ref . '" t="inlineStr"' . $style . '><is><t xml:space="preserve">'
        . admin_tools_xml_text($value)
        . '</t></is></c>';
}

function admin_tools_xlsx_worksheet(array $rows): string
{
    $columns = admin_tools_export_columns();
    $xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        . '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        . 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        . '<cols>'
        . '<col min="1" max="2" width="18" customWidth="1"/>'
        . '<col min="3" max="4" width="16" customWidth="1"/>'
        . '<col min="5" max="5" width="24" customWidth="1"/>'
        . '<col min="6" max="8" width="16" customWidth="1"/>'
        . '<col min="9" max="11" width="28" customWidth="1"/>'
        . '</cols><sheetData>';

    $xml .= '<row r="1">';
    foreach ($columns as $index => $column) {
        $xml .= admin_tools_xlsx_cell(1, $index + 1, $column['label'], true);
    }
    $xml .= '</row>';

    $rowNumber = 2;
    foreach ($rows as $row) {
        $xml .= '<row r="' . $rowNumber . '">';
        foreach ($columns as $index => $column) {
            $xml .= admin_tools_xlsx_cell($rowNumber, $index + 1, $row[$column['key']] ?? '');
        }
        $xml .= '</row>';
        $rowNumber++;
    }

    return $xml . '</sheetData></worksheet>';
}

function admin_tools_xlsx_files(array $rows): array
{
    return [
        '[Content_Types].xml' => '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            . '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
            . '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
            . '<Default Extension="xml" ContentType="application/xml"/>'
            . '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>'
            . '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'
            . '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
            . '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
            . '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
            . '</Types>',
        '_rels/.rels' => '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            . '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            . '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
            . '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>'
            . '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>'
            . '</Relationships>',
        'docProps/app.xml' => '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            . '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" '
            . 'xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">'
            . '<Application>Compare Data</Application></Properties>',
        'docProps/core.xml' => '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            . '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" '
            . 'xmlns:dc="http://purl.org/dc/elements/1.1/" '
            . 'xmlns:dcterms="http://purl.org/dc/terms/" '
            . 'xmlns:dcmitype="http://purl.org/dc/dcmitype/" '
            . 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
            . '<dc:creator>Compare Data</dc:creator><cp:lastModifiedBy>Compare Data</cp:lastModifiedBy>'
            . '<dcterms:created xsi:type="dcterms:W3CDTF">' . gmdate('Y-m-d\TH:i:s\Z') . '</dcterms:created>'
            . '<dcterms:modified xsi:type="dcterms:W3CDTF">' . gmdate('Y-m-d\TH:i:s\Z') . '</dcterms:modified>'
            . '</cp:coreProperties>',
        'xl/workbook.xml' => '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            . '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
            . 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
            . '<sheets><sheet name="CHK_USER" sheetId="1" r:id="rId1"/></sheets></workbook>',
        'xl/_rels/workbook.xml.rels' => '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            . '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            . '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>'
            . '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
            . '</Relationships>',
        'xl/styles.xml' => '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            . '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
            . '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>'
            . '<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD9E2F3"/><bgColor indexed="64"/></patternFill></fill></fills>'
            . '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'
            . '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
            . '<cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs>'
            . '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>'
            . '</styleSheet>',
        'xl/worksheets/sheet1.xml' => admin_tools_xlsx_worksheet($rows),
    ];
}

function admin_tools_zip_dos_time(): array
{
    $time = ((int)date('G') << 11) | ((int)date('i') << 5) | ((int)floor((int)date('s') / 2));
    $date = (((int)date('Y') - 1980) << 9) | ((int)date('n') << 5) | (int)date('j');

    return [$time, $date];
}

function admin_tools_zip_create(array $files): string
{
    [$modTime, $modDate] = admin_tools_zip_dos_time();
    $zip = '';
    $central = '';
    $offset = 0;
    $count = 0;

    foreach ($files as $name => $content) {
        $content = (string)$content;
        $size = strlen($content);
        $crc = (int)sprintf('%u', crc32($content));
        $nameLength = strlen($name);

        $local = pack('VvvvvvVVVvv', 0x04034b50, 20, 0, 0, $modTime, $modDate, $crc, $size, $size, $nameLength, 0) . $name;
        $zip .= $local . $content;

        $central .= pack('VvvvvvvVVVvvvvvVV', 0x02014b50, 20, 20, 0, 0, $modTime, $modDate, $crc, $size, $size, $nameLength, 0, 0, 0, 0, 0, $offset) . $name;
        $offset += strlen($local) + $size;
        $count++;
    }

    $centralSize = strlen($central);
    $zip .= $central;
    $zip .= pack('VvvvvVVv', 0x06054b50, 0, 0, $count, $count, $centralSize, $offset, 0);

    return $zip;
}

function admin_tools_send_xlsx(string $filename, array $rows): void
{
    $zip = admin_tools_zip_create(admin_tools_xlsx_files($rows));

    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Content-Length: ' . strlen($zip));
    echo $zip;
    exit;
}

function admin_tools_xls_workbook(array $rows): string
{
    $columns = admin_tools_export_columns();
    $xml = '<?xml version="1.0" encoding="UTF-8"?>'
        . '<?mso-application progid="Excel.Sheet"?>'
        . '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" '
        . 'xmlns:o="urn:schemas-microsoft-com:office:office" '
        . 'xmlns:x="urn:schemas-microsoft-com:office:excel" '
        . 'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" '
        . 'xmlns:html="http://www.w3.org/TR/REC-html40">'
        . '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">'
        . '<Author>Compare Data</Author>'
        . '<Created>' . gmdate('Y-m-d\TH:i:s\Z') . '</Created>'
        . '</DocumentProperties>'
        . '<Styles>'
        . '<Style ss:ID="Default" ss:Name="Normal"><Font ss:FontName="Calibri" ss:Size="11"/></Style>'
        . '<Style ss:ID="Header"><Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1"/>'
        . '<Interior ss:Color="#D9E2F3" ss:Pattern="Solid"/></Style>'
        . '</Styles>'
        . '<Worksheet ss:Name="CHK_USER"><Table>';

    foreach ([110, 110, 90, 90, 160, 90, 90, 120, 180, 180, 180] as $width) {
        $xml .= '<Column ss:Width="' . $width . '"/>';
    }

    $xml .= '<Row>';
    foreach ($columns as $column) {
        $xml .= '<Cell ss:StyleID="Header"><Data ss:Type="String">'
            . admin_tools_xml_text($column['label'])
            . '</Data></Cell>';
    }
    $xml .= '</Row>';

    foreach ($rows as $row) {
        $xml .= '<Row>';
        foreach ($columns as $column) {
            $xml .= '<Cell><Data ss:Type="String">'
                . admin_tools_xml_text($row[$column['key']] ?? '')
                . '</Data></Cell>';
        }
        $xml .= '</Row>';
    }

    return $xml . '</Table></Worksheet></Workbook>';
}

function admin_tools_send_xls(string $filename, array $rows): void
{
    $content = admin_tools_xls_workbook($rows);

    header('Content-Type: application/vnd.ms-excel; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Cache-Control: max-age=0');
    header('Content-Length: ' . strlen($content));
    echo $content;
    exit;
}

function admin_tools_daily_central_rows(mysqli $mysqli, string $date): array
{
    if (!compare_run_tables_ready($mysqli)) {
        return [];
    }

    $complete = 'complete';
    $sql = 'SELECT DATE(rr.completed_at) AS compare_date,
                   r.project_code,
                   COALESCE(p.project_name, r.project_code) AS project_name,
                   r.database_id,
                   r.database_code,
                   COALESCE(d.questionnaire_name, r.database_code) AS questionnaire_name,
                   r.table_name,
                   COUNT(DISTINCT rr.compare_key) AS compared_ids,
                   COUNT(*) AS completed_records,
                   MIN(rr.completed_at) AS first_completed_at,
                   MAX(rr.completed_at) AS last_completed_at
            FROM ' . core_table('cmp_compare_run_records') . ' rr
            INNER JOIN ' . core_table('cmp_compare_runs') . ' r ON r.run_id = rr.run_id
            LEFT JOIN ' . admin_config_table('projects') . ' p ON p.project_code = r.project_code
            LEFT JOIN ' . admin_config_table('project_databases') . ' d ON d.database_id = r.database_id
            WHERE rr.status = ?
              AND rr.completed_at >= ?
              AND rr.completed_at < DATE_ADD(?, INTERVAL 1 DAY)
            GROUP BY DATE(rr.completed_at), r.project_code, p.project_name,
                     r.database_id, r.database_code, d.questionnaire_name, r.table_name
            ORDER BY project_name, questionnaire_name, r.table_name';
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('sss', $complete, $date, $date);
    $stmt->execute();
    $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    foreach ($rows as &$row) {
        $row['source'] = 'cmp_compare_run_records';
        $row['compared_ids'] = (int)($row['compared_ids'] ?? 0);
        $row['completed_records'] = (int)($row['completed_records'] ?? 0);
    }
    unset($row);

    return $rows;
}

function admin_tools_daily_chk_user_rows(mysqli $mysqli, string $date): array
{
    $sql = 'SELECT d.*, p.project_name
            FROM ' . admin_config_table('project_databases') . ' d
            INNER JOIN ' . admin_config_table('projects') . ' p ON p.project_code = d.project_code
            WHERE d.compare_database IS NOT NULL AND d.compare_database <> ?
            ORDER BY p.display_order, d.display_order, d.database_code';
    $empty = '';
    $databases = admin_fetch_all($mysqli, $sql, 's', [$empty]);
    $rows = [];

    foreach ($databases as $database) {
        $cmpDatabase = assert_identifier($database['compare_database']);
        if (!table_exists($mysqli, $cmpDatabase, 'chk_user')) {
            continue;
        }

        $chkTable = qt($cmpDatabase, 'chk_user');
        $dailySql = "SELECT ? AS compare_date,
                            ? AS project_code,
                            ? AS project_name,
                            ? AS database_id,
                            ? AS database_code,
                            ? AS questionnaire_name,
                            tab AS table_name,
                            COUNT(DISTINCT hhid) AS compared_ids,
                            COUNT(*) AS completed_records,
                            MIN(TIMESTAMP(`date`, `time`)) AS first_completed_at,
                            MAX(TIMESTAMP(`date`, `time`)) AS last_completed_at
                     FROM {$chkTable}
                     WHERE `date` = ?
                     GROUP BY tab
                     ORDER BY tab";
        $stmt = $mysqli->prepare($dailySql);
        $projectCode = (string)$database['project_code'];
        $projectName = (string)($database['project_name'] ?? $projectCode);
        $databaseId = (int)$database['database_id'];
        $databaseCode = (string)$database['database_code'];
        $questionnaireName = (string)($database['questionnaire_name'] ?? $databaseCode);
        $stmt->bind_param(
            'sssisss',
            $date,
            $projectCode,
            $projectName,
            $databaseId,
            $databaseCode,
            $questionnaireName,
            $date
        );
        $stmt->execute();
        foreach ($stmt->get_result()->fetch_all(MYSQLI_ASSOC) as $row) {
            $row['source'] = 'chk_user';
            $row['compared_ids'] = (int)($row['compared_ids'] ?? 0);
            $row['completed_records'] = (int)($row['completed_records'] ?? 0);
            $rows[] = $row;
        }
    }

    return $rows;
}

function admin_tools_daily_report(mysqli $mysqli): array
{
    $date = admin_date_value($_GET['date'] ?? date('Y-m-d')) ?? date('Y-m-d');
    $rows = admin_tools_daily_central_rows($mysqli, $date);
    $source = 'cmp_compare_run_records';
    if (!$rows) {
        $rows = admin_tools_daily_chk_user_rows($mysqli, $date);
        $source = 'chk_user';
    }

    $totalIds = 0;
    $totalRecords = 0;
    foreach ($rows as $row) {
        $totalIds += (int)($row['compared_ids'] ?? 0);
        $totalRecords += (int)($row['completed_records'] ?? 0);
    }

    return [
        'date' => $date,
        'source' => $source,
        'rows' => $rows,
        'summary' => [
            'project_database_rows' => count($rows),
            'compared_ids' => $totalIds,
            'completed_records' => $totalRecords,
        ],
    ];
}

try {
    $mysqli = db();
    $method = admin_request_method();
    $admin = require_manage_admin();
    $action = strtolower(trim((string)($_GET['action'] ?? 'options')));

    if ($method === 'GET') {
        if ($action === 'options') {
            json_response(true, 'options', admin_tools_options($mysqli));
        }
        if ($action === 'tables') {
            $databaseId = admin_required_id($_GET['database_id'] ?? 0, 'database_id');
            json_response(true, 'tables', admin_tools_tables($mysqli, $databaseId));
        }
        if ($action === 'recompare-preview') {
            json_response(true, 'recompare preview', admin_tools_recompare_preview($mysqli));
        }
        if ($action === 'recompare-preview-all') {
            json_response(true, 'recompare preview all tables', admin_tools_recompare_preview_all($mysqli));
        }
        if ($action === 'chk_user') {
            $filters = admin_tools_chk_user_filters($_GET);
            $export = strtolower((string)($_GET['export'] ?? ''));
            $isExport = in_array($export, ['csv', 'xls'], true);
            $data = admin_tools_chk_user_rows($mysqli, $filters, $isExport);
            if ($export === 'xls') {
                $filename = 'chk_user_' . (string)$data['database']['database_code'] . '_' . date('Ymd_His') . '.xls';
                admin_tools_send_xls($filename, $data['rows']);
            }
            if ($export === 'csv') {
                $filename = 'chk_user_' . (string)$data['database']['database_code'] . '_' . date('Ymd_His') . '.csv';
                admin_tools_send_csv($filename, $data['rows']);
            }
            json_response(true, 'chk_user', $data);
        }
        if ($action === 'daily-report') {
            json_response(true, 'daily report', admin_tools_daily_report($mysqli));
        }

        json_response(false, 'Unknown action', [], ['UNKNOWN_ACTION'], 404);
    }

    if ($method === 'POST') {
        $body = input_json();
        $postAction = strtolower(trim((string)($body['action'] ?? $action)));
        if ($postAction === 'recompare') {
            json_response(true, 'recompare deleted', admin_tools_recompare_delete($mysqli, $admin, $body));
        }
        if ($postAction === 'recompare-all') {
            json_response(true, 'recompare all deleted', admin_tools_recompare_delete_all($mysqli, $admin, $body));
        }

        json_response(false, 'Unknown action', [], ['UNKNOWN_ACTION'], 404);
    }

    json_response(false, 'Method not allowed', [], ['Expected GET or POST'], 405);
} catch (Throwable $exception) {
    admin_safe_error($exception, 'ไม่สามารถโหลดเครื่องมือ Administrator ได้');
}
