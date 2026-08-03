<template>
  <tr>
    <td>
      <strong>{{ field.key }}</strong>
      <small>{{ field.label }}</small>
    </td>
    <td>
      <button
        type="button"
        :class="['choice-button', { selected: field.selectedSource === 'round1' }]"
        @click="$emit('choose', recordId, field.key, 'round1')"
      >
        {{ field.round1Value || 'ว่าง' }}
      </button>
    </td>
    <td>
      <button
        type="button"
        :class="['choice-button', { selected: field.selectedSource === 'round2' }]"
        @click="$emit('choose', recordId, field.key, 'round2')"
      >
        {{ field.round2Value || 'ว่าง' }}
      </button>
    </td>
    <td>
      <input
        class="save-value-input"
        :value="field.selectedValue ?? ''"
        placeholder="เลือกหรือกรอกค่าที่จะบันทึก"
        @input="$emit('custom', recordId, field.key, $event.target.value)"
      >
    </td>
  </tr>
</template>

<script setup>
defineProps({
  recordId: { type: String, required: true },
  field: { type: Object, required: true }
})

defineEmits(['choose', 'custom'])
</script>
