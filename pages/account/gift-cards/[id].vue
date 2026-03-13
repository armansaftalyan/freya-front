<script setup lang="ts">
import Card from '~/components/base/Card.vue'
import SkeletonBlock from '~/components/shared/SkeletonBlock.vue'
import type { GiftCard } from '~/types/gift-card'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const { t } = useLocale()
const { formatYerevanDateTime } = useDateTime()
const store = useGiftCardsStore()

const card = ref<GiftCard | null>(null)
const loading = ref(true)

const cardId = computed(() => Number(route.params.id || 0))

const formatMoney = (value: number, currency: string) => {
  try {
    return new Intl.NumberFormat('hy-AM', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value)
  }
  catch {
    return `${value.toFixed(2)} ${currency}`
  }
}

const config = useRuntimeConfig()
const qrUrl = computed(() => {
  if (!card.value) return ''
  const scanUrl = `${config.public.siteUrl}/account/gift-cards/scan/${encodeURIComponent(card.value.qr_token)}`
  const backendBaseUrl = String(config.public.apiBase).replace(/\/api\/?$/, '')
  return `${backendBaseUrl}/mail/qr/${encodeURIComponent(scanUrl)}.png`
})

await useAsyncData(`gift-card-${cardId.value}`, async () => {
  if (!cardId.value) return true
  card.value = await store.fetchCard(cardId.value)
  await store.fetchTransactions(cardId.value)
  loading.value = false
  return true
})
</script>

<template>
  <section class="section-gap">
    <div class="container-shell space-y-6">
      <NuxtLink to="/account/gift-cards" class="inline-flex text-sm text-sand-700 hover:text-sand-900">← {{ t('giftCards.backToList') }}</NuxtLink>

      <div v-if="loading" class="grid gap-4">
        <SkeletonBlock class="h-52" />
        <SkeletonBlock class="h-48" />
      </div>

      <template v-else-if="card">
        <Card>
          <div class="grid gap-5 md:grid-cols-[1fr,240px]">
            <div class="space-y-2">
              <h1 class="text-3xl sm:text-4xl">{{ card.code }}</h1>
              <p class="text-sm text-[var(--muted)]">{{ t('giftCards.status') }}: <span class="font-semibold text-sand-900">{{ card.status }}</span></p>
              <p class="text-sm text-[var(--muted)]">{{ t('giftCards.balance') }}: <span class="font-semibold text-sand-900">{{ formatMoney(card.balance, card.currency) }}</span></p>
              <p class="text-sm text-[var(--muted)]">{{ t('giftCards.initialAmount') }}: {{ formatMoney(card.initial_amount, card.currency) }}</p>
              <p class="text-sm text-[var(--muted)]">{{ t('giftCards.expires') }}: {{ card.expires_at ? formatYerevanDateTime(card.expires_at) : t('giftCards.noExpiration') }}</p>
            </div>
            <div class="flex justify-center md:justify-end">
              <img :src="qrUrl" :alt="`QR ${card.code}`" class="h-[240px] w-[240px] rounded-2xl border border-sand-200 bg-white p-2">
            </div>
          </div>
        </Card>

        <Card>
          <h2 class="text-2xl">{{ t('giftCards.transactionsTitle') }}</h2>
          <div v-if="!store.transactions.length" class="mt-4 text-sm text-[var(--muted)]">{{ t('giftCards.noTransactions') }}</div>
          <div v-else class="mt-4 space-y-3">
            <div v-for="item in store.transactions" :key="item.id" class="rounded-2xl border border-sand-200 p-4">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <p class="font-semibold uppercase">{{ item.type }}</p>
                <p class="text-sm text-[var(--muted)]">{{ formatYerevanDateTime(item.created_at) }}</p>
              </div>
              <p class="mt-2 text-sm">{{ t('giftCards.amount') }}: <span class="font-semibold">{{ formatMoney(item.amount, card.currency) }}</span></p>
              <p class="text-sm text-[var(--muted)]">{{ t('giftCards.balanceAfter') }}: {{ formatMoney(item.balance_after, card.currency) }}</p>
            </div>
          </div>
        </Card>
      </template>
    </div>
  </section>
</template>
