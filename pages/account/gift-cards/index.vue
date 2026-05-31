<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Card from '~/components/base/Card.vue'
import SkeletonBlock from '~/components/shared/SkeletonBlock.vue'
import type { GiftCard } from '~/types/gift-card'
import AccountNav from '~/components/account/AccountNav.vue'
import { useNoindexSeoMeta } from '~/composables/useNoindexSeoMeta'

definePageMeta({ middleware: 'auth' })

const { t } = useLocale()
const { formatYerevanDateTime } = useDateTime()
const { formatAmd } = useCurrency()
const { localePath } = useLocalizedPath()
const auth = useAuthStore()
const { isTor, authGiftCardsPath, authGiftCardScanBasePath } = useBrandContext()
const store = useGiftCardsStore()
const { cards, loading } = storeToRefs(store)

useNoindexSeoMeta({
  title: () => t('giftCards.listTitle'),
  description: () => t('giftCards.listSubtitle'),
})

const formatMoney = (value: number, currency: string) => {
  if (currency === 'AMD')
    return formatAmd(value)

  return `${value.toFixed(2)} ${currency}`
}

const config = useRuntimeConfig()
const qrUrl = (card: GiftCard) => {
  const scanUrl = `${config.public.siteUrl}${authGiftCardScanBasePath.value}/${encodeURIComponent(card.qr_token)}`
  const backendBaseUrl = String(config.public.apiBase).replace(/\/api\/?$/, '')
  return `${backendBaseUrl}/mail/qr/${encodeURIComponent(scanUrl)}.png`
}

const { pending } = await useAsyncData('my-gift-cards', async () => {
  await store.fetchMine()
  return true
}, { server: false })
</script>

<template>
  <section class="section-gap" :class="isTor ? 'text-stone-100' : ''">
    <div class="container-shell space-y-6">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 class="text-3xl sm:text-5xl">{{ t('giftCards.listTitle') }}</h1>
          <p class="mt-2 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('giftCards.listSubtitle') }}</p>
        </div>
        <AccountNav :show-master-profile="Boolean(auth.user?.roles?.includes('master'))" />
      </div>

      <div v-if="pending || loading" class="grid gap-4">
        <SkeletonBlock v-for="idx in 3" :key="idx" :theme="isTor ? 'dark' : 'light'" class="h-40" />
      </div>

      <div v-else-if="!cards.length" class="rounded-3xl p-6 text-sm" :class="isTor ? 'border border-dashed border-white/10 bg-white/[0.03] text-stone-300' : 'border border-dashed border-sand-300 bg-white text-sand-700'">
        {{ t('giftCards.noCards') }}
      </div>

      <div v-else class="grid gap-4">
        <Card v-for="card in cards" :key="card.id" class="fade-in" :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.18)]' : ''">
          <div class="grid gap-5 md:grid-cols-[1fr,220px]">
            <div class="space-y-2">
              <p class="text-lg font-semibold">{{ card.code }}</p>
              <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('giftCards.status') }}: <span class="font-semibold" :class="isTor ? 'text-white' : 'text-sand-900'">{{ card.status }}</span></p>
              <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('giftCards.balance') }}: <span class="font-semibold" :class="isTor ? 'text-white' : 'text-sand-900'">{{ formatMoney(card.balance, card.currency) }}</span></p>
              <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('giftCards.initialAmount') }}: {{ formatMoney(card.initial_amount, card.currency) }}</p>
              <p v-if="card.meta?.recipient_name || card.meta?.recipient_email" class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('account.giftCardRecipient') }}: {{ [card.meta?.recipient_name, card.meta?.recipient_email].filter(Boolean).join(' · ') }}</p>
              <p v-if="card.meta?.sender_name || card.meta?.sender_email" class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('account.giftCardSender') }}: {{ [card.meta?.sender_name, card.meta?.sender_email].filter(Boolean).join(' · ') }}</p>
              <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('giftCards.expires') }}: {{ card.expires_at ? formatYerevanDateTime(card.expires_at) : t('giftCards.noExpiration') }}</p>
              <div class="flex flex-wrap gap-2 pt-2">
                <NuxtLink :to="localePath(`${authGiftCardsPath}/${card.id}`)"><BaseButton size="sm" variant="secondary" :theme="isTor ? 'tor' : 'default'">{{ t('giftCards.viewTransactions') }}</BaseButton></NuxtLink>
                <a :href="card.image_url" :download="`${card.code}.png`" target="_blank" rel="noopener noreferrer">
                  <BaseButton size="sm" variant="secondary" :theme="isTor ? 'tor' : 'default'">{{ t('giftCards.saveCardImage') }}</BaseButton>
                </a>
              </div>
            </div>
            <div class="flex justify-center md:justify-end">
              <img :src="qrUrl(card)" :alt="`QR ${card.code}`" class="h-[220px] w-[220px] rounded-2xl p-2" :class="isTor ? 'border border-white/10 bg-white' : 'border border-sand-200 bg-white'">
            </div>
          </div>
        </Card>
      </div>
    </div>
  </section>
</template>
