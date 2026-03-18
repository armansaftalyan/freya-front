<script setup lang="ts">
import type { ApiItemResponse } from '~/types/api'
import type { Product } from '~/types/product'

const api = useApi()
const cart = useCartStore()
const { locale } = useLocale()
const cartSyncKey = computed(() => cart.items.map(item => item.product.id).sort((a, b) => a - b).join(','))

useHead(() => ({
  htmlAttrs: {
    lang: locale.value,
  },
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
