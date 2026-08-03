-- Phase 2 read-only validation queries
-- Run after database/phase2-compare-migration.sql on staging/local only.
-- This file performs SELECT statements only.

USE `_riped_survey_compare`;

SELECT
  setting_key,
  JSON_UNQUOTE(setting_value) AS setting_value,
  updated_by,
  updated_at
FROM survey_system_settings
WHERE setting_key = 'compare_phase2_enabled';

SELECT
  TABLE_NAME,
  TABLE_ROWS
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN (
    'cmp_compare_runs',
    'cmp_compare_run_records',
    'cmp_compare_field_logs'
  )
ORDER BY TABLE_NAME;

SELECT
  COLUMN_NAME,
  COLUMN_TYPE,
  IS_NULLABLE,
  COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'project_databases'
  AND COLUMN_NAME IN (
    'round1_value',
    'round2_value',
    'completed_round_value',
    'compare_enabled',
    'table_preface',
    'search_column',
    'search_id1_start',
    'search_id1_length',
    'search_id2_start',
    'search_id2_length',
    'search_id2_mode'
  )
ORDER BY FIELD(
  COLUMN_NAME,
  'round1_value',
  'round2_value',
  'completed_round_value',
  'compare_enabled',
  'table_preface',
  'search_column',
  'search_id1_start',
  'search_id1_length',
  'search_id2_start',
  'search_id2_length',
  'search_id2_mode'
);

SELECT
  COLUMN_NAME,
  COLUMN_TYPE,
  IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'project_tables'
  AND COLUMN_NAME IN ('record_id_columns_json', 'status')
ORDER BY FIELD(COLUMN_NAME, 'record_id_columns_json', 'status');

SELECT
  status,
  COUNT(*) AS runs,
  SUM(total_records) AS total_records,
  SUM(completed_records) AS completed_records
FROM cmp_compare_runs
GROUP BY status
ORDER BY status;

SELECT
  selected_source,
  COUNT(*) AS logs
FROM cmp_compare_field_logs
GROUP BY selected_source
ORDER BY selected_source;

SELECT
  run_id,
  table_name,
  total_records,
  completed_records,
  status,
  created_at
FROM cmp_compare_runs
ORDER BY created_at DESC
LIMIT 20;
