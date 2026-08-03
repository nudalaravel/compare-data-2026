<template>
  <div class="preview-grid">
    <span><b>#rows in ROUND1</b><em>{{ preview.round1Count }}</em></span>
    <span><b>#rows in ROUND2</b><em>{{ preview.round2Count }}</em></span>
    <span><b>#rows intersection</b><em>{{ preview.intersectionCount }}</em></span>
    <span><b>เฉพาะ ROUND1</b><em>{{ preview.onlyRound1Count }}</em></span>
    <span><b>เฉพาะ ROUND2</b><em>{{ preview.onlyRound2Count }}</em></span>
    <span><b>Target</b><em>{{ preview.targetFullName }}</em></span>
  </div>
</template>
<script setup>
defineProps({
  preview: { type: Object, required: true }
})
</script>