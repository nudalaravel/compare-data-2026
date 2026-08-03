<template>
  <section>
    <div class="section-title"><div><h2>ชุดข้อมูลที่พร้อมใช้งาน</h2><p>เลือกโปรเจกต์ที่ต้องการเปรียบเทียบ</p></div><span class="count">{{projects.length}} โปรเจกต์</span></div>
    <div class="project-grid"><button v-for="p in projects" :key="p.id" class="project-card" @click="$emit('pick', p)"><span class="folder">▰</span><span class="project-main"><b>{{p.name}}</b><small>{{p.code}}</small><em>{{p.databases.length}} แบบสอบถาม · พร้อมใช้งาน</em></span><span class="arrow">→</span></button></div>
  </section>
</template>
<script setup>
defineProps(['projects'])
defineEmits(['pick'])
</script>