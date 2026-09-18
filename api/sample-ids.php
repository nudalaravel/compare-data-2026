<?php
declare(strict_types=1);

require_once __DIR__ . '/common/auth.php';
require_once __DIR__ . '/common/metadata.php';

require_method('GET');
require_auth();

try {
    $projectCode = trim((string)($_GET['project_code'] ?? ''));
    $databaseCode = trim((string)($_GET['database_code'] ?? ''));
    $projectId = trim((string)($_GET['project_id'] ?? $databaseCode));
    if ($projectId === '') {
        json_response(false, 'Validation error', [], ['Missing project_id or database_code'], 422);
    }

    $limitParam = strtolower(trim((string)($_GET['limit'] ?? 'all')));
    $limit = null;
    if ($limitParam !== '' && !in_array($limitParam, ['all', 'none', 'unlimited', '0'], true)) {
        $limit = max(1, min(5000, (int)$limitParam));
    }
    $limitSql = $limit === null ? '' : "\n                LIMIT {$limit}";
    $perTableLimitSql = $limit === null ? '' : "\n                            ORDER BY id\n                            LIMIT {$limit}";
    $debugEnabled = in_array(strtolower(trim((string)($_GET['debug'] ?? ''))), ['1', 'true', 'yes', 'on'], true);
    $debug = [];

    $mysqli = db();

    $projectSql = 'SELECT d.database_id,
                          d.project_code,
                          d.database_code,
                          d.raw_database,
                          d.compare_database,
                          d.round_field,
                          d.round1_value,
                          d.round2_value,
                          d.completed_round_value,
                          d.questionnaire_name,
                          d.sample_ids_sql,
                          d.search_column,
                          d.search_id1_start,
                          d.search_id1_length,
                          d.search_id2_start,
                          d.search_id2_length,
                          d.search_id2_mode,
                          d.description,
                          d.status AS database_status,
                          d.display_order,
                          p.project_name,
                          p.compare_ready
                   FROM ' . core_table('project_databases') . ' d
                   INNER JOIN ' . core_table('projects') . ' p ON p.project_code = d.project_code
                   WHERE (d.database_code = ?
                       OR d.raw_database = ?
                       OR d.compare_database = ?
                       OR CAST(d.database_id AS CHAR) = ?
                       OR p.project_code = ?)
                     AND p.compare_ready = 1
                     AND d.status <> ?
                     AND d.compare_enabled = 1
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
    if ($debugEnabled) {
        $debug['project_query'] = [
            'sql' => $projectSql,
            'types' => 'ssssssssss',
            'params' => [
                $projectId,
                $projectId,
                $projectId,
                $projectId,
                $projectId,
                $disabled,
                $projectId,
                $projectId,
                $projectId,
                $projectId,
            ],
        ];
    }
    $projectStmt = $mysqli->prepare($projectSql);
    $projectStmt->bind_param(
        'ssssssssss',
        $projectId,
        $projectId,
        $projectId,
        $projectId,
        $projectId,
        $disabled,
        $projectId,
        $projectId,
        $projectId,
        $projectId
    );
    $projectStmt->execute();
    $project = $projectStmt->get_result()->fetch_assoc();
    if (!$project) {
        json_response(false, 'Project not found or not allowed', [], ['PROJECT_NOT_FOUND'], 404);
    }

    if ($projectCode !== ''
        && strtolower((string)$project['project_code']) !== strtolower($projectCode)) {
        json_response(false, 'Validation error', [], ['PROJECT_DATABASE_MISMATCH'], 422);
    }

    $surveyProjectCode = (string)$project['project_code'];
    $databaseCode = assert_identifier((string)$project['database_code']);
    $rawDatabase = assert_identifier((string)$project['raw_database']);
    $roundField = qi(assert_identifier((string)$project['round_field']));
    $roundOne = trim((string)($project['round1_value'] ?? ''));
    $roundTwo = trim((string)($project['round2_value'] ?? ''));
    $roundOne = $roundOne === '' ? '1' : $roundOne;
    $roundTwo = $roundTwo === '' ? '2' : $roundTwo;

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

    $rawSearchId = trim((string)($_GET['q'] ?? ($_GET['search_id'] ?? ($_GET['searchId'] ?? ''))));
    $searchId1 = trim((string)($_GET['search_id1'] ?? ($_GET['searchId1'] ?? '')));
    $searchId2 = trim((string)($_GET['search_id2'] ?? ($_GET['searchId2'] ?? '')));
    $hasSearchScope = $rawSearchId !== '' || $searchId1 !== '' || $searchId2 !== '';

    if ($searchId1 === '' && $rawSearchId !== '') {
        $searchId1 = substr($rawSearchId, $searchId1Start - 1, $searchId1Length);
        $searchId2 = $searchId2Length === null
            ? substr($rawSearchId, $searchId2Start - 1)
            : substr($rawSearchId, $searchId2Start - 1, $searchId2Length);
    }

    if ($hasSearchScope && $searchId1 === '') {
        json_response(false, 'Validation error', [], ['Missing search_id1'], 422);
    }

    $searchId = $searchId1 . $searchId2;
    $searchMode = $searchId2 === '' ? 'prefix' : $searchId2Mode;
    $operator = $searchMode === 'exact' ? '=' : 'LIKE';
    $needle = $searchMode === 'exact' ? $searchId : $searchId . '%';

    $rows = [];
    $customSql = trim((string)($project['sample_ids_sql'] ?? ''));
    if ($customSql !== '') {
        $normalizedCustomSql = trim(preg_replace('/\s+/', ' ', $customSql) ?? '');
        // ตัด ; ท้ายสุดออกก่อนเช็ค เพราะเป็นนิสัยเวลาพิมพ์ SQL ทั่วไป ไม่ใช่ multi-statement
        $normalizedCustomSql = rtrim($normalizedCustomSql, "; \t\n\r\0\x0B");
        if ($normalizedCustomSql === ''
            || strpos($normalizedCustomSql, ';') !== false
            || !preg_match('/^\(?\s*SELECT\b/i', $normalizedCustomSql)
            || preg_match('/\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|REPLACE|CALL|LOAD|GRANT|REVOKE|HANDLER|LOCK|UNLOCK|OUTFILE|DUMPFILE)\b/i', $normalizedCustomSql)) {
            json_response(false, 'Invalid sample id SQL', [], ['INVALID_SAMPLE_SQL'], 422);
        }

        $whereSql = "WHERE CAST(sample_source.id AS CHAR) <> ''";
        $types = '';
        $params = [];
        if ($hasSearchScope) {
            $whereSql .= " AND CAST(sample_source.id AS CHAR) {$operator} ?";
            $types = 's';
            $params[] = $needle;
        }

        $sql = "SELECT CAST(sample_source.project_code AS CHAR) AS project_code,
                       CAST(sample_source.database_code AS CHAR) AS database_code,
                       CAST(sample_source.id AS CHAR) AS id
                FROM ({$normalizedCustomSql}) sample_source
                {$whereSql}
                ORDER BY id{$limitSql}";
        if ($debugEnabled) {
            $debug['sample_source'] = 'sample_ids_sql';
            $debug['limit'] = $limit === null ? 'all' : $limit;
            $debug['sample_query'] = [
                'sql' => $sql,
                'types' => $types,
                'params' => $params,
            ];
        }
        $stmt = $mysqli->prepare($sql);
        if ($types !== '') {
            $refs = [$types];
            foreach ($params as $key => &$value) {
                $refs[] = &$value;
            }
            call_user_func_array([$stmt, 'bind_param'], $refs);
            unset($value);
        }
        $stmt->execute();
        $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    } else {
        $tablesSql = 'SELECT table_id, table_name, primary_keys_json
                      FROM ' . core_table('project_tables') . '
                      WHERE database_id = ? AND allow_compare = 1
                      ORDER BY display_order, table_name';
        $databaseId = (int)$project['database_id'];
        if ($debugEnabled) {
            $debug['tables_query'] = [
                'sql' => $tablesSql,
                'types' => 'i',
                'params' => [$databaseId],
            ];
        }
        $tablesStmt = $mysqli->prepare($tablesSql);
        $tablesStmt->bind_param('i', $databaseId);
        $tablesStmt->execute();
        $tables = $tablesStmt->get_result()->fetch_all(MYSQLI_ASSOC);

        $selects = [];
        $types = '';
        $params = [];
        $debugTableQueries = [];
        foreach ($tables as $table) {
            $tableName = assert_identifier((string)$table['table_name']);
            $primaryKeys = json_decode((string)($table['primary_keys_json'] ?? ''), true);
            $primaryKeys = is_array($primaryKeys) ? array_values(array_filter(array_map('strval', $primaryKeys))) : [];

            if (!$primaryKeys) {
                $primarySql = 'SELECT COLUMN_NAME
                               FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                               WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND CONSTRAINT_NAME = ?
                               ORDER BY ORDINAL_POSITION';
                $primaryConstraint = 'PRIMARY';
                if ($debugEnabled) {
                    $debugTableQueries[] = [
                        'table' => $tableName,
                        'purpose' => 'fallback_primary_key',
                        'sql' => $primarySql,
                        'types' => 'sss',
                        'params' => [$rawDatabase, $tableName, $primaryConstraint],
                    ];
                }
                $primaryStmt = $mysqli->prepare($primarySql);
                $primaryStmt->bind_param('sss', $rawDatabase, $tableName, $primaryConstraint);
                $primaryStmt->execute();
                $primaryRows = $primaryStmt->get_result()->fetch_all(MYSQLI_ASSOC);
                foreach ($primaryRows as $primaryRow) {
                    $primaryKeys[] = (string)$primaryRow['COLUMN_NAME'];
                }
            }

            $primaryKeys = array_values(array_unique(array_map('assert_identifier', $primaryKeys)));
            if (!$primaryKeys) {
                continue;
            }

            if ($searchColumn !== '') {
                $columnSql = 'SELECT COUNT(*) AS total
                              FROM INFORMATION_SCHEMA.COLUMNS
                              WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?';
                if ($debugEnabled) {
                    $debugTableQueries[] = [
                        'table' => $tableName,
                        'purpose' => 'check_search_column',
                        'sql' => $columnSql,
                        'types' => 'sss',
                        'params' => [$rawDatabase, $tableName, $searchColumn],
                    ];
                }
                $columnStmt = $mysqli->prepare($columnSql);
                $columnStmt->bind_param('sss', $rawDatabase, $tableName, $searchColumn);
                $columnStmt->execute();
                $hasSearchColumn = (int)$columnStmt->get_result()->fetch_assoc()['total'] > 0;
                if (!$hasSearchColumn) {
                    continue;
                }
                $sampleExpression = "COALESCE(CAST(s." . qi($searchColumn) . " AS CHAR), '')";
            } else {
                $parts = [];
                foreach ($primaryKeys as $key) {
                    $parts[] = "COALESCE(CAST(s." . qi($key) . " AS CHAR), '')";
                }
                $sampleExpression = 'CONCAT(' . implode(', ', $parts) . ')';
            }

            $whereSql = "s.{$roundField} IN (?, ?) AND {$sampleExpression} <> ''";
            if ($hasSearchScope) {
                $whereSql .= " AND {$sampleExpression} {$operator} ?";
            }

            $selects[] = "(SELECT DISTINCT ? AS project_code,
                                           ? AS database_code,
                                           {$sampleExpression} AS id
                            FROM " . qt($rawDatabase, $tableName) . " s
                            WHERE {$whereSql}{$perTableLimitSql})";
            $types .= 'ssss';
            $params[] = $surveyProjectCode;
            $params[] = $databaseCode;
            $params[] = $roundOne;
            $params[] = $roundTwo;
            if ($hasSearchScope) {
                $types .= 's';
                $params[] = $needle;
            }
        }

        if ($selects) {
            $sql = implode("\nUNION\n", $selects) . "\nORDER BY id";
            if ($debugEnabled) {
                $debug['sample_source'] = 'project_tables';
                $debug['limit'] = $limit === null ? 'all' : $limit;
                $debug['table_helper_queries'] = $debugTableQueries;
                $debug['sample_query'] = [
                    'sql' => $sql,
                    'types' => $types,
                    'params' => $params,
                ];
            }
            $stmt = $mysqli->prepare($sql);
            if ($types !== '') {
                $refs = [$types];
                foreach ($params as $key => &$value) {
                    $refs[] = &$value;
                }
                call_user_func_array([$stmt, 'bind_param'], $refs);
                unset($value);
            }
            $stmt->execute();
            $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        }
    }

    $seen = [];
    $samples = [];
    foreach ($rows as $row) {
        $id = trim((string)($row['id'] ?? ''));
        if ($id === '') {
            continue;
        }

        $rowDatabaseCode = trim((string)($row['database_code'] ?? $databaseCode));
        $seenKey = $rowDatabaseCode . ':' . $id;
        if (isset($seen[$seenKey])) {
            continue;
        }
        $seen[$seenKey] = true;

        $rowSearchId1 = substr($id, $searchId1Start - 1, $searchId1Length);
        $rowSearchId2 = $searchId2Length === null
            ? substr($id, $searchId2Start - 1)
            : substr($id, $searchId2Start - 1, $searchId2Length);

        $samples[] = [
            'project_code' => (string)($row['project_code'] ?? $surveyProjectCode),
            'database_code' => $rowDatabaseCode,
            'id' => $id,
            'search_id1' => $rowSearchId1,
            'searchId1' => $rowSearchId1,
            'search_id2' => $rowSearchId2,
            'searchId2' => $rowSearchId2,
        ];
    }

    $responseData = [
        'samples' => $samples,
        'search_config' => [
            'search_column' => $searchColumn,
            'search_id1_start' => $searchId1Start,
            'search_id1_length' => $searchId1Length,
            'search_id1_end' => $searchId1End,
            'search_id2_start' => $searchId2Start,
            'search_id2_length' => $searchId2Length,
            'search_id2_mode' => $searchId2Mode,
        ],
    ];
    if ($debugEnabled) {
        $responseData['debug'] = $debug;
    }

    json_response(true, 'sample ids', $responseData);
} catch (Throwable $exception) {
    error_log('Sample IDs failed: ' . $exception->getMessage());
    json_response(false, 'Cannot load sample ids', [], ['SAMPLE_IDS_FAILED'], 500);
}
