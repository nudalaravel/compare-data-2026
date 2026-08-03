import { COMPARE_STATUS } from '~/constants/compareStatus'
import {
  buildAuditLog,
  buildCsv,
  getMockAuditLogs,
  getMockProjects
} from '~/services/compareMock'
import { useCompareApi } from '~/services/compareApi'

export function useCompareWorkflow() {
  const user = useState('compare.user', () => readStoredUser())
  const projects = useState('compare.projects', () => getMockProjects())
  const tableCatalog = useState('compare.tableCatalog', () => [])
  const sampleIds = useState('compare.sampleIds', () => [])
  const step = useState('compare.step', () => 1)
  const selectedProjectId = useState('compare.selectedProjectId', () => '')
  const selectedTableName = useState('compare.selectedTableName', () => '')
  const selectedPrimaryKeys = useState('compare.selectedPrimaryKeys', () => [])
  const searchMode = useState('compare.searchMode', () => 'prefix')
  const searchId1 = useState('compare.searchId1', () => '')
  const searchId2 = useState('compare.searchId2', () => '')
  const searchId = useState('compare.searchId', () => '')
  const scopePreview = useState('compare.scopePreview', () => null)
  const preview = useState('compare.preview', () => null)
  const prepareResult = useState('compare.prepareResult', () => null)
  const records = useState('compare.records', () => [])
  const activeRecordIndex = useState('compare.activeRecordIndex', () => 0)
  const auditLogs = useState('compare.auditLogs', () => getMockAuditLogs())
  const toast = useState('compare.toast', () => '')
  const lastError = useState('compare.lastError', () => '')
  const lastErrorIcon = useState('compare.lastErrorIcon', () => 'error')
  const scopePreviewRequestId = useState('compare.scopePreviewRequestId', () => 0)

  const api = useCompareApi()

  const isAuthenticated = computed(() => Boolean(user.value))
  const selectedProject = computed(() => projects.value.find((project) => project.id === selectedProjectId.value) || null)
  const selectedTable = computed(() => tableCatalog.value.find((table) => table.name === selectedTableName.value) || null)
  const activeRecord = computed(() => records.value[activeRecordIndex.value] || null)
  const completedRecords = computed(() => records.value.filter((record) => record.status === COMPARE_STATUS.COMPLETE))
  const pendingRecords = computed(() => records.value.filter((record) => record.status !== COMPARE_STATUS.COMPLETE))
  const comparedCount = computed(() => completedRecords.value.length)
  const compareComplete = computed(() => records.value.length > 0 && pendingRecords.value.length === 0)
  const usingMock = computed(() => api.usingMock)
  const combinedSearchId = computed(() => `${searchId1.value || ''}${searchId2.value || ''}`)

  const tableStatuses = computed(() => tableCatalog.value.map((table) => {
    if (!table.allowed) {
      return { ready: false, label: 'ยังไม่เปิดใช้งาน', tone: 'muted' }
    }

    if (!searchId1.value) {
      return { ready: false, label: 'กรอกรหัสก่อน', tone: 'warning' }
    }

    const tablePreview = findScopeTablePreview(table.name)
    if (tablePreview?.error) {
      return { ready: false, label: tablePreview.error, tone: 'danger' }
    }
    if (tablePreview) {
      const round1Count = Number(tablePreview.round1Count || 0)
      const round2Count = Number(tablePreview.round2Count || 0)
      const intersectionCount = Number(tablePreview.intersectionCount || 0)
      const compareScopeCount = Number(tablePreview.compareScopeCount || tablePreview.compare_scope_count || 0)
      const intersectionCmpCount = Number(tablePreview.intersectionCmpCount || tablePreview.intersection_cmp_count || 0)
      const comparePendingCount = Number(tablePreview.comparePendingCount || tablePreview.compare_pending_count || 0)
      const rawRoundCountsMatch = round1Count === round2Count
      const cmpScopeMatchesRound2 = intersectionCmpCount === round2Count || compareScopeCount === round2Count
      const pendingCmpReady = comparePendingCount > 0 && (cmpScopeMatchesRound2 || rawRoundCountsMatch)
      const hasCompleteRoundPair = round1Count > 0
        && round2Count > 0
        && (compareScopeCount > 0 ? (cmpScopeMatchesRound2 || pendingCmpReady) : rawRoundCountsMatch)
      const selectable = tablePreview.selectable ?? hasCompleteRoundPair
      return {
        ready: Boolean(selectable),
        label: tablePreview.statusText || tablePreview.status_text || (intersectionCount > 0 ? `${intersectionCount} record` : '0 record'),
        tone: tablePreview.statusTone || tablePreview.status_tone || (selectable ? 'warning' : 'empty'),
        icon: tablePreview.statusIcon || tablePreview.status_icon || (selectable ? '▲' : '☒')
      }
    }

    return { ready: false, label: 'รอตรวจ round', tone: 'warning', icon: '▲' }
  }))

  async function login({ username, password }) {
    lastError.value = ''
    lastErrorIcon.value = 'error'
    if (!username || !password) {
      lastError.value = 'กรุณากรอก UserName และ Password'
      return false
    }

    try {
      const cleanUsername = username.trim()
      const res = await api.login({ username: cleanUsername, password })

      if (res.status === 'error' || !res.token) {
        lastError.value = `${res.message || 'รหัสผ่านไม่ถูกต้อง'}<br><br>STAFF RIPED กรุณาใช้รหัสผ่านเดียวกับระบบเข้างาน (/cvriped) หรือระบบบัญชี (/account)`
        return false
      }

      if (res?.user?.fromdb === 'spa.1user' && res?.user?.ttype === 'baseSPA') {
        lastError.value = 'เว็บคีย์นี้ สำหรับ User Key (KEY___ , K___ ) และ Staff RIPED เท่านั้น'
        lastErrorIcon.value = 'warning'
        return false
      }

      saveLoginStorage(cleanUsername, res)
      user.value = readStoredUser()
      notify('เข้าสู่ระบบแล้ว')
      return true
    } catch (error) {
      lastError.value = error.message || 'ไม่สามารถเข้าสู่ระบบได้'
      return false
    }
  }

  function logout() {
    clearLoginStorage()
    user.value = null
    resetWorkspace()
  }

  function hydrateUserFromStorage() {
    user.value = readStoredUser()
    return Boolean(user.value)
  }

  async function refreshProjects() {
    projects.value = await api.listProjects()
  }

  async function loadTablesForProject(project) {
    if (!project?.id) {
      return []
    }

    return api.listTables(project.id)
  }

  async function selectProject(project) {
    selectedProjectId.value = project.id
    selectedTableName.value = ''
    selectedPrimaryKeys.value = []
    searchId1.value = ''
    searchId2.value = ''
    searchId.value = ''
    searchMode.value = 'prefix'
    scopePreview.value = null
    preview.value = null
    records.value = []
    activeRecordIndex.value = 0
    sampleIds.value = []
    const [tables, samples] = await Promise.all([
      api.listTables(project.id),
      api.listSampleIds(project).catch(() => [])
    ])
    tableCatalog.value = tables
    sampleIds.value = samples
    step.value = 2
  }

  async function selectProjectWithTable(project, table) {
    await selectProject(project)
    const tableName = table?.name || table?.table_name || ''
    const matchedTable = tableCatalog.value.find((item) => item.name === tableName)
    if (!matchedTable?.allowed) {
      notify('ไม่พบตารางที่เลือก หรือยังไม่เปิด compare')
      return false
    }

    selectedTableName.value = matchedTable.name
    selectedPrimaryKeys.value = [...matchedTable.primaryKeys]
    scopePreview.value = null
    preview.value = null
    return true
  }

  function backToProjectList() {
    selectedProjectId.value = ''
    selectedTableName.value = ''
    selectedPrimaryKeys.value = []
    searchId1.value = ''
    searchId2.value = ''
    searchId.value = ''
    searchMode.value = 'prefix'
    scopePreview.value = null
    preview.value = null
    records.value = []
    tableCatalog.value = []
    sampleIds.value = []
    step.value = 1
  }

  async function selectTable(table) {
    if (!table?.allowed) {
      return
    }
    syncSearchScope()
    if (!searchId1.value.trim()) {
      notify('กรุณากรอกรหัสก่อนเลือกตาราง')
      return
    }

    const status = tableStatusFor(table.name)
    if (!status?.ready) {
      notify('ตารางนี้ยังไม่มีข้อมูลครบทั้ง 2 round')
      return
    }

    selectedTableName.value = table.name
    selectedPrimaryKeys.value = [...table.primaryKeys]
    const tablePreview = findScopeTablePreview(table.name)
    preview.value = tablePreview || null
    if (!preview.value) {
      await refreshPreview()
    }
  }

  async function refreshPreview(scopePayload = {}) {
    const scope = syncSearchScope(scopePayload)
    preview.value = null
    if (!selectedProject.value || !scope.searchId1) {
      scopePreviewRequestId.value += 1
      scopePreview.value = null
      return
    }

    const requestId = scopePreviewRequestId.value + 1
    scopePreviewRequestId.value = requestId
    const nextScopePreview = await api.previewScope({
      project: selectedProject.value,
      projectId: selectedProject.value.id,
      searchId1: scope.searchId1,
      searchId2: scope.searchId2,
      searchId: scope.searchId,
      searchMode: scope.searchMode
    })
    if (requestId !== scopePreviewRequestId.value) {
      return
    }

    scopePreview.value = nextScopePreview

    const tablePreview = selectedTable.value ? findScopeTablePreview(selectedTable.value.name) : null
    if (tablePreview) {
      preview.value = tablePreview
      return
    }

    if (!selectedTable.value) {
      preview.value = null
      return
    }

    preview.value = await api.previewCompare({
      project: selectedProject.value,
      projectId: selectedProject.value.id,
      table: selectedTable.value,
      tableName: selectedTable.value.name,
      searchMode: scope.searchMode,
      searchId: scope.searchId,
      searchId1: scope.searchId1,
      searchId2: scope.searchId2,
      primaryKeys: selectedPrimaryKeys.value
    })
  }

  function togglePrimaryKey(key) {
    if (selectedPrimaryKeys.value.includes(key)) {
      if (selectedPrimaryKeys.value.length === 1) {
        notify('ต้องเลือก Primary Key อย่างน้อย 1 ตัว')
        return
      }
      selectedPrimaryKeys.value = selectedPrimaryKeys.value.filter((item) => item !== key)
    } else {
      selectedPrimaryKeys.value = [...selectedPrimaryKeys.value, key]
    }
    refreshPreview()
  }

  async function prepareCompare() {
    const scope = syncSearchScope()
    if (!selectedProject.value || !selectedTable.value || !preview.value) {
      notify('กรุณาเลือกตารางและตรวจสอบ Preview ก่อน')
      return false
    }

    const round1Count = Number(preview.value.round1Count || 0)
    const round2Count = Number(preview.value.round2Count || 0)
    const intersectionCount = Number(preview.value.intersectionCount || 0)
    const compareScopeCount = Number(preview.value.compareScopeCount || preview.value.compare_scope_count || 0)
    const intersectionCmpCount = Number(preview.value.intersectionCmpCount || preview.value.intersection_cmp_count || 0)
    const comparePendingCount = Number(preview.value.comparePendingCount || preview.value.compare_pending_count || 0)
    const rawRoundCountsMatch = round1Count === round2Count
    const cmpScopeMatchesRound2 = intersectionCmpCount === round2Count || compareScopeCount === round2Count
    const pendingCmpReady = comparePendingCount > 0 && (cmpScopeMatchesRound2 || rawRoundCountsMatch)
    const hasComparableRoundPair = Boolean(preview.value.selectable)
      || (
        round1Count > 0
        && round2Count > 0
        && (compareScopeCount > 0 ? (cmpScopeMatchesRound2 || pendingCmpReady) : rawRoundCountsMatch)
      )
    if (!hasComparableRoundPair) {
      notify('ยังเลือก compare ไม่ได้ เพราะข้อมูลยังไม่ครบหรือยังไม่ตรงกันทั้ง 2 round')
      return false
    }

    const recordPayload = {
      project: selectedProject.value,
      projectId: selectedProject.value.id,
      table: selectedTable.value,
      tableName: selectedTable.value.name,
      searchMode: scope.searchMode,
      searchId: scope.searchId,
      searchId1: scope.searchId1,
      searchId2: scope.searchId2,
      primaryKeys: selectedPrimaryKeys.value
    }
    const compareStatus = preview.value.compareStatus || preview.value.compare_status || ''

    if (compareStatus === 'complete') {
      prepareResult.value = {
        alreadyComplete: true,
        already_complete: true,
        targetTable: preview.value.targetFullName
      }
      records.value = await api.getCompareRecords(recordPayload)
      activeRecordIndex.value = 0
      step.value = 4
      notify('ข้อมูลชุดนี้ Compare แล้ว')
      return true
    }

    prepareResult.value = await api.prepareCompare({
      projectId: selectedProject.value.id,
      tableName: selectedTable.value.name,
      primaryKeys: selectedPrimaryKeys.value,
      searchMode: scope.searchMode,
      searchId: scope.searchId,
      searchId1: scope.searchId1,
      searchId2: scope.searchId2,
      preview: preview.value
    })

    records.value = await api.getCompareRecords(recordPayload)

    const firstPending = records.value.findIndex((record) => record.status !== COMPARE_STATUS.COMPLETE)
    activeRecordIndex.value = firstPending >= 0 ? firstPending : 0
    step.value = 4

    if (!records.value.length) {
      notify('ไม่พบข้อมูลที่อยู่ครบทั้งสองรอบ')
      return false
    }

    notify(`เตรียมข้อมูลสำเร็จ ${records.value.length} รหัส`)
    return true
  }

  function chooseField(recordId, fieldKey, source) {
    const field = findField(recordId, fieldKey)
    if (!field) {
      return
    }

    field.selectedSource = source
    field.selectedValue = source === 'round1' ? field.round1Value : field.round2Value
    field.customInput = ''
  }

  function setCustomField(recordId, fieldKey, value) {
    const field = findField(recordId, fieldKey)
    if (!field) {
      return
    }

    field.selectedSource = 'custom'
    field.customInput = value
    field.selectedValue = value
  }

  async function saveActiveRecord() {
    const record = activeRecord.value
    if (!record || !selectedProject.value || !selectedTable.value) {
      return false
    }

    const compareFields = record.fields.filter((field) => !field.same)
    const unresolved = compareFields.filter((field) => !hasSaveValue(field.selectedValue))
    if (unresolved.length) {
      notify(`กรุณาเลือกคำตอบให้ครบ ${unresolved.length} ตัวแปร`)
      return false
    }

    const changedFields = compareFields.filter((field) => field.selectedValue !== field.round1Value)
    await api.saveCompare({
      projectId: selectedProject.value.id,
      tableName: selectedTable.value.name,
      runId: prepareResult.value?.runId || prepareResult.value?.taskId || '',
      primaryKey: record.primaryKeyValues,
      values: compareFields.map((field) => ({
        columnName: field.key,
        selectedValue: field.selectedValue,
        selectedSource: field.selectedSource || 'round1',
        round1Value: field.round1Value,
        round2Value: field.round2Value
      }))
    })

    changedFields.forEach((field) => {
      auditLogs.value.unshift(buildAuditLog({
        record,
        field,
        selectedValue: field.selectedValue,
        source: field.selectedSource,
        projectId: selectedProject.value.id,
        tableName: selectedTable.value.name,
        user: user.value?.username || 'unknown'
      }))
    })

    record.status = COMPARE_STATUS.COMPLETE
    notify('บันทึกแล้ว ปรับ round=0 เฉพาะฐาน _cmp')

    const nextIndex = records.value.findIndex((item, index) => index > activeRecordIndex.value && item.status !== COMPARE_STATUS.COMPLETE)
    if (nextIndex >= 0) {
      activeRecordIndex.value = nextIndex
    }

    return true
  }

  function resetActiveRecord() {
    const record = activeRecord.value
    if (!record) {
      return
    }

    record.fields.forEach((field) => {
      field.selectedSource = field.same ? 'round1' : ''
      field.selectedValue = field.same ? field.round1Value : ''
      field.customInput = ''
    })
  }

  function openRecord(index) {
    activeRecordIndex.value = index
  }

  function addAdminProject(form) {
    const rawDatabase = form.rawDatabase.trim()
    const cmpDatabase = form.cmpDatabase.trim() || rawDatabase.replace(/_raw$/, '_cmp') || `${rawDatabase}_cmp`
    const newProject = {
      id: form.code.trim().toLowerCase(),
      code: form.code.trim(),
      displayName: form.displayName.trim(),
      rawDatabase,
      cmpDatabase,
      color: 'blue',
      active: Boolean(form.active),
      updatedAt: 'รอตรวจ Schema',
      tables: []
    }

    projects.value = [newProject, ...projects.value]
    notify('เพิ่มโปรเจกต์ใหม่แล้ว รอตรวจ Schema และกำหนดสิทธิ์')
  }

  function resetWorkspace() {
    step.value = 1
    selectedProjectId.value = ''
    selectedTableName.value = ''
    selectedPrimaryKeys.value = []
    searchMode.value = 'prefix'
    searchId1.value = ''
    searchId2.value = ''
    searchId.value = ''
    scopePreview.value = null
    preview.value = null
    prepareResult.value = null
    records.value = []
    activeRecordIndex.value = 0
    tableCatalog.value = []
    sampleIds.value = []
  }

  function notify(message) {
    toast.value = message
    if (import.meta.client) {
      window.setTimeout(() => {
        if (toast.value === message) {
          toast.value = ''
        }
      }, 2600)
    }
  }

  function syncSearchScope(scopePayload = {}) {
    const cleanId1 = String(scopePayload.searchId1 ?? scopePayload.search_id1 ?? searchId1.value ?? '').trim()
    const cleanId2 = String(scopePayload.searchId2 ?? scopePayload.search_id2 ?? searchId2.value ?? '').trim()
    searchId1.value = cleanId1
    searchId2.value = cleanId2
    searchId.value = `${cleanId1}${cleanId2}`
    searchMode.value = cleanId2 ? projectSearchId2Mode(selectedProject.value) : 'prefix'

    return {
      searchId1: cleanId1,
      searchId2: cleanId2,
      searchId: searchId.value,
      searchMode: searchMode.value
    }
  }

  function findScopeTablePreview(tableName) {
    const currentSearchId = `${searchId1.value || ''}${searchId2.value || ''}`
    const previewSearchId = scopePreview.value?.searchId || scopePreview.value?.search_id || ''
    if (!scopePreview.value || previewSearchId !== currentSearchId) {
      return null
    }

    return scopePreview.value?.tables?.find((item) => {
      return (item.tableName || item.table_name) === tableName
    }) || null
  }

  function tableStatusFor(tableName) {
    const index = tableCatalog.value.findIndex((table) => table.name === tableName)
    return index >= 0 ? tableStatuses.value[index] : null
  }

  function findField(recordId, fieldKey) {
    const record = records.value.find((item) => item.id === recordId)
    return record?.fields.find((field) => field.key === fieldKey)
  }

  return {
    user,
    projects,
    tableCatalog,
    sampleIds,
    step,
    selectedProjectId,
    selectedTableName,
    selectedPrimaryKeys,
    searchMode,
    searchId1,
    searchId2,
    searchId,
    combinedSearchId,
    scopePreview,
    preview,
    prepareResult,
    records,
    activeRecordIndex,
    auditLogs,
    toast,
    lastError,
    lastErrorIcon,
    isAuthenticated,
    selectedProject,
    selectedTable,
    activeRecord,
    completedRecords,
    pendingRecords,
    comparedCount,
    compareComplete,
    usingMock,
    tableStatuses,
    login,
    logout,
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
    openRecord,
    addAdminProject,
    resetWorkspace,
    buildCsv
  }
}

function readStoredUser() {
  if (!import.meta.client) {
    return null
  }

  const token = localStorage.getItem('_token_tcls')
  const username = localStorage.getItem('tcls-user')
  const datauserRaw = localStorage.getItem('datauser')
  if (!token || !username) {
    return null
  }

  let datauser = {}
  try {
    datauser = datauserRaw ? JSON.parse(datauserRaw) : {}
  } catch {
    datauser = {}
  }

  return {
    ...datauser,
    username: datauser.username || username,
    token
  }
}

function saveLoginStorage(username, res) {
  if (!import.meta.client) {
    return
  }

  const datauser = {
    ...(res.user || {}),
    username: res.username || res.user?.username || username,
    name: res.name || res.user?.name || '',
    ttype: res.user?.ttype || ''
  }

  localStorage.setItem('_token_tcls', res.token)
  localStorage.setItem('tcls-user', username)
  localStorage.setItem('datauser', JSON.stringify(datauser))
}

function clearLoginStorage() {
  if (!import.meta.client) {
    return
  }

  localStorage.removeItem('_token_tcls')
  localStorage.removeItem('tcls-user')
  localStorage.removeItem('datauser')
}

function projectSearchId2Mode(project) {
  const mode = String(project?.searchId2Mode || project?.search_id2_mode || 'exact').toLowerCase()
  return ['exact', 'prefix'].includes(mode) ? mode : 'exact'
}

function hasSaveValue(value) {
  return value !== null && typeof value !== 'undefined' && String(value).trim() !== ''
}
