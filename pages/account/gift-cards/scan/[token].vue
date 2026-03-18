<script setup lang="ts">
import type { ApiItemResponse } from '~/types/api'
import type { GiftCard, GiftCardTransaction } from '~/types/gift-card'
import Card from '~/components/base/Card.vue'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const auth = useAuthStore()
const api = useApi()
const toast = useToast()
const { formatYerevanDateTime } = useDateTime()
const { t } = useLocale()
const { formatAmd } = useCurrency()
const { isTor } = useBrandContext()

useSeoMeta({
  title: () => t('giftCards.scanTitle'),
  description: () => t('giftCards.redeemTitle'),
  robots: 'noindex, nofollow',
})

const canManage = computed(() => {
  const roles = auth.user?.roles || []
  return roles.includes('admin') || roles.includes('manager')
})

const token = computed(() => String(route.params.token || '').trim())
const giftCard = ref<GiftCard | null>(null)
const redeemAmount = ref('')
const redeeming = ref(false)
const loading = ref(true)

const formatMoney = (value: number, currency: string) => {
  if (currency === 'AMD')
    return formatAmd(value)

  return `${value.toFixed(2)} ${currency}`
}

const loadGiftCard = async () => {
  if (!token.value || !canManage.value) {
    loading.value = false
    return
  }

  loading.value = true
  try {
    const response = await api.get<ApiItemResponse<GiftCard>>(`/admin/gift-cards/scan/${encodeURIComponent(token.value)}`)
    giftCard.value = response.data
  }
  finally {
    loading.value = false
  }
}

const redeem = async () => {
  if (!giftCard.value) return

  const amount = Number(redeemAmount.value)
  if (!Number.isFinite(amount) || amount <= 0) {
    toast.push({ type: 'error', title: t('giftCards.invalidAmount') })
    return
  }

  redeeming.value = true
  try {
    const response = await api.post<{ data: GiftCardTransaction, gift_card: GiftCard }>(`/admin/gift-cards/${giftCard.value.id}/redeem`, {
      amount,
      meta: {
        source: 'qr_scan_page',
      },
    })

    giftCard.value = response.gift_card
    redeemAmount.value = ''
    toast.push({ type: 'success', title: t('giftCards.redeemed') })
  }
  finally {
    redeeming.value = false
  }
}

await useAsyncData(`gift-card-scan-${token.value}`, async () => {
  await loadGiftCard()
  return true
})
</script>

<template>
  <section class="section-gap" :class="isTor ? 'text-stone-100' : ''">
    <div class="container-shell max-w-3xl space-y-6">
      <h1 class="text-3xl sm:text-4xl">{{ t('giftCards.scanTitle') }}</h1>

      <Card v-if="!canManage" :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100' : ''">
        <p class="text-sm text-rose-700">{{ t('giftCards.accessDenied') }}</p>
      </Card>

      <Card v-else-if="loading" :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100' : ''">
        <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('giftCards.loading') }}</p>
      </Card>

      <Card v-else-if="!giftCard" :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100' : ''">
        <p class="text-sm text-rose-700">{{ t('giftCards.notFound') }}</p>
      </Card>

      <template v-else>
        <Card class="space-y-2" :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.18)]' : ''">
          <p class="text-xl font-semibold">{{ giftCard.code }}</p>
          <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('giftCards.status') }}: <span class="font-semibold" :class="isTor ? 'text-white' : 'text-sand-900'">{{ giftCard.status }}</span></p>
          <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('giftCards.balance') }}: <span class="font-semibold" :class="isTor ? 'text-white' : 'text-sand-900'">{{ formatMoney(giftCard.balance, giftCard.currency) }}</span></p>
          <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('giftCards.expires') }}: {{ giftCard.expires_at ? formatYerevanDateTime(giftCard.expires_at) : t('giftCards.noExpiration') }}</p>
        </Card>

        <Card class="space-y-4" :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.18)]' : ''">
          <h2 class="text-2xl">{{ t('giftCards.redeemTitle') }}</h2>
          <BaseInput v-model="redeemAmount" type="number" step="0.01" min="0" :label="t('giftCards.redeemAmountLabel')" :theme="isTor ? 'dark' : 'light'" />
          <div>
            <BaseButton :theme="isTor ? 'tor' : 'default'" :disabled="redeeming" @click="redeem">{{ redeeming ? t('giftCards.redeeming') : t('giftCards.redeemButton') }}</BaseButton>
          </div>
        </Card>
      </template>
    </div>
  </section>
</template>
