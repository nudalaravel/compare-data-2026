<template>
  <main class="legacy-container content-page">
    <div class="workspace-grid report-workspace">
      <section class="main-column">
        <CommonLegacyPanel title="ค้นหา:">
          <div class="report-search-form">
            <div class="report-control-row">
              <span class="input-prefix">ฐานข้อมูล:</span>
              <select v-model="selectedProjectId" :disabled="loading" @change="changeDatabase">
                <option v-for="project in projects" :key="project.id" :value="project.id">
                  {{ project.displayName }}
                </option>
              </select>
            </div>

            <div class="search-line">
              <span class="input-prefix">Search By ID</span>
              <input
                v-model.trim="searchInput"
                :disabled="loading"
                placeholder="กรอกรหัสที่ต้องการค้นหา"
                @keydown.enter.prevent="submitSearch"
              >
              <div class="report-search-actions">
                <button class="btn btn-gray" type="button" :disabled="loading" @click="submitSearch">ค้นหา</button>
                <button class="btn btn-danger" type="button" :disabled="loading || !appliedSearchId" @click="clearSearch">ล้างการค้นหา</button>
              </div>
            </div>
          </div>
        </CommonLegacyPanel>
        <p v-if="loadError" class="error-text report-error">{{ loadError }}</p>

        <CommonLegacyPanel title="จำนวนข้อมูลทั้งหมด:">
          <div v-if="loading && !summaryTables.length" class="report-empty">กำลังโหลดรายงาน...</div>
          <div v-else class="report-table-wrap">
            <table class="report-summary-table">
              <thead>
                <tr>
                  <th>{{ summaryFirstColumnLabel }}</th>
                  <th>Round1<br><small>(จำนวนข้อมูล)</small></th>
                  <th>Round2<br><small>(จำนวนข้อมูล)</small></th>
                  <th>Compare<br><small>(จำนวนข้อมูล)</small></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="table in summaryTables" :key="table.tableName">
                  <td>{{ table.displayName }}</td>
                  <td>{{ formatNumber(table.round1Count) }}</td>
                  <td>{{ formatNumber(table.round2Count) }}</td>
                  <td>{{ formatNumber(table.compareCount) }}</td>
                </tr>
                <tr v-if="!summaryTables.length">
                  <td colspan="4">ยังไม่มีรายการตารางที่เปิด compare</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CommonLegacyPanel>

        <div class="report-result-copy">
          <p>จำนวนทั้งหมด {{ formatNumber(summaryTotals.round1) }} record</p>
          <p>เปรียบเทียบข้อมูลแล้ว {{ formatNumber(summaryTotals.compare) }} record</p>
          <p>คงเหลือ {{ formatNumber(summaryTotals.remaining) }} record</p>
          <h2>ผลการค้นหา : <strong>{{ formatNumber(pagination.from) }}</strong> Of <strong>{{ formatNumber(pagination.total) }}</strong> record</h2>
        </div>

        <CommonLegacyPanel title="รายงานผล (ตารางข้อมูล)">
          <div class="report-table-tools">
            <label>
              Show
              <select v-model.number="limit" :disabled="loading" @change="changeLimit">
                <option :value="10">10</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
              entries
            </label>
            <label>
              Search:
              <input v-model.trim="tableSearch" placeholder="">
            </label>
          </div>

          <div class="report-table-wrap report-data-scroll">
            <table class="report-data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>ผู้บันทึกข้อมูล รอบ1</th>
                  <th>ผู้บันทึกข้อมูล รอบ2</th>
                  <th v-for="table in tableColumns" :key="table.tableName">
                    {{ table.tableName }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in visibleRows" :key="row.id">
                  <td>{{ row.id }}</td>
                  <td class="text-left">{{ row.recp || '-' }}</td>
                  <td class="text-left">{{ row.recpr2 || '-' }}</td>
                  <td v-for="table in tableColumns" :key="`${row.id}-${table.tableName}`">
                    <span
                      :class="['report-status-icon', row.tables?.[table.tableName]?.tone || 'empty']"
                      :title="row.tables?.[table.tableName]?.label || ''"
                    >
                      {{ row.tables?.[table.tableName]?.icon || '--' }}
                    </span>
                  </td>
                </tr>
                <tr v-if="!visibleRows.length">
                  <td :colspan="3 + tableColumns.length">ไม่พบข้อมูลตามเงื่อนไข</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="report-pagination">
            <button type="button" :disabled="loading || pagination.page <= 1" @click="goPage(pagination.page - 1)">Previous</button>
            <button
              v-for="pageItem in pageItems"
              :key="pageItem.key"
              type="button"
              :disabled="loading || pageItem.disabled"
              :class="{ active: pageItem.value === pagination.page, ellipsis: pageItem.ellipsis }"
              @click="!pageItem.ellipsis && goPage(pageItem.value)"
            >
              {{ pageItem.label }}
            </button>
            <button type="button" :disabled="loading || pagination.page >= totalPages" @click="goPage(pagination.page + 1)">Next</button>
          </div>
        </CommonLegacyPanel>
      </section>

      <aside class="side-column">
        <CommonDetailPanel :rows="detailRows" />
        <CommonLegacyPanel title="คำอธิบาย" compact>
          <ul class="legend-list">
            <li><span class="legend warning">▲</span>ยังไม่ดำเนินการ compare</li>
            <li><span class="legend ok">✓</span>Compare แล้ว</li>
            <li><span class="legend error">✖</span>ข้อมูลทั้งสองรอบ ยังไม่ตรงกัน</li>
            <li><span class="legend slash">/</span>ข้อมูลทั้งสองรอบ ยังไม่เท่ากัน</li>
            <li><span class="legend empty">--</span>ไม่มีข้อมูลทั้งสองรอบ</li>
          </ul>
        </CommonLegacyPanel>
      </aside>
    </div>
  </main>
</template>

<script setup>
const config = useRuntimeConfig()
const route = useRoute()
const { user, hydrateUserFromStorage } = useCompareWorkflow()

const apiBase = String(config.public.apiBase || '').replace(/\/$/, '')
const loading = ref(false)
const loadError = ref('')
const projects = ref([])
const selectedProjectId = ref('')
const selectedProject = ref(null)
const summaryMode = ref('table_all')
const summaryTables = ref([])
const tableColumns = ref([])
const reportRows = ref([])
const searchInput = ref('')
const appliedSearchId = ref('')
const tableSearch = ref('')
const limit = ref(10)
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
  from: 0,
  to: 0
})

const detailRows = computed(() => [
  { label: 'USER:', value: user.value?.username || 'ผู้เยี่ยมชม' },
  { label: 'ฐานข้อมูล', value: selectedProject.value?.rawDatabase || '-' }
])

const visibleRows = computed(() => {
  const term = tableSearch.value.trim().toLowerCase()
  if (!term) {
    return reportRows.value
  }

  return reportRows.value.filter((row) => {
    const values = [
      row.id,
      row.recp,
      row.recpr2,
      ...Object.values(row.tables || {}).map((cell) => `${cell.icon || ''} ${cell.label || ''}`)
    ]

    return values.some((value) => String(value || '').toLowerCase().includes(term))
  })
})

const summaryTotals = computed(() => {
  const round1 = summaryTables.value.reduce((sum, table) => sum + Number(table.round1Count || 0), 0)
  const compare = summaryTables.value.reduce((sum, table) => sum + Number(table.compareCount || 0), 0)
  return {
    round1,
    compare,
    remaining: Math.max(0, round1 - compare)
  }
})
const summaryFirstColumnLabel = computed(() => summaryMode.value === 'database_preface' ? 'ฐานข้อมูล' : 'ตาราง')

const totalPages = computed(() => Math.max(1, Math.ceil(pagination.total / pagination.limit)))
const pageItems = computed(() => {
  const current = pagination.page
  const total = totalPages.value
  const pages = new Set([1, total])
  for (let page = current - 2; page <= current + 2; page += 1) {
    if (page >= 1 && page <= total) {
      pages.add(page)
    }
  }

  const sorted = [...pages].sort((a, b) => a - b)
  const items = []
  let previous = 0
  sorted.forEach((page) => {
    if (previous && page - previous > 1) {
      items.push({ key: `ellipsis-${previous}-${page}`, label: '...', ellipsis: true, disabled: true })
    }
    items.push({ key: `page-${page}`, label: String(page), value: page })
    previous = page
  })

  return items
})

onMounted(() => {
  hydrateUserFromStorage()
  const routeProject = String(route.query.project || route.query.database_code || route.query.project_id || '').trim()
  if (routeProject) {
    selectedProjectId.value = routeProject
  }
  loadReport()
})

async function loadReport(page = pagination.page) {
  if (!apiBase) {
    loadError.value = 'API base URL is not configured'
    return
  }

  loading.value = true
  loadError.value = ''

  try {
    const query = {
      page,
      limit: limit.value
    }
    if (selectedProjectId.value) {
      query.project_id = selectedProjectId.value
    }
    if (appliedSearchId.value) {
      query.search_id = appliedSearchId.value
    }

    const res = await $fetch(`${apiBase}/report.php`, {
      credentials: 'include',
      query
    })
    if (res?.success === false) {
      throw new Error(res.message || 'Cannot load report')
    }

    const data = res?.data || {}
    projects.value = (data.projects || []).map(normalizeProject)
    selectedProject.value = normalizeSelectedProject(data.selected_project)
    summaryMode.value = data.summary_mode || 'table_all'
    selectedProjectId.value = selectedProject.value?.id || selectedProjectId.value || projects.value[0]?.id || ''
    summaryTables.value = (data.tables || []).map(normalizeSummaryTable)
    tableColumns.value = (data.table_columns || []).map(normalizeTableColumn)
    reportRows.value = (data.rows || []).map(normalizeReportRow)
    Object.assign(pagination, {
      page: Number(data.pagination?.page || page || 1),
      limit: Number(data.pagination?.limit || limit.value),
      total: Number(data.pagination?.total || 0),
      from: Number(data.pagination?.from || 0),
      to: Number(data.pagination?.to || 0)
    })
  } catch (error) {
    loadError.value = error?.data?.message || error?.message || 'ไม่สามารถโหลดรายงานผลได้'
    projects.value = []
    summaryMode.value = 'table_all'
    summaryTables.value = []
    tableColumns.value = []
    reportRows.value = []
    Object.assign(pagination, { page: 1, limit: limit.value, total: 0, from: 0, to: 0 })
  } finally {
    loading.value = false
  }
}

function changeDatabase() {
  pagination.page = 1
  tableSearch.value = ''
  loadReport(1)
}

function submitSearch() {
  appliedSearchId.value = searchInput.value.trim()
  tableSearch.value = ''
  pagination.page = 1
  loadReport(1)
}

function clearSearch() {
  searchInput.value = ''
  appliedSearchId.value = ''
  tableSearch.value = ''
  pagination.page = 1
  loadReport(1)
}

function changeLimit() {
  pagination.page = 1
  loadReport(1)
}

function goPage(page) {
  const next = Math.min(Math.max(1, Number(page || 1)), totalPages.value)
  if (next === pagination.page) {
    return
  }
  loadReport(next)
}

function normalizeProject(project) {
  const id = String(project?.project_id || project?.id || project?.database_code || '')
  return {
    ...project,
    id,
    displayName: project?.questionnaire_name || project?.display_name || project?.database_code || id
  }
}

function normalizeSelectedProject(project) {
  if (!project) {
    return null
  }

  return {
    ...project,
    id: project.project_id || project.id || project.database_code,
    displayName: project.questionnaire_name || project.display_name || project.database_code,
    rawDatabase: project.raw_database || project.rawDatabase || ''
  }
}

function normalizeSummaryTable(table) {
  return {
    tableName: table.table_name || table.tableName,
    displayName: table.display_name || table.displayName || table.table_name || table.tableName,
    round1Count: Number(table.round1_count || table.round1Count || 0),
    round2Count: Number(table.round2_count || table.round2Count || 0),
    compareCount: Number(table.compare_count || table.compareCount || 0)
  }
}

function normalizeTableColumn(table) {
  return {
    tableName: table.table_name || table.tableName,
    displayName: table.display_name || table.displayName || table.table_name || table.tableName
  }
}

function normalizeReportRow(row) {
  return {
    id: String(row.id || ''),
    recp: row.recp || '',
    recpr2: row.recpr2 || '',
    tables: row.tables || {}
  }
}

function formatNumber(value) {
  return new Intl.NumberFormat('th-TH').format(Number(value || 0))
}
</script>

<style scoped>
.report-workspace {
  grid-template-columns: minmax(0, 1fr) 486px;
}

.report-search-form {
  display: grid;
  gap: 0;
}

.report-control-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
}

.report-search-actions {
  display: flex;
  min-width: 0;
}

.report-search-actions .btn {
  border-radius: 0;
}

.report-search-actions .btn:last-child {
  border-radius: 0 4px 4px 0;
}

.btn-danger {
  background: #dc3545;
}

.report-table-wrap {
  overflow-x: auto;
}

.report-summary-table,
.report-data-table {
  width: 100%;
  border-collapse: collapse;
}

.report-summary-table th,
.report-summary-table td,
.report-data-table th,
.report-data-table td {
  border: 1px solid var(--line);
  padding: 10px 12px;
}

.report-summary-table th {
  text-align: center;
  vertical-align: bottom;
}

.report-summary-table th:first-child,
.report-summary-table td:first-child,
.report-data-table th,
.report-data-table td {
  text-align: left;
}

.report-summary-table td:not(:first-child),
.report-data-table td:not(:first-child) {
  text-align: center;
}

.report-data-table td.text-left {
  text-align: left;
}

.report-summary-table small {
  font-weight: 400;
}

.report-result-copy {
  margin: -4px 0 14px;
}

.report-error {
  width: 100%;
  margin: -10px 0 16px;
}

.report-result-copy p {
  margin: 0;
}

.report-result-copy h2 {
  margin: 2px 0 0;
  font-size: 22px;
  line-height: 1.25;
}

.report-result-copy strong {
  color: blue;
}

.report-table-tools {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-bottom: 10px;
}

.report-table-tools label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.report-table-tools select {
  width: auto;
  min-width: 58px;
}

.report-table-tools input {
  width: 176px;
}

.report-data-scroll {
  padding-bottom: 12px;
}

.report-data-table {
  min-width: 1200px;
}

.report-data-table th {
  border-bottom: 1px solid #111;
  font-weight: 700;
}

.report-data-table td {
  border-left: 0;
  border-right: 0;
}

.report-data-table tbody tr:nth-child(odd) {
  background: #fafafa;
}

.report-status-icon {
  display: inline-block;
  min-width: 20px;
  text-align: center;
  font-weight: 700;
}

.report-status-icon.ok {
  color: #65bf20;
}

.report-status-icon.warning {
  color: orange;
}

.report-status-icon.danger,
.report-status-icon.empty,
.report-status-icon.slash {
  color: red;
}

.report-pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
  padding-top: 10px;
}

.report-pagination button {
  min-width: 38px;
  min-height: 36px;
  border: 1px solid #cbd3da;
  background: #fff;
  color: #1b2733;
}

.report-pagination button.active {
  background: #e9edf2;
}

.report-pagination button.ellipsis {
  border-color: transparent;
  background: transparent;
}

.report-empty {
  padding: 12px;
  color: var(--muted);
}

@media (max-width: 1100px) {
  .report-workspace {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .report-control-row,
  .report-table-tools {
    display: grid;
    grid-template-columns: 1fr;
  }

  .report-search-actions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .report-search-actions .btn,
  .report-search-actions .btn:last-child {
    border-radius: 4px;
  }

  .report-table-tools input {
    width: 100%;
  }
}
</style>
