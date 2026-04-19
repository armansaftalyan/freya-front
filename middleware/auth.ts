export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const auth = useAuthStore()
  const { localePath } = useLocalizedPath()
  const { authLoginPath } = useBrandContext()

  auth.hydrateToken()

  if (auth.token && !auth.user) {
    await auth.fetchMe()
  }

  if (!auth.isAuth) {
    return navigateTo(localePath(authLoginPath.value))
  }
})
