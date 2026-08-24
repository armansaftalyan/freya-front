export default defineNuxtPlugin(() => {
  const router = useRouter()
  const runtimeConfig = useRuntimeConfig()
  const isPaymentLinkPath = (path: string) => /^\/(?:(?:ru|en|hy)\/)?(?:tor\/)?pay\/[A-Za-z0-9]+(?:[/?#]|$)/.test(path)

  // Payment URLs are bearer secrets and may contain a customer's name on the page.
  // Do not load analytics/webvisor or transmit the token to third parties.
  if (isPaymentLinkPath(window.location.pathname)) {
    return
  }

  const googleAnalyticsId = String(runtimeConfig.public.googleAnalyticsId || '').trim()
  const yandexMetricaId = Number(String(runtimeConfig.public.yandexMetricaId || '').trim())
  const hasGoogle = googleAnalyticsId !== ''
  const hasYandex = Number.isFinite(yandexMetricaId) && yandexMetricaId > 0
  const hasAnalytics = hasGoogle || hasYandex
  let analyticsLoaded = false
  let pendingPageView: string | null = null
  let idleTimer: number | null = null

  const appendScript = (id: string, options: { src?: string, content?: string, async?: boolean }) => {
    if (document.getElementById(id)) {
      return
    }

    const script = document.createElement('script')
    script.id = id

    if (options.src) {
      script.src = options.src
    }

    if (options.async) {
      script.async = true
    }

    if (options.content) {
      script.textContent = options.content
    }

    document.head.appendChild(script)
  }

  const sendPageView = (fullPath: string) => {
    const pageLocation = `${window.location.origin}${fullPath}`

    if (hasGoogle && typeof window.gtag === 'function') {
      window.gtag('config', googleAnalyticsId, {
        page_path: fullPath,
        page_location: pageLocation,
        page_title: document.title,
      })
    }

    if (hasYandex && typeof window.ym === 'function') {
      window.ym(yandexMetricaId, 'hit', fullPath, {
        title: document.title,
        referer: document.referrer,
      })
    }
  }

  const loadAnalytics = () => {
    if (!hasAnalytics || analyticsLoaded) {
      return
    }

    analyticsLoaded = true

    if (hasGoogle) {
      window.dataLayer = window.dataLayer || []
      window.gtag = window.gtag || function (...args: unknown[]) {
        window.dataLayer?.push(args)
      }

      appendScript('google-analytics-loader', {
        src: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleAnalyticsId)}`,
        async: true,
      })
      appendScript('google-analytics-init', {
        content: [
          'window.dataLayer = window.dataLayer || [];',
          'function gtag(){dataLayer.push(arguments);}',
          "gtag('js', new Date());",
          `gtag('config', '${googleAnalyticsId}', { send_page_view: false });`,
        ].join('\n'),
      })
    }

    if (hasYandex) {
      appendScript('yandex-metrica-init', {
        content: [
          '(function(m,e,t,r,i,k,a){',
          'm[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};',
          'm[i].l=1*new Date();',
          'for (var j = 0; j < document.scripts.length; j++) {',
          "if (document.scripts[j].src === r) { return; }",
          '}',
          'k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);',
          `})(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');`,
          `ym(${yandexMetricaId}, 'init', { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });`,
        ].join('\n'),
      })
    }

    if (pendingPageView) {
      sendPageView(pendingPageView)
    }
  }

  const clearInteractionListeners = () => {
    window.removeEventListener('pointerdown', loadOnInteraction)
    window.removeEventListener('keydown', loadOnInteraction)
    window.removeEventListener('touchstart', loadOnInteraction)
    window.removeEventListener('scroll', loadOnInteraction)
  }

  const loadOnInteraction = () => {
    if (idleTimer !== null) {
      window.clearTimeout(idleTimer)
      idleTimer = null
    }

    clearInteractionListeners()
    loadAnalytics()
  }

  const scheduleAnalyticsLoad = () => {
    if (!hasAnalytics || analyticsLoaded) {
      return
    }

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => loadOnInteraction(), { timeout: 3500 })
      return
    }

    idleTimer = window.setTimeout(() => loadOnInteraction(), 3500)
  }

  const trackPageView = (fullPath: string) => {
    if (isPaymentLinkPath(fullPath)) {
      pendingPageView = null
      return
    }

    pendingPageView = fullPath

    if (!analyticsLoaded) {
      return
    }

    sendPageView(fullPath)
  }

  if (hasAnalytics) {
    window.addEventListener('pointerdown', loadOnInteraction, { passive: true, once: true })
    window.addEventListener('keydown', loadOnInteraction, { passive: true, once: true })
    window.addEventListener('touchstart', loadOnInteraction, { passive: true, once: true })
    window.addEventListener('scroll', loadOnInteraction, { passive: true, once: true })

    if (document.readyState === 'complete') {
      scheduleAnalyticsLoad()
    }
    else {
      window.addEventListener('load', scheduleAnalyticsLoad, { once: true })
    }
  }

  router.isReady().then(() => {
    trackPageView(router.currentRoute.value.fullPath)
  })

  router.afterEach((to) => {
    trackPageView(to.fullPath)
  })
})
