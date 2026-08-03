-- Survey key/list compatibility schema
-- Database Server: Amazon RDS for MySQL
-- Source Server Type: MySQL
-- MySQL Version: 8.4.9
-- Source Server Version: 80409
-- Source Host: tsrs-test.c5oh51usgj2f.ap-southeast-1.rds.amazonaws.com:3306
-- Target Server Type: MySQL
-- Target Server Version: 80409
-- File Encoding: UTF-8 (65001)
-- Central Database: _riped_survey_compare
--
-- Current Administrator page uses:
-- projects, project_databases, project_tables,
-- project_table_hidden_columns, config_audit_logs.
--
-- This file keeps the older Survey List/settings tables available for
-- compatibility only. It does not link survey keys to compare database config.

CREATE DATABASE IF NOT EXISTS `_riped_survey_compare`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `_riped_survey_compare`;

-- survey_key_projects
-- Stores public key-in project cards for a standalone Survey List.
-- Current list.vue can be run from the newer projects table instead.
CREATE TABLE IF NOT EXISTS survey_key_projects (
  project_key VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255) NOT NULL,
  survey_url VARCHAR(500) NOT NULL,
  status_mode ENUM('preparing', 'ready', 'keyClosed', 'ended') NOT NULL DEFAULT 'preparing',
  status_text VARCHAR(255) NOT NULL,
  status_tone ENUM('ready', 'warning', 'ended') NOT NULL DEFAULT 'warning',
  summary TEXT NULL,
  keyin_active TINYINT(1) NOT NULL DEFAULT 1,
  compare_ready TINYINT(1) NOT NULL DEFAULT 0,
  project_ended TINYINT(1) NOT NULL DEFAULT 0,
  is_visible TINYINT(1) NOT NULL DEFAULT 1,
  display_order INT NOT NULL DEFAULT 0,
  created_by VARCHAR(100) NULL,
  updated_by VARCHAR(100) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_survey_key_projects_list (is_visible, display_order, title),
  INDEX idx_survey_key_projects_status (status_mode, keyin_active, compare_ready)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Compatibility: public Survey List project cards';

-- survey_key_project_audit_logs
-- Append-only audit trail for changes to survey_key_projects.
CREATE TABLE IF NOT EXISTS survey_key_project_audit_logs (
  audit_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_key VARCHAR(64) NOT NULL,
  action ENUM('create', 'update', 'status_change', 'delete') NOT NULL,
  before_json JSON NULL,
  after_json JSON NULL,
  username VARCHAR(100) NOT NULL,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(255) NULL,
  changed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_survey_key_audit_project_time (project_key, changed_at),
  INDEX idx_survey_key_audit_user_time (username, changed_at),
  CONSTRAINT fk_survey_key_audit_project
    FOREIGN KEY (project_key) REFERENCES survey_key_projects(project_key)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Compatibility: Survey List project audit log';

-- survey_system_settings
-- Shared key-value settings for list/admin behavior.
CREATE TABLE IF NOT EXISTS survey_system_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value JSON NOT NULL,
  description VARCHAR(255) NULL,
  updated_by VARCHAR(100) NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Shared JSON settings';

INSERT INTO survey_key_projects
  (project_key, title, subtitle, survey_url,
   status_mode, status_text, status_tone, summary, keyin_active, compare_ready,
   project_ended, is_visible, display_order, created_by, updated_by)
VALUES
  ('tcls2026', 'TCLS2026', 'TCLS2026', 'https://ripedresearch.org/survey/tcls2026',
   'preparing', 'กำลังเตรียม Compare', 'warning',
   'เปิดใช้งานแล้ว รอ Admin ตรวจ schema และ allowlist ตาราง', 1, 0, 0, 1, 10, 'seed', 'seed'),
  ('tcls_sc2023', 'TCLS_SC2023', 'TCLS_SC2023', 'https://ripedresearch.org/survey/tcls_sc2023',
   'ended', 'จบโครงการ', 'ended',
   'จบโครงการแล้ว ปิดรับการคีย์และเปรียบเทียบข้อมูล', 0, 0, 1, 1, 30, 'seed', 'seed')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  subtitle = VALUES(subtitle),
  survey_url = VALUES(survey_url),
  status_mode = VALUES(status_mode),
  status_text = VALUES(status_text),
  status_tone = VALUES(status_tone),
  summary = VALUES(summary),
  keyin_active = VALUES(keyin_active),
  compare_ready = VALUES(compare_ready),
  project_ended = VALUES(project_ended),
  is_visible = VALUES(is_visible),
  display_order = VALUES(display_order),
  updated_by = VALUES(updated_by),
  updated_at = NOW();

INSERT INTO survey_system_settings (setting_key, setting_value, description, updated_by)
VALUES
  ('survey_base_url', JSON_QUOTE('https://ripedresearch.org/survey'), 'Base URL for key-in systems', 'seed'),
  ('spa_url', JSON_QUOTE('https://ripedresearch.org/spa'), 'Project administrator system URL', 'seed'),
  ('admin_usernames', JSON_ARRAY('admin', 'nuda', 'tuannurlaila.riped'), 'Allowed list-page administrators', 'seed')
ON DUPLICATE KEY UPDATE
  setting_value = VALUES(setting_value),
  description = VALUES(description),
  updated_by = VALUES(updated_by),
  updated_at = NOW();
