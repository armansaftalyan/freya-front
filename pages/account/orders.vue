<script setup lang="ts">
import Card from '~/components/base/Card.vue'
import AccountNav from '~/components/account/AccountNav.vue'
import SkeletonBlock from '~/components/shared/SkeletonBlock.vue'
import type { ApiListResponse } from '~/types/api'
import type { ProductOrder } from '~/types/product'
import { useNoindexSeoMeta } from '~/composables/useNoindexSeoMeta'

definePageMeta({ middleware: 'auth' })

const { t } = useLocale()
const { formatYerevanDateTime } = useDateTime()
const { formatAmd } = useCurrency()
const auth = useAuthStore()
const api = useApi()
const { isTor } = useBrandContext()

useNoindexSeoMeta({
  title: () => t('account.productOrders'),
  description: () => t('account.productOrdersSeoDescription'),
})

const statusLabel = (status: string) => {
  const key = `account.orderStatus${status
    .split(/[_-]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')}`

  const translated = t(key)
  return translated === key ? status : translated
}

const paymentLabel = (provider: string) => {
  if (provider === 'idram') return t('account.paymentIdram')
  if (provider === 'bank_card') return t('account.paymentBankCard')

  return provider
}

const deliveryLabel = (type: string) => {
  if (type === 'pickup') return t('account.orderDeliveryPickup')
  if (type === 'courier') return t('account.orderDeliveryCourier')

  return type
}

const { data: orders, pending } = await useAsyncData('my-product-orders', async () => {
  const response = await api.get<ApiListResponse<ProductOrder>>('/product-orders/my')
  return response.data
}, { default: () => [] })
</script>

<template>
  <section class="section-gap" :class="isTor ? 'text-stone-100' : ''">
    <div class="container-shell space-y-6">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 class="text-3xl sm:text-5xl">{{ t('account.productOrders') }}</h1>
          <p class="mt-2 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('account.productOrdersIntro') }}</p>
        </div>
        <AccountNav :show-master-profile="Boolean(auth.user?.roles?.includes('master'))" />
      </div>

      <div v-if="pending" class="grid gap-4">
        <SkeletonBlock v-for="idx in 3" :key="idx" :theme="isTor ? 'dark' : 'light'" class="h-44" />
      </div>

      <div v-else-if="!orders.length" class="rounded-lg p-6 text-sm" :class="isTor ? 'border border-dashed border-white/10 bg-white/[0.03] text-stone-300' : 'border border-dashed border-sand-300 bg-white text-sand-700'">
        {{ t('account.noProductOrders') }}
      </div>

      <div v-else class="grid gap-4">
        <Card v-for="order in orders" :key="order.id" class="fade-in" :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.18)]' : ''">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p class="text-lg font-semibold">{{ t('account.orderNumber') }} #{{ order.id }}</p>
              <p class="mt-1 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('account.orderDate') }}: {{ formatYerevanDateTime(order.created_at) }}</p>
            </div>
            <div class="text-left sm:text-right">
              <p class="text-sm font-semibold">{{ statusLabel(order.status) }}</p>
              <p class="mt-1 text-lg font-semibold">{{ formatAmd(order.total_price) }}</p>
            </div>
          </div>

          <div class="mt-5 grid gap-4 lg:grid-cols-[1fr,280px]">
            <div>
              <p class="text-sm font-semibold">{{ t('account.orderItems') }}</p>
              <div class="mt-3 divide-y" :class="isTor ? 'divide-white/10' : 'divide-sand-200'">
                <div v-for="item in order.items || []" :key="item.id" class="grid grid-cols-[1fr,auto] gap-3 py-3 text-sm">
                  <div>
                    <p class="font-semibold">{{ item.product?.name || `#${item.product_id}` }}</p>
                    <p :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ item.quantity }} x {{ formatAmd(item.unit_price) }}</p>
                  </div>
                  <p class="font-semibold">{{ formatAmd(item.total_price) }}</p>
                </div>
              </div>
            </div>

            <div class="space-y-2 text-sm">
              <p><span :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('account.orderPayment') }}:</span> {{ paymentLabel(order.payment_provider) }}</p>
              <p><span :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('account.orderStatus') }}:</span> {{ order.paid_at ? `${t('account.orderPaidAt')} ${formatYerevanDateTime(order.paid_at)}` : t('account.orderNotPaid') }}</p>
              <p><span :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('account.orderDelivery') }}:</span> {{ deliveryLabel(order.delivery_type) }}</p>
              <p v-if="order.city || order.address_line"><span :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('productsPage.address') }}:</span> {{ [order.city, order.address_line].filter(Boolean).join(', ') }}</p>
              <p><span :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('account.orderTotal') }}:</span> {{ formatAmd(order.total_price) }}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </section>
</template>
