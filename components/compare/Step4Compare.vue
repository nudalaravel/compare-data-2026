<template>
  <section>
    <h1 class="page-title">4.เปรียบเทียบข้อมูล</h1>
    <button class="back-link" type="button" @click="$emit('back')">« ย้อนกลับ</button>
    <div class="rule"></div>

    <CommonLegacyPanel title="ค้นหา:">
      <div class="search-line">
        <span class="input-prefix">SEARCH ID :</span>
        <input :value="activeRecord?.primaryKey || ''" readonly placeholder="INPUT ID!!">
        <button class="btn btn-gray" type="button">Search</button>
      </div>
    </CommonLegacyPanel>

    <div v-if="complete" class="results-table legacy-result">
      <div class="result-head"><span>Primary Key(s)</span><span>Results</span></div>
      <button
        v-for="(record, index) in records"
        :key="record.id"
        type="button"
        class="result-row done"
        @click="$emit('open-record', index)"
      >
        <span>{{ record.primaryKey }}</span>
        <span>Compared !!!</span>
      </button>
    </div>

    <div v-else-if="activeRecord" class="compare-card">
      <header class="compare-card-head">
        <div>
          <span>Primary Key(s)</span>
          <strong>{{ activeRecord.primaryKey }}</strong>
        </div>
        <div class="mini-progress">
          <span>{{ comparedCount }} / {{ records.length }} รหัส</span>
          <i><b :style="{ width: `${records.length ? (comparedCount / records.length) * 100 : 0}%` }"></b></i>
        </div>
      </header>

      <div class="compare-table-wrap">
        <table class="compare-table">
          <thead>
            <tr>
              <th>field_name</th>
              <th>ROUND 1</th>
              <th>ROUND 2</th>
              <th>ค่าที่จะบันทึก</th>
            </tr>
          </thead>
          <tbody>
            <CompareFieldRow
              v-for="field in differentFields"
              :key="field.key"
              :record-id="activeRecord.id"
              :field="field"
              @choose="(...args) => $emit('choose', ...args)"
              @custom="(...args) => $emit('custom', ...args)"
            />
            <tr v-if="!differentFields.length">
              <td colspan="4" class="empty-diff">ข้อมูล ROUND 1 และ ROUND 2 ตรงกันทั้งหมด</td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer class="submit-row">
        <span>บันทึกเฉพาะฐาน {{ project.cmpDatabase }} และสร้าง Audit Log แบบ append-only</span>
        <button class="btn btn-gray" type="button" :disabled="!canSubmit" @click="$emit('save')">Submit</button>
        <button class="btn btn-gray" type="button" @click="$emit('reset')">Reset</button>
      </footer>
    </div>

    <CommonLegacyPanel v-else title="ไม่พบข้อมูล">
      <p class="empty-state">ไม่พบรหัสที่อยู่ครบทั้ง ROUND 1 และ ROUND 2</p>
    </CommonLegacyPanel>
  </section>
</template>

<script setup>
const props = defineProps({
  project: { type: Object, required: true },
  table: { type: Object, required: true },
  records: { type: Array, default: () => [] },
  activeRecord: { type: Object, default: null },
  activeIndex: { type: Number, default: 0 },
  comparedCount: { type: Number, default: 0 },
  complete: { type: Boolean, default: false }
})

defineEmits(['choose', 'custom', 'save', 'reset', 'open-record', 'back'])

const differentFields = computed(() => {
  return (props.activeRecord?.fields || []).filter((field) => !field.same)
})

const canSubmit = computed(() => {
  return differentFields.value.every((field) => hasSaveValue(field.selectedValue))
})

function hasSaveValue(value) {
  return value !== null && typeof value !== 'undefined' && String(value).trim() !== ''
}
</script>
