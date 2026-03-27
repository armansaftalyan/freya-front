export default defineNuxtPlugin(() => {
  const router = useRouter()
  const runtimeConfig = useRuntimeConfig()

  const googleAnalyticsId = String(runtimeConfig.public.googleAnalyticsId || '').trim()
  const yandexMetricaId = Number(String(runtimeConfig.public.yandexMetricaId || '').trim())

  let hostname = ''
  try {
    hostname = new URL(String(runtimeConfig.public.siteUrl || '')).hostname.toLowerCase()
  }
  catch {
    hostname = ''
  }

  const analyticsEnabled = !['', 'localhost', '127.0.0.1', '0.0.0.0'].includes(hostname)

  if (!analyticsEnabled) {
    return
  }

  const trackPageView = (fullPath: string) => {
    const pageLocation = `${window.location.origin}${fullPath}`

    if (googleAnalyticsId !== '' && typeof window.gtag === 'function') {
      window.gtag('config', googleAnalyticsId, {
        page_path: fullPath,
        page_location: pageLocation,
        page_title: document.title,
      })
    }

    if (Number.isFinite(yandexMetricaId) && yandexMetricaId > 0 && typeof window.ym === 'function') {
      window.ym(yandexMetricaId, 'hit', fullPath, {
        title: document.title,
        referer: document.referrer,
      })
    }
  }

  router.isReady().then(() => {
    trackPageView(router.currentRoute.value.fullPath)
  })

  router.afterEach((to) => {
    trackPageView(to.fullPath)
  })
})
