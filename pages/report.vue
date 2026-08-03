
<template>
  <main class="legacy-container content-page">
    <div class="report-head">
      <div>
        <h1 class="page-title">รายงานผล</h1>
        <p class="updated">ตรวจสอบความคืบหน้าและประวัติการแก้ไขข้อมูล</p>
      </div>
      <button class="btn btn-gray" type="button" @click="downloadCsv">Export CSV</button>
    </div>

    <div class="stat-grid">
      <div v-for="item in stats" :key="item.label" :class="['stat-box', item.tone]">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
        <small>{{ item.note }}</small>
      </div>
    </div>

    <CommonLegacyPanel title="ค้นหา">
      <div class="search-line">
        <span class="input-prefix">SEARCH :</span>
        <input v-model="query" placeholder="รหัส / ผู้ใช้งาน / ตัวแปร / วันที่">
        <button class="btn btn-gray" type="button">Search</button>
      </div>
    </CommonLegacyPanel>

    <ReportAuditLogTable :logs="filteredLogs" />
  </main>
</template>

<script setup>
const { auditLogs, records, comparedCount, buildCsv } = useCompareWorkflow()

const query = ref('')

const filteredLogs = computed(() => {
  const term = query.value.trim().toLowerCase()
  if (!term) {
    return auditLogs.value
  }

  return auditLogs.value.filter((log) => [
    log.projectId,
    log.tableName,
    log.primaryKey,
    log.columnName,
    log.user,
    log.changedAt
  ].some((value) => String(value || '').toLowerCase().includes(term)))
})

const stats = computed(() => {
  const total = records.value.length || 128
  const done = records.value.length ? comparedCount.value : 106
  return [
    { label: 'จำนวนรหัสทั้งหมด', value: total, note: 'รหัส' },
    { label: 'Compare เสร็จแล้ว', value: done, note: `${Math.round((done / total) * 100)}%`, tone: 'ok' },
    { label: 'ยังรอตรวจ', value: total - done, note: 'รหัส', tone: 'warn' },
    { label: 'Audit Log', value: auditLogs.value.length, note: 'รายการ' }
  ]
})

function downloadCsv() {
  if (!import.meta.client) {
    return
  }

  const blob = new Blob([buildCsv(filteredLogs.value)], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'compare-audit-log.csv'
  link.click()
  URL.revokeObjectURL(url)
}
</script>

