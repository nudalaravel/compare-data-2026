-- Phase 2 mock data for local/staging verification only
-- Database: _riped_survey_compare
--
-- This file writes only central config/demo rows.
-- It does not create, update, or delete raw databases or *_cmp answer tables.

USE `_riped_survey_compare`;

INSERT INTO projects
  (project_code, project_name, keyin_url, compare_url, description,
   status, keyin_active, compare_ready, is_visible, display_order, created_by, updated_by)
VALUES
  ('phase2demo', 'PHASE2 Demo', 'https://ripedresearch.org/survey/phase2demo',
   '/compare-data/?project=phase2demo',
   'Demo project for Phase 2 compare run/log API testing.',
   'ready', 1, 1, 1, 990, 'mock', 'mock')
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
  updated_by = VALUES(updated_by),
  updated_at = NOW();

INSERT INTO project_databases
  (project_code, database_code, questionnaire_name, table_preface, sample_ids_sql,
   search_column, search_id1_start, search_id1_length, search_id2_start, search_id2_length, search_id2_mode,
   raw_database, compare_database, round_field,
   round1_value, round2_value, completed_round_value, compare_enabled,
   description, status, is_prepared, prepared_at, display_order, created_by, updated_by)
VALUES
  ('phase2demo', 'phase2demo_ch', 'Phase 2 Demo Questionnaire', 'preface_ch', NULL,
   NULL, 1, 12, 13, NULL, 'exact',
   'phase2demo_ch', 'phase2demo_ch_cmp', 'round',
   '1', '2', '0', 1,
   'Demo child questionnaire database pair.', 'prepared', 1, NOW(), 10, 'mock', 'mock')
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
  round1_value = VALUES(round1_value),
  round2_value = VALUES(round2_value),
  completed_round_value = VALUES(completed_round_value),
  compare_enabled = VALUES(compare_enabled),
  description = VALUES(description),
  status = VALUES(status),
  is_prepared = VALUES(is_prepared),
  updated_by = VALUES(updated_by),
  updated_at = NOW();

SET @phase2_database_id = (
  SELECT database_id
  FROM project_databases
  WHERE project_code = 'phase2demo'
    AND database_code = 'phase2demo_ch'
  LIMIT 1
);

INSERT INTO project_tables
  (database_id, table_name, display_name, primary_keys_json,
   record_id_columns_json, allow_compare, display_order, status, created_by, updated_by)
VALUES
  (@phase2_database_id, 'preface_ch', 'preface_ch',
   JSON_ARRAY('CID', 'house', 'member'),
   JSON_ARRAY('CID', 'house', 'member'),
   1, 10, 'ready', 'mock', 'mock'),
  (@phase2_database_id, 'b1', 'b1',
   JSON_ARRAY('CID', 'house', 'member'),
   JSON_ARRAY('CID', 'house', 'member'),
   1, 20, 'ready', 'mock', 'mock')
ON DUPLICATE KEY UPDATE
  display_name = VALUES(display_name),
  primary_keys_json = VALUES(primary_keys_json),
  record_id_columns_json = VALUES(record_id_columns_json),
  allow_compare = VALUES(allow_compare),
  display_order = VALUES(display_order),
  status = VALUES(status),
  updated_by = VALUES(updated_by),
  updated_at = NOW();

SET @phase2_preface_table_id = (
  SELECT table_id
  FROM project_tables
  WHERE database_id = @phase2_database_id
    AND table_name = 'preface_ch'
  LIMIT 1
);

INSERT INTO project_table_hidden_columns
  (table_id, column_name, hidden_reason, created_by, updated_by)
VALUES
  (@phase2_preface_table_id, 'recp', 'Demo hidden field requested by admin.', 'mock', 'mock'),
  (@phase2_preface_table_id, 'recpdate', 'Demo hidden field requested by admin.', 'mock', 'mock')
ON DUPLICATE KEY UPDATE
  hidden_reason = VALUES(hidden_reason),
  updated_by = VALUES(updated_by),
  updated_at = NOW();

INSERT INTO cmp_compare_runs
  (run_id, project_code, database_id, database_code,
   raw_database, cmp_database, table_name, search_mode, search_id,
   primary_keys_json, round_field, round1_value, round2_value, completed_round_value,
   status, total_records, completed_records, assigned_to, started_at, completed_at)
VALUES
  ('run_mock_phase2_preface_001', 'phase2demo', @phase2_database_id, 'phase2demo_ch',
   'phase2demo_ch', 'phase2demo_ch_cmp', 'preface_ch', 'exact', '202600010001H01',
   JSON_ARRAY('CID', 'house', 'member'), 'round', '1', '2', '0',
   'complete', 1, 1, 'nuda', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  status = VALUES(status),
  total_records = VALUES(total_records),
  completed_records = VALUES(completed_records),
  completed_at = VALUES(completed_at),
  updated_at = NOW();

INSERT INTO cmp_compare_run_records
  (run_id, primary_key_json, compare_key, status, completed_at)
VALUES
  ('run_mock_phase2_preface_001',
   JSON_OBJECT('CID', '202600010001', 'house', 'H01', 'member', ''),
   '202600010001H01',
   'complete',
   NOW())
ON DUPLICATE KEY UPDATE
  status = VALUES(status),
  completed_at = VALUES(completed_at),
  updated_at = NOW();

SET @phase2_run_record_id = (
  SELECT run_record_id
  FROM cmp_compare_run_records
  WHERE run_id = 'run_mock_phase2_preface_001'
    AND compare_key = '202600010001H01'
  LIMIT 1
);

INSERT INTO cmp_compare_field_logs
  (source_hash, run_id, run_record_id, project_code, database_code,
   table_name, compare_key, primary_key_json, column_name,
   round1_value, round2_value, selected_value, selected_source, edited_by, created_at)
VALUES
  (SHA2('phase2demo|preface_ch|202600010001H01|fname_ch', 256),
   'run_mock_phase2_preface_001', @phase2_run_record_id, 'phase2demo', 'phase2demo_ch',
   'preface_ch', '202600010001H01',
   JSON_OBJECT('CID', '202600010001', 'house', 'H01', 'member', ''),
   'fname_ch', 'สมชาย', 'สมชัย', 'สมชัย', 'round2', 'nuda', NOW())
ON DUPLICATE KEY UPDATE
  selected_value = VALUES(selected_value),
  selected_source = VALUES(selected_source),
  edited_by = VALUES(edited_by);
