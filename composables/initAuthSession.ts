export const initAuthSession = async () => {
  const auth = useAuthStore()
  auth.hydrateToken()
  await auth.fetchMe()
}
