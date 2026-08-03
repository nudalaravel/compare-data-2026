<template>
  <CommonLegacyPanel title="เพิ่มโปรเจกต์ใหม่">
    <form class="admin-form" @submit.prevent="submit">
      <label>Project Code *</label>
      <input v-model="form.code" placeholder="เช่น TCLS2026_CH1">

      <label>ชื่อที่แสดง *</label>
      <input v-model="form.displayName" placeholder="Children Baseline 2026 (CH1)">

      <label>ฐานข้อมูลต้นทาง (_raw) *</label>
      <input v-model="form.rawDatabase" placeholder="tcls2026_ch1_raw">

      <label>ฐานข้อมูล Compare (_cmp)</label>
      <input v-model="form.cmpDatabase" placeholder="เว้นว่างเพื่อใช้ชื่ออัตโนมัติ">

      <div class="form-grid">
        <span>
          <label>Round Field</label>
          <input v-model="form.roundField">
        </span>
        <label class="switch-row">
          <input v-model="form.active" type="checkbox">
          เปิดใช้งานหลังตรวจ Schema
        </label>
      </div>

      <div class="admin-note">
        <strong>หลังบันทึก</strong>
        <p>ระบบต้องทดสอบ connection, scan ตาราง, ตรวจ Primary Key, ตั้ง allowlist และกำหนดสิทธิ์ผู้ใช้ก่อนเปิดใช้งานจริง</p>
      </div>

      <button class="btn btn-success wide" type="submit">บันทึกและตรวจสอบ Schema</button>
    </form>
  </CommonLegacyPanel>
</template>
<script setup>
const emit = defineEmits(['add'])

const form = reactive({
  code: '',
  displayName: '',
  rawDatabase: '',
  cmpDatabase: '',
  roundField: 'round',
  active: false
})

function submit() {
  if (!form.code || !form.displayName || !form.rawDatabase) {
    return
  }

  emit('add', { ...form })
  Object.assign(form, {
    code: '',
    displayName: '',
    rawDatabase: '',
    cmpDatabase: '',
    roundField: 'round',
    active: false
  })
}
</script>
