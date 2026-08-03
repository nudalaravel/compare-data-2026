<template>
  <main class="legacy-container content-page">
    <div v-if="!isAuthenticated" class="auth-loading">
      กำลังตรวจสอบสิทธิ์ผู้ใช้งาน...
    </div>

    <template v-else>
      <div v-if="usingMock" class="mock-banner">
        ใช้งาน Mock Service ระหว่างรอเชื่อม PHP API จริง
      </div>

      <div v-if="step === 1" class="workspace-grid">
        <CompareProjectSelector
          class="main-column"
          :projects="visibleProjects"
          :scope-key="projectScopeKey"
          :inline-table-mode="Boolean(inlineTableProject)"
          :inline-tables="inlineTables"
          :inline-tables-loading="inlineTablesLoading"
          :inline-selected-table-name="inlineSelectedTableName"
          @update:inline-selected-table-name="inlineSelectedTableName = $event"
          @pick="selectProject"
          @pick-with-table="pickInlineTable"
        />
        <aside class="side-column">
          <CommonDetailPanel :rows="detailRows" />
        </aside>
      </div>

      <div v-else-if="step === 2 && selectedProject" class="workspace-grid">
        <CompareTableSelector
          class="main-column"
          :project="selectedProject"
          :tables="tableCatalog"
          :table-statuses="tableStatuses"
          :selected-table="selectedTable"
          :selected-primary-keys="selectedPrimaryKeys"
          :preview="preview"
          :scope-preview="scopePreview"
          :sample-ids="sampleIds"
          v-model:search-mode="searchMode"
          v-model:search-id1="searchId1"
          v-model:search-id2="searchId2"
          v-model:search-id="searchId"
          @back="backToProjectList"
          @select-table="selectTable"
          @toggle-primary-key="togglePrimaryKey"
          @refresh-preview="refreshPreview"
          @prepare="openConfirm"
        />

        <aside class="side-column">
          <CommonDetailPanel :rows="detailRows" />
          <CompareTableTree
            :tables="tableCatalog"
            :statuses="tableStatuses"
            :selected-name="selectedTable?.name"
            @select="selectTable"
          />
          <CommonLegacyPanel title="คำอธิบาย" compact>
            <ul class="legend-list">
              <li><span class="legend warning">▲</span>ยังไม่ดำเนินการ compare</li>
              <li><span class="legend ok">✓</span>Compare แล้ว</li>
              <li><span class="legend error">✖</span>ข้อมูลทั้งสองรอบ ไม่ตรงกัน</li>
              <li><span class="legend slash">/</span>ข้อมูลทั้งสองรอบ ยังไม่เท่ากัน</li>
              <li><span class="legend empty">□</span>ไม่มีข้อมูลทั้งสองรอบ</li>
            </ul>
          </CommonLegacyPanel>
        </aside>
      </div>

      <div v-else-if="step === 4 && selectedProject && selectedTable" class="workspace-grid">
        <CompareStep4Compare
          class="main-column"
          :project="selectedProject"
          :table="selectedTable"
          :records="records"
          :active-record="activeRecord"
          :active-index="activeRecordIndex"
          :compared-count="comparedCount"
          :complete="compareComplete"
          @choose="chooseField"
          @custom="setCustomField"
          @save="saveActiveRecord"
          @reset="resetActiveRecord"
          @open-record="openRecord"
          @back="step = 2"
        />

        <aside class="side-column">
          <CommonDetailPanel :rows="detailRows" />
          <CommonDetailPanel title="ผล" :rows="resultRows" />
          <CommonLegacyPanel title="รายการแก้ไขรหัส" compact>
            <div class="small-button-stack">
              <button type="button">-ไม่มีรายการแก้ไขรหัส-R1</button>
              <button type="button">-ไม่มีรายการแก้ไขรหัส-R2</button>
            </div>
          </CommonLegacyPanel>
        </aside>
      </div>

      <CommonConfirmDialog
        :open="confirmOpen"
        title="ยืนยันการเตรียมข้อมูล Compare"
        confirm-text="ยืนยันและเริ่ม Compare"
        @close="confirmOpen = false"
        @confirm="confirmPrepare"
      >
        <p>ระบบจะตรวจตาราง <strong>{{ preview?.targetFullName }}</strong> และคัดลอกเฉพาะข้อมูล <strong>round = 1</strong> จากฐานต้นทางไปยังฐาน <strong>_cmp</strong></p>
        <ul class="confirm-list">
          <li>ไม่แก้ไขหรือลบข้อมูลในฐานต้นทาง `_raw`</li>
          <li>ใช้ Transaction และ Rollback เมื่อเกิดข้อผิดพลาดใน PHP API จริง</li>
          <li>บันทึกผลและ Audit Log เฉพาะเมื่อผู้ใช้กด Submit</li>
        </ul>
      </CommonConfirmDialog>

      <div v-if="toast" class="toast">{{ toast }}</div>
    </template>
  </main>
</template>
<script setup>
const {
  user,
  projects,
  tableCatalog,
  sampleIds,
  step,
  selectedPrimaryKeys,
  searchMode,
  searchId1,
  searchId2,
  searchId,
  scopePreview,
  preview,
  records,
  activeRecordIndex,
  toast,
  isAuthenticated,
  selectedProject,
  selectedTable,
  activeRecord,
  comparedCount,
  compareComplete,
  usingMock,
  tableStatuses,
  hydrateUserFromStorage,
  refreshProjects,
  loadTablesForProject,
  selectProject,
  selectProjectWithTable,
  backToProjectList,
  selectTable,
  refreshPreview,
  togglePrimaryKey,
  prepareCompare,
  chooseField,
  setCustomField,
  saveActiveRecord,
  resetActiveRecord,
  openRecord
} = useCompareWorkflow()

const route = useRoute()
const confirmOpen = ref(false)
const resolvingProject = ref(false)
const inlineTables = ref([])
const inlineTablesLoading = ref(false)
const inlineSelectedTableName = ref('')

const projectScopeKey = computed(() => (typeof route.query.project === 'string' ? route.query.project.trim().toLowerCase() : ''))
const visibleProjects = computed(() => {
  if (!projectScopeKey.value) {
    return projects.value
  }

  const scoped = findProjectDatabasesByUrlKey(projectScopeKey.value)
  return scoped.length ? scoped : projects.value
})
const inlineTableProject = computed(() => {
  if (!projectScopeKey.value || visibleProjects.value.length !== 1) {
    return null
  }

  const project = visibleProjects.value[0]
  return isTopLevelProjectKey(projectScopeKey.value, project) ? project : null
})

onMounted(() => {
  hydrateUserFromStorage()
  resolveProjectFromUrl()
})

watch(() => route.query.project, () => {
  resolveProjectFromUrl()
})

watch([inlineTableProject, isAuthenticated], ([project, authed]) => {
  if (!authed || !project) {
    resetInlineTables()
    return
  }

  loadInlineTables(project)
}, { immediate: true })

const detailRows = computed(() => [
  { label: 'USER:', value: user.value?.username || 'nuda' },
  { label: 'ฐานข้อมูล', value: selectedProject.value?.rawDatabase || '-' },
  { label: 'ตาราง', value: selectedTable.value?.name || '-' }
])

const resultRows = computed(() => [
  { label: 'search', value: activeRecord.value?.primaryKey || searchId.value },
  { label: 'compare', value: `${records.value.length - comparedCount.value} record` },
  { label: '#rows in ROUND1', value: preview.value?.round1Count ?? '-' },
  { label: '#rows in ROUND2', value: preview.value?.round2Count ?? '-' },
  { label: '#rows intersection', value: preview.value?.intersectionCount ?? '-' }
])

async function openConfirm() {
  const compareStatus = preview.value?.compareStatus || preview.value?.compare_status || ''
  if (compareStatus === 'complete') {
    await prepareCompare()
    return
  }

  confirmOpen.value = true
}

async function confirmPrepare() {
  confirmOpen.value = false
  await prepareCompare()
}

async function resolveProjectFromUrl() {
  if (!isAuthenticated.value || resolvingProject.value) {
    return
  }

  const projectKey = projectScopeKey.value
  if (!projectKey) {
    return
  }

  resolvingProject.value = true
  await refreshProjects()
  const scopedDatabases = findProjectDatabasesByUrlKey(projectKey)

  if (scopedDatabases.length === 1 && isTopLevelProjectKey(projectKey, scopedDatabases[0])) {
    backToProjectList()
  } else {
    const exactDatabase = findDatabaseByUrlKey(projectKey)
    if (exactDatabase) {
      resetInlineTables()
      await selectProject(exactDatabase)
    } else if (scopedDatabases.length) {
      backToProjectList()
    }
  }

  resolvingProject.value = false
}

async function loadInlineTables(project) {
  inlineTablesLoading.value = true
  inlineTables.value = []
  inlineSelectedTableName.value = ''

  try {
    const tables = await loadTablesForProject(project)
    inlineTables.value = tables
    inlineSelectedTableName.value = tables.find((table) => table.allowed)?.name || ''
  } finally {
    inlineTablesLoading.value = false
  }
}

function resetInlineTables() {
  inlineTables.value = []
  inlineTablesLoading.value = false
  inlineSelectedTableName.value = ''
}

async function pickInlineTable(project, table) {
  await selectProjectWithTable(project, table)
}

function findDatabaseByUrlKey(projectKey) {
  return projects.value.find((project) => {
    const candidates = [
      project.id,
      project.code,
      project.project_id,
      project.project_code,
      project.databaseCode,
      project.database_code,
      project.rawDatabase,
      project.raw_database
    ]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase())

    return candidates.includes(projectKey)
  }) || null
}

function findProjectDatabasesByUrlKey(projectKey) {
  return projects.value.filter((project) => {
    const groupCandidates = [
      project.surveyProjectCode,
      project.survey_project_code,
      project.groupCode,
      project.project_group,
      project.slug
    ]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase())

    const databaseCandidates = [
      project.id,
      project.project_id,
      project.databaseCode,
      project.database_code,
      project.rawDatabase,
      project.raw_database
    ]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase())

    return groupCandidates.includes(projectKey)
      || databaseCandidates.some((value) => value.startsWith(`${projectKey}_`))
  })
}

function isTopLevelProjectKey(projectKey, project) {
  return [
    project.surveyProjectCode,
    project.survey_project_code,
    project.groupCode,
    project.project_group,
    project.slug
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase())
    .includes(projectKey)
}
</script>
