<template>
  <CommonLegacyPanel title="Audit Log ล่าสุด">
    <div class="audit-table-wrap">
      <table class="audit-table">
        <thead>
          <tr>
            <th>วันเวลา</th>
            <th>ผู้ใช้</th>
            <th>Project/Table</th>
            <th>Primary Key</th>
            <th>Column</th>
            <th>Round 1</th>
            <th>Round 2</th>
            <th>ค่าที่เลือก</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="`${log.id}-${log.columnName}`">
            <td>{{ log.changedAt }}</td>
            <td>{{ log.user }}</td>
            <td>{{ log.projectId }} / {{ log.tableName }}</td>
            <td>{{ log.primaryKey }}</td>
            <td>{{ log.columnName }}</td>
            <td>{{ log.round1Value || '-' }}</td>
            <td>{{ log.round2Value || '-' }}</td>
            <td><strong>{{ log.selectedValue || '-' }}</strong><small>{{ log.source }}</small></td>
          </tr>
        </tbody>
      </table>
    </div>
  </CommonLegacyPanel>
</template>
<script setup>
defineProps({
  logs: { type: Array, default: () => [] }
})
</script>