<template>
  <CommonLegacyPanel title="③ ตารางข้อมูล" compact>
    <div class="table-tree">
      <button
        v-for="(table, index) in tables"
        :key="table.name"
        type="button"
        :class="['table-node', { selected: selectedName === table.name }]"
        :disabled="!table.allowed || !statuses[index]?.ready"
        :title="statusTitle(statuses[index])"
        @click="$emit('select', table)"
      > 
        <span :class="['tree-icon', statusTone(statuses[index])]">{{ statusIcon(statuses[index]) }}</span>
        <span>{{ table.name }}</span>
      </button>
    </div>
  </CommonLegacyPanel>
</template>
<script setup>
defineProps({
  tables: { type: Array, default: () => [] },
  statuses: { type: Array, default: () => [] },
  selectedName: { type: String, default: '' }
})

defineEmits(['select'])

function statusTone(status) {
  return status?.tone || (status?.ready ? 'warning' : 'empty')
}

function statusIcon(status) {
  if (status?.icon) {
    return status.icon
  }

  const tone = statusTone(status)
  if (tone === 'ok') {
    return '✓'
  }
  if (tone === 'warning') {
    return '▲'
  }
  if (tone === 'slash') {
    return '/'
  }
  if (tone === 'empty') {
    return '✖'
  }
  return '☒'
}

function statusTitle(status) {
  return status?.label || ''
}
</script>
