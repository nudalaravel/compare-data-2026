<?php
declare(strict_types=1);

require_once __DIR__ . '/admin-common.php';

try {
    $mysqli = db();
    require_method('POST');
    $admin = require_manage_admin();
    $body = input_json();
    $databaseId = admin_required_id($body['database_id'] ?? 0, 'database_id');
    $confirm = admin_bool_value($body['confirm'] ?? null, false);
    $database = admin_fetch_database($mysqli, $databaseId);
    $compareDatabase = assert_identifier($database['compare_database']);

    $sql = 'SELECT SCHEMA_NAME
            FROM INFORMATION_SCHEMA.SCHEMATA
            WHERE SCHEMA_NAME = ?';
    $params = [$compareDatabase];
    $existsBefore = admin_fetch_one($mysqli, $sql, 's', $params) !== null;

    if (!$confirm) {
        json_response(true, 'prepare preview', [
            'database_id' => $databaseId,
            'compare_database' => $compareDatabase,
            'exists' => $existsBefore,
            'will_create_database' => !$existsBefore,
            'requires_confirm' => true,
        ]);
    }

    if (($database['status'] ?? '') === 'disabled') {
        json_response(false, 'Database config is disabled', [], ['DATABASE_CONFIG_DISABLED'], 422);
    }

    $before = $database;

    $createSql = 'CREATE DATABASE IF NOT EXISTS ' . qi($compareDatabase) . '
                  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci';
    $mysqli->query($createSql);

    $mysqli->begin_transaction();

    $status = 'prepared';
    $username = $admin['username'];
    $sql = 'UPDATE ' . admin_config_table('project_databases') . '
            SET is_prepared = 1,
                prepared_at = COALESCE(prepared_at, NOW()),
                status = ?,
                updated_by = ?
            WHERE database_id = ?';
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('ssi', $status, $username, $databaseId);
    $stmt->execute();

    $after = admin_fetch_database($mysqli, $databaseId);
    admin_audit_log($mysqli, 'prepare', (string)$databaseId, 'prepare', $before, $after, $username);

    $mysqli->commit();

    json_response(true, 'compare database prepared', [
        'database' => admin_database_payload($after),
        'compare_database' => $compareDatabase,
        'created_database' => !$existsBefore,
    ]);
} catch (Throwable $exception) {
    if (isset($mysqli) && $mysqli instanceof mysqli) {
        try {
            $mysqli->rollback();
        } catch (Throwable $ignored) {
        }
    }
    admin_safe_error($exception, 'ไม่สามารถเตรียมระบบ Compare ได้');
}
