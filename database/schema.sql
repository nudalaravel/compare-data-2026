-- Compare Data Online schema entry point
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
-- Current schema source of truth:
-- 1. database/admin-compare-migration.sql
--    Creates Administrator config tables:
--    projects, project_databases, project_tables,
--    project_table_hidden_columns, config_audit_logs.
-- 2. database/phase2-compare-migration.sql
--    Creates Compare run/report tables:
--    cmp_compare_runs, cmp_compare_run_records, cmp_compare_field_logs.
--
-- This file intentionally does not create old metadata/task tables.
-- Keep it as the short bootstrap file and run the two migration files above.

CREATE DATABASE IF NOT EXISTS `_riped_survey_compare`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `_riped_survey_compare`;

SELECT
  '_riped_survey_compare' AS database_name,
  'Run admin-compare-migration.sql then phase2-compare-migration.sql' AS next_step;
