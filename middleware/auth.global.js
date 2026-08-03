export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) {
    return
  }

  const hasToken = Boolean(localStorage.getItem('_token_tcls'))
  const isLoginPage = to.path === '/login'
  const publicPages = ['/list', '/report']
  const isPublicPage = publicPages.includes(to.path)

  if (!hasToken && !isLoginPage && !isPublicPage) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }

  if (hasToken && isLoginPage) {
    return navigateTo('/')
  }
})
