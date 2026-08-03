
<template>
  <section :class="['legacy-panel', { compact }]">
    <header class="legacy-panel-head">
      <h2>{{ title }}</h2>
      <span v-if="badge" class="panel-badge">{{ badge }}</span>
    </header>
    <div class="legacy-panel-body">
      <slot />
    </div>
  </section>
</template>
<script setup>
defineProps({
  title: { type: String, required: true },
  badge: { type: String, default: '' },
  compact: { type: Boolean, default: false }
})
</script>
