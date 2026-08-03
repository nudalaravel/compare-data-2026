-- Mock data for Administrator configuration tables.
-- Run after database/admin-compare-migration.sql.
-- Safety: inserts/updates only Administrator config tables in _riped_survey_compare.
-- Do not run this file on production.

USE `_riped_survey_compare`;

INSERT INTO projects
  (project_code, project_name, keyin_url, compare_url, description,
   status, keyin_active, compare_ready, is_visible, display_order,
   created_by, updated_by)
VALUES
  ('tcls2025', 'TCLS2025', 'https://ripedresearch.org/survey/tcls2025',
   '/compare-data/?project=tcls2025',
   'ระบบคีย์ข้อมูล TCLS2025 พร้อมเปิด compare data',
   'ready', 1, 1, 1, 10, 'seed', 'seed'),
  ('tcls2026', 'TCLS2026', 'https://ripedresearch.org/survey/tcls2026',
   '/compare-data/?project=tcls2026',
   'ระบบคีย์ข้อมูล TCLS2026 อยู่ระหว่างเตรียม compare',
   'preparing', 1, 0, 1, 20, 'seed', 'seed')
ON DUPLICATE KEY UPDATE
  project_name = VALUES(project_name),
  keyin_url = VALUES(keyin_url),
  compare_url = VALUES(compare_url),
  description = VALUES(description),
  status = VALUES(status),
  keyin_active = VALUES(keyin_active),
  compare_ready = VALUES(compare_ready),
  is_visible = VALUES(is_visible),
  display_order = VALUES(display_order),
  updated_by = VALUES(updated_by);

INSERT INTO project_databases
  (project_code, database_code, questionnaire_name, table_preface, sample_ids_sql,
   search_column, search_id1_start, search_id1_length, search_id2_start, search_id2_length, search_id2_mode,
   raw_database, compare_database, round_field,
   description, status, display_order, created_by, updated_by)
VALUES
  ('tcls2025', 'tcls2025_ch1', 'แบบสอบถามเด็ก CH1',
   'preface_ch',
   'SELECT ''tcls2025'' AS project_code, ''tcls2025_ch1'' AS database_code, CONCAT(CID, member_id) AS id FROM tcls2025_ch1.preface_ch WHERE round IN (''1'', ''2'') UNION SELECT ''tcls2025'', ''tcls2025_ch1'', CID FROM tcls2025_ch1.b1 WHERE round IN (''1'', ''2'')',
   NULL, 1, 12, 13, NULL, 'exact',
   'tcls2025_ch1', 'tcls2025_ch1_cmp', 'round',
   'แบบสอบถามเด็ก CH1', 'ready', 10, 'seed', 'seed'),
  ('tcls2025', 'tcls2025_hh', 'แบบสอบถามครัวเรือน HH', 'preface_hh', NULL,
   NULL, 1, 12, 13, NULL, 'exact',
   'tcls2025_hh', 'tcls2025_hh_cmp', 'round',
   'แบบสอบถามครัวเรือน HH', 'ready', 20, 'seed', 'seed')
ON DUPLICATE KEY UPDATE
  questionnaire_name = VALUES(questionnaire_name),
  table_preface = VALUES(table_preface),
  sample_ids_sql = VALUES(sample_ids_sql),
  search_column = VALUES(search_column),
  search_id1_start = VALUES(search_id1_start),
  search_id1_length = VALUES(search_id1_length),
  search_id2_start = VALUES(search_id2_start),
  search_id2_length = VALUES(search_id2_length),
  search_id2_mode = VALUES(search_id2_mode),
  raw_database = VALUES(raw_database),
  compare_database = VALUES(compare_database),
  round_field = VALUES(round_field),
  description = VALUES(description),
  status = VALUES(status),
  display_order = VALUES(display_order),
  updated_by = VALUES(updated_by);

INSERT INTO project_tables
  (database_id, table_name, display_name, primary_keys_json,
   allow_compare, display_order, created_by, updated_by)
SELECT database_id, 'preface_ch', 'preface_ch', JSON_ARRAY('CID', 'member_id'), 1, 10, 'seed', 'seed'
FROM project_databases
WHERE project_code = 'tcls2025' AND database_code = 'tcls2025_ch1'
ON DUPLICATE KEY UPDATE
  display_name = VALUES(display_name),
  primary_keys_json = VALUES(primary_keys_json),
  allow_compare = VALUES(allow_compare),
  display_order = VALUES(display_order),
  updated_by = VALUES(updated_by);

INSERT INTO project_table_hidden_columns
  (table_id, column_name, hidden_reason, created_by, updated_by)
SELECT table_id, 'recp', 'system field', 'seed', 'seed'
FROM project_tables
WHERE table_name = 'preface_ch'
ON DUPLICATE KEY UPDATE
  hidden_reason = VALUES(hidden_reason),
  updated_by = VALUES(updated_by);

INSERT INTO project_table_hidden_columns
  (table_id, column_name, hidden_reason, created_by, updated_by)
SELECT table_id, 'recpdate', 'system field', 'seed', 'seed'
FROM project_tables
WHERE table_name = 'preface_ch'
ON DUPLICATE KEY UPDATE
  hidden_reason = VALUES(hidden_reason),
  updated_by = VALUES(updated_by);
