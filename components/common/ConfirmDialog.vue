
<template>
  <Teleport to="body">
    <div v-if="open" class="modal-backdrop">
      <section class="confirm-dialog" role="dialog" aria-modal="true" :aria-label="title">
        <header>
          <h2>{{ title }}</h2>
          <button type="button" aria-label="ปิด" @click="$emit('close')">×</button>
        </header>
        <div class="confirm-content">
          <slot />
        </div>
        <footer>
          <button type="button" class="btn btn-light" @click="$emit('close')">{{ cancelText }}</button>
          <button type="button" class="btn btn-success" @click="$emit('confirm')">{{ confirmText }}</button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>
<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  confirmText: { type: String, default: 'ยืนยัน' },
  cancelText: { type: String, default: 'ยกเลิก' }
})

defineEmits(['confirm', 'close'])
</script>
