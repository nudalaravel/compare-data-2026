<template>
  <main class="legacy-container login-page">
    <section class="login-wrap">
      <CommonLegacyPanel title="เข้าสู่ระบบ COMPARE DATA">
        <form class="login-form" @submit.prevent="submit">
          <label for="username">UserName</label>
          <input id="username" v-model="username" autocomplete="username">

          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="Password"
          >

          <button class="btn btn-login" type="submit" :disabled="loading">
            {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'Login' }}
          </button>
        </form>
      </CommonLegacyPanel>
    </section>

    <p v-if="lastError" class="error-text" v-html="lastError"></p>
  </main>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})

const router = useRouter()
const route = useRoute()
const { login, lastError, lastErrorIcon, hydrateUserFromStorage } = useCompareWorkflow()
const loading = ref(false)
const username = ref('')
const password = ref('')

onMounted(() => {
  if (hydrateUserFromStorage()) {
    router.replace('/')
  }
})

async function submit() {
  loading.value = true
  const ok = await login({
    username: username.value,
    password: password.value
  })
  loading.value = false

  if (!ok) {
    showLoginAlert(lastError.value, lastErrorIcon.value)
    return
  }

  router.push(typeof route.query.redirect === 'string' ? route.query.redirect : '/list')
}

function showLoginAlert(html, icon = 'error') {
  if (!import.meta.client) {
    return
  }

  const swal = window.Swal
  if (swal?.fire) {
    swal.fire({
      title: '',
      html,
      icon,
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#2563eb'
    })
    return
  }

  const text = String(html || '').replaceAll('<br>', '\n').replace(/<[^>]+>/g, '')
  window.alert(text)
}
</script>
