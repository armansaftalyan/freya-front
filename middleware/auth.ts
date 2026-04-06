export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  const { localePath } = useLocalizedPath()
  const { authLoginPath } = useBrandContext()
  if (auth.token && !auth.user) {
    return auth.fetchMe()
  }

  if (!auth.isAuth) {
    if (import.meta.server) {
      return abortNavigation(createError({
        statusCode: 401,
        statusMessage: 'Authentication required',
      }))
    }

    return navigateTo(localePath(authLoginPath.value))
  }
})
