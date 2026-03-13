<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Card from '~/components/base/Card.vue'
import SkeletonBlock from '~/components/shared/SkeletonBlock.vue'
import type { GiftCard } from '~/types/gift-card'

definePageMeta({ middleware: 'auth' })

const { t } = useLocale()
const { formatYerevanDateTime } = useDateTime()
const { formatAmd } = useCurrency()
const store = useGiftCardsStore()
const { cards, loading } = storeToRefs(store)

const formatMoney = (value: number, currency: string) => {
  if (currency === 'AMD')
    return formatAmd(value)

  return `${value.toFixed(2)} ${currency}`
}

const config = useRuntimeConfig()
const qrUrl = (card: GiftCard) => {
  const scanUrl = `${config.public.siteUrl}/account/gift-cards/scan/${encodeURIComponent(card.qr_token)}`
  const backendBaseUrl = String(config.public.apiBase).replace(/\/api\/?$/, '')
  return `${backendBaseUrl}/mail/qr/${encodeURIComponent(scanUrl)}.png`
}

await useAsyncData('my-gift-cards', async () => {
  await store.fetchMine()
  return true
})
</script>

<template>
  <section class="section-gap">
    <div class="container-shell space-y-6">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 class="text-3xl sm:text-5xl">{{ t('giftCards.listTitle') }}</h1>
          <p class="mt-2 text-sm text-[var(--muted)]">{{ t('giftCards.listSubtitle') }}</p>
        </div>
        <NuxtLink to="/account/appointments"><BaseButton variant="secondary">{{ t('nav.myAppointments') }}</BaseButton></NuxtLink>
      </div>

      <div v-if="loading" class="grid gap-4">
        <SkeletonBlock v-for="idx in 3" :key="idx" class="h-40" />
      </div>

      <div v-else-if="!cards.length" class="rounded-3xl border border-dashed border-sand-300 bg-white p-6 text-sm text-sand-700">
        {{ t('giftCards.noCards') }}
      </div>

      <div v-else class="grid gap-4">
        <Card v-for="card in cards" :key="card.id" class="fade-in">
          <div class="grid gap-5 md:grid-cols-[1fr,220px]">
            <div class="space-y-2">
              <p class="text-lg font-semibold">{{ card.code }}</p>
              <p class="text-sm text-[var(--muted)]">{{ t('giftCards.status') }}: <span class="font-semibold text-sand-900">{{ card.status }}</span></p>
              <p class="text-sm text-[var(--muted)]">{{ t('giftCards.balance') }}: <span class="font-semibold text-sand-900">{{ formatMoney(card.balance, card.currency) }}</span></p>
              <p class="text-sm text-[var(--muted)]">{{ t('giftCards.initialAmount') }}: {{ formatMoney(card.initial_amount, card.currency) }}</p>
              <p class="text-sm text-[var(--muted)]">{{ t('giftCards.expires') }}: {{ card.expires_at ? formatYerevanDateTime(card.expires_at) : t('giftCards.noExpiration') }}</p>
              <div class="flex flex-wrap gap-2 pt-2">
                <NuxtLink :to="`/account/gift-cards/${card.id}`"><BaseButton size="sm" variant="secondary">{{ t('giftCards.viewTransactions') }}</BaseButton></NuxtLink>
                <a :href="card.image_url" :download="`${card.code}.png`" target="_blank" rel="noopener noreferrer">
                  <BaseButton size="sm" variant="secondary">{{ t('giftCards.saveCardImage') }}</BaseButton>
                </a>
              </div>
            </div>
            <div class="flex justify-center md:justify-end">
              <img :src="qrUrl(card)" :alt="`QR ${card.code}`" class="h-[220px] w-[220px] rounded-2xl border border-sand-200 bg-white p-2">
            </div>
          </div>
        </Card>
      </div>
    </div>
  </section>
</template>
