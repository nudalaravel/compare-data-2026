<?php
declare(strict_types=1);

require_once __DIR__ . '/common/compare.php';

require_method('GET');

try {
    $mysqli = db();
    $projects = fetch_admin_compare_projects($mysqli);
    if (!$projects) {
        json_response(true, 'report', [
            'projects' => [],
            'selected_project' => null,
            'tables' => [],
            'rows' => [],
            'pagination' => [
                'page' => 1,
                'limit' => 10,
                'total' => 0,
                'from' => 0,
                'to' => 0,
            ],
        ]);
    }

    $requestedProject = trim((string)($_GET['project_id'] ?? ($_GET['database_code'] ?? ($_GET['project'] ?? ''))));
    $selectedProjectKey = $requestedProject !== '' ? $requestedProject : (string)$projects[0]['project_id'];
    $project = fetch_project($mysqli, $selectedProjectKey);
    $tables = array_values(array_filter(fetch_project_tables($mysqli, (string)$project['project_id']), static function (array $table): bool {
        return !empty($table['allowed']);
    }));

    $searchId = trim((string)($_GET['search_id'] ?? ($_GET['q'] ?? '')));
    $page = max(1, (int)($_GET['page'] ?? 1));
    $limit = max(5, min(100, (int)($_GET['limit'] ?? 10)));
    $offset = ($page - 1) * $limit;

    $summaryDatabases = report_summary_scope_databases($project, $projects);
    $summaryTables = report_summary_tables($mysqli, $project, $tables, $summaryDatabases);
    $allIds = report_collect_sample_ids($mysqli, $project, $tables, $searchId);
    $total = count($allIds);
    $pageIds = array_slice($allIds, $offset, $limit);
    $rows = report_build_rows($mysqli, $project, $tables, $pageIds);

    json_response(true, 'report', [
        'projects' => $projects,
        'selected_project' => $project,
        'tables' => $summaryTables,
        'summary_mode' => count($summaryDatabases) > 1 ? 'database_preface' : 'table_all',
        'table_columns' => array_map(static function (array $table): array {
            return [
                'table_name' => $table['table_name'],
                'display_name' => $table['display_name'] ?: $table['table_name'],
            ];
        }, $tables),
        'rows' => $rows,
        'search_id' => $searchId,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'from' => $total === 0 ? 0 : $offset + 1,
            'to' => min($offset + count($pageIds), $total),
        ],
    ]);
} catch (Throwable $exception) {
    error_log('Report failed: ' . $exception->getMessage());
    json_response(false, 'Cannot load report', [], ['REPORT_FAILED'], 500);
}

function report_summary_scope_databases(array $project, array $projects): array
{
    $surveyProjectCode = (string)($project['survey_project_code'] ?? '');
    if ($surveyProjectCode === '') {
        return [$project];
    }

    $databases = [];
    foreach ($projects as $candidate) {
        if ((string)($candidate['survey_project_code'] ?? '') === $surveyProjectCode) {
            $databases[] = $candidate;
        }
    }

    return $databases ?: [$project];
}

function report_summary_tables(mysqli $mysqli, array $project, array $tables, array $summaryDatabases): array
{
    if (count($summaryDatabases) > 1) {
        return report_summary_database_preface_rows($mysqli, $summaryDatabases);
    }

    return report_summary_table_rows($mysqli, $project, $tables);
}

function report_summary_table_rows(mysqli $mysqli, array $project, array $tables): array
{
    $rows = [];
    foreach ($tables as $table) {
        $tableName = assert_identifier((string)$table['table_name']);
        $rawExists = metadata_table_exists($mysqli, $project['raw_database'], $tableName);
        $cmpExists = metadata_table_exists($mysqli, $project['cmp_database'], $tableName);

        $round1Count = $rawExists
            ? report_count_round($mysqli, $project['raw_database'], $tableName, $project['round_field'], compare_round_value($project, 'round1_value', '1'))
            : 0;
        $round2Count = $rawExists
            ? report_count_round($mysqli, $project['raw_database'], $tableName, $project['round_field'], compare_round_value($project, 'round2_value', '2'))
            : 0;
        $compareCount = $cmpExists
            ? report_count_round($mysqli, $project['cmp_database'], $tableName, $project['round_field'], compare_round_value($project, 'completed_round_value', '0'))
            : 0;

        $rows[] = [
            'table_name' => $tableName,
            'display_name' => $table['display_name'] ?: $tableName,
            'round1_count' => $round1Count,
            'round2_count' => $round2Count,
            'compare_count' => $compareCount,
        ];
    }

    return $rows;
}

function report_summary_database_preface_rows(mysqli $mysqli, array $databases): array
{
    $rows = [];
    foreach ($databases as $databaseProject) {
        $prefaceTables = report_fetch_preface_tables($mysqli, $databaseProject);
        $round1Count = 0;
        $round2Count = 0;
        $compareCount = 0;
        $prefaceTableNames = [];

        foreach ($prefaceTables as $table) {
            $tableName = assert_identifier((string)$table['table_name']);
            $prefaceTableNames[] = $tableName;
            $rawExists = metadata_table_exists($mysqli, $databaseProject['raw_database'], $tableName);
            $cmpExists = metadata_table_exists($mysqli, $databaseProject['cmp_database'], $tableName);

            if ($rawExists) {
                $round1Count += report_count_round(
                    $mysqli,
                    $databaseProject['raw_database'],
                    $tableName,
                    $databaseProject['round_field'],
                    compare_round_value($databaseProject, 'round1_value', '1')
                );
                $round2Count += report_count_round(
                    $mysqli,
                    $databaseProject['raw_database'],
                    $tableName,
                    $databaseProject['round_field'],
                    compare_round_value($databaseProject, 'round2_value', '2')
                );
            }

            if ($cmpExists) {
                $compareCount += report_count_round(
                    $mysqli,
                    $databaseProject['cmp_database'],
                    $tableName,
                    $databaseProject['round_field'],
                    compare_round_value($databaseProject, 'completed_round_value', '0')
                );
            }
        }

        $databaseCode = assert_identifier((string)$databaseProject['database_code']);
        $displayName = trim((string)($databaseProject['display_name'] ?? ''));
        if ($displayName === '') {
            $displayName = trim((string)($databaseProject['questionnaire_name'] ?? ''));
        }
        if ($displayName === '') {
            $displayName = $databaseCode;
        }

        $rows[] = [
            'table_name' => $databaseCode,
            'display_name' => $displayName,
            'database_code' => $databaseCode,
            'summary_type' => 'database',
            'preface_tables' => $prefaceTableNames,
            'round1_count' => $round1Count,
            'round2_count' => $round2Count,
            'compare_count' => $compareCount,
        ];
    }

    return $rows;
}

function report_fetch_preface_tables(mysqli $mysqli, array $project): array
{
    $configuredPrefaceTable = report_configured_preface_table($project);
    if ($configuredPrefaceTable !== '') {
        $displayName = $configuredPrefaceTable;
        $databaseId = (int)($project['database_id'] ?? 0);
        if ($databaseId > 0) {
            $sql = 'SELECT display_name
                    FROM ' . core_table('project_tables') . '
                    WHERE database_id = ? AND table_name = ?
                    LIMIT 1';
            $stmt = $mysqli->prepare($sql);
            $stmt->bind_param('is', $databaseId, $configuredPrefaceTable);
            $stmt->execute();
            $row = $stmt->get_result()->fetch_assoc();
            if ($row && trim((string)($row['display_name'] ?? '')) !== '') {
                $displayName = (string)$row['display_name'];
            }
        }

        return [[
            'table_name' => $configuredPrefaceTable,
            'display_name' => $displayName,
        ]];
    }

    $databaseId = (int)($project['database_id'] ?? 0);
    if ($databaseId <= 0) {
        return [];
    }

    $sql = 'SELECT table_name, display_name
            FROM ' . core_table('project_tables') . '
            WHERE database_id = ? AND allow_compare = 1
            ORDER BY display_order, table_name';
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('i', $databaseId);
    $stmt->execute();

    $tables = [];
    foreach ($stmt->get_result()->fetch_all(MYSQLI_ASSOC) as $row) {
        $tableName = assert_identifier((string)($row['table_name'] ?? ''));
        if (strpos($tableName, 'preface_') !== 0) {
            continue;
        }
        $tables[] = [
            'table_name' => $tableName,
            'display_name' => $row['display_name'] ?: $tableName,
        ];
    }

    return $tables;
}

function report_configured_preface_table(array $project): string
{
    $tableName = trim((string)($project['table_preface'] ?? ($project['tablePreface'] ?? '')));
    if ($tableName === '') {
        return '';
    }

    return assert_identifier($tableName);
}

function report_is_preface_table(array $project, string $tableName): bool
{
    $configuredPrefaceTable = report_configured_preface_table($project);
    if ($configuredPrefaceTable !== '') {
        return $tableName === $configuredPrefaceTable;
    }

    return strpos($tableName, 'preface_') === 0;
}

function report_count_round(mysqli $mysqli, string $database, string $tableName, string $roundField, string $roundValue): int
{
    $sql = 'SELECT COUNT(*) AS total
            FROM ' . qt($database, $tableName) . ' r
            WHERE r.' . qi($roundField) . ' = ?';
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('s', $roundValue);
    $stmt->execute();

    return (int)$stmt->get_result()->fetch_assoc()['total'];
}

function report_collect_sample_ids(mysqli $mysqli, array $project, array $tables, string $searchId): array
{
    $customSql = trim((string)($project['sample_ids_sql'] ?? ''));
    if ($customSql !== '') {
        return report_collect_custom_sample_ids($mysqli, $customSql, (string)$project['database_code'], $searchId);
    }

    $ids = [];
    foreach ($tables as $table) {
        $tableName = assert_identifier((string)$table['table_name']);
        if (!metadata_table_exists($mysqli, $project['raw_database'], $tableName)) {
            continue;
        }

        $primaryKeys = report_primary_keys_for_table($mysqli, $project, $tableName);
        if (!$primaryKeys) {
            continue;
        }
        $searchExpr = compare_search_expression($mysqli, $project, $tableName, 'r', $primaryKeys, false);
        if ($searchExpr === null) {
            continue;
        }

        $where = 'r.' . qi($project['round_field']) . ' IN (?, ?) AND ' . $searchExpr . " <> ''";
        $params = [
            compare_round_value($project, 'round1_value', '1'),
            compare_round_value($project, 'round2_value', '2'),
        ];
        $types = 'ss';
        if ($searchId !== '') {
            $where .= ' AND ' . $searchExpr . ' LIKE ?';
            $params[] = $searchId . '%';
            $types .= 's';
        }

        $sql = 'SELECT DISTINCT CAST(' . $searchExpr . ' AS CHAR) AS id
                FROM ' . qt($project['raw_database'], $tableName) . ' r
                WHERE ' . $where . '
                ORDER BY id
                LIMIT 50000';
        $stmt = $mysqli->prepare($sql);
        bind_params($stmt, $types, $params);
        $stmt->execute();
        foreach ($stmt->get_result()->fetch_all(MYSQLI_ASSOC) as $row) {
            $id = trim((string)($row['id'] ?? ''));
            if ($id !== '') {
                $ids[$id] = true;
            }
        }
    }

    $sorted = array_keys($ids);
    sort($sorted, SORT_NATURAL);
    return $sorted;
}

function report_collect_custom_sample_ids(mysqli $mysqli, string $customSql, string $databaseCode, string $searchId): array
{
    $normalized = trim(preg_replace('/\s+/', ' ', $customSql) ?? '');
    if ($normalized === ''
        || strpos($normalized, ';') !== false
        || !preg_match('/^\(?\s*SELECT\b/i', $normalized)
        || preg_match('/\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|REPLACE|CALL|LOAD|GRANT|REVOKE|HANDLER|LOCK|UNLOCK|OUTFILE|DUMPFILE)\b/i', $normalized)) {
        return [];
    }

    $where = 'WHERE CAST(sample_source.database_code AS CHAR) = ?
              AND CAST(sample_source.id AS CHAR) <> ?';
    $params = [$databaseCode, ''];
    $types = 'ss';
    if ($searchId !== '') {
        $where .= ' AND CAST(sample_source.id AS CHAR) LIKE ?';
        $params[] = $searchId . '%';
        $types .= 's';
    }

    $sql = 'SELECT DISTINCT CAST(sample_source.id AS CHAR) AS id
            FROM (' . $customSql . ') sample_source
            ' . $where . '
            ORDER BY id
            LIMIT 50000';
    $stmt = $mysqli->prepare($sql);
    bind_params($stmt, $types, $params);
    $stmt->execute();

    $ids = [];
    foreach ($stmt->get_result()->fetch_all(MYSQLI_ASSOC) as $row) {
        $id = trim((string)($row['id'] ?? ''));
        if ($id !== '') {
            $ids[$id] = true;
        }
    }

    $sorted = array_keys($ids);
    sort($sorted, SORT_NATURAL);
    return $sorted;
}

function report_build_rows(mysqli $mysqli, array $project, array $tables, array $ids): array
{
    if (!$ids) {
        return [];
    }

    $rows = [];
    foreach ($ids as $id) {
        $rows[$id] = [
            'id' => $id,
            'recp' => '',
            'recpr2' => '',
            'tables' => [],
        ];
    }

    report_attach_operator_values($mysqli, $project, report_operator_tables($project, $tables), $ids, $rows);

    foreach ($tables as $table) {
        $tableName = assert_identifier((string)$table['table_name']);
        $rawStatus = report_raw_status_by_id($mysqli, $project, $tableName, $ids);
        $cmpStatus = report_cmp_status_by_id($mysqli, $project, $tableName, $ids);

        foreach ($ids as $id) {
            $raw = $rawStatus[$id] ?? ['round1' => 0, 'round2' => 0];
            $cmp = $cmpStatus[$id] ?? ['completed' => 0, 'pending' => 0];
            $rows[$id]['tables'][$tableName] = report_status_cell($raw, $cmp);
        }
    }

    return array_values($rows);
}

function report_operator_tables(array $project, array $tables): array
{
    $configuredPrefaceTable = report_configured_preface_table($project);
    if ($configuredPrefaceTable === '') {
        return $tables;
    }

    foreach ($tables as $table) {
        if ((string)($table['table_name'] ?? '') === $configuredPrefaceTable) {
            return $tables;
        }
    }

    $tables[] = [
        'table_name' => $configuredPrefaceTable,
        'display_name' => $configuredPrefaceTable,
    ];

    return $tables;
}

function report_attach_operator_values(mysqli $mysqli, array $project, array $tables, array $ids, array &$rows): void
{
    foreach ($tables as $table) {
        $tableName = assert_identifier((string)$table['table_name']);
        if (!report_is_preface_table($project, $tableName)
            || !metadata_table_exists($mysqli, $project['raw_database'], $tableName)
            || !metadata_column_exists($mysqli, $project['raw_database'], $tableName, 'recp')) {
            continue;
        }

        $primaryKeys = report_primary_keys_for_table($mysqli, $project, $tableName);
        if (!$primaryKeys) {
            continue;
        }
        $searchExpr = compare_search_expression($mysqli, $project, $tableName, 'r', $primaryKeys, false);
        if ($searchExpr === null) {
            continue;
        }

        [$inSql, $idTypes, $idParams] = report_in_clause($ids);
        $round1 = compare_round_value($project, 'round1_value', '1');
        $round2 = compare_round_value($project, 'round2_value', '2');
        $params = array_merge([$round1, $round2, $round1, $round2], $idParams);
        $types = 'ssss' . $idTypes;
        $sql = 'SELECT CAST(' . $searchExpr . ' AS CHAR) AS id,
                       MAX(CASE WHEN r.' . qi($project['round_field']) . ' = ? THEN CAST(r.' . qi('recp') . ' AS CHAR) ELSE \'\' END) AS recp,
                       MAX(CASE WHEN r.' . qi($project['round_field']) . ' = ? THEN CAST(r.' . qi('recp') . ' AS CHAR) ELSE \'\' END) AS recpr2
                FROM ' . qt($project['raw_database'], $tableName) . ' r
                WHERE r.' . qi($project['round_field']) . ' IN (?, ?)
                  AND ' . $searchExpr . ' IN (' . $inSql . ')
                GROUP BY id';
        $stmt = $mysqli->prepare($sql);
        bind_params($stmt, $types, $params);
        $stmt->execute();

        foreach ($stmt->get_result()->fetch_all(MYSQLI_ASSOC) as $row) {
            $id = trim((string)($row['id'] ?? ''));
            if (!isset($rows[$id])) {
                continue;
            }
            if ($rows[$id]['recp'] === '') {
                $rows[$id]['recp'] = (string)($row['recp'] ?? '');
            }
            if ($rows[$id]['recpr2'] === '') {
                $rows[$id]['recpr2'] = (string)($row['recpr2'] ?? '');
            }
        }
    }
}

function report_primary_keys_for_table(mysqli $mysqli, array $project, string $tableName): array
{
    $keys = [];
    $databaseId = (int)($project['database_id'] ?? 0);
    if ($databaseId > 0 && metadata_table_exists($mysqli, CMP_CORE_DB, 'project_tables')) {
        $sql = 'SELECT primary_keys_json
                FROM ' . core_table('project_tables') . '
                WHERE database_id = ? AND table_name = ?
                LIMIT 1';
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param('is', $databaseId, $tableName);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc();
        if ($row) {
            $decoded = json_decode((string)($row['primary_keys_json'] ?? ''), true);
            $keys = is_array($decoded) ? array_values(array_filter(array_map('strval', $decoded))) : [];
        }
    }

    if (!$keys) {
        $keys = fetch_raw_primary_keys($mysqli, (string)$project['raw_database'], $tableName);
    }

    $roundField = strtolower((string)$project['round_field']);
    $keys = array_values(array_filter($keys, static function ($key) use ($roundField) {
        return strtolower((string)$key) !== $roundField;
    }));

    return array_values(array_unique(array_map('assert_identifier', $keys)));
}

function report_raw_status_by_id(mysqli $mysqli, array $project, string $tableName, array $ids): array
{
    if (!metadata_table_exists($mysqli, $project['raw_database'], $tableName)) {
        return [];
    }

    $primaryKeys = fetch_primary_keys($mysqli, (string)$project['project_id'], $tableName);
    $searchExpr = compare_search_expression($mysqli, $project, $tableName, 'r', $primaryKeys, false);
    if ($searchExpr === null) {
        return [];
    }

    [$inSql, $idTypes, $idParams] = report_in_clause($ids);
    $round1 = compare_round_value($project, 'round1_value', '1');
    $round2 = compare_round_value($project, 'round2_value', '2');
    $params = array_merge([$round1, $round2, $round1, $round2], $idParams);
    $types = 'ssss' . $idTypes;

    $sql = 'SELECT CAST(' . $searchExpr . ' AS CHAR) AS id,
                   SUM(CASE WHEN r.' . qi($project['round_field']) . ' = ? THEN 1 ELSE 0 END) AS round1_count,
                   SUM(CASE WHEN r.' . qi($project['round_field']) . ' = ? THEN 1 ELSE 0 END) AS round2_count
            FROM ' . qt($project['raw_database'], $tableName) . ' r
            WHERE r.' . qi($project['round_field']) . ' IN (?, ?)
              AND ' . $searchExpr . ' IN (' . $inSql . ')
            GROUP BY id';
    $stmt = $mysqli->prepare($sql);
    bind_params($stmt, $types, $params);
    $stmt->execute();

    $status = [];
    foreach ($stmt->get_result()->fetch_all(MYSQLI_ASSOC) as $row) {
        $status[(string)$row['id']] = [
            'round1' => (int)$row['round1_count'],
            'round2' => (int)$row['round2_count'],
        ];
    }

    return $status;
}

function report_cmp_status_by_id(mysqli $mysqli, array $project, string $tableName, array $ids): array
{
    if (!metadata_table_exists($mysqli, $project['cmp_database'], $tableName)) {
        return [];
    }

    $primaryKeys = fetch_primary_keys($mysqli, (string)$project['project_id'], $tableName);
    $searchExpr = compare_search_expression($mysqli, $project, $tableName, 'c', $primaryKeys, false);
    if ($searchExpr === null) {
        return [];
    }

    [$inSql, $idTypes, $idParams] = report_in_clause($ids);
    $completedRound = compare_round_value($project, 'completed_round_value', '0');
    $params = array_merge([$completedRound, $completedRound], $idParams);
    $types = 'ss' . $idTypes;

    $sql = 'SELECT CAST(' . $searchExpr . ' AS CHAR) AS id,
                   SUM(CASE WHEN c.' . qi($project['round_field']) . ' = ? THEN 1 ELSE 0 END) AS completed_count,
                   SUM(CASE WHEN c.' . qi($project['round_field']) . ' <> ? THEN 1 ELSE 0 END) AS pending_count
            FROM ' . qt($project['cmp_database'], $tableName) . ' c
            WHERE ' . $searchExpr . ' IN (' . $inSql . ')
            GROUP BY id';
    $stmt = $mysqli->prepare($sql);
    bind_params($stmt, $types, $params);
    $stmt->execute();

    $status = [];
    foreach ($stmt->get_result()->fetch_all(MYSQLI_ASSOC) as $row) {
        $status[(string)$row['id']] = [
            'completed' => (int)$row['completed_count'],
            'pending' => (int)$row['pending_count'],
        ];
    }

    return $status;
}

function report_status_cell(array $raw, array $cmp): array
{
    $round1 = (int)($raw['round1'] ?? 0);
    $round2 = (int)($raw['round2'] ?? 0);
    $completed = (int)($cmp['completed'] ?? 0);
    $pending = (int)($cmp['pending'] ?? 0);

    if ($completed > 0 && $pending === 0 && ($round2 === 0 || $completed >= $round2)) {
        return ['tone' => 'ok', 'icon' => '✓', 'label' => 'Compare แล้ว'];
    }
    if ($completed > 0 || $pending > 0) {
        return ['tone' => 'danger', 'icon' => '✖', 'label' => 'ข้อมูลทั้งสองรอบ ยังไม่ตรงกัน'];
    }
    if ($round1 === 0 && $round2 === 0) {
        return ['tone' => 'empty', 'icon' => '--', 'label' => 'ไม่มีข้อมูลทั้งสองรอบ'];
    }
    if ($round1 !== $round2) {
        return ['tone' => 'slash', 'icon' => '/', 'label' => 'ข้อมูลทั้งสองรอบ ยังไม่เท่ากัน'];
    }

    return ['tone' => 'warning', 'icon' => '▲', 'label' => 'ยังไม่ดำเนินการ compare'];
}

function report_in_clause(array $ids): array
{
    $params = array_values(array_map('strval', $ids));
    $placeholders = implode(', ', array_fill(0, count($params), '?'));
    return [$placeholders, str_repeat('s', count($params)), $params];
}
