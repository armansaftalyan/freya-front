<script setup lang="ts">
import Card from '~/components/base/Card.vue'
import SkeletonBlock from '~/components/shared/SkeletonBlock.vue'
import type { GiftCard } from '~/types/gift-card'
import { useNoindexSeoMeta } from '~/composables/useNoindexSeoMeta'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const { t } = useLocale()
const { localePath } = useLocalizedPath()
const { formatYerevanDateTime } = useDateTime()
const { formatAmd } = useCurrency()
const { isTor, authGiftCardsPath, authGiftCardScanBasePath } = useBrandContext()
const store = useGiftCardsStore()

useNoindexSeoMeta({
  title: () => t('giftCards.transactionsTitle'),
  description: () => t('giftCards.backToList'),
})

const card = ref<GiftCard | null>(null)
const loading = ref(true)

const cardId = computed(() => Number(route.params.id || 0))

const formatMoney = (value: number, currency: string) => {
  if (currency === 'AMD')
    return formatAmd(value)

  return `${value.toFixed(2)} ${currency}`
}

const config = useRuntimeConfig()
const qrUrl = computed(() => {
  if (!card.value) return ''
  const scanUrl = `${config.public.siteUrl}${authGiftCardScanBasePath.value}/${encodeURIComponent(card.value.qr_token)}`
  const backendBaseUrl = String(config.public.apiBase).replace(/\/api\/?$/, '')
  return `${backendBaseUrl}/mail/qr/${encodeURIComponent(scanUrl)}.png`
})

await useAsyncData(`gift-card-${cardId.value}`, async () => {
  if (!cardId.value) return true
  card.value = await store.fetchCard(cardId.value)
  await store.fetchTransactions(cardId.value)
  loading.value = false
  return true
}, { server: false })
</script>

<template>
  <section class="section-gap" :class="isTor ? 'text-stone-100' : ''">
    <div class="container-shell space-y-6">
      <NuxtLink :to="localePath(authGiftCardsPath)" class="inline-flex text-sm" :class="isTor ? 'text-stone-300 hover:text-white' : 'text-sand-700 hover:text-sand-900'">← {{ t('giftCards.backToList') }}</NuxtLink>

      <div v-if="loading" class="grid gap-4">
        <SkeletonBlock :theme="isTor ? 'dark' : 'light'" class="h-52" />
        <SkeletonBlock :theme="isTor ? 'dark' : 'light'" class="h-48" />
      </div>

      <template v-else-if="card">
        <Card :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.18)]' : ''">
          <div class="grid gap-5 md:grid-cols-[1fr,240px]">
            <div class="space-y-2">
              <h1 class="text-3xl sm:text-4xl">{{ card.code }}</h1>
              <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('giftCards.status') }}: <span class="font-semibold" :class="isTor ? 'text-white' : 'text-sand-900'">{{ card.status }}</span></p>
              <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('giftCards.balance') }}: <span class="font-semibold" :class="isTor ? 'text-white' : 'text-sand-900'">{{ formatMoney(card.balance, card.currency) }}</span></p>
              <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('giftCards.initialAmount') }}: {{ formatMoney(card.initial_amount, card.currency) }}</p>
              <p v-if="card.meta?.recipient_name || card.meta?.recipient_email" class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('account.giftCardRecipient') }}: {{ [card.meta?.recipient_name, card.meta?.recipient_email].filter(Boolean).join(' · ') }}</p>
              <p v-if="card.meta?.sender_name || card.meta?.sender_email" class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('account.giftCardSender') }}: {{ [card.meta?.sender_name, card.meta?.sender_email].filter(Boolean).join(' · ') }}</p>
              <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('giftCards.expires') }}: {{ card.expires_at ? formatYerevanDateTime(card.expires_at) : t('giftCards.noExpiration') }}</p>
              <div class="pt-2">
                <a :href="card.image_url" :download="`${card.code}.png`" target="_blank" rel="noopener noreferrer">
                  <BaseButton size="sm" variant="secondary" :theme="isTor ? 'tor' : 'default'">{{ t('giftCards.saveCardImage') }}</BaseButton>
                </a>
              </div>
            </div>
            <div class="flex justify-center md:justify-end">
              <img :src="qrUrl" :alt="`QR ${card.code}`" class="h-[240px] w-[240px] rounded-2xl bg-white p-2" :class="isTor ? 'border border-white/10' : 'border border-sand-200'">
            </div>
          </div>
        </Card>

        <Card :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.18)]' : ''">
          <h2 class="text-2xl">{{ t('giftCards.transactionsTitle') }}</h2>
          <div v-if="!store.transactions.length" class="mt-4 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('giftCards.noTransactions') }}</div>
          <div v-else class="mt-4 space-y-3">
            <div v-for="item in store.transactions" :key="item.id" class="rounded-2xl p-4" :class="isTor ? 'border border-white/10 bg-white/[0.04]' : 'border border-sand-200'">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <p class="font-semibold uppercase">{{ item.type }}</p>
                <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ formatYerevanDateTime(item.created_at) }}</p>
              </div>
              <p class="mt-2 text-sm">{{ t('giftCards.amount') }}: <span class="font-semibold">{{ formatMoney(item.amount, card.currency) }}</span></p>
              <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('giftCards.balanceAfter') }}: {{ formatMoney(item.balance_after, card.currency) }}</p>
            </div>
          </div>
        </Card>
      </template>
    </div>
  </section>
</template>
