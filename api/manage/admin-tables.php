<?php
declare(strict_types=1);

require_once __DIR__ . '/admin-common.php';

function admin_table_config_payload(array $row, array $rawPrimaryKeys = [], bool $existsInRaw = false): array
{
    $configuredKeys = [];
    if (!empty($row['primary_keys_json'])) {
        $decoded = json_decode((string)$row['primary_keys_json'], true);
        if (is_array($decoded)) {
            $configuredKeys = array_values(array_filter(array_map('strval', $decoded)));
        }
    }
    $primaryKeys = $configuredKeys ?: $rawPrimaryKeys;

    return [
        'table_id' => isset($row['table_id']) ? (int)$row['table_id'] : null,
        'database_id' => isset($row['database_id']) ? (int)$row['database_id'] : null,
        'table_name' => $row['table_name'],
        'display_name' => $row['display_name'] ?? $row['table_name'],
        'primary_keys' => $primaryKeys,
        'primary_keys_text' => implode(', ', $primaryKeys),
        'raw_primary_keys' => $rawPrimaryKeys,
        'allow_compare' => !empty($row['allow_compare']),
        'display_order' => (int)($row['display_order'] ?? 0),
        'exists_in_raw' => $existsInRaw,
        'created_at' => $row['created_at'] ?? '',
        'updated_at' => $row['updated_at'] ?? '',
    ];
}

function admin_scan_raw_tables(mysqli $mysqli, string $rawDatabase): array
{
    $sql = 'SELECT TABLE_NAME
            FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = ?
            ORDER BY TABLE_NAME';
    $tableType = 'BASE TABLE';
    $params = [$rawDatabase, $tableType];
    $rows = admin_fetch_all($mysqli, $sql, 'ss', $params);

    return array_map(static function ($row) {
        return assert_identifier($row['TABLE_NAME']);
    }, $rows);
}

function admin_scan_primary_keys(mysqli $mysqli, string $rawDatabase): array
{
    $sql = 'SELECT TABLE_NAME, COLUMN_NAME
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = ? AND CONSTRAINT_NAME = ?
            ORDER BY TABLE_NAME, ORDINAL_POSITION';
    $constraint = 'PRIMARY';
    $params = [$rawDatabase, $constraint];
    $rows = admin_fetch_all($mysqli, $sql, 'ss', $params);
    $keys = [];

    foreach ($rows as $row) {
        $tableName = assert_identifier($row['TABLE_NAME']);
        $columnName = assert_identifier($row['COLUMN_NAME']);
        if (!isset($keys[$tableName])) {
            $keys[$tableName] = [];
        }
        $keys[$tableName][] = $columnName;
    }

    return $keys;
}

function admin_scan_column_names(mysqli $mysqli, string $rawDatabase, string $tableName): array
{
    $sql = 'SELECT COLUMN_NAME
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
            ORDER BY ORDINAL_POSITION';
    $params = [$rawDatabase, $tableName];
    $rows = admin_fetch_all($mysqli, $sql, 'ss', $params);

    return array_map(static function ($row) {
        return assert_identifier($row['COLUMN_NAME']);
    }, $rows);
}

function admin_fetch_table_config(mysqli $mysqli, int $databaseId, string $tableName): ?array
{
    $sql = 'SELECT *
            FROM ' . admin_config_table('project_tables') . '
            WHERE database_id = ? AND table_name = ?';
    $params = [$databaseId, $tableName];
    return admin_fetch_one($mysqli, $sql, 'is', $params);
}

try {
    $mysqli = db();
    $method = admin_request_method();
    require_manage_admin();

    if ($method === 'GET') {
        $databaseId = admin_required_id($_GET['database_id'] ?? 0, 'database_id');
        $database = admin_fetch_database($mysqli, $databaseId);
        $rawDatabase = $database['raw_database'];
        $rawTables = admin_scan_raw_tables($mysqli, $rawDatabase);
        $rawPrimaryKeys = admin_scan_primary_keys($mysqli, $rawDatabase);

        $sql = 'SELECT *
                FROM ' . admin_config_table('project_tables') . '
                WHERE database_id = ?
                ORDER BY display_order, table_name';
        $params = [$databaseId];
        $configuredRows = admin_fetch_all($mysqli, $sql, 'i', $params);

        $configuredByName = [];
        foreach ($configuredRows as $row) {
            $configuredByName[$row['table_name']] = $row;
        }

        $tableNames = array_values(array_unique(array_merge($rawTables, array_keys($configuredByName))));
        sort($tableNames, SORT_NATURAL | SORT_FLAG_CASE);

        $tables = [];
        foreach ($tableNames as $index => $tableName) {
            $existsInRaw = in_array($tableName, $rawTables, true);
            $row = $configuredByName[$tableName] ?? [
                'database_id' => $databaseId,
                'table_name' => $tableName,
                'display_name' => $tableName,
                'allow_compare' => 0,
                'display_order' => ($index + 1) * 10,
            ];
            $tables[] = admin_table_config_payload($row, $rawPrimaryKeys[$tableName] ?? [], $existsInRaw);
        }

        json_response(true, 'tables', [
            'database' => admin_database_payload($database),
            'tables' => $tables,
        ]);
    }

    if (!in_array($method, ['POST', 'PUT'], true)) {
        json_response(false, 'Method not allowed', [], ['Expected GET, POST, or PUT'], 405);
    }

    $admin = require_manage_admin();
    $body = input_json();
    $databaseId = admin_required_id($body['database_id'] ?? 0, 'database_id');
    $database = admin_fetch_database($mysqli, $databaseId);
    $rawDatabase = $database['raw_database'];
    $tableName = admin_identifier_from_body($body, 'table_name');
    $displayName = admin_nullable_string($body['display_name'] ?? $tableName, 255) ?? $tableName;
    $allowCompare = admin_bool_value($body['allow_compare'] ?? null);
    $displayOrder = admin_int_value($body['display_order'] ?? 0);
    $primaryKeys = admin_json_list($body['primary_keys'] ?? ($body['primary_keys_text'] ?? []), 'primary_keys');
    $columnNames = admin_scan_column_names($mysqli, $rawDatabase, $tableName);

    if (!$columnNames) {
        json_response(false, 'Raw table not found', [], ['RAW_TABLE_NOT_FOUND'], 404);
    }

    $unknownKeys = array_values(array_diff($primaryKeys, $columnNames));
    if ($unknownKeys) {
        json_response(false, 'Primary key not found in raw table', [], ['PRIMARY_KEY_COLUMN_NOT_FOUND'], 422);
    }

    if ($allowCompare && !$primaryKeys) {
        json_response(false, 'Primary key is required before enabling compare', [], ['PRIMARY_KEY_REQUIRED'], 422);
    }

    $before = admin_fetch_table_config($mysqli, $databaseId, $tableName);
    $primaryKeysJson = admin_json_encode_value($primaryKeys);
    $username = $admin['username'];

    $mysqli->begin_transaction();

    $sql = 'INSERT INTO ' . admin_config_table('project_tables') . '
            (database_id, table_name, display_name, primary_keys_json,
             allow_compare, display_order, created_by, updated_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              table_id = LAST_INSERT_ID(table_id),
              display_name = VALUES(display_name),
              primary_keys_json = VALUES(primary_keys_json),
              allow_compare = VALUES(allow_compare),
              display_order = VALUES(display_order),
              updated_by = VALUES(updated_by)';
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param(
        'isssiiss',
        $databaseId,
        $tableName,
        $displayName,
        $primaryKeysJson,
        $allowCompare,
        $displayOrder,
        $username,
        $username
    );
    $stmt->execute();
    $tableId = (int)$mysqli->insert_id;

    $sql = 'SELECT *
            FROM ' . admin_config_table('project_tables') . '
            WHERE table_id = ?';
    $params = [$tableId];
    $after = admin_fetch_one($mysqli, $sql, 'i', $params);
    admin_audit_log($mysqli, 'table', (string)$tableId, $before ? 'update' : 'create', $before, $after, $username);

    $mysqli->commit();

    json_response(true, 'table saved', [
        'table' => admin_table_config_payload($after, $primaryKeys, true),
    ]);
} catch (Throwable $exception) {
    if (isset($mysqli) && $mysqli instanceof mysqli) {
        try {
            $mysqli->rollback();
        } catch (Throwable $ignored) {
        }
    }
    admin_safe_error($exception, 'ไม่สามารถจัดการตารางได้');
}
