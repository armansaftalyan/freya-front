import { defaultLocale, extractLocaleFromPath, withLocalePath } from '~/composables/useLocalizedPath'

export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig()
  const nativeApp = config.public.nativeApp === true || config.public.nativeApp === 'true'

  if (nativeApp) {
    return
  }

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
