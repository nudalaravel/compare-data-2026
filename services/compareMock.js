const nowText = 'Mar 13, 2026 at 1:38 PM'

const clone = (value) => JSON.parse(JSON.stringify(value))

const chPrefaceColumns = [
  { name: 'fname_ch', label: 'ชื่อตัวอย่างเด็ก', type: 'text' },
  { name: 'lname_ch', label: 'นามสกุลเด็ก', type: 'text' },
  { name: 'nickname_ch', label: 'ชื่อเล่นเด็ก', type: 'text' },
  { name: 'informant', label: 'ผู้ให้ข้อมูล', type: 'text' },
  { name: 'informantID', label: 'รหัสผู้ให้ข้อมูล', type: 'select', options: ['H01', 'H02', 'H03', 'H04', 'H05', 'H06'] },
  { name: 'tam', label: 'ตำบล', type: 'text' },
  { name: 'moo', label: 'หมู่', type: 'text' },
  { name: 'home', label: 'บ้านเลขที่', type: 'text' },
  { name: 'tel', label: 'เบอร์โทร', type: 'text' },
  { name: 'name_tel', label: 'ชื่อเจ้าของเบอร์', type: 'text' },
  { name: 'memid_tel', label: 'รหัสสมาชิกเบอร์โทร', type: 'select', options: ['H01', 'H02', 'H03', 'H04', 'H05', 'H06'] },
  { name: 'nickname_1', label: 'ชื่อเล่นผู้ดูแล 1', type: 'text' },
  { name: 'fullname_1', label: 'ชื่อเต็มผู้ดูแล 1', type: 'text' },
  { name: 'day_1', label: 'วันที่สัมภาษณ์', type: 'number' },
  { name: 'month_1', label: 'เดือนที่สัมภาษณ์', type: 'select', options: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'] },
  { name: 'timeS_1', label: 'เวลาเริ่ม', type: 'text' },
  { name: 'timeE_1', label: 'เวลาสิ้นสุด', type: 'text' }
]

const b1Columns = [
  { name: 'school_name', label: 'ชื่อโรงเรียน', type: 'text' },
  { name: 'grade', label: 'ระดับชั้น', type: 'text' },
  { name: 'score', label: 'คะแนนประเมิน', type: 'number' },
  { name: 'survey_date', label: 'วันที่เก็บข้อมูล', type: 'date' },
  { name: 'note_json', label: 'บันทึก JSON', type: 'json' }
]

const hhColumns = [
  { name: 'head_name', label: 'ชื่อหัวหน้าครัวเรือน', type: 'text' },
  { name: 'members', label: 'จำนวนสมาชิก', type: 'number' },
  { name: 'income_group', label: 'กลุ่มรายได้', type: 'select', options: ['ต่ำ', 'กลาง', 'สูง'] },
  { name: 'has_phone', label: 'มีโทรศัพท์', type: 'select', options: ['0', '1'] }
]

const createChRows = (round) => ([
  {
    CID: '202194100901',
    member_id: '001H05',
    round,
    fname_ch: round === 1 ? 'อัฟริน' : 'ณัฐฐารินทร์',
    lname_ch: round === 1 ? 'มูรอแม็ง' : 'วิชา',
    nickname_ch: round === 1 ? 'อัฟริน' : 'ณิชา',
    informant: round === 1 ? 'นี่' : 'เมาะลิ',
    informantID: round === 1 ? 'H03' : 'H01',
    tam: round === 1 ? '09' : '10',
    moo: round === 1 ? '01' : '05',
    home: round === 1 ? '60' : '115',
    tel: round === 1 ? '08-1735-4272' : '09-3794-8264',
    name_tel: round === 1 ? 'นี่' : 'ปาตีเมาะ',
    memid_tel: round === 1 ? 'H03' : 'H06',
    nickname_1: round === 1 ? 'ซูฮัย' : 'เฟีย',
    fullname_1: round === 1 ? 'ซูฮัยลา' : 'โซฟียะห์',
    day_1: round === 1 ? '20' : '24',
    month_1: round === 1 ? 'ก.ค.' : 'ต.ค.',
    timeS_1: round === 1 ? '11.00' : '09.16',
    timeE_1: round === 1 ? '12.50' : '10.15'
  },
  {
    CID: '202194100902',
    member_id: '001H02',
    round,
    fname_ch: 'นูรีน',
    lname_ch: 'มะยูโซ๊ะ',
    nickname_ch: 'นูรีน',
    informant: 'มารดา',
    informantID: 'H02',
    tam: '09',
    moo: '01',
    home: '72',
    tel: '08-0000-2222',
    name_tel: 'มารดา',
    memid_tel: 'H02',
    nickname_1: 'อาอีซะห์',
    fullname_1: 'อาอีซะห์ มะยูโซ๊ะ',
    day_1: '21',
    month_1: 'ก.ค.',
    timeS_1: '10.00',
    timeE_1: '11.15'
  },
  {
    CID: '202194100903',
    member_id: '001H03',
    round,
    fname_ch: round === 1 ? 'ซัลมา' : 'ซัลมาน',
    lname_ch: 'ยูโซ๊ะ',
    nickname_ch: 'ซัล',
    informant: 'บิดา',
    informantID: 'H01',
    tam: '08',
    moo: '03',
    home: round === 1 ? '14' : '14/1',
    tel: '08-8888-3333',
    name_tel: 'บิดา',
    memid_tel: 'H01',
    nickname_1: 'อันวา',
    fullname_1: 'อันวา ยูโซ๊ะ',
    day_1: '22',
    month_1: 'ก.ค.',
    timeS_1: '13.00',
    timeE_1: round === 1 ? '14.00' : '14.10'
  },
  {
    CID: '202194100904',
    member_id: '001H04',
    round,
    fname_ch: 'ฮาซัน',
    lname_ch: 'ดอเลาะ',
    nickname_ch: round === 1 ? '' : 'ซัน',
    informant: 'ยาย',
    informantID: 'H04',
    tam: '11',
    moo: '02',
    home: '91',
    tel: round === 1 ? null : '09-1111-4444',
    name_tel: 'ยาย',
    memid_tel: 'H04',
    nickname_1: 'มารีแย',
    fullname_1: 'มารีแย ดอเลาะ',
    day_1: '23',
    month_1: 'ก.ค.',
    timeS_1: '08.30',
    timeE_1: '09.25'
  },
  {
    CID: '202194100905',
    member_id: '001H05',
    round,
    fname_ch: 'นูรอัยนา',
    lname_ch: 'สาและ',
    nickname_ch: 'นา',
    informant: 'แม่',
    informantID: 'H02',
    tam: '10',
    moo: '07',
    home: '34',
    tel: '09-2222-5555',
    name_tel: 'แม่',
    memid_tel: 'H02',
    nickname_1: 'อัยนา',
    fullname_1: round === 1 ? 'นูรอัยนา สาและ' : 'นูรไอนา สาและ',
    day_1: '24',
    month_1: round === 1 ? 'ส.ค.' : 'ก.ค.',
    timeS_1: '15.00',
    timeE_1: '15.45'
  }
])

const createB1Rows = (round) => ([
  { CID: '304460970101', round, school_name: round === 1 ? 'บ้านคลองใต้' : 'โรงเรียนบ้านคลองใต้', grade: 'อนุบาล 2', score: round === 1 ? '8' : '9', survey_date: '2026-03-13', note_json: round === 1 ? '{"risk":false}' : '{"risk":true}' },
  { CID: '304460970102', round, school_name: 'บ้านคลองเหนือ', grade: 'อนุบาล 3', score: '7', survey_date: '2026-03-13', note_json: '{"risk":false}' },
  { CID: '304460970103', round, school_name: 'วัดบางนา', grade: 'อนุบาล 2', score: round === 1 ? '0' : '', survey_date: round === 1 ? '2026-03-12' : '2026-03-13', note_json: null },
  { CID: '304460970104', round, school_name: 'เทศบาล 1', grade: 'อนุบาล 1', score: '6', survey_date: '2026-03-14', note_json: '{"risk":false}' },
  { CID: '304460970105', round, school_name: round === 1 ? 'บ้านทุ่ง' : 'บ้านทุ่งใหม่', grade: 'อนุบาล 3', score: '10', survey_date: '2026-03-14', note_json: '{"risk":false}' }
])

const createHhRows = (round) => ([
  { CID: '99010001', round, head_name: round === 1 ? 'สมพร ใจดี' : 'สมพร ใจดี', members: '4', income_group: 'กลาง', has_phone: '1' },
  { CID: '99010002', round, head_name: round === 1 ? 'อารีย์ แสงทอง' : 'อารี แสงทอง', members: round === 1 ? '3' : '4', income_group: 'ต่ำ', has_phone: '1' },
  { CID: '99010003', round, head_name: 'มานะ ปลอดภัย', members: '5', income_group: 'กลาง', has_phone: '0' },
  { CID: '99010004', round, head_name: 'นงนุช ขยัน', members: round === 1 ? '2' : '3', income_group: round === 1 ? 'สูง' : 'กลาง', has_phone: '1' },
  { CID: '99010005', round, head_name: 'ธันวา มีสุข', members: '6', income_group: 'ต่ำ', has_phone: round === 1 ? '0' : '1' }
])

const tableDatasets = {
  'tcls2025_ch1.preface_ch': {
    name: 'preface_ch',
    displayName: 'ข้อมูลนำหน้าเด็ก',
    primaryKeys: ['CID', 'member_id'],
    roundField: 'round',
    excludedColumns: ['round'],
    columns: chPrefaceColumns,
    round1: createChRows(1),
    round2: createChRows(2)
  },
  'tcls2025_ch1.b1': {
    name: 'b1',
    displayName: 'ตอนที่ 1 ข้อมูลโรงเรียน',
    primaryKeys: ['CID'],
    roundField: 'round',
    excludedColumns: ['round'],
    columns: b1Columns,
    round1: createB1Rows(1),
    round2: createB1Rows(2)
  },
  'tcls2025_hhre.hh': {
    name: 'hh',
    displayName: 'ข้อมูลครัวเรือน',
    primaryKeys: ['CID'],
    roundField: 'round',
    excludedColumns: ['round'],
    columns: hhColumns,
    round1: createHhRows(1),
    round2: createHhRows(2)
  },
  'tcls2025_hhre.hh_member': {
    name: 'hh_member',
    displayName: 'ข้อมูลสมาชิกครัวเรือน',
    primaryKeys: ['CID', 'member_id'],
    roundField: 'round',
    excludedColumns: ['round'],
    columns: chPrefaceColumns.slice(0, 6),
    round1: createChRows(1),
    round2: createChRows(2)
  }
}

const projects = [
  {
    id: 'tcls2025_hhbl',
    code: 'HHBL2025',
    displayName: 'Household Baseline 2025',
    rawDatabase: 'tcls2025_hhbl',
    cmpDatabase: 'tcls2025_hhbl_cmp',
    searchColumn: '',
    searchId1Start: 1,
    searchId1Length: 12,
    searchId2Start: 13,
    searchId2Length: null,
    searchId2Mode: 'exact',
    color: 'green',
    active: true,
    updatedAt: nowText,
    tables: []
  },
  {
    id: 'tcls2025_hhre',
    code: 'HHRE2025',
    displayName: 'Household Resurvey 2025',
    rawDatabase: 'tcls2025_hhre',
    cmpDatabase: 'tcls2025_hhre_cmp',
    searchColumn: '',
    searchId1Start: 1,
    searchId1Length: 12,
    searchId2Start: 13,
    searchId2Length: null,
    searchId2Mode: 'exact',
    color: 'green',
    active: true,
    updatedAt: nowText,
    tables: ['hh', 'hh_member']
  },
  {
    id: 'tcls2025_ch0',
    code: 'CH0BASE2025',
    displayName: 'Baseline Children_2025 (Cohort 0)',
    rawDatabase: 'tcls2025_ch0',
    cmpDatabase: 'tcls2025_ch0_cmp',
    searchColumn: '',
    searchId1Start: 1,
    searchId1Length: 12,
    searchId2Start: 13,
    searchId2Length: null,
    searchId2Mode: 'exact',
    color: 'blue',
    active: true,
    updatedAt: nowText,
    tables: []
  },
  {
    id: 'tcls2025_ch1',
    code: 'CH1BASE2025',
    displayName: 'Children Baseline 2025 (CH1)',
    rawDatabase: 'tcls2025_ch1',
    cmpDatabase: 'tcls2025_ch1_cmp',
    searchColumn: '',
    searchId1Start: 1,
    searchId1Length: 12,
    searchId2Start: 13,
    searchId2Length: null,
    searchId2Mode: 'exact',
    color: 'blue',
    active: true,
    updatedAt: nowText,
    tables: ['preface_ch', 'b1']
  },
  {
    id: 'tcls2025_ch2',
    code: 'CH2RES2025',
    displayName: 'Children Resurvey 2025 (CH2)',
    rawDatabase: 'tcls2025_ch2',
    cmpDatabase: 'tcls2025_ch2_cmp',
    searchColumn: '',
    searchId1Start: 1,
    searchId1Length: 12,
    searchId2Start: 13,
    searchId2Length: null,
    searchId2Mode: 'exact',
    color: 'yellow',
    active: true,
    updatedAt: nowText,
    tables: []
  },
  {
    id: 'tcls2025_ch10_screen',
    code: 'CH10SCREEN2025',
    displayName: 'Children_Resurvey 2025 เด็กกรอกเอง (cohort 10, 11, 12)',
    rawDatabase: 'tcls2025_ch10_screen',
    cmpDatabase: 'tcls2025_ch10_screen_cmp',
    searchColumn: '',
    searchId1Start: 1,
    searchId1Length: 12,
    searchId2Start: 13,
    searchId2Length: null,
    searchId2Mode: 'exact',
    color: 'red',
    active: true,
    updatedAt: nowText,
    tables: []
  }
]

const tableMeta = [
  { name: 'preface_ch', icon: 'error', allowed: true },
  { name: 'hh', icon: 'ok', allowed: true },
  { name: 'hh_member', icon: 'ok', allowed: true },
  { name: 'b1b', icon: 'ok', allowed: false },
  { name: 'b1b_table1', icon: 'ok', allowed: false },
  { name: 'b1', icon: 'ok', allowed: true },
  { name: 'b1a1', icon: 'ok', allowed: false }
]

const auditSeed = [
  {
    id: 1,
    taskId: 'TASK-2025-001',
    projectId: 'tcls2025_ch1',
    tableName: 'preface_ch',
    primaryKey: '202194100900001H01',
    columnName: 'fname_ch',
    round1Value: 'อัฟริน',
    round2Value: 'ณัฐฐารินทร์',
    selectedValue: 'ณัฐฐารินทร์',
    source: 'round2',
    user: 'nuda',
    changedAt: '2026-03-13 13:25:00'
  },
  {
    id: 2,
    taskId: 'TASK-2025-001',
    projectId: 'tcls2025_ch1',
    tableName: 'preface_ch',
    primaryKey: '202194100899001H02',
    columnName: 'round',
    round1Value: '1',
    round2Value: '2',
    selectedValue: '0',
    source: 'system',
    user: 'nuda',
    changedAt: '2026-03-13 13:20:00'
  }
]

export function getMockUser() {
  return { username: 'nuda', role: 'Administrator', displayName: 'nuda' }
}

export function getMockProjects() {
  return clone(projects)
}

export function getMockTableCatalog(projectId) {
  const project = projects.find((item) => item.id === projectId)
  return tableMeta.map((item) => {
    const dataset = tableDatasets[`${projectId}.${item.name}`]
    const allowed = Boolean(project?.tables.includes(item.name) && dataset)
    return {
      ...item,
      allowed,
      displayName: dataset?.displayName || item.name,
      primaryKeys: dataset?.primaryKeys || [],
      roundField: dataset?.roundField || 'round'
    }
  })
}

export function getMockSampleIds(projectId) {
  const project = projects.find((item) => item.id === projectId)
  const ids = []
  Object.entries(tableDatasets).forEach(([key, dataset]) => {
    if (!key.startsWith(`${projectId}.`)) {
      return
    }

    const sourceRows = [...dataset.round1, ...dataset.round2]
    sourceRows.forEach((row) => {
      const sampleId = composePrimaryKey(row, dataset.primaryKeys)
      if (sampleId && !ids.includes(sampleId)) {
        ids.push(sampleId)
      }
    })
  })

  return ids.slice(0, 20).map((id) => {
    const parts = splitMockSearchId(project, id)
    return {
      id,
      project_code: project?.surveyProjectCode || 'tcls2025',
      database_code: projectId,
      search_id1: parts.searchId1,
      searchId1: parts.searchId1,
      search_id2: parts.searchId2,
      searchId2: parts.searchId2
    }
  })
}

export function getMockAuditLogs() {
  return clone(auditSeed)
}

export function getDataset(projectId, tableName) {
  return tableDatasets[`${projectId}.${tableName}`]
}

export function composePrimaryKey(row, primaryKeys) {
  return primaryKeys.map((key) => row[key] ?? '').join('')
}

function splitMockSearchId(project, id) {
  const text = String(id || '')
  const id1Start = Math.max(1, Number(project?.searchId1Start || 1))
  const id1Length = Math.max(1, Number(project?.searchId1Length || 12))
  const id2Start = Math.max(1, Number(project?.searchId2Start || (id1Start + id1Length)))
  const id2Length = project?.searchId2Length ? Number(project.searchId2Length) : null

  return {
    searchId1: text.slice(id1Start - 1, id1Start - 1 + id1Length),
    searchId2: id2Length ? text.slice(id2Start - 1, id2Start - 1 + id2Length) : text.slice(id2Start - 1)
  }
}

export function buildPreview(project, table, searchMode, searchId, selectedPrimaryKeys) {
  const dataset = getDataset(project.id, table.name)
  if (!dataset) {
    return null
  }

  const keys = selectedPrimaryKeys?.length ? selectedPrimaryKeys : dataset.primaryKeys
  const matches = (row) => {
    const key = composePrimaryKey(row, keys)
    return searchMode === 'exact' ? key === searchId : key.startsWith(searchId)
  }

  const round1Keys = dataset.round1.filter(matches).map((row) => composePrimaryKey(row, keys))
  const round2Keys = dataset.round2.filter(matches).map((row) => composePrimaryKey(row, keys))
  const set1 = new Set(round1Keys)
  const set2 = new Set(round2Keys)
  const intersection = round1Keys.filter((key) => set2.has(key))
  const onlyRound1 = round1Keys.filter((key) => !set2.has(key))
  const onlyRound2 = round2Keys.filter((key) => !set1.has(key))

  return {
    round1Count: round1Keys.length,
    round2Count: round2Keys.length,
    intersectionCount: intersection.length,
    onlyRound1Count: onlyRound1.length,
    onlyRound2Count: onlyRound2.length,
    matchedKeys: intersection,
    rawDatabase: project.rawDatabase,
    cmpDatabase: project.cmpDatabase,
    targetTable: table.name,
    targetFullName: `${project.cmpDatabase}.${table.name}`,
    willCreateTable: true,
    copiedRows: round1Keys.length
  }
}

export function buildCompareRecords(project, table, searchMode, searchId, selectedPrimaryKeys) {
  const dataset = getDataset(project.id, table.name)
  if (!dataset) {
    return []
  }

  const keys = selectedPrimaryKeys?.length ? selectedPrimaryKeys : dataset.primaryKeys
  const preview = buildPreview(project, table, searchMode, searchId, keys)
  const matchedKeySet = new Set(preview?.matchedKeys || [])
  const round2ByKey = new Map(dataset.round2.map((row) => [composePrimaryKey(row, keys), row]))

  return dataset.round1
    .filter((row) => matchedKeySet.has(composePrimaryKey(row, keys)))
    .map((round1Row, index) => {
      const primaryKey = composePrimaryKey(round1Row, keys)
      const round2Row = round2ByKey.get(primaryKey)
      const fields = dataset.columns.map((column) => {
        const round1Value = normalizeValue(round1Row[column.name])
        const round2Value = normalizeValue(round2Row?.[column.name])
        const same = round1Value === round2Value
        return {
          key: column.name,
          label: column.label,
          type: column.type,
          options: column.options || [],
          round1Value,
          round2Value,
          same,
          status: same ? 'same' : 'different',
          selectedSource: same ? 'round1' : '',
          selectedValue: same ? round1Value : '',
          customInput: ''
        }
      })

      return {
        id: `${project.id}-${table.name}-${primaryKey}`,
        sequence: index + 1,
        primaryKey,
        primaryKeyValues: Object.fromEntries(keys.map((key) => [key, round1Row[key]])),
        status: fields.every((field) => field.same) ? 'complete' : 'pending',
        fields
      }
    })
}

export function normalizeValue(value) {
  if (value === null || typeof value === 'undefined') {
    return ''
  }

  return String(value)
}

export function buildAuditLog({ record, field, selectedValue, source, projectId, tableName, user }) {
  return {
    id: Date.now() + Math.random(),
    taskId: `TASK-${projectId.toUpperCase()}`,
    projectId,
    tableName,
    primaryKey: record.primaryKey,
    columnName: field.key,
    round1Value: field.round1Value,
    round2Value: field.round2Value,
    selectedValue,
    source,
    user,
    changedAt: new Date().toLocaleString('th-TH', { hour12: false })
  }
}

export function buildCsv(logs) {
  const header = ['task_id', 'project_id', 'table_name', 'primary_key', 'column_name', 'round1_value', 'round2_value', 'selected_value', 'source', 'user', 'changed_at']
  const lines = logs.map((log) => [
    log.taskId,
    log.projectId,
    log.tableName,
    log.primaryKey,
    log.columnName,
    log.round1Value,
    log.round2Value,
    log.selectedValue,
    log.source,
    log.user,
    log.changedAt
  ].map(escapeCsv).join(','))

  return [header.join(','), ...lines].join('\n')
}

function escapeCsv(value) {
  const text = String(value ?? '')
  return `"${text.replaceAll('"', '""')}"`
}
