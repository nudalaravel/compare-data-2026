<template>
  <section>
    <h1 class="page-title">2.เลือกตารางข้อมูล</h1>
    <div class="rule"></div>
    <button class="back-link" type="button" @click="$emit('back')">« ย้อนกลับ</button>
    <div class="rule"></div>

    <div class="instructions">
      <p>1. เลือกหมู่ ที่ต้องการ compare <span class="danger-text">(compare หมู่ A เป็นครั้งแรก)</span></p>
      <p>2. กรอก StructureID หรือ StructureID+MemberID <span class="danger-text">(เคย compare หมู่ A แล้ว)</span></p>
      <p>3. คลิกเลือกตารางที่ต้องการ compare กล่องทางขวามือ</p>
      <p>4. กด Select PrimaryKey</p>
      <p>5. กด Next</p>
    </div>

    <CommonLegacyPanel :title="`Compare Data : ${project.rawDatabase}`">
      <div class="scope-row">
        <span class="step-bubble">1</span>
        <label>CID:</label>
        <div ref="searchId1Select" class="searchable-select" :class="{ open: searchId1Open }">
          <input
            :value="searchId1Query"
            autocomplete="off"
            role="combobox"
            aria-autocomplete="list"
            :aria-expanded="searchId1Open ? 'true' : 'false'"
            placeholder="เลือกหรือพิมพ์ CID"
            @focus="openSearchId1"
            @input="setSearchId1Query($event.target.value)"
            @keydown.down.prevent="moveSearchId1Highlight(1)"
            @keydown.up.prevent="moveSearchId1Highlight(-1)"
            @keydown.enter.prevent="commitSearchId1FromKeyboard"
            @keydown.esc.prevent="closeSearchId1"
          >
          <button class="searchable-select-toggle" type="button" aria-label="Open CID list" @click="toggleSearchId1">
            ▾
          </button>
          <div v-if="searchId1Open" class="searchable-select-menu" role="listbox">
            <button
              v-for="(option, index) in filteredSearchId1Options"
              :key="option.value"
              type="button"
              :class="['searchable-select-option', { active: index === highlightedSearchId1Index }]"
              role="option"
              @mousedown.prevent="setSearchId1(option.value)"
            >
              {{ option.value }}
            </button>
            <div v-if="!filteredSearchId1Options.length" class="searchable-select-empty">
              ไม่พบรหัส
            </div>
          </div>
        </div>
        <span class="step-bubble">2</span>
        <input
          :value="searchId2Query"
          placeholder=""
          @input="setSearchId2Query($event.target.value)"
        >
      </div>

      <div class="scope-row">
        <label>New table:</label>
        <input :value="project.cmpDatabase" disabled>
        <input :value="selectedTable?.name || ''" disabled placeholder="เลือกตารางจากด้านขวา">
      </div>

      <div class="center-actions">
        <span class="step-bubble">4</span>
        <button
          class="btn btn-lime"
          type="button"
          :disabled="!selectedTable || !selectedTableReady"
          @click="$emit('refresh-preview')"
        >
          Select PrimaryKey
        </button>
      </div>

      <div v-if="selectedTable" class="primary-key-zone">
        <div class="pk-box">
          <h3>X Drop</h3>
          <div class="pk-list empty-state">ตัวแปรที่ซ่อนจะถูกอ่านจาก Metadata</div>
        </div>
        <div class="pk-box">
          <h3>Select</h3>
          <label v-for="key in selectedTable.primaryKeys" :key="key" class="pk-choice">
            <input
              type="checkbox"
              :checked="selectedPrimaryKeys.includes(key)"
              @change="$emit('toggle-primary-key', key)"
            >
            {{ key }}
          </label>
        </div>
      </div>

      <div class="center-actions">
        <span class="step-bubble">5</span>
        <button class="btn btn-lime" type="button" :disabled="!freshPreview || !selectedTableReady" @click="$emit('prepare')">Next</button>
      </div>
    </CommonLegacyPanel>
  </section>
</template>

<script setup>
const props = defineProps({
  project: { type: Object, required: true },
  tables: { type: Array, default: () => [] },
  tableStatuses: { type: Array, default: () => [] },
  selectedTable: { type: Object, default: null },
  selectedPrimaryKeys: { type: Array, default: () => [] },
  preview: { type: Object, default: null },
  scopePreview: { type: Object, default: null },
  sampleIds: { type: Array, default: () => [] }
})

const searchMode = defineModel('searchMode', { default: 'prefix' })
const searchId1 = defineModel('searchId1', { default: '' })
const searchId2 = defineModel('searchId2', { default: '' })
const searchId = defineModel('searchId', { default: '' })
const emit = defineEmits(['back', 'select-table', 'toggle-primary-key', 'refresh-preview', 'prepare'])

const searchId1Select = ref(null)
const searchId1Query = ref('')
const searchId2Query = ref('')
const searchId1Open = ref(false)
const highlightedSearchId1Index = ref(0)
let refreshScopeTimer = null

const combinedSearchId = computed(() => `${searchId1.value || ''}${searchId2.value || ''}`)
const normalizedSamples = computed(() => props.sampleIds.map(normalizeSample).filter((sample) => sample.id))
const searchId1Options = computed(() => {
  const options = new Map()
  normalizedSamples.value.forEach((sample) => {
    if (!sample.searchId1 || options.has(sample.searchId1)) {
      return
    }
    options.set(sample.searchId1, { value: sample.searchId1 })
  })

  return [...options.values()]
})
const filteredSearchId1Options = computed(() => {
  const query = searchId1Query.value.trim().toLowerCase()
  const options = query
    ? searchId1Options.value.filter((option) => option.value.toLowerCase().includes(query))
    : searchId1Options.value

  return options.slice(0, 100)
})
const selectedTableStatus = computed(() => {
  const index = props.tables.findIndex((table) => table.name === props.selectedTable?.name)
  return index >= 0 ? props.tableStatuses[index] : null
})
const selectedTableReady = computed(() => Boolean(selectedTableStatus.value?.ready))
const freshPreview = computed(() => {
  const previewSearchId = props.preview?.searchId || props.preview?.search_id || ''
  return previewSearchId === combinedSearchId.value ? props.preview : null
})

watch([searchId1, searchId2, () => props.project], syncScope, { immediate: true })
watch(searchId1, (value) => {
  if (searchId1Query.value !== value) {
    searchId1Query.value = String(value || '')
  }
}, { immediate: true })
watch(searchId2, (value) => {
  if (searchId2Query.value !== value) {
    searchId2Query.value = String(value || '')
  }
}, { immediate: true })
watch(filteredSearchId1Options, () => {
  highlightedSearchId1Index.value = 0
})

onMounted(() => {
  window.addEventListener('mousedown', handleOutsideSearchId1)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousedown', handleOutsideSearchId1)
  if (refreshScopeTimer) {
    window.clearTimeout(refreshScopeTimer)
  }
})

function setSearchId1(value) {
  searchId1.value = String(value || '').trim()
  searchId1Query.value = searchId1.value
  closeSearchId1()
  refreshScope()
}

function setSearchId1Query(value) {
  searchId1Query.value = value
  searchId1.value = value
  searchId1Open.value = true
  highlightedSearchId1Index.value = 0
  scheduleRefreshScope()
}

function setSearchId2Query(value) {
  searchId2Query.value = value
  searchId2.value = value
  scheduleRefreshScope()
}

function openSearchId1() {
  searchId1Query.value = searchId1.value || ''
  searchId1Open.value = true
  highlightedSearchId1Index.value = 0
}

function closeSearchId1() {
  searchId1Open.value = false
}

function toggleSearchId1() {
  if (searchId1Open.value) {
    closeSearchId1()
    return
  }
  openSearchId1()
}

function moveSearchId1Highlight(direction) {
  if (!searchId1Open.value) {
    openSearchId1()
    return
  }

  const lastIndex = filteredSearchId1Options.value.length - 1
  if (lastIndex < 0) {
    highlightedSearchId1Index.value = 0
    return
  }

  highlightedSearchId1Index.value = Math.min(
    lastIndex,
    Math.max(0, highlightedSearchId1Index.value + direction)
  )
}

function commitSearchId1FromKeyboard() {
  const option = filteredSearchId1Options.value[highlightedSearchId1Index.value]
  setSearchId1(option?.value || searchId1Query.value)
}

function handleOutsideSearchId1(event) {
  if (!searchId1Select.value?.contains(event.target)) {
    closeSearchId1()
  }
}

function scheduleRefreshScope() {
  if (refreshScopeTimer) {
    window.clearTimeout(refreshScopeTimer)
  }
  refreshScopeTimer = window.setTimeout(() => {
    refreshScopeTimer = null
    refreshScope()
  }, 250)
}

function refreshScope() {
  if (refreshScopeTimer) {
    window.clearTimeout(refreshScopeTimer)
    refreshScopeTimer = null
  }
  const scope = syncScope()
  emit('refresh-preview', scope)
}

function syncScope() {
  const cleanId1 = String(searchId1.value || '').trim()
  const cleanId2 = String(searchId2Query.value || searchId2.value || '').trim()
  searchId1.value = cleanId1
  searchId2.value = cleanId2
  searchId2Query.value = cleanId2
  searchId.value = `${cleanId1}${cleanId2}`
  searchMode.value = resolveMode()

  return {
    searchId1: cleanId1,
    searchId2: cleanId2,
    searchId: searchId.value,
    searchMode: searchMode.value
  }
}

function resolveMode() {
  if (!String(searchId2.value || '').trim()) {
    return 'prefix'
  }

  const mode = String(props.project?.searchId2Mode || props.project?.search_id2_mode || 'exact').toLowerCase()
  return ['exact', 'prefix'].includes(mode) ? mode : 'exact'
}

function normalizeSample(sample) {
  if (typeof sample === 'string') {
    const id = String(sample)
    const parts = splitSearchIdByProject(props.project, id)
    return {
      id,
      databaseCode: props.project.databaseCode || props.project.database_code || props.project.id,
      searchId1: parts.searchId1,
      searchId2: parts.searchId2
    }
  }

  const id = String(sample?.id || sample?.sample_id || '')
  return {
    id,
    databaseCode: sample?.databaseCode || sample?.database_code || props.project.databaseCode || props.project.database_code || props.project.id,
    searchId1: String(sample?.searchId1 || sample?.search_id1 || id),
    searchId2: String(sample?.searchId2 || sample?.search_id2 || '')
  }
}

function splitSearchIdByProject(project, id) {
  const text = String(id || '')
  const id1Start = Math.max(1, Number(project?.searchId1Start || project?.search_id1_start || 1))
  const id1Length = Math.max(1, Number(project?.searchId1Length || project?.search_id1_length || text.length || 1))
  const id2Start = Math.max(1, Number(project?.searchId2Start || project?.search_id2_start || (id1Start + id1Length)))
  const rawId2Length = project?.searchId2Length || project?.search_id2_length || null
  const id2Length = rawId2Length ? Number(rawId2Length) : null

  return {
    searchId1: text.slice(id1Start - 1, id1Start - 1 + id1Length),
    searchId2: id2Length ? text.slice(id2Start - 1, id2Start - 1 + id2Length) : text.slice(id2Start - 1)
  }
}
</script>
