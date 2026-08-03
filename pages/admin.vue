<template>
  <main class="legacy-container content-page admin-page">
    <header class="admin-page-head">
      <div>
        <h1 class="page-title">Administrator</h1>
        <p class="updated">เครื่องมือดูแล Compare Data, CHK_USER และรายงานการ compare รายวัน</p>
      </div>
      <span class="admin-user-pill">USER: {{ adminUsername || '-' }}</span>
    </header>

    <nav class="admin-submenu" aria-label="Administrator submenu">
      <button
        v-for="tab in adminTabs"
        :key="tab.id"
        :class="{ active: activeTab === tab.id }"
        type="button"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </nav>

    <p v-if="loadError" class="error-text admin-error">{{ loadError }}</p>
    <p v-if="actionMessage" class="admin-message">{{ actionMessage }}</p>

    <section v-if="activeTab === 'recompare'" class="admin-tool-grid">
      <CommonLegacyPanel title="ยกเลิก Compare / Recompare">
        <p class="tool-hint">
          เลือก Project และฐานข้อมูลเพื่อดูข้อมูล compare ทุกตาราง ถ้ากรอก Search ID ระบบจะกรองเฉพาะรหัสนั้น ถ้าไม่กรอกจะแสดงยอดรวมทั้งหมด การกด Recompare ยังต้องกรอก Search ID เพื่อไม่ให้ลบกว้างเกินไป
        </p>

        <div class="admin-form-grid">
          <label>
            Project
            <select v-model="selectedProjectCode">
              <option v-for="project in projects" :key="project.project_code" :value="project.project_code">
                {{ project.project_name }} ({{ project.project_code }})
              </option>
            </select>
          </label>

          <label>
            ฐานข้อมูล
            <select v-model="selectedDatabaseId">
              <option v-for="database in filteredDatabases" :key="database.database_id" :value="database.database_id">
                {{ databaseLabel(database) }}
              </option>
            </select>
          </label>

          <label class="wide">
            Search ID
            <input v-model.trim="recompareForm.search_id" placeholder="ไม่กรอกก็แสดงผลได้">
          </label>
        </div>

        <div class="admin-actions">
          <button class="btn btn-gray" type="button" :disabled="loadingPreview" @click="loadRecomparePreview">
            {{ loadingPreview ? 'กำลังตรวจ...' : 'ตรวจสอบข้อมูลที่จะลบ' }}
          </button>
          <button
            class="btn btn-warning"
            type="button"
            :disabled="!canRecompareAll || deletingCompare === '__all__'"
            @click="executeRecompareAll"
          >
            {{ deletingCompare === '__all__' ? 'กำลังลบทุกตาราง...' : 'Recompare all' }}
          </button>
        </div>
      </CommonLegacyPanel>

      <CommonLegacyPanel title="สรุป Scope">
        <dl class="detail-list">
          <div>
            <dt>Project</dt>
            <dd>{{ selectedProject?.project_name || '-' }}</dd>
          </div>
          <div>
            <dt>Database</dt>
            <dd>{{ selectedDatabase?.database_code || '-' }}</dd>
          </div>
          <div>
            <dt>Compare DB</dt>
            <dd>{{ selectedDatabase?.compare_database || '-' }}</dd>
          </div>
          <div>
            <dt>Search ID</dt>
            <dd>{{ recompareForm.search_id || '-' }}</dd>
          </div>
        </dl>

        <div v-if="recomparePreview" class="preview-box">
          <strong>ผลตรวจสอบทุกตาราง</strong>
          <div class="metric-grid">
            <span>cmp rows</span>
            <b>{{ formatNumber(recompareTotals.cmp_rows) }}</b>
            <span>cmp complete</span>
            <b>{{ formatNumber(recompareTotals.cmp_completed_rows) }}</b>
            <span>cmp pending</span>
            <b>{{ formatNumber(recompareTotals.cmp_pending_rows) }}</b>
            <span>chk_user rows</span>
            <b>{{ formatNumber(recompareTotals.chk_user_rows) }}</b>
          </div>
          <small>พบข้อมูล compare ใน {{ formatNumber(recompareTotals.tables_with_cmp_rows) }} จาก {{ formatNumber(recompareTotals.tables) }} ตาราง</small>
        </div>

        <div v-if="recompareResult" class="preview-box success">
          <strong>ดำเนินการแล้ว</strong>
          <div class="metric-grid">
            <span>deleted cmp</span>
            <b>{{ formatNumber(recompareResult.deleted_cmp_rows) }}</b>
            <span>deleted chk_user</span>
            <b>{{ formatNumber(recompareResult.deleted_chk_user_rows) }}</b>
          </div>
        </div>
      </CommonLegacyPanel>
    </section>

    <CommonLegacyPanel v-if="activeTab === 'recompare'" title="รายการ Compare ที่พบ">
      <div class="admin-table-wrap">
        <table class="admin-data-table recompare-table recompare-matrix">
          <thead>
            <tr>
              <th>No</th>
              <th>ID</th>
              <th>UserR1</th>
              <th>UserR2</th>
              <th v-for="column in recompareColumns" :key="column.table_name">
                {{ column.table_name }}
                <small v-if="column.display_name && column.display_name !== column.table_name">{{ column.display_name }}</small>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in recompareMatrixRows" :key="row.id">
              <td class="number-cell">{{ index + 1 }}</td>
              <td>{{ row.id }}</td>
              <td>{{ row.user_r1 || '-' }}</td>
              <td>{{ row.user_r2 || '-' }}</td>
              <td v-for="column in recompareColumns" :key="`${row.id}:${column.table_name}`" class="recompare-cell-wrap">
                <div v-if="row.cells && row.cells[column.table_name]" class="recompare-cell">
                  <span
                    :class="['cell-icon', recompareStatusClass(row.cells[column.table_name])]"
                    :title="recompareCellTitle(row.cells[column.table_name])"
                  >
                    {{ recompareCellIcon(row.cells[column.table_name]) }}
                  </span>
                  <button
                    class="btn btn-warning btn-small"
                    type="button"
                    :disabled="!row.cells[column.table_name].has_compare_data || deletingCompare === recompareCellKey(row.id, column.table_name)"
                    @click="executeRecompareCell(row, column)"
                  >
                    {{ deletingCompare === recompareCellKey(row.id, column.table_name) ? 'กำลังลบ...' : 'Recompare' }}
                  </button>
                </div>
                <span v-else class="empty-cell">--</span>
              </td>
            </tr>
            <tr v-if="recomparePreview && !recompareMatrixRows.length">
              <td :colspan="recompareTableColspan">ยังไม่มีรายการ compare สำหรับฐานข้อมูลนี้</td>
            </tr>
            <tr v-if="!recomparePreview">
              <td :colspan="recompareTableColspan">กด “ตรวจสอบข้อมูลที่จะลบ” เพื่อดูรายการ compare ทุกตาราง</td>
            </tr>
          </tbody>
        </table>
      </div>
    </CommonLegacyPanel>

    <section v-if="activeTab === 'chk_user'" class="admin-tool-grid">
      <CommonLegacyPanel title="จัดการข้อมูล CHK_USER">
        <p class="tool-hint">
          เลือก Project และฐานข้อมูลเพื่อดูรายการในตาราง `_cmp.chk_user` ถ้ากรอก Search ID ระบบจะกรองแบบ prefix ถ้าไม่กรอกจะแสดงรายการล่าสุดตาม limit
        </p>

        <div class="admin-form-grid">
          <label>
            Project
            <select v-model="selectedProjectCode">
              <option v-for="project in projects" :key="project.project_code" :value="project.project_code">
                {{ project.project_name }} ({{ project.project_code }})
              </option>
            </select>
          </label>

          <label>
            ฐานข้อมูล
            <select v-model="selectedDatabaseId">
              <option v-for="database in filteredDatabases" :key="database.database_id" :value="database.database_id">
                {{ databaseLabel(database) }}
              </option>
            </select>
          </label>

          <label>
            Search ID
            <input v-model.trim="chkUserFilters.search_id" placeholder="ไม่กรอกก็แสดงผลได้">
          </label>
        </div>

        <div class="admin-actions">
          <button class="btn btn-gray" type="button" :disabled="loadingChkUser" @click="loadChkUserRows">
            {{ loadingChkUser ? 'กำลังโหลด...' : 'แสดง CHK_USER' }}
          </button>
          <button class="btn btn-warning" type="button" :disabled="loadingChkUser || !chkUserRows.length" @click="exportChkUser">
            EXPORT XLS
          </button>
        </div>
      </CommonLegacyPanel>

      <CommonLegacyPanel title="สรุป CHK_USER">
        <dl class="detail-list">
          <div>
            <dt>Compare DB</dt>
            <dd>{{ selectedDatabase?.compare_database || '-' }}</dd>
          </div>
          <div>
            <dt>จำนวนทั้งหมด</dt>
            <dd>{{ formatNumber(chkUserTotal) }} rows</dd>
          </div>
          <div>
            <dt>แสดงผล</dt>
            <dd>{{ formatNumber(chkUserRows.length) }} rows</dd>
          </div>
        </dl>
      </CommonLegacyPanel>
    </section>

    <CommonLegacyPanel v-if="activeTab === 'chk_user'" title="CHK_USER Detail">
      <div class="admin-table-wrap">
        <table class="admin-data-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Database</th>
              <th>User</th>
              <th>Tab</th>
              <th>HHID</th>
              <th>date</th>
              <th>time</th>
              <th>keyfields</th>
              <th>val_r1</th>
              <th>val_r2</th>
              <th>val</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in chkUserRows" :key="`${row.hhid}-${row.tab}-${row.keyfields}-${index}`">
              <td>{{ row.project }}</td>
              <td>{{ row.database }}</td>
              <td>{{ row.user }}</td>
              <td>{{ row.tab }}</td>
              <td>{{ row.hhid }}</td>
              <td>{{ row.date }}</td>
              <td>{{ row.time }}</td>
              <td>{{ row.keyfields }}</td>
              <td>{{ row.val_r1 }}</td>
              <td>{{ row.val_r2 }}</td>
              <td>{{ row.val }}</td>
            </tr>
            <tr v-if="!chkUserRows.length">
              <td colspan="11">ไม่พบข้อมูล CHK_USER ตามเงื่อนไข</td>
            </tr>
          </tbody>
        </table>
      </div>
    </CommonLegacyPanel>

    <section v-if="activeTab === 'daily'" class="admin-tool-grid">
      <CommonLegacyPanel title="รายงาน Compare รายวัน">
        <p class="tool-hint">
          แสดงว่าวันที่เลือกมีการ compare Project ไหน ฐานไหน ตารางไหน และเสร็จกี่รหัสแล้ว โดยอ้างอิง `cmp_compare_run_records` ถ้าไม่มีข้อมูลจึง fallback ไปอ่าน `_cmp.chk_user`
        </p>

        <div class="admin-form-grid">
          <label>
            วันที่
            <input v-model="dailyDate" type="date">
          </label>
        </div>

        <div class="admin-actions">
          <button class="btn btn-gray" type="button" :disabled="loadingDaily" @click="loadDailyReport">
            {{ loadingDaily ? 'กำลังโหลด...' : 'แสดงรายงานรายวัน' }}
          </button>
        </div>
      </CommonLegacyPanel>

      <CommonLegacyPanel title="สรุปรายวัน">
        <dl class="detail-list">
          <div>
            <dt>วันที่</dt>
            <dd>{{ dailyReport.date || dailyDate }}</dd>
          </div>
          <div>
            <dt>แหล่งข้อมูล</dt>
            <dd>{{ dailyReport.source || '-' }}</dd>
          </div>
          <div>
            <dt>จำนวนรหัส</dt>
            <dd>{{ formatNumber(dailyReport.summary?.compared_ids || 0) }}</dd>
          </div>
          <div>
            <dt>จำนวนรายการ</dt>
            <dd>{{ formatNumber(dailyReport.summary?.completed_records || 0) }}</dd>
          </div>
        </dl>
      </CommonLegacyPanel>
    </section>

    <CommonLegacyPanel v-if="activeTab === 'daily'" title="รายการ Compare รายวัน">
      <div class="admin-table-wrap">
        <table class="admin-data-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>ฐานข้อมูล</th>
              <th>ตาราง</th>
              <th>จำนวนรหัส</th>
              <th>จำนวนรายการ</th>
              <th>เริ่ม</th>
              <th>ล่าสุด</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in dailyRows" :key="`${row.project_code}-${row.database_code}-${row.table_name}`">
              <td>
                <strong>{{ row.project_name || row.project_code }}</strong>
                <small>{{ row.project_code }}</small>
              </td>
              <td>
                <strong>{{ row.questionnaire_name || row.database_code }}</strong>
                <small>{{ row.database_code }}</small>
              </td>
              <td>{{ row.table_name }}</td>
              <td class="number-cell">{{ formatNumber(row.compared_ids) }}</td>
              <td class="number-cell">{{ formatNumber(row.completed_records) }}</td>
              <td>{{ formatDateTime(row.first_completed_at) }}</td>
              <td>{{ formatDateTime(row.last_completed_at) }}</td>
            </tr>
            <tr v-if="!dailyRows.length">
              <td colspan="7">ยังไม่มีรายการ compare ในวันที่เลือก</td>
            </tr>
          </tbody>
        </table>
      </div>
    </CommonLegacyPanel>
  </main>
</template>

<script setup>
const config = useRuntimeConfig()

const apiBase = String(config.public.apiBase || '').replace(/\/$/, '')
const adminTabs = [
  { id: 'recompare', label: 'ยกเลิก Compare / Recompare' },
  { id: 'chk_user', label: 'CHK_USER / Export' },
  { id: 'daily', label: 'รายงาน Compare รายวัน' }
]

const activeTab = ref('recompare')
const projects = ref([])
const databases = ref([])
const tables = ref([])
const selectedProjectCode = ref('')
const selectedDatabaseId = ref('')
const selectedTableName = ref('')
const loadError = ref('')
const actionMessage = ref('')
const loadingOptions = ref(false)
const loadingTables = ref(false)
const loadingPreview = ref(false)
const deletingCompare = ref('')
const loadingChkUser = ref(false)
const loadingDaily = ref(false)
const recomparePreview = ref(null)
const recompareResult = ref(null)
const chkUserRows = ref([])
const chkUserTotal = ref(0)
const dailyReport = ref({})
const dailyRows = ref([])
const dailyDate = ref(localDateString())

const recompareForm = reactive({
  search_id: ''
})

const chkUserFilters = reactive({
  search_id: '',
  limit: 500
})

const filteredDatabases = computed(() => {
  if (!selectedProjectCode.value) return databases.value
  return databases.value.filter((database) => database.project_code === selectedProjectCode.value)
})

const selectedProject = computed(() => projects.value.find((project) => project.project_code === selectedProjectCode.value) || null)
const selectedDatabase = computed(() => databases.value.find((database) => Number(database.database_id) === Number(selectedDatabaseId.value)) || null)
const recompareColumns = computed(() => recomparePreview.value?.columns || [])
const recompareMatrixRows = computed(() => recomparePreview.value?.matrix_rows || [])
const recompareTotals = computed(() => recomparePreview.value?.totals || {})
const recompareTableColspan = computed(() => 4 + recompareColumns.value.length)
const canRecompareAll = computed(() => Boolean(recompareForm.search_id.trim()) && recompareMatrixRows.value.length > 0)

const adminUsername = computed(() => {
  if (!process.client) return ''
  try {
    const datauser = JSON.parse(localStorage.getItem('datauser') || '{}')
    return datauser.username || localStorage.getItem('tcls-user') || ''
  } catch {
    return localStorage.getItem('tcls-user') || ''
  }
})

onMounted(async () => {
  await loadOptions()
  await loadDailyReport()
})

watch(selectedProjectCode, () => {
  const first = filteredDatabases.value[0]
  selectedDatabaseId.value = first ? String(first.database_id) : ''
})

watch(selectedDatabaseId, async () => {
  selectedTableName.value = ''
  recomparePreview.value = null
  recompareResult.value = null
  await loadTables()
})

watch(selectedTableName, (tableName) => {
  selectedTableName.value = tableName || ''
})

watch(() => recompareForm.search_id, () => {
  recomparePreview.value = null
  recompareResult.value = null
})

function localDateString(date = new Date()) {
  const copy = new Date(date)
  copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset())
  return copy.toISOString().slice(0, 10)
}

function toolUrl(params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value)
    }
  })

  return `${apiBase}/manage/admin-compare-tools.php${query.toString() ? `?${query}` : ''}`
}

function authHeaders() {
  if (!process.client) return {}
  const token = localStorage.getItem('_token_tcls')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function fetchTool(params = {}, options = {}) {
  if (!apiBase) {
    throw new Error('API base URL is not configured')
  }

  return await $fetch(toolUrl(params), {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers || {})
    }
  })
}

async function loadOptions() {
  loadingOptions.value = true
  loadError.value = ''
  try {
    const res = await fetchTool({ action: 'options' })
    projects.value = res?.data?.projects || []
    databases.value = res?.data?.databases || []
    if (!selectedProjectCode.value && projects.value.length) {
      selectedProjectCode.value = projects.value[0].project_code
    }
    if (!selectedDatabaseId.value && filteredDatabases.value.length) {
      selectedDatabaseId.value = String(filteredDatabases.value[0].database_id)
    }
    await loadTables()
  } catch (error) {
    loadError.value = error?.data?.message || error?.message || 'ไม่สามารถโหลดข้อมูล Administrator ได้'
  } finally {
    loadingOptions.value = false
  }
}

async function loadTables() {
  if (!selectedDatabaseId.value) {
    tables.value = []
    return
  }

  loadingTables.value = true
  try {
    const res = await fetchTool({ action: 'tables', database_id: selectedDatabaseId.value })
    tables.value = res?.data?.tables || []
    if (!selectedTableName.value && tables.value.length) {
      selectedTableName.value = tables.value[0].table_name
    }
  } catch (error) {
    tables.value = []
    loadError.value = error?.data?.message || error?.message || 'ไม่สามารถโหลดรายการตารางได้'
  } finally {
    loadingTables.value = false
  }
}

function validateScope(requireTable = true, requireSearch = false) {
  actionMessage.value = ''
  loadError.value = ''
  if (!selectedDatabaseId.value) {
    loadError.value = 'กรุณาเลือกฐานข้อมูล'
    return false
  }
  if (requireTable && !selectedTableName.value) {
    loadError.value = 'กรุณาเลือกตาราง'
    return false
  }
  if (requireSearch && !recompareForm.search_id.trim()) {
    loadError.value = 'กรุณากรอก Search ID'
    return false
  }
  return true
}

async function loadRecomparePreview(clearResult = true) {
  if (!validateScope(false, false)) return

  loadingPreview.value = true
  if (clearResult) {
    recompareResult.value = null
  }
  try {
    const res = await fetchTool({
      action: 'recompare-preview-all',
      database_id: selectedDatabaseId.value,
      search_id: recompareForm.search_id.trim()
    })
    recomparePreview.value = res?.data || null
    actionMessage.value = 'ตรวจสอบข้อมูลที่จะลบแล้ว'
  } catch (error) {
    recomparePreview.value = null
    loadError.value = error?.data?.message || error?.message || 'ตรวจสอบข้อมูลที่จะลบไม่สำเร็จ'
  } finally {
    loadingPreview.value = false
  }
}

async function executeRecompareCell(row, column) {
  const tableName = column?.table_name || ''
  const searchId = row?.id || ''
  const cell = row?.cells?.[tableName] || null
  if (!validateScope(false, false)) return

  if (!recomparePreview.value) {
    await loadRecomparePreview(false)
  }
  if (!tableName || !searchId || !cell?.has_compare_data) {
    loadError.value = 'ไม่พบข้อมูลใน _cmp หรือ chk_user ของตารางนี้'
    return
  }

  await executeRecompareForTable(tableName, searchId)
}

async function executeRecompareForTable(tableName, searchId) {
  const ok = window.confirm(`ยืนยันลบข้อมูล compare ของ ${selectedDatabase.value?.compare_database}.${tableName} รหัส ${searchId} ?`)
  if (!ok) return

  deletingCompare.value = recompareCellKey(searchId, tableName)
  try {
    const res = await fetchTool({}, {
      method: 'POST',
      body: {
        action: 'recompare',
        database_id: Number(selectedDatabaseId.value),
        table_name: tableName,
        search_id: searchId,
        confirm: true
      }
    })
    recompareResult.value = res?.data?.result || null
    actionMessage.value = 'ยกเลิก compare/recompare แล้ว'
    await loadRecomparePreview(false)
  } catch (error) {
    loadError.value = error?.data?.message || error?.message || 'ยกเลิก compare/recompare ไม่สำเร็จ'
  } finally {
    deletingCompare.value = ''
  }
}

async function executeRecompareAll() {
  if (!validateScope(false, true)) return
  if (!recompareMatrixRows.value.length) {
    loadError.value = 'ยังไม่มีรายการ compare สำหรับรหัสนี้'
    return
  }

  const searchId = recompareForm.search_id.trim()
  const ok = window.confirm(`ยืนยันลบข้อมูล compare ทุกตารางของ ${selectedDatabase.value?.compare_database} รหัส ${searchId} ?`)
  if (!ok) return

  deletingCompare.value = '__all__'
  try {
    const res = await fetchTool({}, {
      method: 'POST',
      body: {
        action: 'recompare-all',
        database_id: Number(selectedDatabaseId.value),
        search_id: searchId,
        confirm: true
      }
    })
    recompareResult.value = res?.data || null
    actionMessage.value = 'ยกเลิก compare/recompare ทุกตารางแล้ว'
    await loadRecomparePreview(false)
  } catch (error) {
    loadError.value = error?.data?.message || error?.message || 'ยกเลิก compare/recompare ทุกตารางไม่สำเร็จ'
  } finally {
    deletingCompare.value = ''
  }
}

function chkUserParams(extra = {}) {
  return {
    action: 'chk_user',
    database_id: selectedDatabaseId.value,
    search_id: chkUserFilters.search_id.trim(),
    limit: chkUserFilters.limit,
    ...extra
  }
}

async function loadChkUserRows() {
  if (!validateScope(false, false)) return

  loadingChkUser.value = true
  try {
    const res = await fetchTool(chkUserParams())
    chkUserRows.value = res?.data?.rows || []
    chkUserTotal.value = Number(res?.data?.total || 0)
    actionMessage.value = 'โหลด CHK_USER แล้ว'
  } catch (error) {
    chkUserRows.value = []
    chkUserTotal.value = 0
    loadError.value = error?.data?.message || error?.message || 'โหลด CHK_USER ไม่สำเร็จ'
  } finally {
    loadingChkUser.value = false
  }
}

async function exportChkUser() {
  if (!validateScope(false, false)) return

  loadingChkUser.value = true
  try {
    const response = await fetch(toolUrl(chkUserParams({ export: 'xls' })), {
      headers: authHeaders()
    })
    if (!response.ok) {
      throw new Error('Export failed')
    }
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `chk_user_${selectedDatabase.value?.database_code || 'export'}_${Date.now()}.xls`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    actionMessage.value = 'Export CHK_USER เป็น XLS แล้ว'
  } catch (error) {
    loadError.value = error?.message || 'Export CHK_USER ไม่สำเร็จ'
  } finally {
    loadingChkUser.value = false
  }
}

async function loadDailyReport() {
  loadingDaily.value = true
  try {
    const res = await fetchTool({ action: 'daily-report', date: dailyDate.value })
    dailyReport.value = res?.data || {}
    dailyRows.value = res?.data?.rows || []
    actionMessage.value = activeTab.value === 'daily' ? 'โหลดรายงานรายวันแล้ว' : actionMessage.value
  } catch (error) {
    dailyReport.value = {}
    dailyRows.value = []
    loadError.value = error?.data?.message || error?.message || 'โหลดรายงานรายวันไม่สำเร็จ'
  } finally {
    loadingDaily.value = false
  }
}

function databaseLabel(database) {
  const name = database.questionnaire_name || database.database_code
  return `${name} (${database.database_code})`
}

function formatNumber(value) {
  return new Intl.NumberFormat('th-TH').format(Number(value || 0))
}

function formatDateTime(value) {
  return value ? String(value).replace('T', ' ').slice(0, 19) : '-'
}

function recompareStatusText(row) {
  if (!row.cmp_table_exists) return 'ยังไม่มีตาราง _cmp'
  if (!row.has_compare_data) return 'ยังไม่พบ compare'
  if (Number(row.cmp_completed_rows || 0) > 0) return 'Compare แล้ว'
  if (Number(row.cmp_pending_rows || 0) > 0) return 'มีข้อมูลรอ compare'
  return 'มีเฉพาะ chk_user'
}

function recompareStatusClass(row) {
  if (!row.cmp_table_exists || !row.has_compare_data) return 'muted'
  if (Number(row.cmp_completed_rows || 0) > 0) return 'ok'
  if (Number(row.cmp_pending_rows || 0) > 0) return 'warning'
  return 'danger'
}

function recompareCellKey(searchId, tableName) {
  return `${searchId}:${tableName}`
}

function recompareCellIcon(cell) {
  if (!cell?.has_compare_data) return '--'
  if (Number(cell.cmp_completed_rows || 0) > 0) return '✓'
  if (Number(cell.cmp_pending_rows || 0) > 0) return '▲'
  return '✓'
}

function recompareCellTitle(cell) {
  return [
    recompareStatusText(cell),
    `cmp: ${formatNumber(cell.cmp_rows)}`,
    `cmp complete: ${formatNumber(cell.cmp_completed_rows)}`,
    `cmp pending: ${formatNumber(cell.cmp_pending_rows)}`,
    `chk_user: ${formatNumber(cell.chk_user_rows)}`
  ].join('\n')
}
</script>

<style scoped>
.admin-page {
  padding-bottom: 40px;
}

.admin-page-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 16px;
}

.admin-user-pill {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 6px 12px;
  border: 1px solid var(--line);
  background: #eef2f6;
  color: #3f4e5f;
  font-size: 13px;
}

.admin-submenu {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--line);
  padding-bottom: 10px;
}

.admin-submenu button {
  border: 1px solid #cfd6dd;
  background: #fff;
  color: #1f2a35;
  min-height: 36px;
  padding: 7px 12px;
}

.admin-submenu button.active {
  background: #6c757d;
  color: #fff;
  border-color: #6c757d;
}

.admin-tool-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px;
  gap: 24px;
  align-items: start;
}

.tool-hint {
  margin: 0 0 14px;
  color: #5b6875;
  line-height: 1.6;
}

.admin-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.admin-form-grid label {
  display: grid;
  gap: 6px;
  font-weight: 600;
}

.admin-form-grid input,
.admin-form-grid select {
  width: 100%;
  min-height: 36px;
}

.admin-form-grid .wide {
  grid-column: 1 / -1;
}

.admin-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.btn-danger {
  background: #dc3545;
}

.btn-warning {
  background: #ffc107;
  color: #1f2a35;
}

.btn-small {
  min-height: 30px;
  padding: 5px 10px;
  font-size: 13px;
}

.detail-list {
  display: grid;
  gap: 8px;
  margin: 0;
}

.detail-list div,
.metric-grid {
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr);
  align-items: center;
  gap: 0;
}

.detail-list dt,
.metric-grid span {
  padding: 8px 10px;
  background: #6c757d;
  color: #fff;
  font-weight: 700;
}

.detail-list dd,
.metric-grid b {
  margin: 0;
  min-height: 36px;
  padding: 8px 10px;
  border: 1px solid #cfd6dd;
  background: #eef2f6;
  color: #3f4e5f;
  font-weight: 500;
}

.preview-box {
  display: grid;
  gap: 10px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--line);
}

.preview-box.success b {
  color: #16803a;
}

.preview-box small {
  color: #5b6875;
}

.admin-table-wrap {
  overflow-x: auto;
}

.admin-data-table {
  width: 100%;
  min-width: 980px;
  border-collapse: collapse;
}

.admin-data-table th,
.admin-data-table td {
  border: 1px solid var(--line);
  padding: 8px 10px;
  text-align: left;
  vertical-align: top;
}

.admin-data-table th {
  background: #f5f5f5;
  font-weight: 700;
}

.admin-data-table tbody tr:nth-child(odd) {
  background: #fafafa;
}

.admin-data-table small {
  display: block;
  color: #697684;
  margin-top: 2px;
}

.recompare-table {
  min-width: 1120px;
}

.recompare-matrix {
  min-width: 1280px;
}

.recompare-matrix th {
  white-space: nowrap;
}

.recompare-cell-wrap {
  min-width: 96px;
}

.recompare-cell {
  display: grid;
  gap: 4px;
  justify-items: start;
}

.cell-icon {
  display: inline-flex;
  min-height: 18px;
  align-items: center;
  font-weight: 700;
}

.cell-icon.ok,
.cell-icon.danger {
  color: #64b832;
}

.cell-icon.warning {
  color: #c58a00;
}

.cell-icon.muted,
.empty-cell {
  color: #dc3545;
}

.empty-cell {
  font-weight: 700;
}

.admin-status {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 3px 8px;
  border: 1px solid #d8dee5;
  background: #f5f5f5;
  color: #5b6875;
  font-size: 12px;
  font-weight: 700;
}

.admin-status.ok {
  border-color: #9fd2b0;
  background: #e6f5eb;
  color: #166534;
}

.admin-status.warning {
  border-color: #f2d07a;
  background: #fff7df;
  color: #7a5200;
}

.admin-status.danger {
  border-color: #f0b4b4;
  background: #fff0f0;
  color: #9f1239;
}

.admin-status.muted {
  color: #697684;
}

.number-cell {
  text-align: right;
}

.admin-error,
.admin-message {
  margin-bottom: 12px;
}

.admin-message {
  color: #166534;
}

@media (max-width: 1100px) {
  .admin-tool-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .admin-page-head,
  .admin-form-grid {
    grid-template-columns: 1fr;
  }

  .admin-page-head {
    display: grid;
  }
}
</style>
