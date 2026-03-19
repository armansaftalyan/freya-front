export default defineNuxtRouteMiddleware((to) => {
  const localeParam = Array.isArray(to.params.locale) ? to.params.locale[0] : to.params.locale
  const routeLocale = typeof localeParam === 'string' ? extractLocaleFromPath(`/${localeParam}`) : extractLocaleFromPath(to.path)

  if (routeLocale) {
    return
  }

  return
})
