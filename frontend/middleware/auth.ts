export default defineNuxtRouteMiddleware((to) => {
  if (process.client) {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      return navigateTo({
        path: '/auth/login',
        query: { redirect: to.fullPath },
      })
    }
  }
})
