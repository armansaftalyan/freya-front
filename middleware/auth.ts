export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  const { localePath } = useLocalizedPath()
  const { authLoginPath } = useBrandContext()
  if (auth.token && !auth.user) {
    return auth.fetchMe()
  }

  if (!auth.isAuth) {
    return navigateTo(localePath(authLoginPath.value))
  }
})
