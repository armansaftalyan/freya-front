export const initAuthSession = async () => {
  const auth = useAuthStore()
  await auth.fetchMe()
}
