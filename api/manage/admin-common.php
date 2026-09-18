<?php
declare(strict_types=1);

require_once __DIR__ . '/common.php';

function admin_config_table(string $table): string
{
    $allowed = [
        'projects',
        'project_databases',
        'project_tables',
        'project_table_hidden_columns',
        'config_audit_logs',
    ];

    if (!in_array($table, $allowed, true)) {
        json_response(false, 'Invalid config table', [], ['INVALID_CONFIG_TABLE'], 500);
    }

    return manage_table($table);
}

function admin_request_method(): string
{
    return strtoupper((string)($_SERVER['REQUEST_METHOD'] ?? 'GET'));
}

function admin_string($value, int $max = 255): string
{
    $text = trim((string)$value);
    if ($max > 0 && strlen($text) > $max) {
        $text = substr($text, 0, $max);
    }

    return $text;
}

function admin_nullable_string($value, int $max = 255): ?string
{
    $text = admin_string($value, $max);
    return $text === '' ? null : $text;
}

function admin_project_code_from_body(array $body): string
{
    $value = $body['project_code'] ?? ($body['project_key'] ?? ($body['key'] ?? ''));
    return admin_project_code((string)$value, 'project_code');
}

function admin_project_code(string $value, string $field = 'project_code'): string
{
    $code = strtolower(trim($value));
    if ($code === '' || !preg_match('/^[a-z0-9_-]+$/', $code)) {
        json_response(false, 'Validation error', [], ["Invalid {$field}"], 422);
    }

    return $code;
}

function admin_identifier_from_body(array $body, string $field, string $default = ''): string
{
    $value = trim((string)($body[$field] ?? $default));
    if ($value === '') {
        json_response(false, 'Validation error', [], ["Missing field: {$field}"], 422);
    }

    return assert_identifier($value);
}

function admin_optional_identifier_from_body(array $body, string $field, string $default = ''): string
{
    $value = trim((string)($body[$field] ?? $default));
    return $value === '' ? '' : assert_identifier($value);
}

function admin_bool_value($value, bool $default = false): int
{
    if ($value === null) {
        return $default ? 1 : 0;
    }

    if (is_bool($value)) {
        return $value ? 1 : 0;
    }

    $text = strtolower(trim((string)$value));
    if ($text === '') {
        return $default ? 1 : 0;
    }

    return in_array($text, ['1', 'true', 'yes', 'y', 'on'], true) ? 1 : 0;
}

function admin_int_value($value, int $default = 0): int
{
    if ($value === null || $value === '') {
        return $default;
    }

    return (int)$value;
}

function admin_required_id($value, string $field): int
{
    $id = (int)$value;
    if ($id <= 0) {
        json_response(false, 'Validation error', [], ["Invalid {$field}"], 422);
    }

    return $id;
}

function admin_date_value($value): ?string
{
    $text = trim((string)$value);
    if ($text === '') {
        return null;
    }

    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $text)) {
        json_response(false, 'Validation error', [], ['INVALID_DATE'], 422);
    }

    return $text;
}

function admin_url_value($value, string $field): ?string
{
    $text = trim((string)$value);
    if ($text === '') {
        return null;
    }

    if (strpos($text, '/') === 0) {
        return $text;
    }

    $parts = parse_url($text);
    $scheme = strtolower((string)($parts['scheme'] ?? ''));
    if (!in_array($scheme, ['http', 'https'], true) || filter_var($text, FILTER_VALIDATE_URL) === false) {
        json_response(false, 'Validation error', [], ["Invalid {$field}"], 422);
    }

    return $text;
}

function admin_status_value($value, array $allowed, string $default): string
{
    $status = strtolower(trim((string)$value));
    if ($status === '') {
        return $default;
    }

    if (!in_array($status, $allowed, true)) {
        json_response(false, 'Validation error', [], ['INVALID_STATUS'], 422);
    }

    return $status;
}

function admin_json_list($value, string $field = 'list'): array
{
    if (is_array($value)) {
        $items = $value;
    } else {
        $items = manage_value_list($value);
    }

    $result = [];
    foreach ($items as $item) {
        $identifier = assert_identifier(trim((string)$item));
        if (!in_array($identifier, $result, true)) {
            $result[] = $identifier;
        }
    }

    return $result;
}

function admin_json_encode_value($value): ?string
{
    if ($value === null) {
        return null;
    }

    return json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

function admin_client_ip(): ?string
{
    $ip = trim((string)($_SERVER['HTTP_X_FORWARDED_FOR'] ?? ($_SERVER['REMOTE_ADDR'] ?? '')));
    if ($ip === '') {
        return null;
    }

    $parts = explode(',', $ip);
    return admin_string($parts[0] ?? $ip, 45);
}

function admin_user_agent(): ?string
{
    return admin_nullable_string($_SERVER['HTTP_USER_AGENT'] ?? '', 255);
}

function admin_audit_log(
    mysqli $mysqli,
    string $entityType,
    string $entityId,
    string $action,
    ?array $before,
    ?array $after,
    string $username
): void {
    $beforeJson = admin_json_encode_value($before);
    $afterJson = admin_json_encode_value($after);
    $ipAddress = admin_client_ip();
    $userAgent = admin_user_agent();

    $sql = 'INSERT INTO ' . admin_config_table('config_audit_logs') . '
            (entity_type, entity_id, action, before_json, after_json, username, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param(
        'ssssssss',
        $entityType,
        $entityId,
        $action,
        $beforeJson,
        $afterJson,
        $username,
        $ipAddress,
        $userAgent
    );
    $stmt->execute();
}

function admin_fetch_one(mysqli $mysqli, string $sql, string $types = '', array $params = []): ?array
{
    $stmt = $mysqli->prepare($sql);
    if ($types !== '') {
        bind_params($stmt, $types, $params);
    }
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();

    return $row ?: null;
}

function admin_fetch_all(mysqli $mysqli, string $sql, string $types = '', array $params = []): array
{
    $stmt = $mysqli->prepare($sql);
    if ($types !== '') {
        bind_params($stmt, $types, $params);
    }
    $stmt->execute();

    return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
}

function admin_fetch_project(mysqli $mysqli, string $projectCode): ?array
{
    $sql = 'SELECT *
            FROM ' . admin_config_table('projects') . '
            WHERE project_code = ?';
    $params = [$projectCode];
    return admin_fetch_one($mysqli, $sql, 's', $params);
}

function admin_fetch_database(mysqli $mysqli, int $databaseId): array
{
    $sql = 'SELECT d.*, p.project_name
            FROM ' . admin_config_table('project_databases') . ' d
            INNER JOIN ' . admin_config_table('projects') . ' p ON p.project_code = d.project_code
            WHERE d.database_id = ?';
    $params = [$databaseId];
    $row = admin_fetch_one($mysqli, $sql, 'i', $params);
    if (!$row) {
        json_response(false, 'Database config not found', [], ['DATABASE_CONFIG_NOT_FOUND'], 404);
    }

    assert_identifier($row['raw_database']);
    assert_identifier($row['compare_database']);
    assert_identifier($row['round_field']);

    return $row;
}

function admin_fetch_project_table(mysqli $mysqli, int $tableId): array
{
    $sql = 'SELECT t.*, d.project_code, d.database_code, d.raw_database, d.compare_database, d.round_field
            FROM ' . admin_config_table('project_tables') . ' t
            INNER JOIN ' . admin_config_table('project_databases') . ' d ON d.database_id = t.database_id
            WHERE t.table_id = ?';
    $params = [$tableId];
    $row = admin_fetch_one($mysqli, $sql, 'i', $params);
    if (!$row) {
        json_response(false, 'Table config not found', [], ['TABLE_CONFIG_NOT_FOUND'], 404);
    }

    assert_identifier($row['raw_database']);
    assert_identifier($row['table_name']);

    return $row;
}

function admin_project_payload(array $row): array
{
    $status = (string)($row['status'] ?? 'draft');
    $compareReady = !empty($row['compare_ready']);
    $keyinActive = !empty($row['keyin_active']);
    $projectEnded = $status === 'ended' || !$keyinActive;

    return [
        'project_code' => $row['project_code'],
        'project_key' => $row['project_code'],
        'key' => $row['project_code'],
        'project_name' => $row['project_name'],
        'title' => $row['project_name'],
        'subtitle' => strtoupper((string)$row['project_code']),
        'keyin_url' => $row['keyin_url'] ?? '',
        'survey_url' => $row['keyin_url'] ?? '',
        'compare_url' => $row['compare_url'] ?? '',
        'description' => $row['description'] ?? '',
        'summary' => $row['description'] ?? '',
        'start_date' => $row['start_date'] ?? '',
        'end_date' => $row['end_date'] ?? '',
        'status' => $status,
        'status_mode' => $status,
        'status_text' => admin_project_status_text($status, $keyinActive, $compareReady),
        'status_tone' => admin_project_status_tone($status, $keyinActive, $compareReady),
        'keyin_active' => $keyinActive,
        'compare_ready' => $compareReady,
        'project_ended' => $projectEnded,
        'is_visible' => !empty($row['is_visible']),
        'display_order' => (int)($row['display_order'] ?? 0),
        'database_count' => (int)($row['database_count'] ?? 0),
        'prepared_count' => (int)($row['prepared_count'] ?? 0),
        'table_count' => (int)($row['table_count'] ?? 0),
        'created_at' => $row['created_at'] ?? '',
        'updated_at' => $row['updated_at'] ?? '',
    ];
}

function admin_database_payload(array $row): array
{
    return [
        'database_id' => (int)$row['database_id'],
        'project_code' => $row['project_code'],
        'database_code' => $row['database_code'],
        'questionnaire_name' => $row['questionnaire_name'] ?? '',
        'questionnaireName' => $row['questionnaire_name'] ?? '',
        'table_preface' => $row['table_preface'] ?? '',
        'tablePreface' => $row['table_preface'] ?? '',
        'sample_ids_sql' => $row['sample_ids_sql'] ?? '',
        'sampleIdsSql' => $row['sample_ids_sql'] ?? '',
        'search_column' => $row['search_column'] ?? '',
        'searchColumn' => $row['search_column'] ?? '',
        'search_id1_start' => (int)($row['search_id1_start'] ?? 1),
        'searchId1Start' => (int)($row['search_id1_start'] ?? 1),
        'search_id1_length' => (int)($row['search_id1_length'] ?? 12),
        'searchId1Length' => (int)($row['search_id1_length'] ?? 12),
        'search_id2_start' => (int)($row['search_id2_start'] ?? 13),
        'searchId2Start' => (int)($row['search_id2_start'] ?? 13),
        'search_id2_length' => isset($row['search_id2_length']) ? (int)$row['search_id2_length'] : null,
        'searchId2Length' => isset($row['search_id2_length']) ? (int)$row['search_id2_length'] : null,
        'search_id2_mode' => $row['search_id2_mode'] ?? 'exact',
        'searchId2Mode' => $row['search_id2_mode'] ?? 'exact',
        'raw_database' => $row['raw_database'],
        'compare_database' => $row['compare_database'],
        'round_field' => $row['round_field'],
        'round1_value' => (string)($row['round1_value'] ?? '1'),
        'round2_value' => (string)($row['round2_value'] ?? '2'),
        'completed_round_value' => (string)($row['completed_round_value'] ?? '0'),
        'compare_enabled' => !array_key_exists('compare_enabled', $row) || !empty($row['compare_enabled']),
        'description' => $row['description'] ?? '',
        'status' => $row['status'],
        'is_prepared' => !empty($row['is_prepared']),
        'prepared_at' => $row['prepared_at'] ?? '',
        'display_order' => (int)($row['display_order'] ?? 0),
        'color' => $row['color'] ?? 'blue',
        'table_count' => (int)($row['table_count'] ?? 0),
        'column_count' => (int)($row['column_count'] ?? 0),
        'hidden_column_count' => (int)($row['column_count'] ?? 0),
        'created_at' => $row['created_at'] ?? '',
        'updated_at' => $row['updated_at'] ?? '',
    ];
}

function admin_project_status_text(string $status, bool $keyinActive, bool $compareReady): string
{
    if ($status === 'ended') {
        return 'จบโครงการ';
    }
    if (!$keyinActive) {
        return 'ปิดคีย์ข้อมูล';
    }
    if ($compareReady) {
        return 'พร้อม compare data';
    }
    if ($status === 'preparing') {
        return 'กำลังเตรียม Compare';
    }
    if ($status === 'draft') {
        return 'ร่าง';
    }

    return 'เปิดใช้งาน';
}

function admin_project_status_tone(string $status, bool $keyinActive, bool $compareReady): string
{
    if ($status === 'ended' || !$keyinActive) {
        return 'muted';
    }
    if ($compareReady) {
        return 'ready';
    }
    if ($status === 'preparing') {
        return 'warning';
    }

    return 'active';
}

function admin_safe_error(Throwable $exception, string $message = 'Server error'): void
{
    error_log($exception->getMessage());
    json_response(false, $message, [], ['SERVER_ERROR'], 500);
}
