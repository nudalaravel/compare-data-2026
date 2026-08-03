<template>
  <section>
    <h1 class="page-title">1.เลือกฐานข้อมูล</h1>
    <div class="rule"></div>
    <p class="updated">
      {{ scopeKey ? `แสดงฐานข้อมูลใน Project: ${scopeKey}` : 'เลือกฐานข้อมูลหรือแบบสอบถามที่ต้องการ compare' }}
    </p>
    <div class="rule"></div>

    <div v-if="inlineTableMode && inlineProject" class="inline-table-picker">
      <button
        type="button"
        :class="['legacy-db-button', inlineProject.color]"
        aria-disabled="true"
      >
        <span>
          {{ inlineProject.displayName || inlineProject.questionnaireName }}
        </span>
        <small>{{ inlineProject.rawDatabase }}</small>
      </button>

      <CommonLegacyPanel title="ตารางข้อมูล">
        <p class="inline-table-hint">โปรเจคนี้มีฐานข้อมูลเดียว เลือกตารางที่ต้องการ compare แล้วกด Next</p>
        <div v-if="inlineTablesLoading" class="empty-state">กำลังโหลดตาราง...</div>
        <div v-else class="inline-table-list">
          <button
            v-for="table in inlineTables"
            :key="table.name"
            type="button"
            :class="['inline-table-button', { selected: inlineSelectedTableName === table.name }]"
            :disabled="!table.allowed"
            @click="chooseInlineTable(table)"
          >
            <strong>{{ table.displayName || table.name }}</strong>
            <small>{{ table.name }}</small>
            <em>{{ table.allowed ? 'เปิด compare' : 'ยังไม่เปิด compare' }}</em>
          </button>
          <p v-if="!inlineTables.length" class="empty-state">ยังไม่มีตารางที่เปิด compare</p>
        </div>
      </CommonLegacyPanel>

      <div class="center-actions">
        <button class="btn btn-lime" type="button" :disabled="!selectedInlineTable" @click="continueWithInlineTable">Next</button>
      </div>
    </div>

    <div v-else class="legacy-button-list">
      <button
        v-for="project in projects"
        :key="project.id"
        type="button"
        :class="['legacy-db-button', project.color]"
        :disabled="!project.active || project.tables.length === 0"
        @click="$emit('pick', project)"
      >
        <span>
          {{ project.displayName || project.questionnaireName }}
        </span>
        <small>{{ project.rawDatabase }}</small>
        <small v-if="project.tables.length === 0">ยังไม่มีตารางที่เปิด compare</small>
      </button>
    </div>
  </section>
</template>
<script setup>
const props = defineProps({
  projects: { type: Array, default: () => [] },
  scopeKey: { type: String, default: '' },
  inlineTableMode: { type: Boolean, default: false },
  inlineTables: { type: Array, default: () => [] },
  inlineTablesLoading: { type: Boolean, default: false },
  inlineSelectedTableName: { type: String, default: '' }
})

const emit = defineEmits(['pick', 'pick-with-table', 'update:inline-selected-table-name'])

const inlineProject = computed(() => props.inlineTableMode ? props.projects[0] || null : null)
const selectedInlineTable = computed(() => props.inlineTables.find((table) => table.name === props.inlineSelectedTableName) || null)

function chooseInlineTable(table) {
  if (!table.allowed) {
    return
  }

  emit('update:inline-selected-table-name', table.name)
}

function continueWithInlineTable() {
  if (!inlineProject.value || !selectedInlineTable.value) {
    return
  }

  emit('pick-with-table', inlineProject.value, selectedInlineTable.value)
}
</script>