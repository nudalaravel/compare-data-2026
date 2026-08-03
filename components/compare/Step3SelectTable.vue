<template>
  <section class="two-col">
    <div class="panel config">
      <div class="panel-head"><h2>กำหนดขอบเขต</h2></div>
      <label>รูปแบบการค้นหารหัส</label>
      <div class="segmented"><button :class="{on:searchMode==='exact'}" @click="searchMode='exact'">ตรงรหัส</button><button :class="{on:searchMode==='prefix'}" @click="searchMode='prefix'">ขึ้นต้นด้วย (LIKE id%)</button></div>
      <label>รหัสที่ต้องการเปรียบเทียบ</label>
      <input v-model="searchId" placeholder="เช่น 304460970101">
    </div>
    <div class="panel">
      <div class="panel-head"><h2>เลือกตารางข้อมูล</h2><span class="badge">{{selectedDatabase.name}}</span></div>
      <div class="table-list">
        <button v-for="(t,i) in selectedDatabase.tables" :key="t.name" :disabled="!tableStatuses[i]?.ready" @click="tableStatuses[i]?.ready && $emit('pick-table', t, tableStatuses[i])">
          <span class="db">▤</span>
          <span><b>{{t.label}}</b><small>{{t.name}} · PK: {{t.pk.join(', ')}}</small></span>
          <em :class="['status', {ok: tableStatuses[i]?.ready}]">{{tableStatuses[i]?.label}}</em>
        </button>
      </div>
    </div>
  </section>
</template>
<script setup>
defineProps(['selectedDatabase', 'tableStatuses'])
defineEmits(['pick-table'])
const searchMode = defineModel('searchMode')
const searchId = defineModel('searchId')
</script>
