-- Administrator configuration migration for Survey Key-in and Compare
-- Database: _riped_survey_compare
-- Target: MySQL 8.4.x / MySQL 80409 compatible
-- Safety: non-destructive migration. This file does not create, alter, drop,
-- or write any table whose name starts with cmp_.

CREATE DATABASE IF NOT EXISTS `_riped_survey_compare`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `_riped_survey_compare`;

-- ตาราง projects
-- หน้าที่: เก็บรายการระบบคีย์หรือโครงการระดับบน เช่น TCLS2027 พร้อม URL, ระยะเวลา,
-- สถานะการเปิดใช้งาน และสถานะความพร้อมของ Compare ที่หน้า Survey List ใช้แสดงผล
CREATE TABLE IF NOT EXISTS projects (
  project_code VARCHAR(64) NOT NULL COMMENT 'รหัสโครงการ เช่น tcls2027',
  project_name VARCHAR(255) NOT NULL COMMENT 'ชื่อโครงการที่แสดงบนหน้า list',
  keyin_url VARCHAR(500) NULL COMMENT 'URL เว็บคีย์ข้อมูล',
  compare_url VARCHAR(500) NULL COMMENT 'URL หน้า compare data เช่น /compare-data/?project=tcls2027',
  description TEXT NULL COMMENT 'รายละเอียดหรือหมายเหตุของโครงการ',
  start_date DATE NULL COMMENT 'วันที่เริ่มเปิดใช้งาน',
  end_date DATE NULL COMMENT 'วันที่สิ้นสุดหรือปิดโครงการ',
  status ENUM('draft','preparing','active','ready','key_closed','ended') NOT NULL DEFAULT 'draft' COMMENT 'สถานะรวมของโครงการ',
  keyin_active TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1 = เปิดให้คีย์ข้อมูล',
  compare_ready TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1 = เปิดปุ่ม compare data',
  is_visible TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1 = แสดงบนหน้า list สาธารณะ',
  display_order INT NOT NULL DEFAULT 0 COMMENT 'ลำดับการแสดงผล',
  created_by VARCHAR(100) NULL COMMENT 'ผู้สร้าง config',
  updated_by VARCHAR(100) NULL COMMENT 'ผู้แก้ไขล่าสุด',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (project_code),
  INDEX idx_projects_visible_order (is_visible, display_order, project_code),
  INDEX idx_projects_status (status, keyin_active, compare_ready)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Administrator config: project/key-in systems shown on list page';

-- ตาราง project_databases
-- หน้าที่: เก็บชุดฐานข้อมูลหรือแบบสอบถามย่อยของแต่ละโครงการ
-- 1 โครงการมีได้หลายฐาน raw และหลายฐาน compare โดยการเพิ่ม config จะยังไม่สร้างฐาน _cmp ทันที
CREATE TABLE IF NOT EXISTS project_databases (
  database_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  project_code VARCHAR(64) NOT NULL COMMENT 'อ้างอิง projects.project_code',
  database_code VARCHAR(128) NOT NULL COMMENT 'รหัสชุดแบบสอบถาม เช่น tcls2027_ch',
  questionnaire_name VARCHAR(255) NULL COMMENT 'ชื่อแบบสอบถาม ถ้ามี เช่น แบบสอบถามเด็ก CH1',
  sample_ids_sql LONGTEXT NULL COMMENT 'SQL สำหรับดึงตัวอย่างรหัส ต้องคืน project_code, database_code, id',
  search_column VARCHAR(128) NULL COMMENT 'Column used for Compare search scope. If empty, primary-key concat is used.',
  search_id1_start INT NOT NULL DEFAULT 1 COMMENT '1-based SUBSTRING start for searchId1',
  search_id1_length INT NOT NULL DEFAULT 12 COMMENT 'SUBSTRING length for searchId1',
  search_id2_start INT NOT NULL DEFAULT 13 COMMENT '1-based SUBSTRING start for searchId2; should be after searchId1 end',
  search_id2_length INT NULL COMMENT 'SUBSTRING length for searchId2. NULL means to the end of the id.',
  search_id2_mode ENUM('exact','prefix') NOT NULL DEFAULT 'exact' COMMENT 'Search mode when searchId2 is filled',
  raw_database VARCHAR(128) NOT NULL COMMENT 'ฐานข้อมูลต้นทางสำหรับ scan ตาราง',
  compare_database VARCHAR(128) NOT NULL COMMENT 'ฐานข้อมูล compare ที่จะสร้างเมื่อ Admin ยืนยัน',
  round_field VARCHAR(64) NOT NULL DEFAULT 'round' COMMENT 'ชื่อ field สำหรับรอบข้อมูล',
  description TEXT NULL COMMENT 'รายละเอียดชุดฐานข้อมูล',
  status ENUM('draft','ready','prepared','disabled') NOT NULL DEFAULT 'draft' COMMENT 'สถานะ config ของฐานนี้',
  is_prepared TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1 = Admin กดเตรียมระบบ Compare แล้ว',
  prepared_at DATETIME NULL COMMENT 'เวลาที่เตรียมระบบ Compare',
  display_order INT NOT NULL DEFAULT 0,
  created_by VARCHAR(100) NULL,
  updated_by VARCHAR(100) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (database_id),
  UNIQUE KEY uq_project_databases_code (project_code, database_code),
  UNIQUE KEY uq_project_databases_pair (project_code, raw_database, compare_database),
  INDEX idx_project_databases_project (project_code, display_order, database_code),
  CONSTRAINT fk_project_databases_project
    FOREIGN KEY (project_code) REFERENCES projects(project_code)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Administrator config: raw/compare database sets per project';

DROP PROCEDURE IF EXISTS add_admin_config_column;
DELIMITER //
CREATE PROCEDURE add_admin_config_column(
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
    SET @admin_config_sql = CONCAT(
      'ALTER TABLE `', REPLACE(DATABASE(), '`', '``'), '`.`',
      REPLACE(p_table_name, '`', '``'), '` ADD COLUMN `',
      REPLACE(p_column_name, '`', '``'), '` ', p_definition
    );
    PREPARE admin_config_stmt FROM @admin_config_sql;
    EXECUTE admin_config_stmt;
    DEALLOCATE PREPARE admin_config_stmt;
  END IF;
END//
DELIMITER ;

CALL add_admin_config_column('project_databases', 'questionnaire_name', 'VARCHAR(255) NULL COMMENT ''ชื่อแบบสอบถาม ถ้ามี เช่น แบบสอบถามเด็ก CH1'' AFTER database_code');
CALL add_admin_config_column('project_databases', 'sample_ids_sql', 'LONGTEXT NULL COMMENT ''SQL สำหรับดึงตัวอย่างรหัส ต้องคืน project_code, database_code, id'' AFTER questionnaire_name');
CALL add_admin_config_column('project_databases', 'search_column', 'VARCHAR(128) NULL COMMENT ''Column used for Compare search scope. If empty, primary-key concat is used.'' AFTER sample_ids_sql');
CALL add_admin_config_column('project_databases', 'search_id1_start', 'INT NOT NULL DEFAULT 1 COMMENT ''1-based SUBSTRING start for searchId1'' AFTER search_column');
CALL add_admin_config_column('project_databases', 'search_id1_length', 'INT NOT NULL DEFAULT 12 COMMENT ''SUBSTRING length for searchId1'' AFTER search_id1_start');
CALL add_admin_config_column('project_databases', 'search_id2_start', 'INT NOT NULL DEFAULT 13 COMMENT ''1-based SUBSTRING start for searchId2; should be after searchId1 end'' AFTER search_id1_length');
CALL add_admin_config_column('project_databases', 'search_id2_length', 'INT NULL COMMENT ''SUBSTRING length for searchId2. NULL means to the end of the id.'' AFTER search_id2_start');
CALL add_admin_config_column('project_databases', 'search_id2_mode', 'ENUM(''exact'',''prefix'') NOT NULL DEFAULT ''exact'' COMMENT ''Search mode when searchId2 is filled'' AFTER search_id2_length');

DROP PROCEDURE IF EXISTS add_admin_config_column;

-- ตาราง project_tables
-- หน้าที่: เก็บรายการตารางที่ scan ได้หรือเลือกเปิด Compare ในแต่ละฐานข้อมูล
-- รองรับ primary key แบบหลาย field ผ่าน JSON โดยไม่แก้ metadata ของระบบ Compare เดิม
CREATE TABLE IF NOT EXISTS project_tables (
  table_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  database_id BIGINT UNSIGNED NOT NULL COMMENT 'อ้างอิง project_databases.database_id',
  table_name VARCHAR(128) NOT NULL COMMENT 'ชื่อตารางในฐาน raw_database',
  display_name VARCHAR(255) NULL COMMENT 'ชื่อที่ต้องการแสดงในหน้า admin/compare',
  primary_keys_json JSON NULL COMMENT 'รายการ primary key ที่ Admin ยืนยัน เช่น ["CID","MemberID"]',
  allow_compare TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1 = เปิดให้ใช้ตารางนี้ในระบบ Compare',
  display_order INT NOT NULL DEFAULT 0,
  created_by VARCHAR(100) NULL,
  updated_by VARCHAR(100) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (table_id),
  UNIQUE KEY uq_project_tables_name (database_id, table_name),
  INDEX idx_project_tables_allowed (database_id, allow_compare, display_order),
  CONSTRAINT fk_project_tables_database
    FOREIGN KEY (database_id) REFERENCES project_databases(database_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Administrator config: table allowlist and primary key settings';

-- ตาราง project_table_hidden_columns
-- หน้าที่: เก็บเฉพาะตัวแปรที่ Admin ต้องการซ่อนในแต่ละตารางเท่านั้น
-- ตัวแปรอื่นๆ จะไม่ถูกบันทึกลงฐานกลาง แต่จะ scan สดจาก INFORMATION_SCHEMA ทุกครั้ง
CREATE TABLE IF NOT EXISTS project_table_hidden_columns (
  hidden_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  table_id BIGINT UNSIGNED NOT NULL COMMENT 'อ้างอิง project_tables.table_id',
  column_name VARCHAR(128) NOT NULL COMMENT 'ชื่อตัวแปรในตาราง raw ที่ต้องการซ่อน',
  hidden_reason VARCHAR(255) NULL COMMENT 'เหตุผลหรือหมายเหตุ เช่น system field, recp',
  created_by VARCHAR(100) NULL,
  updated_by VARCHAR(100) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (hidden_id),
  UNIQUE KEY uq_project_table_hidden_columns_name (table_id, column_name),
  INDEX idx_project_table_hidden_columns_table (table_id, column_name),
  CONSTRAINT fk_project_table_hidden_columns_table
    FOREIGN KEY (table_id) REFERENCES project_tables(table_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Administrator config: sparse hidden-column overrides only';

-- ย้ายค่าเดิมแบบปลอดภัย: ถ้ามี project_table_columns จาก migration เก่า
-- ให้ copy เฉพาะแถวที่ visible = 0 มาเป็นรายการซ่อนใน table ใหม่
DROP PROCEDURE IF EXISTS migrate_admin_hidden_columns_from_legacy;
DELIMITER //
CREATE PROCEDURE migrate_admin_hidden_columns_from_legacy()
BEGIN
  IF EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'project_table_columns'
  ) THEN
    SET @migration_sql = '
      INSERT INTO project_table_hidden_columns
        (table_id, column_name, hidden_reason, created_by, updated_by)
      SELECT table_id,
             column_name,
             CASE WHEN is_system_column = 1 THEN ''legacy system column'' ELSE ''legacy hidden column'' END,
             COALESCE(created_by, ''migration''),
             COALESCE(updated_by, ''migration'')
      FROM project_table_columns
      WHERE visible = 0
      ON DUPLICATE KEY UPDATE
        hidden_reason = VALUES(hidden_reason),
        updated_by = VALUES(updated_by)';
    PREPARE migration_stmt FROM @migration_sql;
    EXECUTE migration_stmt;
    DEALLOCATE PREPARE migration_stmt;
  END IF;
END//
DELIMITER ;
CALL migrate_admin_hidden_columns_from_legacy();
DROP PROCEDURE IF EXISTS migrate_admin_hidden_columns_from_legacy;

-- ตาราง config_audit_logs
-- หน้าที่: เก็บประวัติการเพิ่ม/แก้ไข config ของ Administrator แบบ append-only
-- ตารางนี้อยู่ในฐานกลาง ไม่ใช่ chk_user; ส่วน chk_user ยังคงอยู่ในฐาน *_cmp ตาม logic เดิม
CREATE TABLE IF NOT EXISTS config_audit_logs (
  log_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  entity_type VARCHAR(64) NOT NULL COMMENT 'ชนิดข้อมูล เช่น project, database, table, column, prepare',
  entity_id VARCHAR(128) NOT NULL COMMENT 'รหัสอ้างอิงของข้อมูลที่ถูกแก้',
  action VARCHAR(32) NOT NULL COMMENT 'create, update, save, prepare',
  before_json JSON NULL COMMENT 'ค่าเดิมก่อนแก้ไข',
  after_json JSON NULL COMMENT 'ค่าใหม่หลังแก้ไข',
  username VARCHAR(100) NOT NULL COMMENT 'Admin ผู้ดำเนินการ',
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (log_id),
  INDEX idx_config_audit_entity (entity_type, entity_id, created_at),
  INDEX idx_config_audit_user (username, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Append-only Administrator config audit log';
