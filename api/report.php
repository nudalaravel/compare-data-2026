<?php
declare(strict_types=1);

require_once __DIR__ . '/common/compare.php';

require_method('GET');

try {
    $mysqli = db();

    // 1) โหลดรายการฐานข้อมูลที่เปิดให้ดู report ได้
    $projects = fetch_admin_compare_projects($mysqli);
    if (!$projects) {
        report_send_empty_response();
    }

    // 2) เลือกฐานข้อมูลจาก URL ถ้าไม่ส่งมา ใช้รายการแรก
    $requestedProject = trim((string)($_GET['project_id'] ?? ($_GET['database_code'] ?? ($_GET['project'] ?? ''))));
    $projectKey = $requestedProject !== '' ? $requestedProject : (string)$projects[0]['project_id'];
    $project = fetch_project($mysqli, $projectKey);

    // 3) โหลดเฉพาะตารางที่ Admin เปิด allow_compare
    $tables = [];
    foreach (fetch_project_tables($mysqli, (string)$project['project_id']) as $table) {
        if (!empty($table['allowed'])) {
            $tables[] = $table;
        }
    }

    // 4) รับเงื่อนไขค้นหาและแบ่งหน้า
    $searchId = trim((string)($_GET['search_id'] ?? ($_GET['q'] ?? '')));
    $page = max(1, (int)($_GET['page'] ?? 1));
    $limit = max(5, min(100, (int)($_GET['limit'] ?? 10)));
    $offset = ($page - 1) * $limit;
    $debugMode = report_debug_enabled();
    $debugData = ['recp_queries' => []];

    // 5) สรุปจำนวนข้อมูลด้านบน
    $summaryDatabases = report_databases_in_same_project($project, $projects);
    $summaryMode = count($summaryDatabases) > 1 ? 'database_preface' : 'table_all';
    if ($summaryMode === 'database_preface') {
        $summaryRows = report_summary_by_database_preface($mysqli, $summaryDatabases);
    } else {
        $summaryRows = report_summary_by_table($mysqli, $project, $tables);
    }

    // 6) หา ID ทั้งหมด แล้วตัดเฉพาะหน้าปัจจุบัน
    $allIds = report_sample_ids($mysqli, $project, $tables, $searchId);
    $total = count($allIds);
    $pageIds = array_slice($allIds, $offset, $limit);

    // 7) สร้างแถวรายงานราย ID พร้อมสถานะทุกตาราง
    $rows = report_rows_by_id($mysqli, $project, $tables, $pageIds, $debugMode, $debugData);

    $response = [
        'projects' => $projects,
        'selected_project' => $project,
        'tables' => $summaryRows,
        'summary_mode' => $summaryMode,
        'table_columns' => report_table_columns($tables),
        'rows' => $rows,
        'search_id' => $searchId,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'from' => $total === 0 ? 0 : $offset + 1,
            'to' => min($offset + count($pageIds), $total),
        ],
    ];

    if ($debugMode) {
        $response['debug'] = $debugData;
    }

    json_response(true, 'report', $response);
} catch (Throwable $exception) {
    error_log('Report failed: ' . $exception->getMessage());
    json_response(false, 'Cannot load report', [], ['REPORT_FAILED'], 500);
}

function report_debug_enabled(): bool
{
    $debug = strtolower(trim((string)($_GET['debug'] ?? ($_GET['debug_sql'] ?? ''))));
    return in_array($debug, ['1', 'true', 'yes', 'sql', 'recp'], true);
}

function report_send_empty_response(): void
{
    json_response(true, 'report', [
        'projects' => [],
        'selected_project' => null,
        'tables' => [],
        'summary_mode' => 'table_all',
        'table_columns' => [],
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

function report_table_columns(array $tables): array
{
    $columns = [];
    foreach ($tables as $table) {
        $tableName = assert_identifier((string)$table['table_name']);
        $columns[] = [
            'table_name' => $tableName,
            'display_name' => $table['display_name'] ?: $tableName,
        ];
    }

    return $columns;
}

function report_databases_in_same_project(array $selectedProject, array $projects): array
{
    $surveyProjectCode = (string)($selectedProject['survey_project_code'] ?? '');
    if ($surveyProjectCode === '') {
        return [$selectedProject];
    }

    $databases = [];
    foreach ($projects as $project) {
        if ((string)($project['survey_project_code'] ?? '') === $surveyProjectCode) {
            $databases[] = $project;
        }
    }

    return $databases ?: [$selectedProject];
}

// กรณีโปรเจคมีหลายฐาน: ตาราง summary แสดงรายฐาน และนับเฉพาะ preface_* ของแต่ละฐาน
function report_summary_by_database_preface(mysqli $mysqli, array $databases): array
{
    $rows = [];
    foreach ($databases as $databaseProject) {
        $round1Count = 0;
        $round2Count = 0;
        $compareCount = 0;
        $prefaceTableNames = [];

        foreach (report_preface_tables($mysqli, $databaseProject) as $prefaceTable) {
            $tableName = assert_identifier((string)$prefaceTable['table_name']);
            $prefaceTableNames[] = $tableName;

            if (metadata_table_exists($mysqli, $databaseProject['raw_database'], $tableName)) {
                $round1Count += report_count_round($mysqli, $databaseProject['raw_database'], $tableName, $databaseProject['round_field'], compare_round_value($databaseProject, 'round1_value', '1'));
                $round2Count += report_count_round($mysqli, $databaseProject['raw_database'], $tableName, $databaseProject['round_field'], compare_round_value($databaseProject, 'round2_value', '2'));
            }

            if (metadata_table_exists($mysqli, $databaseProject['cmp_database'], $tableName)) {
                $compareCount += report_count_round($mysqli, $databaseProject['cmp_database'], $tableName, $databaseProject['round_field'], compare_round_value($databaseProject, 'completed_round_value', '0'));
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

// กรณีโปรเจคมีฐานเดียว: ตาราง summary แสดงทุกตารางที่เปิด compare
function report_summary_by_table(mysqli $mysqli, array $project, array $tables): array
{
    $rows = [];
    foreach ($tables as $table) {
        $tableName = assert_identifier((string)$table['table_name']);
        $round1Count = 0;
        $round2Count = 0;
        $compareCount = 0;

        if (metadata_table_exists($mysqli, $project['raw_database'], $tableName)) {
            $round1Count = report_count_round($mysqli, $project['raw_database'], $tableName, $project['round_field'], compare_round_value($project, 'round1_value', '1'));
            $round2Count = report_count_round($mysqli, $project['raw_database'], $tableName, $project['round_field'], compare_round_value($project, 'round2_value', '2'));
        }

        if (metadata_table_exists($mysqli, $project['cmp_database'], $tableName)) {
            $compareCount = report_count_round($mysqli, $project['cmp_database'], $tableName, $project['round_field'], compare_round_value($project, 'completed_round_value', '0'));
        }

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

function report_count_round(mysqli $mysqli, string $database, string $tableName, string $roundField, string $roundValue): int
{
    $sql = 'SELECT COUNT(*) AS total
            FROM ' . qt($database, $tableName) . ' r
            WHERE r.' . qi($roundField) . ' = ?';
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('s', $roundValue);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();

    return (int)($row['total'] ?? 0);
}

function report_preface_tables(mysqli $mysqli, array $project): array
{
    // ถ้า Admin ระบุ table_preface แล้ว ให้ใช้ตัวนี้เป็นหลัก เช่น preface_hh หรือ preface_ch
    $configured = report_preface_table_from_config($project);
    if ($configured !== '') {
        return [[
            'table_name' => $configured,
            'display_name' => report_table_display_name($mysqli, $project, $configured),
        ]];
    }

    // ถ้าไม่ได้ระบุไว้ ค่อย fallback เป็นตารางที่ขึ้นต้นด้วย preface_ ใน allowlist
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

function report_preface_table_from_config(array $project): string
{
    $tableName = trim((string)($project['table_preface'] ?? ($project['tablePreface'] ?? '')));
    return $tableName === '' ? '' : assert_identifier($tableName);
}

function report_table_display_name(mysqli $mysqli, array $project, string $tableName): string
{
    $databaseId = (int)($project['database_id'] ?? 0);
    if ($databaseId <= 0) {
        return $tableName;
    }

    $sql = 'SELECT display_name
            FROM ' . core_table('project_tables') . '
            WHERE database_id = ? AND table_name = ?
            LIMIT 1';
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('is', $databaseId, $tableName);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $displayName = trim((string)($row['display_name'] ?? ''));

    return $displayName !== '' ? $displayName : $tableName;
}

function report_sample_ids(mysqli $mysqli, array $project, array $tables, string $searchId): array
{
    // Report ต้องแสดงเฉพาะรายการที่มีข้อมูลคีย์แล้วจริงใน raw table เท่านั้น
    // จึง union ID จากทุกตารางที่เปิด compare โดยดู round 1/2 ใน raw เสมอ ไม่ใช้รายชื่อ sample ทั้งหมดจาก sample_ids_sql
    $ids = [];
    foreach ($tables as $table) {
        $tableName = assert_identifier((string)$table['table_name']);
        if (!metadata_table_exists($mysqli, $project['raw_database'], $tableName)) {
            continue;
        }

        $primaryKeys = report_primary_keys($mysqli, $project, $tableName);
        $searchExpr = compare_search_expression($mysqli, $project, $tableName, 'r', $primaryKeys, false);
        if ($searchExpr === null) {
            continue;
        }

        $round1 = compare_round_value($project, 'round1_value', '1');
        $round2 = compare_round_value($project, 'round2_value', '2');
        $params = [$round1, $round2];
        $types = 'ss';
        $whereSearch = '';
        if ($searchId !== '') {
            $whereSearch = ' AND ' . $searchExpr . ' LIKE ?';
            $params[] = $searchId . '%';
            $types .= 's';
        }

        $sql = 'SELECT DISTINCT CAST(' . $searchExpr . ' AS CHAR) AS id
                FROM ' . qt($project['raw_database'], $tableName) . ' r
                WHERE r.' . qi($project['round_field']) . ' IN (?, ?)
                  AND ' . $searchExpr . " <> ''" . $whereSearch . '
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

function report_rows_by_id(mysqli $mysqli, array $project, array $tables, array $ids, bool $debugMode, array &$debugData): array
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
            'recby' => '',
            'recby2' => '',
            'tables' => [],
        ];
    }

    report_fill_recp_from_preface($mysqli, $project, $ids, $rows, $debugMode, $debugData);

    foreach ($tables as $table) {
        $tableName = assert_identifier((string)$table['table_name']);
        $rawCounts = report_raw_round_counts_by_id($mysqli, $project, $tableName, $ids);
        $cmpCounts = report_cmp_counts_by_id($mysqli, $project, $tableName, $ids);

        foreach ($ids as $id) {
            $raw = $rawCounts[$id] ?? ['round1' => 0, 'round2' => 0];
            $cmp = $cmpCounts[$id] ?? ['completed' => 0, 'pending' => 0];
            $rows[$id]['tables'][$tableName] = report_status_cell($raw, $cmp);
        }
    }

    return array_values($rows);
}

function report_fill_recp_from_preface(mysqli $mysqli, array $project, array $ids, array &$rows, bool $debugMode, array &$debugData): void
{
    $prefaceTables = report_preface_tables($mysqli, $project);
    if (!$prefaceTables && $debugMode) {
        $debugData['recp_queries'][] = [
            'purpose' => 'recp_recpr2_from_preface',
            'source_line' => null,
            'skipped' => true,
            'reason' => 'NO_PREFACE_TABLE_CONFIGURED',
            'table_preface' => (string)($project['table_preface'] ?? ($project['tablePreface'] ?? '')),
        ];
    }

    foreach ($prefaceTables as $prefaceTable) {
        $tableName = assert_identifier((string)$prefaceTable['table_name']);
        $tableExists = metadata_table_exists($mysqli, $project['raw_database'], $tableName);
        $recpColumnExists = $tableExists && metadata_column_exists($mysqli, $project['raw_database'], $tableName, 'recp');
        if (!$tableExists || !$recpColumnExists) {
            if ($debugMode) {
                $debugData['recp_queries'][] = [
                    'purpose' => 'recp_recpr2_from_preface',
                    'source_line' => null,
                    'skipped' => true,
                    'reason' => !$tableExists ? 'RAW_PREFACE_TABLE_NOT_FOUND' : 'RECP_COLUMN_NOT_FOUND',
                    'raw_database' => (string)$project['raw_database'],
                    'table_name' => $tableName,
                ];
            }
            continue;
        }

        $primaryKeys = report_primary_keys($mysqli, $project, $tableName);
        $searchExpr = compare_search_expression($mysqli, $project, $tableName, 'r', $primaryKeys, false);
        if ($searchExpr === null) {
            if ($debugMode) {
                $debugData['recp_queries'][] = [
                    'purpose' => 'recp_recpr2_from_preface',
                    'skipped' => true,
                    'reason' => 'SEARCH_EXPRESSION_NOT_FOUND',
                    'raw_database' => (string)$project['raw_database'],
                    'table_name' => $tableName,
                    'primary_keys' => $primaryKeys,
                    'search_column' => (string)($project['search_column'] ?? ''),
                ];
            }
            continue;
        }

        [$inSql, $idTypes, $idParams] = report_in_clause($ids);
        $round1 = compare_round_value($project, 'round1_value', '1');
        $round2 = compare_round_value($project, 'round2_value', '2');
        $params = array_merge([$round1, $round2, $round1, $round2], $idParams);
        $types = 'ssss' . $idTypes;

        // recp / recby  = recp จาก round 1, recpr2 / recby2 = recp จาก round 2
        $sourceLine = __LINE__ + 1;
        $sql = 'SELECT CAST(' . $searchExpr . ' AS CHAR) AS id,
                       MAX(CASE WHEN r.' . qi($project['round_field']) . ' = ? THEN CAST(r.' . qi('recp') . ' AS CHAR) ELSE \'\' END) AS recp,
                       MAX(CASE WHEN r.' . qi($project['round_field']) . ' = ? THEN CAST(r.' . qi('recp') . ' AS CHAR) ELSE \'\' END) AS recpr2
                FROM ' . qt($project['raw_database'], $tableName) . ' r
                WHERE r.' . qi($project['round_field']) . ' IN (?, ?)
                  AND ' . $searchExpr . ' IN (' . $inSql . ')
                GROUP BY id';
        $debugIndex = null;
        if ($debugMode) {
            $debugData['recp_queries'][] = [
                'purpose' => 'recp_recpr2_from_preface',
                'source_line' => $sourceLine,
                'skipped' => false,
                'raw_database' => (string)$project['raw_database'],
                'table_name' => $tableName,
                'round_field' => (string)$project['round_field'],
                'round1_value' => $round1,
                'round2_value' => $round2,
                'ids' => array_values($ids),
                'primary_keys' => $primaryKeys,
                'search_expr' => $searchExpr,
                'param_types' => $types,
                'params' => $params,
                'sql' => $sql,
                'compiled_sql' => report_debug_sql($sql, $params),
                'row_count' => 0,
            ];
            $debugIndex = count($debugData['recp_queries']) - 1;
        }

        $stmt = $mysqli->prepare($sql);
        bind_params($stmt, $types, $params);
        $stmt->execute();

        $resultRows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        if ($debugMode && $debugIndex !== null) {
            $debugData['recp_queries'][$debugIndex]['row_count'] = count($resultRows);
            $debugData['recp_queries'][$debugIndex]['result_ids'] = array_map(static function ($row): string {
                return (string)($row['id'] ?? '');
            }, $resultRows);
        }

        foreach ($resultRows as $row) {
            $id = trim((string)($row['id'] ?? ''));
            if (!isset($rows[$id])) {
                continue;
            }

            $round1Recorder = (string)($row['recp'] ?? '');
            $round2Recorder = (string)($row['recpr2'] ?? '');
            if ($rows[$id]['recp'] === '') {
                $rows[$id]['recp'] = $round1Recorder;
                $rows[$id]['recby'] = $round1Recorder;
            }
            if ($rows[$id]['recpr2'] === '') {
                $rows[$id]['recpr2'] = $round2Recorder;
                $rows[$id]['recby2'] = $round2Recorder;
            }
        }
    }
}

function report_debug_sql(string $sql, array $params): string
{
    $parts = explode('?', $sql);
    if (count($parts) === 1) {
        return $sql;
    }

    $compiled = array_shift($parts);
    foreach ($parts as $index => $part) {
        $compiled .= array_key_exists($index, $params) ? report_debug_value($params[$index]) : '?';
        $compiled .= $part;
    }

    return $compiled;
}

function report_debug_value($value): string
{
    if ($value === null) {
        return 'NULL';
    }

    return "'" . str_replace("'", "''", (string)$value) . "'";
}

function report_raw_round_counts_by_id(mysqli $mysqli, array $project, string $tableName, array $ids): array
{
    if (!metadata_table_exists($mysqli, $project['raw_database'], $tableName)) {
        return [];
    }

    $primaryKeys = report_primary_keys($mysqli, $project, $tableName);
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

    $counts = [];
    foreach ($stmt->get_result()->fetch_all(MYSQLI_ASSOC) as $row) {
        $counts[(string)$row['id']] = [
            'round1' => (int)$row['round1_count'],
            'round2' => (int)$row['round2_count'],
        ];
    }

    return $counts;
}

function report_cmp_counts_by_id(mysqli $mysqli, array $project, string $tableName, array $ids): array
{
    if (!metadata_table_exists($mysqli, $project['cmp_database'], $tableName)) {
        return [];
    }

    $primaryKeys = report_primary_keys($mysqli, $project, $tableName);
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

    $counts = [];
    foreach ($stmt->get_result()->fetch_all(MYSQLI_ASSOC) as $row) {
        $counts[(string)$row['id']] = [
            'completed' => (int)$row['completed_count'],
            'pending' => (int)$row['pending_count'],
        ];
    }

    return $counts;
}

function report_status_cell(array $raw, array $cmp): array
{
    $round1 = (int)($raw['round1'] ?? 0);
    $round2 = (int)($raw['round2'] ?? 0);
    $completed = (int)($cmp['completed'] ?? 0);
    $pending = (int)($cmp['pending'] ?? 0);

    if ($completed > 0 && $pending === 0 && ($round2 === 0 || $completed >= $round2)) {
        return ['tone' => 'ok', 'icon' => '✓', 'label' => 'Compare แล้ว', 'statusCode' => 1];
    }
    if ($completed > 0 || $pending > 0) {
        return ['tone' => 'error', 'icon' => '✖', 'label' => 'ข้อมูลทั้งสองรอบ ยังไม่ตรงกัน', 'statusCode' => 2];
    }
    if ($round1 === 0 && $round2 === 0) {
        return ['tone' => 'empty', 'icon' => '--', 'label' => 'ไม่มีข้อมูลทั้งสองรอบ', 'statusCode' => 3];
    }
    if ($round1 !== $round2) {
        return ['tone' => 'slash', 'icon' => '/', 'label' => 'ข้อมูลทั้งสองรอบ ยังไม่เท่ากัน', 'statusCode' => 4];
    }

    return ['tone' => 'warning', 'icon' => '▲', 'label' => 'ยังไม่ดำเนินการ compare', 'statusCode' => 5];
}

function report_primary_keys(mysqli $mysqli, array $project, string $tableName): array
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
    $keys = array_values(array_filter($keys, static function ($key) use ($roundField): bool {
        return strtolower((string)$key) !== $roundField;
    }));

    return validate_primary_keys($keys);
}

function report_in_clause(array $ids): array
{
    $params = array_values(array_map('strval', $ids));
    return [
        implode(', ', array_fill(0, count($params), '?')),
        str_repeat('s', count($params)),
        $params,
    ];
}
