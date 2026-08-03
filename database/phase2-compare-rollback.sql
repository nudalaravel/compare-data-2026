-- Phase 2 Compare Data rollback
-- Database: _riped_survey_compare
--
-- Safety:
-- - This rollback is non-destructive.
-- - It does not drop Phase 2 tables.
-- - It does not delete or reset compare-complete records.
-- - It does not touch raw databases or *_cmp answer tables.
--
-- Effect:
-- - PHP will stop using cmp_compare_runs, cmp_compare_run_records,
--   and cmp_compare_field_logs when compare_phase2_enabled is false.
-- - Compare workflow remains available through chk_user and the existing
--   compare table data.

USE `_riped_survey_compare`;

CREATE TABLE IF NOT EXISTS survey_system_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value JSON NOT NULL,
  description VARCHAR(255) NULL,
  updated_by VARCHAR(100) NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO survey_system_settings (setting_key, setting_value, description, updated_by)
VALUES
  ('compare_phase2_enabled', 'false', 'Rollback flag: disable Phase 2 compare run/log tables without deleting data.', 'phase2-rollback')
ON DUPLICATE KEY UPDATE
  setting_value = VALUES(setting_value),
  description = VALUES(description),
  updated_by = VALUES(updated_by),
  updated_at = NOW();

-- DBA cleanup after a verified backup should be handled in a separate,
-- reviewed script. The first rollback intentionally preserves Phase 2 tables.
