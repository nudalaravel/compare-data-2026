# งานพัฒนาระบบ Administrator สำหรับ Key-in และ Compare

## 1. เป้าหมาย

สร้างส่วน Administrator สำหรับจัดการโครงการ ฐานข้อมูล ตาราง และตัวแปรที่ใช้ในระบบ Key-in และ Compare

## 2. ระบบปัจจุบัน

- ระบบมีโครงสร้างเดิมอยู่แล้ว
- หน้าจัดการที่ทำไว้ปัจจุบันอยู่ใน `list.vue`
- สามารถปรับโครงสร้าง `list.vue` และแยก Component ได้
- ต้องรักษาการทำงานเดิมที่ใช้งานได้

## 3. ขอบเขตที่ห้ามแก้ไข

- ห้ามแก้หน้า Compare Data เดิม
- ห้ามแก้ Logic Compare เดิม
- ห้ามแก้ PHP API ของ Compare เดิมโดยไม่จำเป็น
- ห้ามแก้โครงสร้างตารางที่ขึ้นต้นด้วย `cmp_`
- ห้ามเพิ่ม ลบ หรือเปลี่ยนคอลัมน์ในตาราง `cmp_`
- ห้ามเปลี่ยน Primary Key หรือ Index ของตาราง `cmp_`
- ห้ามแก้ข้อมูลจริงในฐานข้อมูล Production
- ห้ามเปลี่ยน Logic `round = 0`

ถ้าจำเป็นต้องเชื่อมกับระบบ Compare เดิม ให้สร้าง Config Layer, Adapter หรือ PHP API ใหม่ครอบระบบเดิม

## 4. ฐานข้อมูลกลาง

ใช้ฐานข้อมูล:

`_riped_survey_compare`

ฐานนี้ใช้เก็บ Config ของระบบ Administrator ไม่ใช่ข้อมูล Compare จริง

ห้ามตั้งชื่อตาราง Config ใหม่ให้ขึ้นต้นด้วย `cmp_`

## 5. ขั้นตอนสำหรับ Administrator

### 5.1 เพิ่มโครงการ

Admin สามารถระบุ:

- Project Code เช่น `TCLS2027`
- Project Name
- Key-in URL
- Compare URL
- Description
- Start Date
- End Date
- Status

### 5.2 เพิ่มฐานข้อมูลหรือชุดแบบสอบถาม

ตัวอย่างฐานข้อมูลต้นทาง:

- `tcls2027_hh`
- `tcls2027_ch`
- `tcls2027_ch2`
- `tcls2027_ch0`

ฐาน Compare ที่สัมพันธ์กัน:

- `tcls2027_hh_cmp`
- `tcls2027_ch_cmp`
- `tcls2027_ch2_cmp`
- `tcls2027_ch0_cmp`

การเพิ่ม Config ห้ามสร้างฐาน `_cmp` ทันที

ให้สร้างเมื่อ Admin กดปุ่ม “เตรียมระบบ Compare” และยืนยันแล้วเท่านั้น

### 5.3 เลือกตาราง

ตัวอย่าง:

`tcls2027_ch`

- `preface`
- `b1b`
- `b1b_table1`

`tcls2027_hh`

- `preface_hh`
- `hh`
- `hh_member`

ระบบต้อง:

- Scan รายชื่อตาราง
- ตรวจ Primary Key
- รองรับ Composite Primary Key
- ให้ Admin เลือกตารางที่เปิด Compare
- กำหนดชื่อที่แสดงและลำดับได้

### 5.4 ตั้งค่าตัวแปร

ตัวอย่าง:

ฐานข้อมูล: `tcls2027_hh`  
ตาราง: `preface_hh`

ตัวแปรที่ไม่ต้องแสดง:

- `recp`
- `recpdate`

แต่ละตัวแปรต้องตั้งค่าได้ว่า:

- Visible
- Comparable
- Editable
- Primary Key
- System Column
- Masked
- Display Order

## 6. โครงสร้าง Config ที่แนะนำ

สร้างหรือปรับตาราง Config ที่ไม่ใช่ `cmp_`:

- `projects`
- `project_databases`
- `project_tables`
- `project_table_columns`
- `config_audit_logs`

ก่อนสร้างตารางใหม่ ต้องตรวจสอบโครงสร้างเดิมก่อน

ถ้ามีตาราง Config เดิม:

- ให้พิจารณานำกลับมาใช้
- ห้าม Drop
- ห้ามล้างข้อมูล
- สร้าง Migration แบบไม่ทำลายข้อมูลเดิม

## 7. หน้า Nuxt

ไฟล์เริ่มต้นปัจจุบันคือ:

`list.vue`

ให้ค้นหาตำแหน่งที่ถูกต้องก่อนแก้ไข หากพบหลายไฟล์ ห้ามเดา

สามารถแยก Component เช่น:

- `ProjectListTable.vue`
- `ProjectForm.vue`
- `ProjectDatabaseList.vue`
- `ProjectTableSelector.vue`
- `ProjectColumnConfig.vue`
- `AdminWizardStepper.vue`

ห้ามย้ายหรือเปลี่ยนชื่อ `list.vue` ถ้าจะทำให้ Route เดิมเสีย

## 8. PHP API

สร้าง PHP API สำหรับ:

- จัดการ Project
- จัดการ Project Database
- Scan Tables
- ตรวจ Primary Key
- Scan Columns
- บันทึก Column Config
- เตรียมระบบ Compare
- Config Audit Log

ทุก API ต้อง:

- ตรวจ Authentication
- ตรวจสิทธิ์ Admin
- Validate Input
- ใช้ `mysqli` prepared statement
- ใช้ Transaction เมื่อจำเป็น
- ส่ง JSON Response รูปแบบเดียวกัน
- ตรวจชื่อ Database, Table และ Column กับ Allowlist
- ป้องกัน SQL Injection
- ไม่แสดง SQL Error และ Credential แก่ Frontend

## 9. การตรวจสอบก่อนเริ่ม

ก่อนแก้ไขให้:

1. ค้นหา `list.vue`
2. ตรวจ Route และ Component ที่เกี่ยวข้อง
3. ตรวจ PHP API ที่ `list.vue` เรียกใช้
4. ตรวจตาราง Config เดิม
5. ค้นหาไฟล์และตารางที่เกี่ยวข้องกับ `cmp_`
6. สรุป Protected Files
7. สรุป Protected Tables
8. ตรวจ `git status`
9. ระบุไฟล์ที่อนุญาตให้แก้ไข

หากไม่แน่ใจว่าไฟล์ใดเป็นระบบ Compare เดิม ให้ถือว่าเป็น Protected

## 10. การทดสอบ

หลังพัฒนาเสร็จให้:

- รัน Nuxt Build
- ตรวจ PHP Syntax ทุกไฟล์ที่สร้างหรือแก้
- ทดสอบเพิ่มโครงการ
- ทดสอบเพิ่มฐานข้อมูล
- ทดสอบ Scan Tables
- ทดสอบตรวจ Primary Key
- ทดสอบซ่อนตัวแปร
- ทดสอบสิทธิ์ Admin
- ตรวจ `git diff`
- ยืนยันว่าไม่มีระบบ Compare เดิมถูกแก้ไข
- ยืนยันว่าไม่มีตาราง `cmp_` ถูกเปลี่ยนโครงสร้าง

## 11. สิ่งที่ต้องส่งมอบ

- Nuxt Administrator
- PHP API
- SQL Migration
- Mock Data
- `.env.example`
- README
- ตัวอย่าง API Request/Response
- ผล Build และ Syntax Check
- รายการไฟล์ที่สร้างหรือแก้ไข
- รายการ Protected Files ที่ไม่ได้แก้ไข

ไม่ต้องหยุดเพียงการเสนอแผน หากตรวจสอบขอบเขตได้อย่างปลอดภัย ให้พัฒนาต่อจนเสร็จ


# งานระยะที่ 2: ปรับระบบ Compare Data เป็นโครงสร้างใหม่

## 1. เป้าหมาย

พัฒนาส่วน Compare Data ต่อจากระบบ Administrator ในระยะที่ 1 ให้พร้อมใช้งานจริง โดยใช้:

- Frontend: Nuxt 3
- Backend: PHP 8+ REST API
- Database: MySQL 8
- Database API: mysqli prepared statement
- Config Database: `_riped_survey_compare`

รอบนี้อนุญาตให้:

- ปรับ PHP API เดิม
- สร้าง PHP API ใหม่
- ยกเลิก API เดิมหลังตรวจสอบว่าไม่มีส่วนอื่นใช้งาน
- ปรับโครงสร้างตาราง `cmp_`
- เปลี่ยนตาราง `cmp_` ไปเป็นโครงสร้างใหม่
- สร้าง Migration ย้ายข้อมูลเดิม
- Refactor โค้ดหน้า Compare
- แยก Component, Service, Composable และ Store

แต่ต้องรักษา Business Logic และ Workflow เดิมทุกประการ

## 2. Business Logic ที่ต้องเหมือนเดิม

แม้ API และฐานข้อมูลจะเปลี่ยนใหม่ แต่ระบบต้องทำงานเหมือนเดิมดังนี้:

1. ผู้ใช้เลือกโครงการ
2. ผู้ใช้เลือกฐานข้อมูลหรือชุดแบบสอบถาม
3. ระบบแสดงตารางที่อยู่ในฐานข้อมูลนั้น
4. ผู้ใช้เลือกตารางที่ต้องการ Compare
5. ระบบดึง Primary Key ของตาราง
6. รองรับ Primary Key ตัวเดียวและ Composite Primary Key
7. ผู้ใช้เลือกค้นหาแบบรหัสตรงตัวได้
8. ผู้ใช้เลือกค้นหาแบบ Prefix หรือ `LIKE 'id%'` ได้
9. เมื่อกด Next ระบบเตรียมข้อมูล Round 1 สำหรับ Compare
10. Round 1 ใช้ข้อมูลที่ถูกคัดลอกมาเก็บในฐานหรือตาราง Compare
11. Round 2 อ่านจากฐาน Raw
12. หน้า Compare แสดงค่าของ Round 1 และ Round 2
13. ผู้ใช้เลือกค่าจาก Round 1, Round 2 หรือกรอกค่าใหม่
14. ต้องเลือกคำตอบให้ครบทุกตัวแปรที่ต้อง Compare
15. การบันทึกต้องแก้เฉพาะข้อมูลฝั่ง Compare
16. ห้ามแก้ไขข้อมูลฐาน Raw
17. เมื่อบันทึกครบ ให้เปลี่ยน `round = 0` ฝั่ง Compare
18. แสดงข้อความ `Compare Complete`
19. บันทึกว่าใครแก้ตัวแปรอะไร
20. บันทึกค่าเดิม ค่า Round 2 และค่าที่เลือก
21. เมื่อเสร็จแล้วสามารถเปิดรหัสถัดไปได้

ห้ามเปลี่ยนความหมายของ Workflow เหล่านี้ แม้จะออกแบบฐานข้อมูลหรือ API ใหม่

## 3. UI ที่ต้องรักษา

ให้ยึด UI หน้า Compare Data ปัจจุบันเป็นหลัก

ก่อนแก้ไขให้ค้นหาและตรวจสอบ:

- Route หน้า Compare
- ไฟล์ Vue ของหน้า Compare
- Layout
- Navbar
- Components
- CSS
- API ที่เรียกใช้อยู่
- รูปแบบ Response เดิม
- การจัดลำดับหน้าปัจจุบัน

ให้รักษา:

- Layout เดิม
- Navbar เดิม
- สีหลักเดิม
- ชื่อเมนูเดิม
- ลำดับขั้นตอนเดิม
- วิธีเลือกฐานข้อมูล
- วิธีเลือกตาราง
- วิธีระบุ Primary Key
- วิธีค้นหารหัส
- ตารางแสดง Round 1 และ Round 2
- ปุ่ม Back, Next, Save และ Complete
- รูปแบบที่ผู้ใช้งานเดิมคุ้นเคย

สามารถปรับปรุง:

- Loading
- Empty State
- Error State
- Validation
- Confirmation Dialog
- Progress
- Responsive
- ความชัดเจนของข้อความ
- การจัด Component
- Accessibility

ห้ามออกแบบ UI ใหม่ทั้งหมดโดยไม่อ้างอิงหน้าปัจจุบัน

## 4. ตรวจสอบระบบเดิมก่อนเริ่ม

ก่อนแก้ไขให้ดำเนินการ:

1. อ่าน `AGENTS.md` หากมี
2. อ่านไฟล์ `TASK_ADMIN_COMPARE.md`
3. ตรวจสอบ `git status`
4. ค้นหา `list.vue` ของส่วน Administrator
5. ตรวจสอบ Config ที่สร้างจากระยะที่ 1
6. ค้นหาไฟล์หน้า Compare ทั้งหมด
7. ค้นหา PHP API เดิมทั้งหมดที่เกี่ยวกับ Compare
8. ค้นหา SQL ที่อ่านหรือเขียนฐาน `_cmp`
9. ค้นหาตารางที่ขึ้นต้นด้วย `cmp_`
10. ตรวจสอบโครงสร้างด้วย `SHOW CREATE TABLE`
11. ตรวจสอบว่าตารางหรือ API เดิมมีระบบอื่นเรียกใช้หรือไม่
12. สรุป Business Logic เดิมจากโค้ดจริง
13. สรุปโครงสร้างเก่าและโครงสร้างใหม่
14. จัดทำ Migration Mapping

ก่อนลงมือให้สรุปสั้น ๆ:

- Current UI Files
- Current API Files
- Current Database Structure
- Current Compare Logic
- Files To Modify
- Files To Create
- Tables To Migrate
- Compatibility Risks

หากไม่มี Blocker ที่อาจทำให้ข้อมูลสูญหาย ให้ดำเนินการต่อได้เลย

## 5. ข้อมูลจากระบบ Administrator

หน้า Compare ต้องอ่าน Config จากฐานกลาง:

`_riped_survey_compare`

ข้อมูลหลักประกอบด้วย:

### projects

- id
- project_code
- project_name
- keyin_url
- compare_url
- status

### project_databases

- id
- project_id
- questionnaire_code
- display_name
- raw_database_name
- compare_database_name
- round_column
- round1_value
- round2_value
- completed_round_value
- compare_enabled
- status

### project_tables

- id
- project_database_id
- table_name
- display_name
- compare_enabled
- primary_key_json
- record_id_columns_json
- display_order
- status

### project_table_columns

- id
- project_table_id
- column_name
- display_name
- data_type
- is_primary_key
- is_system_column
- is_visible
- is_comparable
- is_editable
- is_masked
- display_order

หน้า Compare ห้าม Hard-code ชื่อ:

- Project
- Database
- Compare Database
- Table
- Primary Key
- Column
- Round Column

ข้อมูลทั้งหมดต้องอ่านจาก Config ที่ Admin อนุมัติแล้ว

## 6. การออกแบบฐาน Compare ใหม่

สามารถปรับโครงสร้างตาราง `cmp_` เดิมได้ แต่ต้องออกแบบให้รองรับหลายโครงการ หลายฐาน หลายตาราง และ Composite Primary Key

แนะนำให้แยกข้อมูลเป็น 2 ส่วน:

### 6.1 ข้อมูลคำตอบที่ใช้ Compare

ข้อมูล Round 1 ที่ผู้ใช้งานสามารถแก้ไขได้ ให้ยังคงเก็บในฐาน Compare ของแต่ละแบบสอบถาม เช่น:

```text
tcls2027_hh_cmp
tcls2027_ch_cmp
tcls2027_ch2_cmp
tcls2027_ch0_cmp


# งานเพิ่มเติม: การเลือกขอบเขตข้อมูลสำหรับ Compare

## 1. เป้าหมาย

ปรับขั้นตอนการเลือกข้อมูลก่อนเริ่ม Compare ให้ผู้ใช้สามารถเลือกพื้นที่หรือส่วนต้นของรหัสจาก Dropdown และกรอกส่วนต่อท้ายเพิ่มเติมได้

ค่าที่นำไปค้นหาต้องประกอบจาก:

searchId = searchId1 + searchId2