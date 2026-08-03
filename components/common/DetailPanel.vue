
<template>
  <CommonLegacyPanel :title="title" compact>
    <div class="detail-list">
      <div v-for="row in rows" :key="row.label" class="detail-row">
        <span class="detail-label">{{ row.label }}</span>
        <span class="detail-value">{{ row.value || '-' }}</span>
      </div>
    </div>
  </CommonLegacyPanel>
</template>
<script setup>
defineProps({
  title: { type: String, default: 'รายละเอียด' },
  rows: { type: Array, default: () => [] }
})
</script>
