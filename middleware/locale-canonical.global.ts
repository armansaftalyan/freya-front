import { defaultLocale, extractLocaleFromPath, withLocalePath } from '~/composables/useLocalizedPath'

export default defineNuxtRouteMiddleware((to) => {
  if (extractLocaleFromPath(to.path)) {
    return
  }

  return navigateTo(
    {
      path: withLocalePath(to.path, defaultLocale),
      query: to.query,
      hash: to.hash,
    },
    {
      redirectCode: 301,
      replace: true,
    },
  )
})
