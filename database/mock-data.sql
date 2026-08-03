-- Mock data for local/staging verification only
-- Run after:
-- 1. database/admin-compare-migration.sql
-- 2. database/phase2-compare-migration.sql
--
-- Do not run this file on production.

CREATE DATABASE IF NOT EXISTS `_riped_survey_compare`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `_riped_survey_compare`;

INSERT INTO projects
  (project_code, project_name, keyin_url, compare_url, description,
   status, keyin_active, compare_ready, is_visible, display_order, created_by, updated_by)
VALUES
  ('tcls2025', 'TCLS2025', 'https://ripedresearch.org/survey/tcls2025',
   '/compare-data/?project=tcls2025',
   'Mock project for Compare Data local/staging verification.',
   'ready', 1, 1, 1, 20, 'seed', 'seed')
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
  (project_code, database_code, questionnaire_name, sample_ids_sql,
   search_column, search_id1_start, search_id1_length, search_id2_start, search_id2_length, search_id2_mode,
   raw_database, compare_database, round_field,
   round1_value, round2_value, completed_round_value, compare_enabled,
   description, status, is_prepared, prepared_at, display_order, created_by, updated_by)
VALUES
  ('tcls2025', 'tcls2025_ch1', 'Children Baseline 2025 CH1', NULL,
   NULL, 1, 12, 13, NULL, 'exact',
   'tcls2025_ch1', 'tcls2025_ch1_cmp', 'round',
   '1', '2', '0', 1,
   'Children Baseline 2025 CH1', 'prepared', 1, NOW(), 10, 'seed', 'seed')
ON DUPLICATE KEY UPDATE
  questionnaire_name = VALUES(questionnaire_name),
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

SET @tcls2025_ch1_database_id = (
  SELECT database_id
  FROM project_databases
  WHERE project_code = 'tcls2025'
    AND database_code = 'tcls2025_ch1'
  LIMIT 1
);

INSERT INTO project_tables
  (database_id, table_name, display_name, primary_keys_json,
   record_id_columns_json, allow_compare, display_order, status, created_by, updated_by)
VALUES
  (@tcls2025_ch1_database_id, 'preface_ch', 'preface_ch',
   JSON_ARRAY('CID', 'member_id'),
   JSON_ARRAY('CID', 'member_id'),
   1, 10, 'ready', 'seed', 'seed'),
  (@tcls2025_ch1_database_id, 'b1', 'b1',
   JSON_ARRAY('CID'),
   JSON_ARRAY('CID'),
   1, 20, 'ready', 'seed', 'seed')
ON DUPLICATE KEY UPDATE
  display_name = VALUES(display_name),
  primary_keys_json = VALUES(primary_keys_json),
  record_id_columns_json = VALUES(record_id_columns_json),
  allow_compare = VALUES(allow_compare),
  display_order = VALUES(display_order),
  status = VALUES(status),
  updated_by = VALUES(updated_by),
  updated_at = NOW();

SET @preface_ch_table_id = (
  SELECT table_id
  FROM project_tables
  WHERE database_id = @tcls2025_ch1_database_id
    AND table_name = 'preface_ch'
  LIMIT 1
);

INSERT INTO project_table_hidden_columns
  (table_id, column_name, hidden_reason, created_by, updated_by)
VALUES
  (@preface_ch_table_id, 'recp', 'Hide interviewer/system field from Compare Data.', 'seed', 'seed')
ON DUPLICATE KEY UPDATE
  hidden_reason = VALUES(hidden_reason),
  updated_by = VALUES(updated_by),
  updated_at = NOW();

CREATE DATABASE IF NOT EXISTS `tcls2025_ch1`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS `tcls2025_ch1_cmp`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tcls2025_ch1`.`preface_ch` (
  CID VARCHAR(20) NOT NULL,
  member_id VARCHAR(12) NOT NULL,
  round TINYINT NOT NULL,
  fname_ch VARCHAR(100) NULL,
  lname_ch VARCHAR(100) NULL,
  nickname_ch VARCHAR(100) NULL,
  informant VARCHAR(100) NULL,
  tel VARCHAR(30) NULL,
  recp VARCHAR(100) NULL,
  PRIMARY KEY (CID, member_id, round),
  INDEX idx_preface_ch_round (round)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tcls2025_ch1`.`preface_ch`
  (CID, member_id, round, fname_ch, lname_ch, nickname_ch, informant, tel, recp)
VALUES
  ('202194100901', '001H05', 1, 'อัฟริน', 'มูรอแม็ง', 'อัฟริน', 'นี่', '08-1735-4272', 'A01'),
  ('202194100901', '001H05', 2, 'ณัฐฐารินทร์', 'วิชา', 'ณิชา', 'เมาะลิ', '09-3794-8264', 'B01'),
  ('202194100902', '001H02', 1, 'นูรีน', 'มะยูโซ๊ะ', 'นูรีน', 'มารดา', '08-0000-2222', 'A02'),
  ('202194100902', '001H02', 2, 'นูรีน', 'มะยูโซ๊ะ', 'นูรีน', 'มารดา', '08-0000-2222', 'B02')
ON DUPLICATE KEY UPDATE
  fname_ch = VALUES(fname_ch),
  lname_ch = VALUES(lname_ch),
  nickname_ch = VALUES(nickname_ch),
  informant = VALUES(informant),
  tel = VALUES(tel),
  recp = VALUES(recp);

CREATE TABLE IF NOT EXISTS `tcls2025_ch1`.`b1` (
  CID VARCHAR(20) NOT NULL,
  round TINYINT NOT NULL,
  school_name VARCHAR(150) NULL,
  grade VARCHAR(50) NULL,
  score INT NULL,
  survey_date DATE NULL,
  PRIMARY KEY (CID, round),
  INDEX idx_b1_round (round)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tcls2025_ch1`.`b1`
  (CID, round, school_name, grade, score, survey_date)
VALUES
  ('304460970101', 1, 'บ้านคลองใต้', 'อนุบาล 2', 8, '2026-03-13'),
  ('304460970101', 2, 'โรงเรียนบ้านคลองใต้', 'อนุบาล 2', 9, '2026-03-13'),
  ('304460970102', 1, 'บ้านคลองเหนือ', 'อนุบาล 3', 7, '2026-03-13'),
  ('304460970102', 2, 'บ้านคลองเหนือ', 'อนุบาล 3', 7, '2026-03-13')
ON DUPLICATE KEY UPDATE
  school_name = VALUES(school_name),
  grade = VALUES(grade),
  score = VALUES(score),
  survey_date = VALUES(survey_date);

CREATE TABLE IF NOT EXISTS `tcls2025_ch1_cmp`.`chk_user` (
  `user` VARCHAR(100) NOT NULL,
  tab VARCHAR(128) NOT NULL,
  hhid VARCHAR(255) NOT NULL,
  `date` DATE NOT NULL,
  `time` TIME NOT NULL,
  keyfields VARCHAR(128) NOT NULL,
  val_r1 TEXT NULL,
  val_r2 TEXT NULL,
  val TEXT NULL,
  INDEX idx_chk_user_hhid (hhid),
  INDEX idx_chk_user_tab_hhid (tab, hhid),
  INDEX idx_chk_user_user_datetime (`user`, `date`, `time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tcls2025_ch1_cmp`.`chk_user`
  (`user`, tab, hhid, `date`, `time`, keyfields, val_r1, val_r2, val)
VALUES
  ('nuda', 'preface_ch', '202194100901001H05', '2026-03-13', '13:25:00', 'fname_ch', 'อัฟริน', 'ณัฐฐารินทร์', 'ณัฐฐารินทร์');
