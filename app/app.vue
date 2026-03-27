<script setup lang="ts">
import type { ApiItemResponse } from '~/types/api'
import type { Product } from '~/types/product'

const api = useApi()
const cart = useCartStore()
const { locale } = useLocale()
const runtimeConfig = useRuntimeConfig()
const cartSyncKey = computed(() => cart.items.map(item => item.product.id).sort((a, b) => a - b).join(','))
const googleAnalyticsId = computed(() => String(runtimeConfig.public.googleAnalyticsId || '').trim())
const yandexMetricaId = computed(() => String(runtimeConfig.public.yandexMetricaId || '').trim())
const hasQueryParams = computed(() => Object.keys(useRoute().query).length > 0)

useHead(() => ({
  htmlAttrs: {
    lang: locale.value,
  },
  meta: hasQueryParams.value
    ? [
        {
          key: 'query-robots',
          name: 'robots',
          content: 'noindex, nofollow',
        },
      ]
    : [],
  script: [
    ...(googleAnalyticsId.value
      ? [
          {
            key: 'google-analytics-loader',
            src: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleAnalyticsId.value)}`,
            async: true,
          },
          {
            key: 'google-analytics-init',
            children: [
              'window.dataLayer = window.dataLayer || [];',
              'function gtag(){dataLayer.push(arguments);}',
              "gtag('js', new Date());",
              `gtag('config', '${googleAnalyticsId.value}', { send_page_view: false });`,
            ].join('\n'),
          },
        ]
      : []),
    ...(yandexMetricaId.value
      ? [
          {
            key: 'yandex-metrica-init',
            children: [
              '(function(m,e,t,r,i,k,a){',
              'm[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};',
              'm[i].l=1*new Date();',
              'for (var j = 0; j < document.scripts.length; j++) {',
              "if (document.scripts[j].src === r) { return; }",
              '}',
              'k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);',
              `})(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');`,
              `ym(${yandexMetricaId.value}, 'init', { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });`,
            ].join('\n'),
          },
        ]
      : []),
  ],
  noscript: [
    ...(yandexMetricaId.value
      ? [
          {
            key: 'yandex-metrica-noscript',
            children: `<div><img src="https://mc.yandex.ru/watch/${yandexMetricaId.value}" style="position:absolute; left:-9999px;" alt="" /></div>`,
          },
        ]
      : []),
  ],
}))

const syncCartLocale = async () => {
  const productIds = [...new Set(cart.items.map(item => item.product.id))].filter(Boolean)
  if (!productIds.length) return

  const responses = await Promise.all(
    productIds.map(async (id) => {
      try {
        return await api.get<ApiItemResponse<Product>>(`/products/${id}`, undefined, { skipErrorToast: true })
      }
      catch {
        return null
      }
    }),
  )

  cart.syncProducts(
    responses
      .map(response => response?.data || null)
      .filter((product): product is Product => Boolean(product)),
  )
}

watch(
  () => [locale.value, cartSyncKey.value],
  () => {
    syncCartLocale()
  },
  { immediate: true },
)
</script>

<template>
  <NuxtLoadingIndicator color="#c8a46a" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
