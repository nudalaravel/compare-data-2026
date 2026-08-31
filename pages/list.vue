
<template>
  <main class="survey-list-page">
    <section class="survey-hero">
      <div class="survey-hero-nav survey-container">
        <strong>Survey List</strong>
        <nav>
          <button class="survey-admin-nav-button" type="button" @click="openAdminAccess">
            สำหรับผู้ดูแลระบบ
          </button>
        </nav>
      </div>

      <div class="survey-hero-content">
        <h1>Survey Web</h1>
        <p>(web keyin data online)</p>
        <p>All website on http://ripedresearch.org/survey</p>
      </div>
    </section>

    <section v-if="adminSession" ref="adminPanel" class="survey-container admin-workspace">
      <header class="admin-head">
        <div>
          <p>Administrator</p>
          <h2>จัดการระบบ Key-in และ Compare</h2>
        </div>
        <div class="admin-session">
          <span>Admin: {{ adminSession.username }}</span>
          <button type="button" @click="logoutAdmin">ออกจากโหมดผู้ดูแล</button>
        </div>
      </header>

      <div class="admin-tabbar">
        <button
          v-for="tab in adminTabs"
          :key="tab.id"
          :class="{ active: adminTab === tab.id }"
          type="button"
          @click="adminTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <p v-if="adminMessage" class="admin-message">{{ adminMessage }}</p>
      <p v-if="adminError" class="admin-error">{{ adminError }}</p>

      <section v-show="adminTab === 'projects'" class="admin-section">
        <div class="section-title">
          <h3>Project</h3>
          <button type="button" @click="resetProjectForm">เพิ่มใหม่</button>
        </div>
        <p class="tab-hint">
          เพิ่มหรือแก้โครงการหลักที่จะแสดงในหน้า Survey List พร้อมกำหนด URL คีย์ข้อมูล, URL compare, ช่วงเวลา และสถานะเปิดใช้งาน
        </p>

        <form class="admin-form" @submit.prevent="saveProject">
          <label>
            Project Code
            <input v-model="projectForm.project_code" placeholder="tcls2027">
          </label>
          <label>
            Project Name
            <input v-model="projectForm.project_name" placeholder="TCLS2027">
          </label>
          <label>
            Key-in URL
            <input v-model="projectForm.keyin_url" placeholder="https://ripedresearch.org/survey/tcls2027">
          </label>
          <label>
            Compare URL
            <input v-model="projectForm.compare_url" placeholder="/compare-data/?project=tcls2027">
          </label>
          <label>
            Start Date
            <input v-model="projectForm.start_date" type="date">
          </label>
          <label>
            End Date
            <input v-model="projectForm.end_date" type="date">
          </label>
          <label>
            Status
            <select v-model="projectForm.status" @change="applyProjectStatusDefaults">
              <option v-for="option in projectStatusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>
          <label>
            Display Order
            <input v-model.number="projectForm.display_order" type="number">
          </label>
          <label class="full">
            Description
            <textarea v-model="projectForm.description" rows="3"></textarea>
          </label>
          <div class="admin-check-row full">
            <label><input v-model="projectForm.keyin_active" type="checkbox"> เปิดคีย์ข้อมูล</label>
            <label><input v-model="projectForm.compare_ready" type="checkbox"> เปิด compare data</label>
            <label><input v-model="projectForm.is_visible" type="checkbox"> แสดงบนหน้า list</label>
          </div>
          <div class="form-actions full">
            <button type="submit" :disabled="adminSaving">
              {{ adminSaving ? 'กำลังบันทึก...' : 'บันทึก Project' }}
            </button>
          </div>
        </form>

        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Status</th>
                <th>DB</th>
                <th>Prepared</th>
                <th>Tables</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="project in surveySystems" :key="project.project_code" :class="{ selected: project.project_code === selectedProjectCode }">
                <td>
                  <strong>{{ project.project_name }}</strong>
                  <small>{{ project.project_code }}</small>
                </td>
                <td><span :class="['mini-status', project.statusTone]">{{ project.status_text }}</span></td>
                <td>{{ project.database_count }}</td>
                <td>{{ project.prepared_count }}</td>
                <td>{{ project.table_count }}</td>
                <td>
                  <button type="button" @click="selectProject(project)">เลือก</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section v-show="adminTab === 'databases'" class="admin-section">
        <div class="section-title">
          <h3>Project Database</h3>
          <button type="button" :disabled="!canUseDatabaseTools" @click="resetDatabaseForm">เพิ่มฐานใหม่</button>
        </div>
        <p class="tab-hint">
          เพิ่มชุดแบบสอบถามหรือฐานข้อมูลของ Project ระบุฐาน raw และชื่อฐาน compare ที่สัมพันธ์กัน โดยยังไม่สร้างฐาน _cmp จนกดเตรียมระบบ Compare
        </p>
        <p class="section-note">
          {{ selectedProject ? `Project: ${selectedProject.project_name}` : 'เลือก Project ก่อนเพิ่มฐานข้อมูล' }}
        </p>

        <form class="admin-form" @submit.prevent="saveDatabase">
          <label>
            Database Code
            <input v-model="databaseForm.database_code" :disabled="!canUseDatabaseTools" placeholder="tcls2027_ch">
          </label>
          <label>
            ชื่อแบบสอบถาม
            <input v-model="databaseForm.questionnaire_name" :disabled="!canUseDatabaseTools" placeholder="เช่น แบบสอบถามเด็ก CH1">
          </label>
          <label>
            Preface Table
            <input v-model="databaseForm.table_preface" :disabled="!canUseDatabaseTools" placeholder="preface_ch">
          </label>
          <label>
            Raw Database
            <input v-model="databaseForm.raw_database" :disabled="!canUseDatabaseTools" placeholder="tcls2027_ch">
          </label>
          <label>
            Compare Database
            <input v-model="databaseForm.compare_database" :disabled="!canUseDatabaseTools" placeholder="tcls2027_ch_cmp">
          </label>
          <label>
            Round Field
            <input v-model="databaseForm.round_field" :disabled="!canUseDatabaseTools" placeholder="round">
          </label>
          <label>
            Search Column
            <input v-model="databaseForm.search_column" :disabled="!canUseDatabaseTools" placeholder="CID">
          </label>
          <label>
            searchId1 Start
            <input v-model.number="databaseForm.search_id1_start" type="number" min="1" :disabled="!canUseDatabaseTools">
          </label>
          <label>
            searchId1 Length
            <input v-model.number="databaseForm.search_id1_length" type="number" min="1" :disabled="!canUseDatabaseTools">
          </label>
          <label>
            searchId2 Start
            <input v-model.number="databaseForm.search_id2_start" type="number" min="1" :disabled="!canUseDatabaseTools">
          </label>
          <label>
            searchId2 Length
            <input v-model.number="databaseForm.search_id2_length" type="number" min="1" :disabled="!canUseDatabaseTools" placeholder="blank = end">
          </label>
          <label>
            searchId2 Mode
            <select v-model="databaseForm.search_id2_mode" :disabled="!canUseDatabaseTools">
              <option value="exact">Exact</option>
              <option value="prefix">Prefix</option>
            </select>
          </label>
          <label>
            Round 1 Value
            <input v-model="databaseForm.round1_value" :disabled="!canUseDatabaseTools" placeholder="1">
          </label>
          <label>
            Round 2 Value
            <input v-model="databaseForm.round2_value" :disabled="!canUseDatabaseTools" placeholder="2">
          </label>
          <label>
            Completed Value
            <input v-model="databaseForm.completed_round_value" :disabled="!canUseDatabaseTools" placeholder="0">
          </label>
          <label class="admin-check">
            <input v-model="databaseForm.compare_enabled" type="checkbox" :disabled="!canUseDatabaseTools">
            <span>Compare Enabled</span>
          </label>
          <label>
            Status
            <select v-model="databaseForm.status" :disabled="!canUseDatabaseTools">
              <option v-for="option in databaseStatusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>
          <label>
            Display Order
            <input v-model.number="databaseForm.display_order" type="number" :disabled="!canUseDatabaseTools">
          </label>
          <label class="full">
            Description
            <textarea v-model="databaseForm.description" :disabled="!canUseDatabaseTools" rows="2"></textarea>
          </label>
          <label class="full">
            Sample ID SQL
            <textarea
              v-model="databaseForm.sample_ids_sql"
              class="sample-sql-textarea"
              :disabled="!canUseDatabaseTools"
              rows="10"
              placeholder="SELECT 'cct2025' AS project_code, 'cct2025' AS database_code, CID AS id FROM cct2025.table0 UNION SELECT 'cct2025', 'cct2025', CID FROM cct2025.table1"
            ></textarea>
            <small class="field-help">ใช้เมื่อเงื่อนไขรหัสของโครงการไม่ตายตัว SQL ต้องคืนเฉพาะ project_code, database_code, id</small>
          </label>
          <p class="field-help full">
            Search split uses 1-based positions. Default searchId1 is positions 1-12 and searchId2 starts at 13, so position 12 is not duplicated.
          </p>
          <div class="form-actions full">
            <button type="submit" :disabled="adminSaving || !canUseDatabaseTools">
              {{ adminSaving ? 'กำลังบันทึก...' : 'บันทึก Database' }}
            </button>
            <button type="button" :disabled="adminSaving || !selectedDatabaseId" @click="prepareCompareDatabase">
              เตรียมระบบ Compare
            </button>
          </div>
        </form>

        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Database Code</th>
                <th>ชื่อแบบ</th>
                <th>Preface</th>
                <th>Raw</th>
                <th>Compare</th>
                <th>Round</th>
                <th>Enabled</th>
                <th>Status</th>
                <th>Tables</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="database in adminDatabases" :key="database.database_id" :class="{ selected: database.database_id === selectedDatabaseId }">
                <td>{{ database.database_code }}</td>
                <td>{{ database.questionnaire_name || '-' }}</td>
                <td>{{ database.table_preface || database.tablePreface || '-' }}</td>
                <td>{{ database.raw_database }}</td>
                <td>{{ database.compare_database }}</td>
                <td>{{ database.round1_value || '1' }}/{{ database.round2_value || '2' }}/{{ database.completed_round_value || '0' }}</td>
                <td>{{ database.compare_enabled ? 'on' : 'off' }}</td>
                <td>{{ database.is_prepared ? 'prepared' : database.status }}</td>
                <td>{{ database.table_count }}</td>
                <td>
                  <button type="button" @click="selectDatabase(database)">เลือก</button>
                </td>
              </tr>
              <tr v-if="!adminLoading && !adminDatabases.length">
                <td colspan="10">ยังไม่มีฐานข้อมูลใน Project นี้</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section v-show="adminTab === 'tables'" class="admin-section">
        <div class="section-title">
          <h3>Tables</h3>
          <button type="button" :disabled="tablesLoading || !canUseTableTools" @click="loadDatabaseTables">
            {{ tablesLoading ? 'กำลัง scan...' : 'Scan Tables' }}
          </button>
        </div>
        <p class="tab-hint">
          Scan ตารางจาก raw database เลือกตารางที่เปิด Compare กำหนดชื่อแสดงและ Order (ลำดับการแสดงผล) ได้ ส่วน Primary Key แสดงเพื่ออ้างอิงเท่านั้น
        </p>
        <p class="section-note">
          {{ selectedDatabase ? `Raw database: ${selectedDatabase.raw_database}` : 'เลือก Database ก่อน scan ตาราง' }}
        </p>

        <div class="admin-table-wrap wide">
          <table class="admin-table">
            <thead>
              <tr>
                <th>เปิด Compare</th>
                <th>Table</th>
                <th>Display Name</th>
                <th>Primary Key</th>
                <th>Order</th>
                <th>Raw</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="table in adminTables" :key="table.table_name" :class="{ selected: table.table_id === selectedTableId }">
                <td><input v-model="table.allow_compare" type="checkbox"></td>
                <td>{{ table.table_name }}</td>
                <td><input v-model="table.display_name"></td>
                <td><span class="readonly-text">{{ table.primary_keys_text || '-' }}</span></td>
                <td><input v-model.number="table.display_order" type="number"></td>
                <td>{{ table.exists_in_raw ? 'พบ' : 'ไม่พบ' }}</td>
                <td class="button-stack">
                  <button type="button" :disabled="adminSaving" @click="saveTable(table)">บันทึก</button>
                  <button type="button" :disabled="!table.table_id" @click="selectTable(table)">ตัวแปร</button>
                </td>
              </tr>
              <tr v-if="!tablesLoading && !adminTables.length">
                <td colspan="7">ยังไม่มีรายการตาราง กด Scan Tables เพื่ออ่านจาก raw database</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section v-show="adminTab === 'columns'" class="admin-section">
        <div class="section-title">
          <h3>Variables</h3>
          <button type="button" :disabled="columnsLoading || !canUseColumnTools" @click="loadTableColumns">
            {{ columnsLoading ? 'กำลัง scan...' : 'Scan Variables' }}
          </button>
        </div>
        <p class="tab-hint">
          ตั้งค่าตัวแปรของตารางที่เลือก โดยระบบจะ scan ตัวแปรจาก raw table ทุกครั้ง และบันทึกลงฐานกลางเฉพาะตัวแปรที่ถูกซ่อนเท่านั้น
        </p>
        <dl class="column-head-hint">
          <div><dt>Variables</dt><dd>ชื่อตัวแปรจาก raw table</dd></div>
          <div><dt>Type</dt><dd>ชนิดข้อมูลที่ scan จากฐานข้อมูล</dd></div>
          <div><dt>Visible</dt><dd>ติ๊กออกเพื่อซ่อนตัวแปร ระบบจะเก็บเฉพาะรายการที่ถูกซ่อน</dd></div>
          <div><dt>PK</dt><dd>ใช้เป็น key จับคู่ข้อมูล</dd></div>
          <div><dt>Order</dt><dd>ลำดับการแสดงตัวแปร อ่านอย่างเดียว</dd></div>
        </dl>
        <p class="section-note">
          {{ selectedTableName ? `Table: ${selectedTableName}` : 'เลือกตารางก่อนตั้งค่าตัวแปร' }}
        </p>

        <div class="admin-table-wrap wide">
          <table class="admin-table column-table">
            <thead>
              <tr>
                <th>Variable</th>
                <th>Type</th>
                <th>Visible</th>
                <th>PK</th>
                <th>Order</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="column in adminColumns" :key="column.column_name">
                <td>{{ column.column_name }}</td>
                <td>{{ column.data_type }}</td>
                <td><input v-model="column.visible" type="checkbox"></td>
                <td>
                  <span :class="['readonly-flag', { active: column.is_primary_key }]">
                    {{ column.is_primary_key ? 'PK' : '-' }}
                  </span>
                </td>
                <td>
                  <span class="readonly-order">{{ column.display_order }}</span>
                </td>
              </tr>
              <tr v-if="!columnsLoading && !adminColumns.length">
                <td colspan="5">ยังไม่มีรายการตัวแปร เลือกตารางแล้วกด Scan Variables</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="form-actions">
          <button type="button" :disabled="adminSaving || !canUseColumnTools" @click="saveColumns">
              {{ adminSaving ? 'กำลังบันทึก...' : 'บันทึก Hidden Columns' }}
          </button>
        </div>
      </section>
    </section>

    <section class="survey-container survey-tools">
      <div>
        <h2>ระบบคีย์และโปรเจกต์ Compare</h2>
        <p>เลือกโปรเจกต์เพื่อเข้าสู่ระบบคีย์ข้อมูล หรือเข้าสู่ระบบเปรียบเทียบข้อมูลผ่านพารามิเตอร์ project</p>
      </div>
    </section>

    <section class="survey-container survey-card-grid">
      <div v-if="projectsLoading" class="survey-empty-state">
        กำลังโหลดรายการโปรเจกต์จากฐานข้อมูล...
      </div>
      <div v-else-if="projectLoadError" class="survey-empty-state error">
        {{ projectLoadError }}
      </div>
      <div v-else-if="!surveySystems.length" class="survey-empty-state">
        ยังไม่มีรายการโปรเจกต์ในฐานข้อมูล
      </div>

      <article v-for="system in surveySystems" :key="system.project_code" class="survey-system-card">
        <span class="monitor-icon" aria-hidden="true"></span>
        <h3>{{ system.title }}</h3>
        <p>{{ system.subtitle }}</p>
        <em :class="['survey-status', system.statusTone]">{{ system.status_text }}</em>
        <small>{{ system.summary }}</small>

        <div class="survey-card-meta">
          <span>{{ system.database_count }} ฐานข้อมูล</span>
          <span>{{ system.table_count }} ตาราง compare</span>
        </div>

        <div class="survey-card-actions">
          <a v-if="system.keyin_active" class="survey-key-button" :href="resolveSurveyHref(system)">
            คีย์ข้อมูล
          </a>
          <button v-else class="survey-key-button disabled" type="button" disabled>
            {{ system.project_ended ? 'จบโครงการ' : 'ปิดคีย์แล้ว' }}
          </button>

          <a v-if="canCompare(system)" class="survey-compare-button" :href="resolveCompareHref(system)">
            compare data
          </a>
          <button v-else class="survey-compare-button disabled" type="button" disabled>
            compare data
          </button>
        </div>
      </article>
    </section>

    <footer class="survey-footer">
      <div class="survey-footer-content">
        <div class="spa-brand" aria-label="SPA">
          <span class="spa-mark" aria-hidden="true"></span>
          <strong>SPA</strong>
        </div>
        <div class="spa-link-row">
          <span>go to System for Project Administrator(SPA) ?</span>
          <a href="https://ripedresearch.org/spa">Click here</a>
        </div>
      </div>
    </footer>

    <div v-if="showAdminLogin" class="admin-modal-backdrop" @click.self="closeAdminLogin">
      <section class="admin-login-modal" role="dialog" aria-modal="true" aria-labelledby="admin-login-title">
        <header>
          <h2 id="admin-login-title">สำหรับผู้ดูแลระบบ</h2>
          <button type="button" aria-label="Close" @click="closeAdminLogin">×</button>
        </header>

        <form class="admin-login-form" @submit.prevent="submitAdminLogin">
          <label>
            UserName
            <input v-model="adminCredentials.username" autocomplete="username">
          </label>
          <label>
            Password
            <input v-model="adminCredentials.password" type="password" autocomplete="current-password">
          </label>
          <p v-if="adminLoginError" class="admin-error">{{ adminLoginError }}</p>
          <footer>
            <button class="admin-cancel-button" type="button" @click="closeAdminLogin">ยกเลิก</button>
            <button class="admin-login-button" type="submit" :disabled="adminLoginLoading">
              {{ adminLoginLoading ? 'กำลังตรวจสอบ...' : 'Login' }}
            </button>
          </footer>
        </form>
      </section>
    </div>
  </main>
</template>

<script setup>
definePageMeta({
  layout: false
})

useHead({
  title: 'Survey List'
})

const adminSessionKey = 'survey-list-admin-session'
const adminUsernames = ['admin', 'nuda', 'tuannurlaila.riped']
const runtimeConfig = useRuntimeConfig()
const appBaseUrl = normalizeAppBaseUrl(runtimeConfig.public.appBaseUrl || '/compare-data/')
const defaultApiBase = `${appBaseUrl.replace(/\/$/, '')}/api`
const apiBase = String(runtimeConfig.public.apiBase || defaultApiBase).replace(/\/$/, '')
const adminLoginUrl = runtimeConfig.public.loginUrl || 'https://ripedresearch.org/api/spaqnaire2025-api/login_merge.php'

const projectStatusOptions = [
  { value: 'draft', label: 'ร่าง' },
  { value: 'preparing', label: 'กำลังเตรียม Compare' },
  { value: 'active', label: 'เปิดคีย์ข้อมูล' },
  { value: 'ready', label: 'พร้อม compare data' },
  { value: 'key_closed', label: 'คีย์จบแล้ว' },
  { value: 'ended', label: 'จบโครงการ' }
]

const databaseStatusOptions = [
  { value: 'draft', label: 'ร่าง' },
  { value: 'ready', label: 'พร้อมตั้งค่าตาราง' },
  { value: 'prepared', label: 'เตรียม Compare แล้ว' },
  { value: 'disabled', label: 'ปิดใช้งาน' }
]

const adminTabs = [
  { id: 'projects', label: 'Project' },
  { id: 'databases', label: 'Database' },
  { id: 'tables', label: 'Tables' },
  { id: 'columns', label: 'Variables' }
]

const surveySystems = ref([])
const projectsLoading = ref(false)
const projectLoadError = ref('')
const showAdminLogin = ref(false)
const adminLoginLoading = ref(false)
const adminLoginError = ref('')
const adminSession = ref(null)
const adminPanel = ref(null)
const adminTab = ref('projects')
const adminMessage = ref('')
const adminError = ref('')
const adminSaving = ref(false)
const adminLoading = ref(false)

const adminCredentials = reactive({
  username: '',
  password: ''
})

const selectedProjectCode = ref('')
const selectedDatabaseId = ref(null)
const selectedTableId = ref(null)
const selectedTableName = ref('')
const adminDatabases = ref([])
const adminTables = ref([])
const adminColumns = ref([])
const tablesLoading = ref(false)
const columnsLoading = ref(false)

const projectForm = reactive({
  project_code: '',
  project_name: '',
  keyin_url: '',
  compare_url: '',
  description: '',
  start_date: '',
  end_date: '',
  status: 'preparing',
  keyin_active: true,
  compare_ready: false,
  is_visible: true,
  display_order: 0
})

const databaseForm = reactive({
  database_id: null,
  project_code: '',
  database_code: '',
  questionnaire_name: '',
  table_preface: '',
  sample_ids_sql: '',
  search_column: '',
  search_id1_start: 1,
  search_id1_length: 12,
  search_id2_start: 13,
  search_id2_length: null,
  search_id2_mode: 'exact',
  raw_database: '',
  compare_database: '',
  round_field: 'round',
  round1_value: '1',
  round2_value: '2',
  completed_round_value: '0',
  compare_enabled: true,
  description: '',
  status: 'draft',
  display_order: 0
})

const selectedProject = computed(() => surveySystems.value.find((project) => project.project_code === selectedProjectCode.value) || null)
const selectedDatabase = computed(() => adminDatabases.value.find((database) => database.database_id === selectedDatabaseId.value) || null)
const canUseDatabaseTools = computed(() => Boolean(selectedProjectCode.value))
const canUseTableTools = computed(() => Boolean(selectedDatabaseId.value))
const canUseColumnTools = computed(() => Boolean(selectedTableId.value))

onMounted(async () => {
  restoreAdminSession()
  await loadProjectsFromApi(Boolean(adminSession.value))
  if (adminSession.value && surveySystems.value.length) {
    selectProject(surveySystems.value[0], false)
  }
})

function normalizeAppBaseUrl(value) {
  const trimmed = String(value || '/').trim()
  if (!trimmed || trimmed === '/') {
    return '/'
  }

  return `/${trimmed.replace(/^\/+|\/+$/g, '')}/`
}

function apiUrl(file, params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value)
    }
  })
  const suffix = query.toString()

  return `${apiBase}/manage/${file}${suffix ? `?${suffix}` : ''}`
}

function adminAuthHeaders() {
  return adminSession.value?.token ? { Authorization: `Bearer ${adminSession.value.token}` } : {}
}

function defaultKeyinUrl(projectCode) {
  return `https://ripedresearch.org/survey/${encodeURIComponent(projectCode)}`
}

function defaultCompareUrl(projectCode) {
  return `${appBaseUrl}?project=${encodeURIComponent(projectCode)}`
}

function normalizeProject(item) {
  const projectCode = String(item.project_code || item.project_key || item.key || '').trim().toLowerCase()
  const status = String(item.status || item.status_mode || 'draft')
  const keyinActive = Boolean(item.keyin_active ?? item.active ?? (status !== 'draft' && status !== 'ended'))
  const compareReady = Boolean(item.compare_ready ?? item.compareReady ?? status === 'ready')
  const statusText = item.status_text || projectStatusText(status, keyinActive, compareReady)

  return {
    project_code: projectCode,
    key: projectCode,
    project_name: item.project_name || item.title || projectCode.toUpperCase(),
    title: item.title || item.project_name || projectCode.toUpperCase(),
    subtitle: item.subtitle || projectCode.toUpperCase(),
    keyin_url: item.keyin_url || item.survey_url || defaultKeyinUrl(projectCode),
    survey_url: item.survey_url || item.keyin_url || defaultKeyinUrl(projectCode),
    compare_url: item.compare_url || defaultCompareUrl(projectCode),
    description: item.description || item.summary || '',
    summary: item.summary || item.description || '',
    start_date: dateInputValue(item.start_date),
    end_date: dateInputValue(item.end_date),
    status,
    status_text: statusText,
    statusTone: item.status_tone || item.statusTone || projectStatusTone(status, keyinActive, compareReady),
    keyin_active: keyinActive,
    compare_ready: compareReady,
    project_ended: Boolean(item.project_ended ?? item.ended ?? status === 'ended'),
    is_visible: Boolean(item.is_visible ?? true),
    display_order: Number(item.display_order || 0),
    database_count: Number(item.database_count || 0),
    prepared_count: Number(item.prepared_count || 0),
    table_count: Number(item.table_count || 0)
  }
}

function projectStatusText(status, keyinActive, compareReady) {
  if (status === 'ended') return 'จบโครงการ'
  if (!keyinActive || status === 'key_closed') return 'คีย์จบแล้ว'
  if (compareReady || status === 'ready') return 'พร้อม compare data'
  if (status === 'preparing') return 'กำลังเตรียม Compare'
  if (status === 'draft') return 'ร่าง'

  return 'เปิดใช้งาน'
}

function projectStatusTone(status, keyinActive, compareReady) {
  if (status === 'ended' || status === 'key_closed' || !keyinActive) return 'muted'
  if (compareReady || status === 'ready') return 'ready'
  if (status === 'preparing') return 'warning'

  return 'active'
}

function dateInputValue(value) {
  return value ? String(value).slice(0, 10) : ''
}

function resolveCompareHref(system) {
  return system.compare_url || defaultCompareUrl(system.project_code)
}

function resolveSurveyHref(system) {
  return system.survey_url || system.keyin_url || defaultKeyinUrl(system.project_code)
}

function canCompare(system) {
  return system.compare_ready && !system.project_ended
}

async function loadProjectsFromApi(adminMode = false) {
  projectsLoading.value = true
  projectLoadError.value = ''

  try {
    const res = await $fetch(apiUrl('admin-projects.php', { scope: adminMode ? 'admin' : 'public' }), {
      headers: adminMode ? adminAuthHeaders() : {}
    })
    const projects = res?.data?.projects || res?.projects || []
    surveySystems.value = projects.map(normalizeProject)
  } catch (error) {
    surveySystems.value = []
    projectLoadError.value = error?.data?.message || error?.message || 'ไม่สามารถโหลดรายการโปรเจกต์ได้'
  } finally {
    projectsLoading.value = false
  }
}

function openAdminAccess() {
  adminError.value = ''
  adminMessage.value = ''
  if (adminSession.value) {
    scrollToAdmin()
    return
  }

  showAdminLogin.value = true
}

function closeAdminLogin() {
  if (adminLoginLoading.value) return
  showAdminLogin.value = false
  adminLoginError.value = ''
  adminCredentials.password = ''
}

async function submitAdminLogin() {
  adminLoginError.value = ''
  const username = adminCredentials.username.trim()
  if (!username || !adminCredentials.password) {
    adminLoginError.value = 'กรุณากรอก UserName และ Password'
    return
  }

  adminLoginLoading.value = true
  try {
    const res = await $fetch(adminLoginUrl, {
      method: 'POST',
      body: {
        username,
        password: adminCredentials.password
      }
    })

    if (res?.status === 'error' || !res?.token) {
      adminLoginError.value = res?.message || 'รหัสผ่านไม่ถูกต้อง'
      return
    }

    if (!isAdminLogin(res)) {
      adminLoginError.value = 'บัญชีนี้ไม่มีสิทธิ์ผู้ดูแลระบบ'
      return
    }

    const loginUsername = String(res.username || res?.user?.username || username).trim().toLowerCase()
    adminSession.value = {
      username: loginUsername,
      token: res.token,
      ttype: res.ttype || res?.user?.ttype || 'cvriped',
      name: res.name || res?.user?.name_surname || res?.user?.firstname || ''
    }

    if (process.client) {
      sessionStorage.setItem(adminSessionKey, JSON.stringify(adminSession.value))
      localStorage.setItem('_token_tcls', res.token)
      localStorage.setItem('tcls-user', loginUsername)
      localStorage.setItem('datauser', JSON.stringify({ username: loginUsername, ttype: adminSession.value.ttype }))
    }

    showAdminLogin.value = false
    adminCredentials.password = ''
    await loadAdminData()
    await nextTick()
    scrollToAdmin()
  } catch (error) {
    adminLoginError.value = error?.data?.message || error?.message || 'ไม่สามารถเข้าสู่ระบบผู้ดูแลได้'
  } finally {
    adminLoginLoading.value = false
  }
}

function isAdminLogin(res) {
  const loginUsername = String(res?.username || res?.user?.username || '').trim().toLowerCase()
  const loginType = String(res?.ttype || res?.user?.ttype || '').trim().toLowerCase()

  return loginType === 'cvriped' && adminUsernames.includes(loginUsername)
}

function restoreAdminSession() {
  if (!process.client) return

  try {
    const rawSession = sessionStorage.getItem(adminSessionKey)
    adminSession.value = rawSession ? JSON.parse(rawSession) : null
  } catch {
    adminSession.value = null
  }
}

function logoutAdmin() {
  adminSession.value = null
  adminDatabases.value = []
  adminTables.value = []
  adminColumns.value = []
  selectedProjectCode.value = ''
  selectedDatabaseId.value = null
  selectedTableId.value = null
  if (process.client) {
    sessionStorage.removeItem(adminSessionKey)
  }
  loadProjectsFromApi(false)
}

function scrollToAdmin() {
  adminPanel.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

async function loadAdminData() {
  if (!adminSession.value) return
  await loadProjectsFromApi(true)
  if (!selectedProjectCode.value && surveySystems.value.length) {
    await selectProject(surveySystems.value[0], false)
  } else if (selectedProjectCode.value) {
    await loadProjectDatabases()
  }
}

function resetProjectForm() {
  Object.assign(projectForm, {
    project_code: '',
    project_name: '',
    keyin_url: '',
    compare_url: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'preparing',
    keyin_active: true,
    compare_ready: false,
    is_visible: true,
    display_order: 0
  })
}

function fillProjectForm(project) {
  Object.assign(projectForm, {
    project_code: project.project_code,
    project_name: project.project_name,
    keyin_url: project.keyin_url,
    compare_url: project.compare_url,
    description: project.description,
    start_date: project.start_date,
    end_date: project.end_date,
    status: project.status,
    keyin_active: project.keyin_active,
    compare_ready: project.compare_ready,
    is_visible: project.is_visible,
    display_order: project.display_order
  })
}

function applyProjectStatusDefaults() {
  if (projectForm.status === 'draft') {
    projectForm.keyin_active = false
    projectForm.compare_ready = false
  } else if (projectForm.status === 'preparing') {
    projectForm.keyin_active = true
    projectForm.compare_ready = false
  } else if (projectForm.status === 'active') {
    projectForm.keyin_active = true
    projectForm.compare_ready = false
  } else if (projectForm.status === 'ready') {
    projectForm.keyin_active = true
    projectForm.compare_ready = true
  } else if (projectForm.status === 'key_closed' || projectForm.status === 'ended') {
    projectForm.keyin_active = false
    projectForm.compare_ready = false
  }
}

async function selectProject(project, switchTab = true) {
  selectedProjectCode.value = project.project_code
  selectedDatabaseId.value = null
  selectedTableId.value = null
  selectedTableName.value = ''
  adminTables.value = []
  adminColumns.value = []
  fillProjectForm(project)
  await loadProjectDatabases()
  if (switchTab) adminTab.value = 'databases'
}

async function saveProject() {
  if (!adminSession.value) return
  adminSaving.value = true
  adminError.value = ''
  adminMessage.value = ''

  try {
    const projectCode = projectForm.project_code.trim().toLowerCase()
    const payload = {
      ...projectForm,
      project_code: projectCode,
      keyin_url: projectForm.keyin_url || defaultKeyinUrl(projectCode),
      compare_url: projectForm.compare_url || defaultCompareUrl(projectCode)
    }
    const res = await $fetch(apiUrl('admin-projects.php'), {
      method: 'POST',
      headers: adminAuthHeaders(),
      body: payload
    })
    const savedProject = normalizeProject(res?.data?.project || payload)
    adminMessage.value = 'บันทึกโครงการแล้ว'
    await loadProjectsFromApi(true)
    const current = surveySystems.value.find((project) => project.project_code === savedProject.project_code) || savedProject
    await selectProject(current, false)
  } catch (error) {
    adminError.value = error?.data?.message || error?.message || 'ไม่สามารถบันทึกโครงการได้'
  } finally {
    adminSaving.value = false
  }
}

function resetDatabaseForm() {
  Object.assign(databaseForm, {
    database_id: null,
    project_code: selectedProjectCode.value,
    database_code: '',
    questionnaire_name: '',
    table_preface: '',
    sample_ids_sql: '',
    search_column: '',
    search_id1_start: 1,
    search_id1_length: 12,
    search_id2_start: 13,
    search_id2_length: null,
    search_id2_mode: 'exact',
    raw_database: '',
    compare_database: '',
    round_field: 'round',
    round1_value: '1',
    round2_value: '2',
    completed_round_value: '0',
    compare_enabled: true,
    description: '',
    status: 'draft',
    display_order: 0
  })
}

function fillDatabaseForm(database) {
  Object.assign(databaseForm, {
    database_id: database.database_id,
    project_code: database.project_code,
    database_code: database.database_code,
    questionnaire_name: database.questionnaire_name || '',
    table_preface: database.table_preface || database.tablePreface || '',
    sample_ids_sql: database.sample_ids_sql || '',
    search_column: database.search_column || '',
    search_id1_start: database.search_id1_start || 1,
    search_id1_length: database.search_id1_length || 12,
    search_id2_start: database.search_id2_start || 13,
    search_id2_length: database.search_id2_length || null,
    search_id2_mode: database.search_id2_mode || 'exact',
    raw_database: database.raw_database,
    compare_database: database.compare_database,
    round_field: database.round_field,
    round1_value: database.round1_value || '1',
    round2_value: database.round2_value || '2',
    completed_round_value: database.completed_round_value || '0',
    compare_enabled: database.compare_enabled ?? true,
    description: database.description || '',
    status: database.status,
    display_order: database.display_order || 0
  })
}

async function loadProjectDatabases() {
  if (!adminSession.value || !selectedProjectCode.value) {
    adminDatabases.value = []
    return
  }

  adminLoading.value = true
  adminError.value = ''
  try {
    const res = await $fetch(apiUrl('admin-databases.php', { project_code: selectedProjectCode.value }), {
      headers: adminAuthHeaders()
    })
    adminDatabases.value = res?.data?.databases || []
    if (!databaseForm.project_code) {
      resetDatabaseForm()
    }
  } catch (error) {
    adminDatabases.value = []
    adminError.value = error?.data?.message || error?.message || 'ไม่สามารถโหลดฐานข้อมูลของโครงการได้'
  } finally {
    adminLoading.value = false
  }
}

async function saveDatabase() {
  if (!adminSession.value || !selectedProjectCode.value) return
  adminSaving.value = true
  adminError.value = ''
  adminMessage.value = ''

  try {
    const currentDatabase = databaseForm.database_id ? selectedDatabase.value : null
    const rawDatabase = databaseForm.raw_database.trim() || currentDatabase?.raw_database || ''
    const databaseCode = databaseForm.database_code.trim() || currentDatabase?.database_code || rawDatabase
    const compareDatabase = databaseForm.compare_database.trim() || currentDatabase?.compare_database || `${rawDatabase}_cmp`
    const searchId1Start = Number(databaseForm.search_id1_start || 1)
    const searchId1Length = Number(databaseForm.search_id1_length || 12)
    const searchId2Start = Number(databaseForm.search_id2_start || 13)

    if (!rawDatabase || !databaseCode) {
      adminError.value = 'กรุณากรอก Raw Database สำหรับฐานใหม่ หรือเลือก Database ที่ต้องการแก้ไขก่อน'
      return
    }
    if (searchId2Start <= searchId1Start + searchId1Length - 1) {
      adminError.value = 'ตำแหน่ง searchId2 ต้องเริ่มหลัง searchId1 เพื่อไม่ให้หลักซ้ำกัน'
      return
    }

    const payload = {
      ...databaseForm,
      project_code: selectedProjectCode.value,
      raw_database: rawDatabase,
      database_code: databaseCode,
      compare_database: compareDatabase,
      search_id1_start: searchId1Start,
      search_id1_length: searchId1Length,
      search_id2_start: searchId2Start,
      search_id2_length: databaseForm.search_id2_length || null
    }
    const res = await $fetch(apiUrl('admin-databases.php'), {
      method: 'POST',
      headers: adminAuthHeaders(),
      body: payload
    })
    const saved = res?.data?.database
    adminMessage.value = 'บันทึกฐานข้อมูลแล้ว'
    await loadProjectDatabases()
    if (saved) {
      selectedDatabaseId.value = saved.database_id
      fillDatabaseForm(saved)
      await loadDatabaseTables()
    }
  } catch (error) {
    adminError.value = error?.data?.message || error?.message || 'ไม่สามารถบันทึกฐานข้อมูลได้'
  } finally {
    adminSaving.value = false
  }
}

async function selectDatabase(database, switchTab = true) {
  selectedDatabaseId.value = database.database_id
  selectedTableId.value = null
  selectedTableName.value = ''
  adminColumns.value = []
  fillDatabaseForm(database)
  await loadDatabaseTables()
  if (switchTab) adminTab.value = 'tables'
}

async function loadDatabaseTables() {
  if (!adminSession.value || !selectedDatabaseId.value) {
    adminTables.value = []
    return
  }

  tablesLoading.value = true
  adminError.value = ''
  try {
    const res = await $fetch(apiUrl('admin-tables.php', { database_id: selectedDatabaseId.value }), {
      headers: adminAuthHeaders()
    })
    adminTables.value = (res?.data?.tables || []).map((table) => ({
      ...table,
      primary_keys_text: table.primary_keys_text || (table.primary_keys || []).join(', ')
    }))
  } catch (error) {
    adminTables.value = []
    adminError.value = error?.data?.message || error?.message || 'ไม่สามารถ scan ตารางได้'
  } finally {
    tablesLoading.value = false
  }
}

async function saveTable(table) {
  if (!adminSession.value || !selectedDatabaseId.value) return
  adminSaving.value = true
  adminError.value = ''
  adminMessage.value = ''

  try {
    const res = await $fetch(apiUrl('admin-tables.php'), {
      method: 'POST',
      headers: adminAuthHeaders(),
      body: {
        database_id: selectedDatabaseId.value,
        table_name: table.table_name,
        display_name: table.display_name || table.table_name,
        primary_keys: parseIdentifierList(table.primary_keys_text),
        allow_compare: table.allow_compare,
        display_order: Number(table.display_order || 0)
      }
    })
    Object.assign(table, res?.data?.table || table)
    adminMessage.value = `บันทึกตาราง ${table.table_name} แล้ว`
  } catch (error) {
    adminError.value = error?.data?.message || error?.message || 'ไม่สามารถบันทึกตารางได้'
  } finally {
    adminSaving.value = false
  }
}

async function selectTable(table) {
  if (!table.table_id) {
    adminError.value = 'กรุณาบันทึกตารางก่อนตั้งค่าตัวแปร'
    return
  }

  selectedTableId.value = table.table_id
  selectedTableName.value = table.table_name
  await loadTableColumns()
  adminTab.value = 'columns'
}

async function loadTableColumns() {
  if (!adminSession.value || !selectedTableId.value) {
    adminColumns.value = []
    return
  }

  columnsLoading.value = true
  adminError.value = ''
  try {
    const res = await $fetch(apiUrl('admin-columns.php', { table_id: selectedTableId.value }), {
      headers: adminAuthHeaders()
    })
    adminColumns.value = res?.data?.columns || []
  } catch (error) {
    adminColumns.value = []
    adminError.value = error?.data?.message || error?.message || 'ไม่สามารถ scan ตัวแปรได้'
  } finally {
    columnsLoading.value = false
  }
}

async function saveColumns() {
  if (!adminSession.value || !selectedTableId.value) return
  adminSaving.value = true
  adminError.value = ''
  adminMessage.value = ''

  try {
    const res = await $fetch(apiUrl('admin-columns.php'), {
      method: 'POST',
      headers: adminAuthHeaders(),
      body: {
        table_id: selectedTableId.value,
        hidden_columns: adminColumns.value
          .filter((column) => !column.visible)
          .map((column) => column.column_name)
      }
    })
    adminColumns.value = res?.data?.columns || adminColumns.value
    adminMessage.value = 'บันทึกรายการตัวแปรที่ซ่อนแล้ว'
  } catch (error) {
    adminError.value = error?.data?.message || error?.message || 'ไม่สามารถบันทึก config ตัวแปรได้'
  } finally {
    adminSaving.value = false
  }
}

async function prepareCompareDatabase() {
  if (!adminSession.value || !selectedDatabaseId.value) return
  const database = selectedDatabase.value
  if (!database) return

  const ok = window.confirm(`ยืนยันเตรียมระบบ Compare สำหรับ ${database.compare_database} ?`)
  if (!ok) return

  adminSaving.value = true
  adminError.value = ''
  adminMessage.value = ''

  try {
    const res = await $fetch(apiUrl('admin-prepare.php'), {
      method: 'POST',
      headers: adminAuthHeaders(),
      body: {
        database_id: selectedDatabaseId.value,
        confirm: true
      }
    })
    adminMessage.value = res?.data?.created_database
      ? `สร้างฐาน ${database.compare_database} แล้ว`
      : `ฐาน ${database.compare_database} พร้อมใช้งานแล้ว`
    await loadProjectDatabases()
  } catch (error) {
    adminError.value = error?.data?.message || error?.message || 'ไม่สามารถเตรียมระบบ Compare ได้'
  } finally {
    adminSaving.value = false
  }
}

function parseIdentifierList(value) {
  return String(value || '')
    .split(/[\s,;]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}
</script>


<style scoped>
:global(html),
:global(body),
:global(#__nuxt) {
  min-height: 100%;
}

:global(body) {
  margin: 0;
  font-family: Tahoma, Arial, sans-serif;
  color: #101820;
  background: #f5f7f9;
}

.survey-list-page {
  min-height: 100vh;
  background: #f5f7f9;
}

.survey-container {
  width: min(1460px, calc(100% - 80px));
  margin: 0 auto;
}

.survey-hero {
  min-height: 545px;
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(rgba(74, 91, 110, 0.56), rgba(47, 70, 93, 0.72)),
    repeating-linear-gradient(178deg, rgba(255, 255, 255, 0.16) 0 2px, transparent 3px 28px),
    linear-gradient(180deg, #9aaeba 0%, #778fa2 42%, #415f7a 100%);
}

.survey-hero::after {
  content: '';
  position: absolute;
  inset: 48% -12% 0;
  background:
    repeating-radial-gradient(ellipse at 50% 20%, rgba(255, 255, 255, 0.18) 0 1px, transparent 2px 18px),
    repeating-linear-gradient(4deg, rgba(25, 54, 80, 0.2) 0 1px, transparent 2px 20px);
  opacity: 0.55;
}

.survey-hero-nav {
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
  color: #111820;
}

.survey-hero-nav strong {
  font-size: 18px;
  font-weight: 400;
}

.survey-admin-nav-button {
  border: 0;
  padding: 0;
  color: #111820;
  background: transparent;
  font: inherit;
  cursor: pointer;
}

.survey-admin-nav-button:hover {
  color: #007bff;
}

.survey-hero-content {
  min-height: 420px;
  display: grid;
  place-content: center;
  position: relative;
  z-index: 1;
  text-align: center;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.28);
}

.survey-hero-content h1 {
  margin: 0 0 8px;
  font-size: 44px;
  line-height: 1.15;
  letter-spacing: 0;
}

.survey-hero-content p {
  margin: 4px 0;
  font-size: 32px;
  line-height: 1.3;
}

.survey-tools {
  padding: 72px 0 30px;
  text-align: center;
}

.survey-tools h2 {
  margin: 0 0 8px;
  color: #1c7c42;
  font-size: 28px;
  line-height: 1.25;
}

.survey-tools p {
  margin: 0;
  color: #647083;
  font-size: 16px;
}

.survey-card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(240px, 1fr));
  gap: 56px 72px;
  padding: 36px 0 110px;
}

.survey-system-card {
  min-height: 245px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  text-align: center;
}

.monitor-icon {
  width: 64px;
  height: 42px;
  display: inline-block;
  position: relative;
  border: 4px solid #159948;
  border-radius: 4px;
}

.monitor-icon::before {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -12px;
  width: 8px;
  height: 10px;
  background: #159948;
  transform: translateX(-50%);
}

.monitor-icon::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -16px;
  width: 28px;
  height: 4px;
  background: #159948;
  transform: translateX(-50%);
}

.survey-system-card h3 {
  margin: 16px 0 0;
  color: #0d9e45;
  font-size: 28px;
  line-height: 1.2;
  letter-spacing: 0;
}

.survey-system-card p,
.survey-system-card small {
  margin: 0;
  color: #23a658;
  font-size: 17px;
  line-height: 1.35;
}

.survey-system-card small {
  min-height: 44px;
  max-width: 300px;
  color: #303841;
  font-size: 14px;
}

.survey-status {
  min-height: 22px;
  font-style: normal;
  font-size: 13px;
  color: #5b6674;
}

.survey-status.ready {
  color: #168a42;
}

.survey-status.warning {
  color: #c27a00;
}

.survey-status.muted {
  color: #7f8893;
}

.survey-card-meta {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  color: #617084;
  font-size: 12px;
}

.survey-card-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.survey-key-button,
.survey-compare-button {
  min-width: 106px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 4px;
  padding: 0 14px;
  color: #fff;
  background: #2eaa59;
  text-decoration: none;
  font: inherit;
  cursor: pointer;
}

.survey-compare-button {
  background: #129149;
}

.survey-key-button.disabled,
.survey-compare-button.disabled {
  color: #eef2f6;
  background: #a9b3bf;
  cursor: not-allowed;
}

.survey-empty-state {
  grid-column: 1 / -1;
  min-height: 180px;
  display: grid;
  place-items: center;
  color: #607083;
  font-size: 18px;
}

.survey-empty-state.error {
  color: #b3261e;
}

.survey-footer {
  min-height: 315px;
  display: grid;
  place-items: center;
  background:
    linear-gradient(rgba(79, 101, 122, 0.62), rgba(56, 78, 100, 0.72)),
    repeating-linear-gradient(178deg, rgba(255, 255, 255, 0.14) 0 2px, transparent 3px 26px),
    linear-gradient(180deg, #92a9ba 0%, #647f98 100%);
}

.survey-footer-content {
  display: grid;
  gap: 24px;
  justify-items: center;
  color: #fff;
}

.spa-brand {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #1f3160;
  font-size: 28px;
}

.spa-mark {
  width: 26px;
  height: 26px;
  display: inline-block;
  background: conic-gradient(#ef2a2a 0 25%, #ffd13b 0 50%, #215fb8 0 75%, #2aa84f 0);
  clip-path: polygon(50% 0, 62% 32%, 96% 24%, 72% 50%, 96% 76%, 62% 68%, 50% 100%, 38% 68%, 4% 76%, 28% 50%, 4% 24%, 38% 32%);
}

.spa-link-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
}

.spa-link-row a {
  border-radius: 4px;
  padding: 10px 18px;
  color: #fff;
  background: #007bff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 400;
}

.admin-workspace {
  margin-top: 42px;
  padding: 28px;
  background: #fff;
  border: 1px solid #d8dee6;
  border-radius: 8px;
  box-shadow: 0 12px 28px rgba(23, 42, 58, 0.08);
}

.admin-head,
.section-title,
.admin-session,
.admin-check-row,
.form-actions,
.admin-tabbar {
  display: flex;
  align-items: center;
}

.admin-head,
.section-title {
  justify-content: space-between;
  gap: 18px;
}

.admin-head {
  margin-bottom: 18px;
}

.admin-head p,
.section-note {
  margin: 0;
  color: #687688;
}

.admin-head h2,
.section-title h3 {
  margin: 4px 0 0;
  line-height: 1.25;
}

.admin-session {
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.admin-session span {
  padding: 8px 12px;
  border-radius: 4px;
  background: #e9eef4;
  color: #354253;
}

.admin-session button,
.section-title button,
.form-actions button,
.admin-table button,
.admin-cancel-button,
.admin-login-button {
  min-height: 36px;
  border: 0;
  border-radius: 4px;
  padding: 0 14px;
  background: #697583;
  color: #fff;
  font: inherit;
  cursor: pointer;
}

.section-title button,
.form-actions button,
.admin-login-button {
  background: #168a42;
}

.admin-session button:hover,
.section-title button:hover,
.form-actions button:hover,
.admin-table button:hover,
.admin-login-button:hover {
  filter: brightness(0.95);
}

.admin-tabbar {
  gap: 8px;
  padding: 8px;
  background: #edf2f7;
  border-radius: 6px;
  overflow-x: auto;
}

.admin-tabbar button {
  min-height: 38px;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 0 18px;
  background: transparent;
  color: #39495c;
  font: inherit;
  cursor: pointer;
}

.admin-tabbar button.active {
  border-color: #168a42;
  background: #fff;
  color: #168a42;
}

.admin-section {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid #dce3eb;
}

.section-note {
  margin-top: 4px;
  margin-bottom: 16px;
}

.tab-hint {
  max-width: 920px;
  margin: 8px 0 4px;
  color: #617084;
  font-size: 13px;
  line-height: 1.55;
}

.field-help {
  display: block;
  margin-top: 5px;
  color: #617084;
  font-size: 12px;
  line-height: 1.45;
}

.column-head-hint {
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 8px;
  margin: 12px 0 14px;
  padding: 12px;
  background: #f4f7fa;
  border: 1px solid #dce3eb;
  border-radius: 6px;
}

.column-head-hint div {
  display: grid;
  gap: 2px;
}

.column-head-hint dt {
  color: #263343;
  font-size: 13px;
  font-weight: 700;
}

.column-head-hint dd {
  margin: 0;
  color: #617084;
  font-size: 12px;
  line-height: 1.4;
}

.admin-form {
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: 14px;
  margin: 18px 0 24px;
}

.admin-form label {
  display: grid;
  gap: 6px;
  color: #263343;
  font-size: 14px;
}

.admin-form input,
.admin-form select,
.admin-form textarea,
.admin-table input {
  width: 100%;
  min-height: 38px;
  box-sizing: border-box;
  border: 1px solid #cbd5df;
  border-radius: 4px;
  padding: 8px 10px;
  background: #fff;
  color: #192536;
  font: inherit;
}

.admin-form textarea {
  resize: vertical;
}

.admin-form .sample-sql-textarea {
  min-height: 120px;
  font-family: Consolas, 'Courier New', monospace;
  line-height: 1.45;
}

.admin-form .full {
  grid-column: 1 / -1;
}

.admin-check-row,
.form-actions {
  gap: 14px;
  flex-wrap: wrap;
}

.admin-check-row label {
  display: inline-flex;
  grid-auto-flow: column;
  align-items: center;
  gap: 8px;
}

.admin-form label.admin-check {
  display: inline-flex;
  align-items: center;
  align-self: end;
  gap: 8px;
  min-height: 38px;
}

.admin-check-row input,
.admin-form .admin-check input,
.admin-table input[type='checkbox'] {
  width: 18px;
  min-height: 18px;
}

.admin-table-wrap {
  overflow-x: auto;
  border: 1px solid #dce3eb;
  border-radius: 6px;
}

.admin-table-wrap.wide {
  max-height: 520px;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  font-size: 14px;
}

.admin-table th,
.admin-table td {
  border-bottom: 1px solid #dce3eb;
  padding: 10px 12px;
  text-align: left;
  vertical-align: middle;
}

.admin-table th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #f4f7fa;
  color: #263343;
  font-weight: 700;
}

.admin-table tr.selected td {
  background: #edf9f1;
}

.admin-table td small {
  display: block;
  color: #6c798a;
}

.admin-table button {
  min-height: 32px;
  padding: 0 10px;
  background: #697583;
}

.button-stack {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.column-table th,
.column-table td {
  text-align: center;
}

.column-table th:first-child,
.column-table td:first-child,
.column-table th:nth-child(2),
.column-table td:nth-child(2) {
  text-align: left;
}

.readonly-flag {
  min-width: 34px;
  min-height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: #edf2f7;
  color: #6b7788;
  font-size: 12px;
  font-weight: 700;
}

.readonly-flag.active {
  background: #e7f7ed;
  color: #168a42;
}

.readonly-text {
  display: inline-block;
  max-width: 260px;
  color: #526071;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.readonly-order {
  display: inline-flex;
  min-width: 44px;
  min-height: 26px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: #f5f7fa;
  color: #526071;
  font-size: 12px;
}

.mini-status {
  display: inline-flex;
  min-height: 28px;
  align-items: center;
  border-radius: 4px;
  padding: 0 10px;
  background: #eef3f7;
  color: #516070;
  white-space: nowrap;
}

.mini-status.ready {
  background: #e7f7ed;
  color: #168a42;
}

.mini-status.warning {
  background: #fff4d8;
  color: #9a6400;
}

.mini-status.muted {
  background: #eef0f3;
  color: #6d7480;
}

.admin-message,
.admin-error {
  margin: 14px 0 0;
  border-radius: 4px;
  padding: 10px 12px;
}

.admin-message {
  background: #e9f7ee;
  color: #176a36;
}

.admin-error {
  background: #fff0f0;
  color: #b3261e;
}

button:disabled,
input:disabled,
select:disabled,
textarea:disabled {
  opacity: 0.62;
  cursor: not-allowed;
}

.admin-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(13, 24, 35, 0.62);
}

.admin-login-modal {
  width: min(480px, 100%);
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.3);
}

.admin-login-modal header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid #dce3eb;
}

.admin-login-modal h2 {
  margin: 0;
  font-size: 22px;
}

.admin-login-modal header button {
  width: 34px;
  height: 34px;
  border: 0;
  background: transparent;
  font-size: 24px;
  cursor: pointer;
}

.admin-login-form {
  display: grid;
  gap: 16px;
  padding: 22px;
}

.admin-login-form label {
  display: grid;
  gap: 6px;
}

.admin-login-form input {
  min-height: 40px;
  border: 1px solid #cbd5df;
  border-radius: 4px;
  padding: 8px 10px;
  font: inherit;
}

.admin-login-form footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.admin-cancel-button {
  color: #263343;
  background: #e5eaf0;
}

@media (max-width: 1020px) {
  .survey-container {
    width: min(100% - 36px, 760px);
  }

  .survey-card-grid {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
    gap: 44px 28px;
  }

  .admin-form {
    grid-template-columns: repeat(2, minmax(180px, 1fr));
  }

  .column-head-hint {
    grid-template-columns: repeat(2, minmax(180px, 1fr));
  }
}

@media (max-width: 720px) {
  .survey-container {
    width: min(100% - 28px, 520px);
  }

  .survey-hero {
    min-height: 430px;
  }

  .survey-hero-content {
    min-height: 310px;
    padding: 0 18px;
  }

  .survey-hero-content h1 {
    font-size: 36px;
  }

  .survey-hero-content p {
    font-size: 22px;
  }

  .survey-card-grid {
    grid-template-columns: 1fr;
    padding-bottom: 72px;
  }

  .admin-workspace {
    padding: 18px;
  }

  .admin-head,
  .section-title {
    align-items: flex-start;
    flex-direction: column;
  }

  .admin-form {
    grid-template-columns: 1fr;
  }

  .column-head-hint {
    grid-template-columns: 1fr;
  }

  .spa-link-row {
    padding: 0 18px;
    font-size: 22px;
    text-align: center;
  }
}
</style>
