-- Phase 2 Compare Data migration
-- Database: _riped_survey_compare
-- Target: MySQL 8.4.x / Source Server Version 80409
--
-- Safety rules:
-- - Run database/admin-compare-migration.sql first.
-- - Run this on staging first. Do not run directly on production.
-- - This migration does not write to raw databases.
-- - This migration does not update any *_cmp answer table.
-- - This migration does not drop existing tables.
-- - Existing Compare Complete rows are not reset.

CREATE DATABASE IF NOT EXISTS `_riped_survey_compare`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `_riped_survey_compare`;

CREATE TABLE IF NOT EXISTS survey_system_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value JSON NOT NULL,
  description VARCHAR(255) NULL,
  updated_by VARCHAR(100) NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Enable/disable switch used by PHP. Rollback sets this flag to false.
INSERT INTO survey_system_settings (setting_key, setting_value, description, updated_by)
VALUES
  ('compare_phase2_enabled', 'true', 'Enable Phase 2 compare run/log tables. Set false to skip central run tracking.', 'phase2-migration')
ON DUPLICATE KEY UPDATE
  setting_value = VALUES(setting_value),
  description = VALUES(description),
  updated_by = VALUES(updated_by),
  updated_at = NOW();

-- Add Phase 2 fields to Administrator database/table config.
DROP PROCEDURE IF EXISTS add_phase2_compare_column;
DELIMITER //
CREATE PROCEDURE add_phase2_compare_column(
  IN p_table_name VARCHAR(64),
  IN p_column_name VARCHAR(64),
  IN p_definition TEXT
)
BEGIN
  IF EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = p_table_name
  ) AND NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = p_table_name
      AND COLUMN_NAME = p_column_name
  ) THEN
    SET @phase2_sql = CONCAT(
      'ALTER TABLE `', REPLACE(DATABASE(), '`', '``'), '`.`',
      REPLACE(p_table_name, '`', '``'), '` ADD COLUMN `',
      REPLACE(p_column_name, '`', '``'), '` ', p_definition
    );
    PREPARE phase2_stmt FROM @phase2_sql;
    EXECUTE phase2_stmt;
    DEALLOCATE PREPARE phase2_stmt;
  END IF;
END//
DELIMITER ;

CALL add_phase2_compare_column('project_databases', 'round1_value', 'VARCHAR(32) NOT NULL DEFAULT ''1'' COMMENT ''Round 1 value used by Compare Data''');
CALL add_phase2_compare_column('project_databases', 'round2_value', 'VARCHAR(32) NOT NULL DEFAULT ''2'' COMMENT ''Round 2 value used by Compare Data''');
CALL add_phase2_compare_column('project_databases', 'completed_round_value', 'VARCHAR(32) NOT NULL DEFAULT ''0'' COMMENT ''Value written to the compare table after completion''');
CALL add_phase2_compare_column('project_databases', 'compare_enabled', 'TINYINT(1) NOT NULL DEFAULT 1 COMMENT ''1 = this database can be used by Compare Data''');
CALL add_phase2_compare_column('project_tables', 'record_id_columns_json', 'JSON NULL COMMENT ''Optional columns used to display/search record IDs''');
CALL add_phase2_compare_column('project_tables', 'status', 'ENUM(''draft'',''ready'',''disabled'') NOT NULL DEFAULT ''ready'' COMMENT ''Table config status for Compare Data''');

DROP PROCEDURE IF EXISTS add_phase2_compare_column;

-- cmp_compare_runs
-- Stores one compare run started from a search id/prefix.
-- It points to the current Administrator config through project_code/database_id/database_code.
CREATE TABLE IF NOT EXISTS cmp_compare_runs (
  run_id VARCHAR(64) NOT NULL,
  project_code VARCHAR(64) NULL COMMENT 'Top-level project code from projects.project_code',
  database_id BIGINT UNSIGNED NULL COMMENT 'project_databases.database_id',
  database_code VARCHAR(128) NULL COMMENT 'Questionnaire/database code from project_databases.database_code',
  raw_database VARCHAR(128) NOT NULL COMMENT 'Source raw database name; read-only for Compare',
  cmp_database VARCHAR(128) NOT NULL COMMENT 'Compare result database name',
  table_name VARCHAR(128) NOT NULL,
  search_mode ENUM('exact','prefix') NOT NULL,
  search_id VARCHAR(255) NOT NULL,
  primary_keys_json JSON NOT NULL,
  round_field VARCHAR(64) NOT NULL DEFAULT 'round',
  round1_value VARCHAR(32) NOT NULL DEFAULT '1',
  round2_value VARCHAR(32) NOT NULL DEFAULT '2',
  completed_round_value VARCHAR(32) NOT NULL DEFAULT '0',
  status ENUM('pending','in_progress','complete','error') NOT NULL DEFAULT 'pending',
  total_records INT NOT NULL DEFAULT 0,
  completed_records INT NOT NULL DEFAULT 0,
  assigned_to VARCHAR(100) NOT NULL,
  started_at DATETIME NULL,
  completed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (run_id),
  INDEX idx_cmp_compare_runs_database (database_id, table_name, status),
  INDEX idx_cmp_compare_runs_user (assigned_to, status, created_at),
  INDEX idx_cmp_compare_runs_project (project_code, database_code, table_name),
  CONSTRAINT fk_cmp_compare_runs_database
    FOREIGN KEY (database_id) REFERENCES project_databases(database_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Phase 2: compare run header. Keeps workflow state only; answer data stays in *_cmp tables.';

-- cmp_compare_run_records
-- Stores per-record progress inside a compare run.
-- This does not replace chk_user. chk_user remains the insert-only field correction log in each *_cmp database.
CREATE TABLE IF NOT EXISTS cmp_compare_run_records (
  run_record_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  run_id VARCHAR(64) NOT NULL,
  primary_key_json JSON NOT NULL,
  compare_key VARCHAR(255) NOT NULL,
  status ENUM('pending','in_progress','complete','error') NOT NULL DEFAULT 'pending',
  locked_by VARCHAR(100) NULL,
  locked_at DATETIME NULL,
  completed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (run_record_id),
  UNIQUE KEY uq_cmp_compare_run_records_key (run_id, compare_key),
  INDEX idx_cmp_compare_run_records_status (run_id, status),
  CONSTRAINT fk_cmp_compare_run_records_run
    FOREIGN KEY (run_id) REFERENCES cmp_compare_runs(run_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Phase 2: per-record compare progress within a run.';

-- cmp_compare_field_logs
-- Central append-only field correction log for cross-database reports.
-- API still inserts the original row into {compare_database}.chk_user on every save.
CREATE TABLE IF NOT EXISTS cmp_compare_field_logs (
  log_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  source_hash CHAR(64) NULL COMMENT 'Used by chk_user imports to prevent duplicate rows',
  run_id VARCHAR(64) NULL,
  run_record_id BIGINT UNSIGNED NULL,
  project_code VARCHAR(64) NULL,
  database_code VARCHAR(128) NULL,
  table_name VARCHAR(128) NOT NULL,
  compare_key VARCHAR(255) NOT NULL,
  primary_key_json JSON NULL,
  column_name VARCHAR(128) NOT NULL,
  round1_value TEXT NULL,
  round2_value TEXT NULL,
  selected_value TEXT NULL,
  selected_source ENUM('round1','round2','custom','chk_user') NOT NULL DEFAULT 'custom',
  edited_by VARCHAR(100) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (log_id),
  UNIQUE KEY uq_cmp_compare_field_logs_source (source_hash),
  INDEX idx_cmp_compare_field_logs_run (run_id, run_record_id),
  INDEX idx_cmp_compare_field_logs_lookup (project_code, database_code, table_name, compare_key),
  INDEX idx_cmp_compare_field_logs_user (edited_by, created_at),
  CONSTRAINT fk_cmp_compare_field_logs_run
    FOREIGN KEY (run_id) REFERENCES cmp_compare_runs(run_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  CONSTRAINT fk_cmp_compare_field_logs_record
    FOREIGN KEY (run_record_id) REFERENCES cmp_compare_run_records(run_record_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Phase 2: central append-only field correction log. Does not replace *_cmp.chk_user.';

-- Import existing chk_user rows into the central field-log table.
-- Source databases come from project_databases in the current Administrator config.
-- This reads *_cmp.chk_user and writes only to _riped_survey_compare.
DROP PROCEDURE IF EXISTS migrate_phase2_chk_user_logs;
DELIMITER //
CREATE PROCEDURE migrate_phase2_chk_user_logs()
BEGIN
  DECLARE done INT DEFAULT 0;
  DECLARE v_project_code VARCHAR(64);
  DECLARE v_database_code VARCHAR(128);
  DECLARE v_cmp_database VARCHAR(128);
  DECLARE chk_cursor CURSOR FOR
    SELECT project_code, database_code, compare_database
    FROM phase2_chk_user_sources
    WHERE compare_database IS NOT NULL AND compare_database <> '';
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  DROP TEMPORARY TABLE IF EXISTS phase2_chk_user_sources;
  CREATE TEMPORARY TABLE phase2_chk_user_sources (
    project_code VARCHAR(64) NOT NULL,
    database_code VARCHAR(128) NOT NULL,
    compare_database VARCHAR(128) NOT NULL
  ) ENGINE=Memory;

  INSERT INTO phase2_chk_user_sources
    (project_code, database_code, compare_database)
  SELECT d.project_code, d.database_code, d.compare_database
  FROM project_databases d
  INNER JOIN projects p ON p.project_code = d.project_code
  WHERE d.compare_database IS NOT NULL
    AND d.compare_database <> ''
    AND d.status <> 'disabled';

  OPEN chk_cursor;
  chk_loop: LOOP
    FETCH chk_cursor INTO v_project_code, v_database_code, v_cmp_database;
    IF done = 1 THEN
      LEAVE chk_loop;
    END IF;

    IF EXISTS (
      SELECT 1
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = v_cmp_database
        AND TABLE_NAME = 'chk_user'
    ) THEN
      SET @hash_project_code = v_project_code;
      SET @hash_database_code = v_database_code;
      SET @hash_cmp_database = v_cmp_database;
      SET @project_code = v_project_code;
      SET @database_code = v_database_code;
      SET @safe_cmp_database = REPLACE(v_cmp_database, '`', '``');
      SET @chk_sql = CONCAT(
        'INSERT IGNORE INTO cmp_compare_field_logs ',
        '(source_hash, project_code, database_code, table_name, compare_key, ',
        'primary_key_json, column_name, round1_value, round2_value, selected_value, ',
        'selected_source, edited_by, created_at) ',
        'SELECT SHA2(CONCAT_WS(''|'', ?, ?, ?, COALESCE(`user`, ''''), COALESCE(tab, ''''), ',
        'COALESCE(hhid, ''''), COALESCE(CAST(`date` AS CHAR), ''''), COALESCE(CAST(`time` AS CHAR), ''''), ',
        'COALESCE(keyfields, ''''), COALESCE(val_r1, ''''), COALESCE(val_r2, ''''), COALESCE(val, '''')), 256), ',
        '?, ?, tab, hhid, JSON_OBJECT(''chk_user_hhid'', hhid), keyfields, val_r1, val_r2, val, ',
        '''chk_user'', `user`, TIMESTAMP(`date`, `time`) ',
        'FROM `', @safe_cmp_database, '`.`chk_user`'
      );
      PREPARE chk_stmt FROM @chk_sql;
      EXECUTE chk_stmt USING
        @hash_project_code,
        @hash_database_code,
        @hash_cmp_database,
        @project_code,
        @database_code;
      DEALLOCATE PREPARE chk_stmt;
    END IF;
  END LOOP;
  CLOSE chk_cursor;
  DROP TEMPORARY TABLE IF EXISTS phase2_chk_user_sources;
END//
DELIMITER ;

CALL migrate_phase2_chk_user_logs();
DROP PROCEDURE IF EXISTS migrate_phase2_chk_user_logs;
