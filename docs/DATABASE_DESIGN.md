# Database Design

ฐานกลางที่ใช้จริงคือ `_riped_survey_compare`

## Administrator Config

- `projects`: โปรเจคใหญ่หรือระบบคีย์ เช่น `tcls2025`, `cct2025-key`; ใช้แสดงหน้า `/list` และเก็บสถานะเปิดคีย์/พร้อม compare/จบโครงการ
- `project_databases`: ฐานข้อมูลย่อยของโปรเจคหนึ่งรายการ หนึ่งโปรเจคมีได้หลายชุดฐาน เช่น `tcls2025_ch1`, `tcls2025_hh`; เก็บ `questionnaire_name` ถ้ามี, `raw_database`, `compare_database`, `round_field`, ค่า round, สถานะ prepared, `sample_ids_sql` สำหรับกำหนด query sample id แบบ custom ต่อฐาน และ config แบ่งรหัสค้นหา `search_column`, `search_id1_start`, `search_id1_length`, `search_id2_start`, `search_id2_length`, `search_id2_mode`
- `project_tables`: ตารางที่ admin เปิดให้ compare ในแต่ละ `database_id`; เก็บชื่อ table, primary key แบบ JSON, สถานะ allow compare และลำดับแสดงผล
- `project_table_hidden_columns`: เก็บเฉพาะ column ที่ต้องการซ่อน เช่น `recp`; column อื่น scan จาก `INFORMATION_SCHEMA` ทุกครั้ง ไม่ต้องบันทึกลงฐานกลางทั้งหมด
- `config_audit_logs`: log แบบ append-only ของการเพิ่ม/แก้ project, database, table และ hidden columns
- `survey_system_settings`: setting แบบ key-value เช่น `compare_phase2_enabled`, URL กลาง และรายชื่อ admin

## Compare Run/Report

- `cmp_compare_runs`: header ของงาน compare หนึ่งครั้งจาก search id หรือ prefix
- `cmp_compare_run_records`: สถานะ record ย่อยใน run นั้น ใช้ track pending/complete ต่อ primary key
- `cmp_compare_field_logs`: log รวมส่วนกลางสำหรับรายงานข้ามหลายฐาน
- `{compare_database}.chk_user`: log เดิมในฐาน `_cmp` ของแต่ละชุดข้อมูล API ยัง insert ลงตารางนี้เหมือนเดิม

## ความสัมพันธ์หลัก

- `projects.project_code` เชื่อมกับ `project_databases.project_code`
- `project_databases.database_id` เชื่อมกับ `project_tables.database_id`
- `project_tables.table_id` เชื่อมกับ `project_table_hidden_columns.table_id`
- `cmp_compare_runs.database_id` เชื่อมกับ `project_databases.database_id`
- `cmp_compare_run_records.run_id` เชื่อมกับ `cmp_compare_runs.run_id`
- `cmp_compare_field_logs.run_id` และ `run_record_id` เชื่อมกับ run/record ถ้ามี

## หลักการสำคัญ

- Raw database เป็น read-only สำหรับระบบนี้
- Compare database (`*_cmp`) เป็นที่เก็บผลแก้ไขจริงและ `chk_user`
- ฐานกลางเก็บ metadata, workflow state และ report log เท่านั้น
- ซ่อน column แบบ sparse คือเก็บเฉพาะตัวที่ซ่อน ไม่เก็บทุกตัวแปร
