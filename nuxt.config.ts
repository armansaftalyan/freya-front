const apiBase = import.meta.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api'
const siteUrl = import.meta.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const googleAnalyticsId = import.meta.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''
const yandexMetricaId = import.meta.env.NUXT_PUBLIC_YANDEX_METRIKA_ID || ''
const nativeApp = import.meta.env.NUXT_PUBLIC_NATIVE_APP === 'true'
const firstBookingPromoEnabled = import.meta.env.NUXT_PUBLIC_FIRST_BOOKING_PROMO_ENABLED === 'true'
const firstBookingPromoPercentOff = Number(import.meta.env.NUXT_PUBLIC_FIRST_BOOKING_PROMO_PERCENT_OFF || 50)
const firstBookingPromoAudience = import.meta.env.NUXT_PUBLIC_FIRST_BOOKING_PROMO_AUDIENCE || 'all'
const publicSsrCacheHeaders = {
  'Cache-Control': 'public, max-age=3600, s-maxage=14400, stale-while-revalidate=86400',
}
const publicSwrRule = {
  swr: 14400,
  headers: publicSsrCacheHeaders,
}
const privateNoStoreRule = {
  prerender: false,
  headers: {
    'Cache-Control': 'private, no-store',
  },
}
const privatePaymentRule = {
  prerender: false,
  headers: {
    'Cache-Control': 'private, no-store, max-age=0',
    'X-Robots-Tag': 'noindex, nofollow',
    'Referrer-Policy': 'no-referrer',
  },
}

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  ssr: true,
  devtools: { enabled: false },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@vueuse/nuxt'],
  nitro: {
    compressPublicAssets: true,
  },
  css: ['~/assets/css/main.css'],
  tailwindcss: {
    viewer: false,
  },
  vite: {
    server: {
      watch: {
        ignored: [
          '**/.git/**',
          '**/.nuxt/**',
          '**/.output/**',
          '**/dist/**',
          '**/android/**',
          '**/ios/**',
        ],
      },
    },
  },
  routeRules: {
    '/sw.js': {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
    '/pay/**': privatePaymentRule,
    '/tor/pay/**': privatePaymentRule,
    '/en/pay/**': privatePaymentRule,
    '/ru/pay/**': privatePaymentRule,
    '/hy/pay/**': privatePaymentRule,
    '/en/tor/pay/**': privatePaymentRule,
    '/ru/tor/pay/**': privatePaymentRule,
    '/hy/tor/pay/**': privatePaymentRule,
    '/': publicSwrRule,
    '/en': publicSwrRule,
    '/ru': publicSwrRule,
    '/hy': publicSwrRule,
    '/en/blog': publicSwrRule,
    '/en/blog/**': publicSwrRule,
    '/en/services': publicSwrRule,
    '/en/services/**': publicSwrRule,
    '/en/products': publicSwrRule,
    '/en/products/**': publicSwrRule,
    '/en/masters': publicSwrRule,
    '/en/masters/**': publicSwrRule,
    '/en/contacts': publicSwrRule,
    '/en/legal': publicSwrRule,
    '/en/privacy-policy': publicSwrRule,
    '/en/tor': publicSwrRule,
    '/en/tor/blog': publicSwrRule,
    '/en/tor/blog/**': publicSwrRule,
    '/en/tor/services': publicSwrRule,
    '/en/tor/services/**': publicSwrRule,
    '/en/tor/products': publicSwrRule,
    '/en/tor/products/**': publicSwrRule,
    '/en/tor/masters': publicSwrRule,
    '/en/tor/masters/**': publicSwrRule,
    '/en/tor/contacts': publicSwrRule,
    '/en/tor/legal': publicSwrRule,
    '/en/tor/privacy-policy': publicSwrRule,
    '/ru/blog': publicSwrRule,
    '/ru/blog/**': publicSwrRule,
    '/ru/services': publicSwrRule,
    '/ru/services/**': publicSwrRule,
    '/ru/products': publicSwrRule,
    '/ru/products/**': publicSwrRule,
    '/ru/masters': publicSwrRule,
    '/ru/masters/**': publicSwrRule,
    '/ru/contacts': publicSwrRule,
    '/ru/legal': publicSwrRule,
    '/ru/privacy-policy': publicSwrRule,
    '/ru/tor': publicSwrRule,
    '/ru/tor/blog': publicSwrRule,
    '/ru/tor/blog/**': publicSwrRule,
    '/ru/tor/services': publicSwrRule,
    '/ru/tor/services/**': publicSwrRule,
    '/ru/tor/products': publicSwrRule,
    '/ru/tor/products/**': publicSwrRule,
    '/ru/tor/masters': publicSwrRule,
    '/ru/tor/masters/**': publicSwrRule,
    '/ru/tor/contacts': publicSwrRule,
    '/ru/tor/legal': publicSwrRule,
    '/ru/tor/privacy-policy': publicSwrRule,
    '/hy/blog': publicSwrRule,
    '/hy/blog/**': publicSwrRule,
    '/hy/services': publicSwrRule,
    '/hy/services/**': publicSwrRule,
    '/hy/products': publicSwrRule,
    '/hy/products/**': publicSwrRule,
    '/hy/masters': publicSwrRule,
    '/hy/masters/**': publicSwrRule,
    '/hy/contacts': publicSwrRule,
    '/hy/legal': publicSwrRule,
    '/hy/privacy-policy': publicSwrRule,
    '/hy/tor': publicSwrRule,
    '/hy/tor/blog': publicSwrRule,
    '/hy/tor/blog/**': publicSwrRule,
    '/hy/tor/services': publicSwrRule,
    '/hy/tor/services/**': publicSwrRule,
    '/hy/tor/products': publicSwrRule,
    '/hy/tor/products/**': publicSwrRule,
    '/hy/tor/masters': publicSwrRule,
    '/hy/tor/masters/**': publicSwrRule,
    '/hy/tor/contacts': publicSwrRule,
    '/hy/tor/legal': publicSwrRule,
    '/hy/tor/privacy-policy': publicSwrRule,
    '/account': { prerender: false },
    '/account/**': { prerender: false },
    '/en/account': privateNoStoreRule,
    '/en/account/**': privateNoStoreRule,
    '/ru/account': privateNoStoreRule,
    '/ru/account/**': privateNoStoreRule,
    '/hy/account': privateNoStoreRule,
    '/hy/account/**': privateNoStoreRule,
    '/en/cart': privateNoStoreRule,
    '/ru/cart': privateNoStoreRule,
    '/hy/cart': privateNoStoreRule,
    '/en/booking': privateNoStoreRule,
    '/ru/booking': privateNoStoreRule,
    '/hy/booking': privateNoStoreRule,
    '/en/gift-cards/buy': privateNoStoreRule,
    '/ru/gift-cards/buy': privateNoStoreRule,
    '/hy/gift-cards/buy': privateNoStoreRule,
    '/tor/account': { prerender: false },
    '/tor/account/**': { prerender: false },
    '/en/tor/account': privateNoStoreRule,
    '/en/tor/account/**': privateNoStoreRule,
    '/ru/tor/account': privateNoStoreRule,
    '/ru/tor/account/**': privateNoStoreRule,
    '/hy/tor/account': privateNoStoreRule,
    '/hy/tor/account/**': privateNoStoreRule,
    '/en/tor/cart': privateNoStoreRule,
    '/ru/tor/cart': privateNoStoreRule,
    '/hy/tor/cart': privateNoStoreRule,
    '/en/tor/booking': privateNoStoreRule,
    '/ru/tor/booking': privateNoStoreRule,
    '/hy/tor/booking': privateNoStoreRule,
  },
  runtimeConfig: {
    public: {
      apiBase,
      siteUrl,
      googleAnalyticsId,
      yandexMetricaId,
      nativeApp,
      firstBookingPromoEnabled,
      firstBookingPromoPercentOff,
      firstBookingPromoAudience,
    },
  },
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Premium beauty salon with online booking, top masters, and elegant service.',
        },
        { name: 'format-detection', content: 'telephone=no' },
        { key: 'app-mobile-capable', name: 'mobile-web-app-capable', content: 'yes' },
        { key: 'app-apple-capable', name: 'apple-mobile-web-app-capable', content: 'yes' },
        { key: 'app-apple-status-bar', name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { key: 'app-theme-color', name: 'theme-color', content: '#fbf8f4' },
        { key: 'app-mobile-title', name: 'apple-mobile-web-app-title', content: 'Freya' },
      ],
      link: [
        { key: 'app-icon-png', rel: 'icon', type: 'image/png', href: '/logo.png?v=4' },
        { key: 'app-icon-svg', rel: 'icon', type: 'image/svg+xml', href: '/logo.svg?v=4' },
        { key: 'app-shortcut-icon', rel: 'shortcut icon', href: '/logo.png?v=4' },
        { key: 'app-apple-touch-icon', rel: 'apple-touch-icon', sizes: '180x180', href: '/logo.png?v=4' },
      ],
    },
  },
  hooks: {
    'pages:extend'(pages) {
      if (nativeApp) return

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
