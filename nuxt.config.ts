const apiBase = import.meta.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api'
const siteUrl = import.meta.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const googleAnalyticsId = import.meta.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''
const yandexMetricaId = import.meta.env.NUXT_PUBLIC_YANDEX_METRIKA_ID || ''

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  ssr: true,
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@vueuse/nuxt'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase,
      siteUrl,
      googleAnalyticsId,
      yandexMetricaId,
    },
  },
  app: {
    head: {
      titleTemplate: '%s | Freya Beauty Salon',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Premium beauty salon with online booking, top masters, and elegant service.',
        },
        { key: 'app-mobile-title', name: 'apple-mobile-web-app-title', content: 'Freya' },
      ],
      link: [
        { key: 'app-icon-png', rel: 'icon', type: 'image/png', href: '/logo.png?v=4' },
        { key: 'app-icon-svg', rel: 'icon', type: 'image/svg+xml', href: '/logo.svg?v=4' },
        { key: 'app-shortcut-icon', rel: 'shortcut icon', href: '/logo.png?v=4' },
        { key: 'app-apple-touch-icon', rel: 'apple-touch-icon', sizes: '180x180', href: '/logo.png?v=4' },
        { key: 'app-manifest', rel: 'manifest', href: '/site.webmanifest?v=4' },
      ],
    },
  },
  hooks: {
    'pages:extend'(pages) {
      const cloneWithLocale = (page: any): any => ({
        ...page,
        name: page.name ? `${page.name}___locale` : undefined,
        path: page.path === '/' ? '/:locale(ru|en|hy)' : `/:locale(ru|en|hy)${page.path}`,
        children: page.children?.map((child: any) => ({
          ...child,
          name: child.name ? `${child.name}___locale` : undefined,
          children: child.children,
        })),
      })

      const localizedPages = pages.map(cloneWithLocale)
      pages.push(...localizedPages)
    },
  },
  typescript: {
    strict: true,
  },
})
