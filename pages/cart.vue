<script setup lang="ts">
import type { ApiItemResponse } from '~/types/api'
import type { Product, ProductOrder, ProductOrderQuote } from '~/types/product'

const api = useApi()
const toast = useToast()
const { t, locale } = useLocale()
const { formatAmd } = useCurrency()
const { siteUrl } = useSiteMeta()
const { localePath } = useLocalizedPath()
const cart = useCartStore()
const { isTor, productsPath } = useBrandContext()
const cartSyncKey = computed(() => cart.items.map(item => item.product.id).sort((a, b) => a - b).join(','))
const catalogPath = computed(() => productsPath.value)
const increaseItem = (productId: number) => {
  const item = cart.items.find(entry => entry.product.id === productId)
  if (!item) return
  cart.addItem(item.product, 1)
}
const decreaseItem = (productId: number) => cart.decreaseItem(productId, 1)

const syncCartProducts = async () => {
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

const form = reactive({
  customer_name: '',
  customer_phone: '',
  customer_email: '',
  delivery_type: 'courier' as 'pickup' | 'courier',
  city: 'Yerevan',
  address_line: '',
  comment: '',
})

const ordering = ref(false)
const orderQuote = ref<ProductOrderQuote | null>(null)

usePageSeo({
  title: () => `${isTor.value ? 'Tor' : 'Freya'} - ${t('cartPage.title')}`,
  description: () => t('cartPage.seoDescription'),
})

useSeoMeta({
  robots: 'noindex, nofollow',
})

useStructuredData(() => ({
  '@context': 'https://schema.org',
  '@type': 'CheckoutPage',
  name: t('cartPage.title'),
  description: t('cartPage.seoDescription'),
  url: `${siteUrl.value}${isTor.value ? '/tor/cart' : '/cart'}`,
}))

await useAsyncData(
  () => `cart-products-${locale.value}-${cartSyncKey.value}`,
  async () => {
    await syncCartProducts()
    return true
  },
  { watch: [locale, cartSyncKey] },
)

const quoteKey = computed(() => JSON.stringify({
  items: cart.items.map(item => ({ product_id: item.product.id, quantity: item.quantity })),
  delivery_type: form.delivery_type,
  city: form.city.trim(),
}))

await useAsyncData(
  () => `cart-order-quote-${locale.value}-${quoteKey.value}`,
  async () => {
    if (!cart.items.length) {
      orderQuote.value = null
      return null
    }

    const response = await api.post<ApiItemResponse<ProductOrderQuote>>('/product-orders/quote', {
      items: cart.items.map(item => ({
        product_id: item.product.id,
        quantity: Math.max(1, Number(item.quantity || 1)),
      })),
      delivery_type: form.delivery_type,
      city: form.city.trim() || undefined,
    }, { skipErrorToast: true })

    orderQuote.value = response.data
    return response.data
  },
  { watch: [locale, cartSyncKey, () => form.delivery_type, () => form.city] },
)

const summarySubtotal = computed(() => orderQuote.value?.subtotal_price ?? cart.totalPrice)
const summaryDeliveryFee = computed(() => orderQuote.value?.delivery_fee ?? (form.delivery_type === 'pickup' ? 0 : 0))
const summaryTotal = computed(() => orderQuote.value?.total_price ?? (summarySubtotal.value + summaryDeliveryFee.value))

const submit = async () => {
  if (!cart.items.length) return

  ordering.value = true
  try {
    const response = await api.post<ApiItemResponse<ProductOrder>>('/product-orders', {
      items: cart.items.map(item => ({
        product_id: item.product.id,
        quantity: Math.max(1, Number(item.quantity || 1)),
      })),
      customer_name: form.customer_name.trim(),
      customer_phone: form.customer_phone.trim(),
      customer_email: form.customer_email.trim() || undefined,
      delivery_type: form.delivery_type,
      city: form.city.trim() || undefined,
      address_line: form.delivery_type === 'courier' ? form.address_line.trim() || undefined : undefined,
      comment: form.comment.trim() || undefined,
    })

    toast.push({
      type: 'success',
      title: t('productsPage.orderCreated'),
      description: `${t('productsPage.orderNumber')} #${response.data.id}`,
    })

    cart.clear()
    form.customer_name = ''
    form.customer_phone = ''
    form.customer_email = ''
    form.delivery_type = 'courier'
    form.city = 'Yerevan'
    form.address_line = ''
    form.comment = ''
  }
  finally {
    ordering.value = false
  }
}
</script>

<template>
  <section class="section-gap" :class="isTor ? 'pt-8 text-stone-100 sm:pt-10' : ''">
    <div class="container-shell space-y-8">
      <div class="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.2em]" :class="isTor ? 'text-[#c58a3a]' : 'text-sand-600'">{{ t('cartPage.eyebrow') }}</p>
          <h1 class="text-3xl leading-tight sm:text-5xl">{{ t('cartPage.title') }}</h1>
          <p class="mt-3 max-w-3xl text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('cartPage.seoDescription') }}</p>
        </div>
        <NuxtLink :to="localePath(catalogPath)"><BaseButton :variant="isTor ? 'primary' : 'secondary'">{{ t('cartPage.continueShopping') }}</BaseButton></NuxtLink>
      </div>

      <div
        v-if="!cart.items.length"
        class="rounded-3xl p-8 text-center"
        :class="isTor
          ? 'border border-white/10 bg-white/[0.03] shadow-[0_20px_50px_rgba(0,0,0,0.22)]'
          : 'border border-sand-200 bg-white shadow-soft'"
      >
        <p class="text-lg">{{ t('cartPage.empty') }}</p>
        <NuxtLink :to="localePath(catalogPath)" class="mt-5 inline-flex">
          <BaseButton :variant="isTor ? 'primary' : 'primary'">{{ t('cartPage.goToCatalog') }}</BaseButton>
        </NuxtLink>
      </div>

      <div v-else class="grid gap-8 lg:grid-cols-[1.05fr,0.95fr]">
        <div class="space-y-4">
          <div
            v-for="item in cart.items"
            :key="item.product.id"
            class="rounded-3xl p-5"
            :class="isTor
              ? 'border border-white/10 bg-white/[0.03] shadow-[0_20px_50px_rgba(0,0,0,0.18)]'
              : 'border border-sand-200 bg-white shadow-soft'"
          >
            <div class="flex flex-col gap-4 sm:flex-row">
              <img
                :src="item.product.image_url || '/logo.png'"
                :alt="item.product.name"
                class="h-28 w-full rounded-2xl object-cover sm:w-28"
              >
              <div class="min-w-0 flex-1">
                <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p class="text-xl">{{ item.product.name }}</p>
                    <p class="mt-1 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ item.product.description || t('productsPage.defaultDescription') }}</p>
                  </div>
                  <button
                    type="button"
                    class="shrink-0 whitespace-nowrap text-sm font-medium text-rose-600 transition hover:text-rose-700"
                    @click="cart.removeItem(item.product.id)"
                  >
                    {{ t('cartPage.remove') }}
                  </button>
                </div>

                <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div class="space-y-2 sm:max-w-[10rem]">
                    <p class="text-sm" :class="isTor ? 'text-stone-300' : 'text-sand-700'">{{ t('productsPage.quantity') }}</p>
                    <div
                      class="flex h-12 items-center overflow-hidden rounded-full"
                      :class="isTor ? 'border border-[#c58a3a]/35 bg-[#161616]' : 'border border-sand-200 bg-sand-50'"
                    >
                      <button
                        type="button"
                        class="flex h-full w-12 items-center justify-center text-lg font-semibold transition"
                        :class="isTor ? 'text-[#c58a3a] hover:bg-white/[0.05]' : 'text-sand-700 hover:bg-white'"
                        @click="decreaseItem(item.product.id)"
                      >
                        -
                      </button>
                      <div class="flex-1 text-center text-sm font-semibold" :class="isTor ? 'text-white' : 'text-sand-900'">
                        {{ item.quantity }}
                      </div>
                      <button
                        type="button"
                        class="flex h-full w-12 items-center justify-center text-lg font-semibold transition"
                        :class="isTor ? 'text-[#c58a3a] hover:bg-white/[0.05]' : 'text-sand-700 hover:bg-white'"
                        @click="increaseItem(item.product.id)"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ formatAmd(item.product.price) }} x {{ item.quantity }}</p>
                    <p class="text-lg font-semibold" :class="isTor ? 'text-white' : 'text-sand-900'">{{ formatAmd(item.product.price * item.quantity) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="rounded-[2rem] p-6"
          :class="isTor
            ? 'border border-white/10 bg-[linear-gradient(180deg,rgba(22,22,22,0.96),rgba(12,12,12,0.94))] shadow-[0_20px_50px_rgba(0,0,0,0.24)]'
            : 'border border-sand-200 bg-[linear-gradient(180deg,rgba(255,251,244,0.98),rgba(245,234,216,0.95))] shadow-soft'"
        >
          <div class="space-y-2">
            <p class="text-xs uppercase tracking-[0.14em]" :class="isTor ? 'text-[#c58a3a]' : 'text-sand-600'">{{ t('productsPage.quickOrder') }}</p>
            <h2 class="text-2xl">{{ t('cartPage.checkoutTitle') }}</h2>
            <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('productsPage.orderHint') }}</p>
          </div>

          <div class="mt-5 grid gap-4">
            <BaseInput v-model="form.customer_name" :label="t('productsPage.customerName')" :theme="isTor ? 'dark' : 'light'" />
            <BaseInput v-model="form.customer_phone" type="tel" :label="t('productsPage.customerPhone')" :theme="isTor ? 'dark' : 'light'" />
            <BaseInput v-model="form.customer_email" type="email" :label="t('productsPage.customerEmail')" :theme="isTor ? 'dark' : 'light'" />

            <div class="grid gap-4 sm:grid-cols-2">
              <BaseSelect
                v-model="form.delivery_type"
                :label="t('productsPage.deliveryType')"
                :theme="isTor ? 'dark' : 'light'"
                :options="[
                  { label: t('productsPage.deliveryCourier'), value: 'courier' },
                  { label: t('productsPage.deliveryPickup'), value: 'pickup' },
                ]"
              />
              <BaseInput v-model="form.city" :label="t('productsPage.city')" :theme="isTor ? 'dark' : 'light'" />
            </div>

            <BaseInput
              v-if="form.delivery_type === 'courier'"
              v-model="form.address_line"
              :label="t('productsPage.address')"
              :theme="isTor ? 'dark' : 'light'"
            />

            <label class="grid gap-1">
              <span class="text-sm" :class="isTor ? 'text-stone-300' : 'text-sand-700'">{{ t('productsPage.comment') }}</span>
              <textarea
                v-model="form.comment"
                class="min-h-24 rounded-2xl px-3 py-2 text-sm outline-none transition"
                :class="isTor
                  ? 'border border-white/10 bg-white/[0.04] text-white focus:border-[#c58a3a]'
                  : 'border border-sand-200 bg-white text-sand-900 focus:border-sand-500'"
              />
            </label>

            <div class="rounded-2xl p-4" :class="isTor ? 'border border-white/10 bg-white/[0.04]' : 'border border-sand-200 bg-white'">
              <div class="flex items-center justify-between gap-3">
                <span class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('cartPage.itemsCount') }}</span>
                <span class="text-sm font-medium" :class="isTor ? 'text-white' : 'text-sand-900'">{{ cart.itemsCount }}</span>
              </div>
              <div class="mt-2 flex items-center justify-between gap-3">
                <span class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('productsPage.subtotal') }}</span>
                <span class="text-sm font-medium" :class="isTor ? 'text-white' : 'text-sand-900'">{{ formatAmd(summarySubtotal) }}</span>
              </div>
              <div class="mt-2 flex items-center justify-between gap-3">
                <span class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('productsPage.deliveryFee') }}</span>
                <span class="text-sm font-medium" :class="isTor ? 'text-white' : 'text-sand-900'">{{ formatAmd(summaryDeliveryFee) }}</span>
              </div>
              <div class="mt-2 flex items-center justify-between gap-3">
                <span class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('productsPage.total') }}</span>
                <span class="text-lg font-semibold" :class="isTor ? 'text-white' : 'text-sand-900'">{{ formatAmd(summaryTotal) }}</span>
              </div>
            </div>

            <BaseButton :variant="isTor ? 'primary' : 'primary'" :disabled="ordering" @click="submit">
              {{ ordering ? t('productsPage.creatingOrder') : t('cartPage.checkoutButton') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
