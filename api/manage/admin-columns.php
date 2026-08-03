<?php
declare(strict_types=1);

require_once __DIR__ . '/admin-common.php';

function admin_decode_primary_keys($value): array
{
    if (!$value) {
        return [];
    }

    $decoded = json_decode((string)$value, true);
    if (!is_array($decoded)) {
        return [];
    }

    return array_values(array_filter(array_map('strval', $decoded)));
}

function admin_scan_columns(mysqli $mysqli, string $rawDatabase, string $tableName): array
{
    $sql = 'SELECT COLUMN_NAME, DATA_TYPE, ORDINAL_POSITION, COLUMN_KEY
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
            ORDER BY ORDINAL_POSITION';
    $params = [$rawDatabase, $tableName];
    $rows = admin_fetch_all($mysqli, $sql, 'ss', $params);
    $columns = [];

    foreach ($rows as $row) {
        $name = assert_identifier($row['COLUMN_NAME']);
        $columns[$name] = [
            'column_name' => $name,
            'data_type' => (string)$row['DATA_TYPE'],
            'ordinal_position' => (int)$row['ORDINAL_POSITION'],
            'column_key' => (string)$row['COLUMN_KEY'],
        ];
    }

    return $columns;
}

function admin_fetch_hidden_column_rows(mysqli $mysqli, int $tableId): array
{
    $sql = 'SELECT *
            FROM ' . admin_config_table('project_table_hidden_columns') . '
            WHERE table_id = ?
            ORDER BY column_name';
    $params = [$tableId];
    $rows = admin_fetch_all($mysqli, $sql, 'i', $params);
    $hiddenByName = [];

    foreach ($rows as $row) {
        $hiddenByName[assert_identifier($row['column_name'])] = $row;
    }

    return $hiddenByName;
}

function admin_column_payload(array $hiddenRow, array $rawColumn, array $primaryKeys, string $roundField, bool $existsInRaw): array
{
    $columnName = (string)($rawColumn['column_name'] ?? $hiddenRow['column_name']);
    $lowerName = strtolower($columnName);
    $systemNames = ['recp', 'recpdate', strtolower($roundField)];
    $isHidden = !empty($hiddenRow);
    $isPrimaryKey = in_array($columnName, $primaryKeys, true) || (($rawColumn['column_key'] ?? '') === 'PRI');
    $isSystemColumn = in_array($lowerName, $systemNames, true);
    $isComparable = !$isHidden && !$isPrimaryKey && !$isSystemColumn;

    return [
        'hidden_id' => isset($hiddenRow['hidden_id']) ? (int)$hiddenRow['hidden_id'] : null,
        'column_id' => isset($hiddenRow['hidden_id']) ? (int)$hiddenRow['hidden_id'] : null,
        'table_id' => isset($hiddenRow['table_id']) ? (int)$hiddenRow['table_id'] : null,
        'column_name' => $columnName,
        'data_type' => $rawColumn['data_type'] ?? '',
        'visible' => !$isHidden,
        'hidden' => $isHidden,
        'comparable' => $isComparable,
        'editable' => $isComparable,
        'is_primary_key' => $isPrimaryKey,
        'is_system_column' => $isSystemColumn,
        'masked' => false,
        'display_order' => (int)($rawColumn['ordinal_position'] ?? 999999),
        'exists_in_raw' => $existsInRaw,
        'hidden_reason' => $hiddenRow['hidden_reason'] ?? '',
        'created_at' => $hiddenRow['created_at'] ?? '',
        'updated_at' => $hiddenRow['updated_at'] ?? '',
    ];
}

function admin_load_column_payloads(mysqli $mysqli, int $tableId): array
{
    $table = admin_fetch_project_table($mysqli, $tableId);
    $primaryKeys = admin_decode_primary_keys($table['primary_keys_json'] ?? null);
    $rawColumns = admin_scan_columns($mysqli, $table['raw_database'], $table['table_name']);
    $hiddenByName = admin_fetch_hidden_column_rows($mysqli, $tableId);

    $columnNames = array_values(array_unique(array_merge(array_keys($rawColumns), array_keys($hiddenByName))));
    usort($columnNames, static function ($a, $b) use ($rawColumns) {
        $aOrder = $rawColumns[$a]['ordinal_position'] ?? 999999;
        $bOrder = $rawColumns[$b]['ordinal_position'] ?? 999999;
        if ($aOrder === $bOrder) {
            return strnatcasecmp($a, $b);
        }

        return $aOrder <=> $bOrder;
    });

    $columns = [];
    foreach ($columnNames as $columnName) {
        $existsInRaw = isset($rawColumns[$columnName]);
        $rawColumn = $rawColumns[$columnName] ?? ['column_name' => $columnName, 'ordinal_position' => 999999, 'column_key' => ''];
        $hiddenRow = $hiddenByName[$columnName] ?? [];
        $columns[] = admin_column_payload($hiddenRow, $rawColumn, $primaryKeys, $table['round_field'], $existsInRaw);
    }

    return [
        'table' => [
            'table_id' => (int)$table['table_id'],
            'database_id' => (int)$table['database_id'],
            'project_code' => $table['project_code'],
            'database_code' => $table['database_code'],
            'raw_database' => $table['raw_database'],
            'table_name' => $table['table_name'],
            'display_name' => $table['display_name'] ?? $table['table_name'],
            'primary_keys' => $primaryKeys,
            'hidden_columns' => array_keys($hiddenByName),
        ],
        'columns' => $columns,
    ];
}

function admin_hidden_columns_from_body(array $body, array $rawColumns, array $existingHidden): array
{
    if (array_key_exists('hidden_columns', $body)) {
        $hiddenColumns = admin_json_list($body['hidden_columns'], 'hidden_columns');
    } else {
        $columns = $body['columns'] ?? null;
        if (!is_array($columns)) {
            json_response(false, 'Validation error', [], ['Missing columns'], 422);
        }

        $hiddenColumns = [];
        foreach ($columns as $column) {
            if (!is_array($column)) {
                json_response(false, 'Validation error', [], ['Invalid column payload'], 422);
            }

            $columnName = assert_identifier(trim((string)($column['column_name'] ?? '')));
            if (!isset($rawColumns[$columnName]) && !isset($existingHidden[$columnName])) {
                json_response(false, 'Column not found in raw table', [], ['RAW_COLUMN_NOT_FOUND'], 422);
            }

            $visible = admin_bool_value($column['visible'] ?? null, true);
            if (!$visible && !in_array($columnName, $hiddenColumns, true)) {
                $hiddenColumns[] = $columnName;
            }
        }
    }

    foreach ($hiddenColumns as $columnName) {
        if (!isset($rawColumns[$columnName]) && !isset($existingHidden[$columnName])) {
            json_response(false, 'Column not found in raw table', [], ['RAW_COLUMN_NOT_FOUND'], 422);
        }
    }

    return $hiddenColumns;
}

try {
    $mysqli = db();
    $method = admin_request_method();
    require_manage_admin();

    if ($method === 'GET') {
        $tableId = admin_required_id($_GET['table_id'] ?? 0, 'table_id');
        $data = admin_load_column_payloads($mysqli, $tableId);
        json_response(true, 'columns', $data);
    }

    if (!in_array($method, ['POST', 'PUT'], true)) {
        json_response(false, 'Method not allowed', [], ['Expected GET, POST, or PUT'], 405);
    }

    $admin = require_manage_admin();
    $body = input_json();
    $tableId = admin_required_id($body['table_id'] ?? 0, 'table_id');

    $table = admin_fetch_project_table($mysqli, $tableId);
    $rawColumns = admin_scan_columns($mysqli, $table['raw_database'], $table['table_name']);
    if (!$rawColumns) {
        json_response(false, 'Raw table not found', [], ['RAW_TABLE_NOT_FOUND'], 404);
    }

    $existingHidden = admin_fetch_hidden_column_rows($mysqli, $tableId);
    $hiddenColumns = admin_hidden_columns_from_body($body, $rawColumns, $existingHidden);
    $beforeData = admin_load_column_payloads($mysqli, $tableId);
    $username = $admin['username'];

    $mysqli->begin_transaction();

    $deleteSql = 'DELETE FROM ' . admin_config_table('project_table_hidden_columns') . '
                  WHERE table_id = ?';
    $deleteStmt = $mysqli->prepare($deleteSql);
    $deleteStmt->bind_param('i', $tableId);
    $deleteStmt->execute();

    if ($hiddenColumns) {
        $insertSql = 'INSERT INTO ' . admin_config_table('project_table_hidden_columns') . '
                      (table_id, column_name, hidden_reason, created_by, updated_by)
                      VALUES (?, ?, ?, ?, ?)
                      ON DUPLICATE KEY UPDATE
                        hidden_reason = VALUES(hidden_reason),
                        updated_by = VALUES(updated_by)';
        $insertStmt = $mysqli->prepare($insertSql);
        foreach ($hiddenColumns as $columnName) {
            $reason = null;
            $insertStmt->bind_param('issss', $tableId, $columnName, $reason, $username, $username);
            $insertStmt->execute();
        }
    }

    $afterData = admin_load_column_payloads($mysqli, $tableId);
    admin_audit_log($mysqli, 'hidden_columns', (string)$tableId, 'save', $beforeData, $afterData, $username);

    $mysqli->commit();

    json_response(true, 'hidden columns saved', $afterData);
} catch (Throwable $exception) {
    if (isset($mysqli) && $mysqli instanceof mysqli) {
        try {
            $mysqli->rollback();
        } catch (Throwable $ignored) {
        }
    }
    admin_safe_error($exception, 'Cannot manage table variables');
}
