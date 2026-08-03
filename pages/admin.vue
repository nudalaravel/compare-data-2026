<template>
  <main class="legacy-container content-page">
    <div class="report-head">
      <div>
        <h1 class="page-title">Administrator</h1>
        <p class="updated">จัดการโปรเจกต์ ตาราง allowlist, Primary Key และสิทธิ์ผู้ใช้งาน</p>
      </div>
      <span class="status-pill ok">ระบบพร้อมใช้งาน</span>
    </div>

    <div class="admin-grid">
      <CommonLegacyPanel title="โปรเจกต์ทั้งหมด">
        <div class="admin-project-list">
          <article v-for="project in projects" :key="project.id" class="admin-project-row">
            <span :class="['project-color', project.color]"></span>
            <div>
              <strong>{{ project.displayName }}</strong>
              <small>{{ project.code }} · {{ project.rawDatabase }} → {{ project.cmpDatabase }}</small>
            </div>
            <em>{{ project.active ? 'เปิดใช้งาน' : 'ปิด' }}</em>
            <button type="button" class="btn btn-light">ตั้งค่า</button>
          </article>
        </div>
      </CommonLegacyPanel>

      <AdminProjectForm @add="addAdminProject" />
    </div>

    <CommonLegacyPanel title="Security Checklist">
      <ul class="security-list">
        <li>ชื่อตารางและคอลัมน์ต้องผ่าน Metadata/Allowlist ก่อนนำไปสร้าง SQL</li>
        <li>API บันทึกผล Update เฉพาะฐาน `_cmp` และไม่ Update ฐาน `_raw`</li>
        <li>Correction log บันทึกแบบ append-only ลงตาราง `chk_user` ในฐาน `_cmp` พร้อมผู้ใช้ เวลา ค่าเดิม และค่าที่เลือก</li>
        <li>ใช้ `.env` สำหรับ credential และไม่เก็บรหัสผ่านลง repository</li>
      </ul>
    </CommonLegacyPanel>
  </main>
</template>

<script setup>
import AdminProjectForm from '~/components/admin/AdminProjectForm.vue'

const { projects, addAdminProject } = useCompareWorkflow()
</script>
