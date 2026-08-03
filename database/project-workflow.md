# Survey Compare Project Workflow

ฐานกลาง: `_riped_survey_compare`

แนวคิดหลักคือแยก 4 ชั้นให้เป็นอิสระ:

1. `projects`
   เก็บโปรเจคใหญ่/ระบบคีย์ที่แสดงในหน้า `/list` เช่น `tcls2025`

2. `project_databases`
   เก็บชุดฐานข้อมูลของแต่ละโปรเจค หนึ่งโปรเจคมีหลายฐานได้ เช่น CH1, HH, School

3. `project_tables`
   เก็บตารางที่เปิดให้ compare ในแต่ละฐาน พร้อม primary key

4. `project_table_hidden_columns`
   เก็บเฉพาะตัวแปรที่ซ่อน เช่น `recp`

## ขั้นตอนเพิ่มโปรเจคใหม่

### 1. เพิ่มโปรเจคใหญ่

```http
POST /api/manage/admin-projects.php
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "project_code": "cct2025-key",
  "project_name": "CCT2025 KEY",
  "keyin_url": "https://ripedresearch.org/survey/cct2025-key",
  "compare_url": "/compare-data/?project=cct2025-key",
  "status": "preparing",
  "keyin_active": true,
  "compare_ready": false,
  "is_visible": true,
  "display_order": 10
}
```

ขั้นนี้ทำให้ project แสดงบนหน้า list ได้ก่อน ยังไม่ต้องมีฐาน raw หรือ compare

### 2. เพิ่มฐานข้อมูลย่อย

```http
POST /api/manage/admin-databases.php
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "project_code": "cct2025-key",
  "database_code": "cct2025_ch1",
  "questionnaire_name": "แบบสอบถามเด็ก CH1",
  "raw_database": "cct2025_ch1",
  "compare_database": "cct2025_ch1_cmp",
  "sample_ids_sql": "SELECT 'cct2025-key' AS project_code, 'cct2025_ch1' AS database_code, CID AS id FROM cct2025_ch1.table0 UNION SELECT 'cct2025-key', 'cct2025_ch1', CONCAT(CID, member_id) FROM cct2025_ch1.table1",
  "search_column": "",
  "search_id1_start": 1,
  "search_id1_length": 12,
  "search_id2_start": 13,
  "search_id2_length": null,
  "search_id2_mode": "exact",
  "round_field": "round",
  "round1_value": "1",
  "round2_value": "2",
  "completed_round_value": "0",
  "compare_enabled": true,
  "status": "ready",
  "display_order": 10
}
```

ขั้นนี้เป็นแค่ config ยังไม่แก้ข้อมูล raw และยังไม่สร้างข้อมูล compare จนกว่า admin จะกด prepare

### Sample ID สำหรับหน้า Compare

หลังเลือกฐานข้อมูลแล้ว หน้า Compare จะเรียก API กลางตัวเดียวเพื่อดึงตัวอย่างรหัสจากฐานนั้น ถ้า `project_databases.sample_ids_sql` มีค่า ระบบจะใช้ SQL ที่ admin เขียนเอง โดย SQL ต้องคืนเฉพาะ `project_code`, `database_code`, `id`

```http
GET /api/sample-ids.php?project_code=cct2025-key&database_code=cct2025_ch1&search_id1=202501001001&limit=all
Authorization: Bearer <token>
```

Use `limit=all` for the Compare select options. Use a numeric `limit`, such as `limit=20`, only for short Postman/debug checks.

ถ้าไม่ส่ง `search_id2` ระบบค้นแบบ Prefix จาก `search_id1` เสมอ ถ้าส่ง `search_id2` ระบบจะรวม `search_id = search_id1 + search_id2` และใช้ mode จาก `project_databases.search_id2_mode`

ตัวอย่าง SQL ใน `sample_ids_sql`:

```sql
SELECT 'cct2025-key' AS project_code,
       'cct2025_ch1' AS database_code,
       CID AS id
FROM cct2025_ch1.table0
WHERE active_status = 'Y'
UNION
SELECT 'cct2025-key' AS project_code,
       'cct2025_ch1' AS database_code,
       CONCAT(CID, member_id) AS id
FROM cct2025_ch1.table1
WHERE round IN ('1', '2')
```

response ใน `data.samples` จะเป็นแถวที่มีเฉพาะ:

```json
[
  {
    "project_code": "cct2025-key",
    "database_code": "cct2025_ch1",
    "id": "202501001001H01",
    "search_id1": "202501001001",
    "search_id2": "H01"
  }
]
```

### Preview ขอบเขตก่อนสร้าง Task

```http
POST /api/compare-scope-preview.php
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "project_id": "cct2025_ch1",
  "search_id1": "202501001001",
  "search_id2": "H01"
}
```

API นี้จะค้นทุกตารางที่เปิด `allow_compare` ภายใต้ฐานที่เลือก แล้วคืน `data.preview.tables` แยกตามตารางเพื่อให้ผู้ใช้เลือกตารางก่อนกด Next

### 3. เลือกตารางที่ compare ได้

```http
GET /api/manage/admin-tables.php?database_id=1
Authorization: Bearer <token>
```

จากนั้นบันทึกตาราง:

```http
POST /api/manage/admin-tables.php
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "database_id": 1,
  "table_name": "preface_ch",
  "display_name": "preface_ch",
  "allow_compare": true,
  "primary_keys": ["CID", "member_id"],
  "display_order": 10
}
```

### 4. ซ่อนตัวแปรเฉพาะที่ต้องการ

```http
POST /api/manage/admin-columns.php
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "table_id": 1,
  "hidden_columns": ["recp"]
}
```

ระบบไม่เก็บ column ทุกตัวลงฐานกลาง เพราะ raw schema อาจเปลี่ยนบ่อย ให้ scan สดจาก `INFORMATION_SCHEMA` แล้ว merge เฉพาะรายการที่ซ่อน

### 5. เตรียมฐาน compare

```http
POST /api/manage/admin-prepare.php
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "database_id": 1,
  "confirm": true
}
```

ขั้นนี้สร้าง/ตรวจฐาน compare และ `chk_user` ตาม workflow เดิม แต่ไม่แก้ raw database

## สรุปจำนวนจุดที่ต้องเพิ่ม

ถ้าแค่ให้ขึ้นหน้า list: เพิ่ม `projects` จุดเดียว

ถ้าจะให้ compare ใช้งานได้จริง:

1. `projects`
2. `project_databases`
3. `project_tables`
4. `project_table_hidden_columns` เฉพาะกรณีมีตัวแปรที่ต้องซ่อน
