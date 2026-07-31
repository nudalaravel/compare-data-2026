# Compare Data Online

ระบบเปรียบเทียบข้อมูล Round 1 และ Round 2 สำหรับ Nuxt 3 + PHP API + MySQL โดยใช้ฐานกลาง `_riped_survey_compare` เป็น metadata/config กลาง

## โครงสร้างหลัก

- `pages/login.vue` หน้า login ผ่าน RIPED API และเก็บ localStorage key เดิม
- `pages/list.vue` หน้า Survey List แบบ public พร้อม modal สำหรับ Administrator
- `pages/index.vue` หน้า Compare Data เดิม อ่าน `project` จาก URL เช่น `/compare-data/?project=tcls2025`
- `api/` PHP REST API สำหรับ login, metadata, compare workflow, audit, และ admin config
- `database/admin-compare-migration.sql` schema สำหรับ Administrator config
- `database/phase2-compare-migration.sql` schema สำหรับ compare run/log ส่วนกลาง
- `database/manage-schema.sql` compatibility schema สำหรับ Survey List/settings เดิม
- `database/schema.sql` bootstrap สั้นสำหรับสร้างฐานกลางและชี้ migration ที่ต้องรัน

## Environment

ตั้งค่า base path จาก `.env` เพื่อให้อนาคตเปลี่ยนชื่อ `/compare-data/` ได้ง่าย:

```bash
NUXT_PUBLIC_APP_BASE_URL=/compare-data/
NUXT_PUBLIC_API_BASE=https://ripedresearch.org/compare-data/api
NUXT_PUBLIC_LOGIN_URL=https://ripedresearch.org/api/spaqnaire2025-api/login_merge.php
```

ฝั่ง PHP อ่าน `.env` จาก root โปรเจกต์หรือ parent directory ที่วาง API ไว้ และควรตั้งค่า:

```bash
CMP_CORE_DB=_riped_survey_compare
CMP_MANAGE_ADMIN_USERS=admin,nuda,tuannurlaila.riped
CMP_AUTH_ALLOW_UNVERIFIED_JWT=1
```

## Login

หน้า `/login` เรียก:

```text
https://ripedresearch.org/api/spaqnaire2025-api/login_merge.php
```

เมื่อสำเร็จจะเก็บ:

- `_token_tcls`
- `tcls-user`
- `datauser`

หน้าอื่นยกเว้น `/list` จะถูกบังคับ login เสมอถ้าไม่มี `_token_tcls`

## Current Database Model

ฐานกลางปัจจุบันใช้ตารางเหล่านี้:

- `projects`: โปรเจคใหญ่/ระบบคีย์ที่แสดงบนหน้า list
- `project_databases`: ชุดฐานข้อมูลย่อยของแต่ละโปรเจค เช่น ชื่อแบบสอบถาม, raw database, compare database, `sample_ids_sql` สำหรับ query รหัสแบบ custom และ config แบ่งรหัส `searchId1/searchId2`
- `project_tables`: ตารางที่เปิดให้ compare พร้อม primary key
- `project_table_hidden_columns`: เก็บเฉพาะตัวแปรที่ admin ต้องการซ่อน
- `config_audit_logs`: ประวัติการแก้ config ของ admin
- `survey_system_settings`: setting กลาง เช่น feature flag และ URL
- `cmp_compare_runs`: งาน compare ที่เริ่มจาก search id/prefix
- `cmp_compare_run_records`: สถานะราย record ในแต่ละ run
- `cmp_compare_field_logs`: log รวมส่วนกลางสำหรับรายงาน
- `{compare_database}.chk_user`: log เดิมแบบ insert-only อยู่ในฐาน `_cmp` ของแต่ละชุดข้อมูล

## SQL Order

สำหรับ local/staging ให้รันตามลำดับ:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/admin-compare-migration.sql
mysql -u root -p < database/phase2-compare-migration.sql
mysql -u root -p < database/phase2-compare-validation.sql
```

ไฟล์ mock ใช้เฉพาะ local/staging:

```bash
mysql -u root -p < database/mock-data.sql
mysql -u root -p < database/admin-compare-mock-data.sql
mysql -u root -p < database/phase2-compare-mock-data.sql
```

ห้ามรัน mock data กับ production

## Administrator Flow

1. เพิ่มโปรเจคใหญ่ใน `/list` แท็บ Projects หรือ `POST /api/manage/admin-projects.php`
2. เพิ่มฐานข้อมูลของโปรเจคในแท็บ Databases หรือ `POST /api/manage/admin-databases.php`
3. Scan/เปิดตารางที่ให้ compare ในแท็บ Tables หรือ `POST /api/manage/admin-tables.php`
4. ซ่อนเฉพาะตัวแปรที่ไม่ต้องแสดงในแท็บ Columns หรือ `POST /api/manage/admin-columns.php`
5. เตรียม compare database ผ่าน `POST /api/manage/admin-prepare.php` เมื่อพร้อม

## Compare Search Scope

- `sample-ids.php` คืน `id`, `search_id1`, `search_id2` โดยแบ่งตำแหน่งจาก `project_databases.search_id1_start`, `search_id1_length`, `search_id2_start`, `search_id2_length`
- ถ้าไม่กรอก `search_id2` ระบบค้นหาแบบ Prefix จาก `search_id1`
- ถ้ากรอก `search_id2` ระบบรวม `search_id = search_id1 + search_id2` แล้วใช้ mode จาก `project_databases.search_id2_mode`
- `compare-scope-preview.php` preview ทุกตารางที่เปิด `allow_compare` ในฐานที่เลือก และส่งผลแยกตามตารางก่อนสร้าง task

## Compare API

- `GET /api/projects.php`
- `GET /api/project-tables.php?project_id=...`
- `GET /api/sample-ids.php?project_id=...`
- `GET /api/sample-ids.php?project_code=...&database_code=...&search_id1=...&search_id2=...`
- `GET /api/table-schema.php?project_id=...&table_name=...`
- `POST /api/compare-scope-preview.php`
- `POST /api/compare-preview.php`
- `POST /api/compare-prepare.php`
- `GET /api/compare-record.php`
- `POST /api/compare-save.php`
- `POST /api/compare-complete.php`
- `GET /api/tasks.php`
- `GET /api/audit-logs.php`
- `GET /api/compare-runs.php`

Endpoint admin รุ่นเก่าบางไฟล์ถูกตั้งให้ตอบ `410 Deprecated` และให้ใช้ชุด `/api/manage/admin-*.php` แทน เพื่อไม่ให้ config ถูกเขียนคนละโครงสร้าง

## Safety

- ห้ามแก้ข้อมูลฐาน raw
- `compare-save.php` update เฉพาะฐาน `_cmp`
- `{compare_database}.chk_user` ยังเป็น append-only และถูกสร้างอัตโนมัติถ้ายังไม่มี
- การปิด Phase 2 ทำได้ด้วย `compare_phase2_enabled=false` ใน `survey_system_settings`
- การลบตารางหรือคอลัมน์ที่เคยมีใน production ต้องทำเป็น cleanup migration แยก หลัง backup และตรวจสอบแล้วเท่านั้น
# compare-data-2026
