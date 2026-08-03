<template>
  <section>
    <div class="section-title"><div><h2>แบบสอบถามที่พร้อมใช้งาน</h2><p>เลือกแบบสอบถาม/ฐานข้อมูลภายใต้ {{selectedProject.name}}</p></div><span class="count">{{selectedProject.databases.length}} แบบสอบถาม</span></div>
    <div class="project-grid"><button v-for="d in selectedProject.databases" :key="d.name" class="project-card" @click="$emit('pick', d)"><span class="folder">▤</span><span class="project-main"><b>{{d.label}}</b><small>{{d.name}}</small><em>{{d.tables.length}} ตาราง</em></span><span class="arrow">→</span></button></div>
  </section>
</template>
<script setup>
defineProps(['selectedProject'])
defineEmits(['pick'])
</script>
