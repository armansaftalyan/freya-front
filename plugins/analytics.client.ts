export default defineNuxtPlugin(() => {
  const router = useRouter()
  const runtimeConfig = useRuntimeConfig()

  const googleAnalyticsId = String(runtimeConfig.public.googleAnalyticsId || '').trim()
  const yandexMetricaId = Number(String(runtimeConfig.public.yandexMetricaId || '').trim())
  const hasGoogle = googleAnalyticsId !== ''
  const hasYandex = Number.isFinite(yandexMetricaId) && yandexMetricaId > 0

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

  const appendYandexNoscript = () => {
    if (!hasYandex || document.getElementById('yandex-metrica-noscript')) {
      return
    }

    const noscript = document.createElement('noscript')
    noscript.id = 'yandex-metrica-noscript'
    noscript.innerHTML = `<div><img src="https://mc.yandex.ru/watch/${yandexMetricaId}" style="position:absolute; left:-9999px;" alt="" /></div>`
    document.body.appendChild(noscript)
  }

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

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', appendYandexNoscript, { once: true })
    }
    else {
      appendYandexNoscript()
    }
  }

  const trackPageView = (fullPath: string) => {
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

  router.isReady().then(() => {
    trackPageView(router.currentRoute.value.fullPath)
  })

  router.afterEach((to) => {
    trackPageView(to.fullPath)
  })
})
