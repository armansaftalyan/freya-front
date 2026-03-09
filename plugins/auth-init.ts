export default defineNuxtPlugin(async () => {
  await initAuthSession()
})
