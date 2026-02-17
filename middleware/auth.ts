export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  if (auth.token && !auth.user) {
    return auth.fetchMe()
  }

  if (!auth.isAuth) {
    return navigateTo('/account/login')
  }
})
