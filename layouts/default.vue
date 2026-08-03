<template>
  <div class="legacy-shell">
    <header class="legacy-topbar">
      <div class="legacy-container topbar-inner">
        <NuxtLink class="legacy-brand" to="/list">COMPARE DATA</NuxtLink>
        <nav class="legacy-nav" aria-label="Main navigation">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :class="{ active: route.path === item.to }"
            :to="item.to"
          >
            {{ item.label }}
          </NuxtLink>
          <button v-if="user" type="button" @click="handleLogout">ออกจากระบบ</button>
          <NuxtLink v-else to="/login">เข้าสู่ระบบ</NuxtLink>
        </nav>
      </div>
    </header>

    <slot />

    <footer class="legacy-footer">
      <span>
        &copy; 2019–{{ new Date().getFullYear() }} RIPED.
        สงวนลิขสิทธิ์ | เวอร์ชัน {{ version }}
      </span>
    </footer>
  </div>
</template>
<script setup>
const route = useRoute()
const config = useRuntimeConfig()
const { user, logout } = useCompareWorkflow()
const version = config.public.appVersion || '1.0.0'

const navItems = [
  { to: '/list', label: 'Survey List' },
  { to: '/', label: 'Compare' },
  { to: '/report', label: 'รายงานผล' },
  { to: '/admin', label: 'Administrator' }
]

function handleLogout() {
  logout()
  navigateTo('/login')
}
</script>
