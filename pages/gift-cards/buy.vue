<script setup lang="ts">
import type { GiftCard } from '~/types/gift-card'
import Card from '~/components/base/Card.vue'
import GiftCardVisual from '~/components/giftcards/GiftCardVisual.vue'

const api = useApi()
const config = useRuntimeConfig()
const toast = useToast()
const { formatYerevanDateTime } = useDateTime()
const { locale, t } = useLocale()
const { formatAmd } = useCurrency()
const route = useRoute()
const { siteUrl, salonName, defaultImageUrl } = useSiteMeta()
const { isTor, brand, authGiftCardScanBasePath } = useBrandContext()

const form = reactive({
  amount: '10000',
  recipient_name: '',
  recipient_email: '',
  recipient_phone: '',
  sender_name: '',
  sender_email: '',
  message: '',
})

const creating = ref(false)
const createdOrder = ref<any | null>(null)
const issuedCard = ref<GiftCard | null>(null)
const payment = ref<{ status: string, message: string, payload?: any } | null>(null)
const presetAmounts = [10000, 20000, 50000, 100000, 200000]
const selectedTheme = ref<'gold' | 'black' | 'rose'>('gold')
const paymentProvider = ref<'idram' | 'manual'>('idram')
const idramFormRef = ref<HTMLFormElement | null>(null)
const cardThemes = computed(() => (isTor.value ? ['gold', 'black'] : ['gold', 'black', 'rose']) as Array<'gold' | 'black' | 'rose'>)
const torCardLabel = computed(() => {
  if (locale.value === 'ru')
    return 'TOR подарочная карта'

  if (locale.value === 'hy')
    return 'TOR նվեր քարտ'

  return 'TOR gift card'
})

const giftCardBranding = computed(() => isTor.value
  ? {
      logoSrc: '/tor-logo.jpg',
      logoAlt: 'Tor Barbershop',
      issuer: 'TOR',
      label: torCardLabel.value,
      logoBadgeStyle: 'background-color: rgb(239 229 209);',
    }
  : {
      logoSrc: '/logo.svg',
      logoAlt: 'Freya',
      issuer: 'Freya',
      label: t('giftCards.cardLabel'),
      logoBadgeStyle: '',
    })

usePageSeo({
  title: () => `${t('giftCards.buyTitle')} | ${brand.value === 'tor' ? 'Tor' : 'Freya'}`,
  description: () => t('giftCards.buySubtitle'),
  image: () => defaultImageUrl.value,
})

const selectedAmount = computed(() => {
  const parsed = Number(form.amount)
  if (!Number.isFinite(parsed)) return 10000
  return Math.min(200000, Math.max(10000, parsed))
})

const qrUrl = computed(() => {
  if (!issuedCard.value) return ''
  const scanUrl = `${config.public.siteUrl}${authGiftCardScanBasePath.value}/${encodeURIComponent(issuedCard.value.qr_token)}`
  const backendBaseUrl = String(config.public.apiBase).replace(/\/api\/?$/, '')
  return `${backendBaseUrl}/mail/qr/${encodeURIComponent(scanUrl)}.png`
})

const idramPayload = computed(() => {
  if (payment.value?.status !== 'redirect' || !payment.value?.payload?.fields) return null
  return payment.value.payload
})

const formatMoney = (value: number, currency: string) => {
  if (currency === 'AMD')
    return formatAmd(value)

  return `${value.toFixed(2)} ${currency}`
}

const applyAmountPreset = (amount: number) => {
  form.amount = String(amount)
}

watch(isTor, (torMode) => {
  if (torMode && selectedTheme.value === 'rose')
    selectedTheme.value = 'gold'
}, { immediate: true })

useStructuredData(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Product',
      name: `${salonName} Gift Card`,
      description: t('giftCards.buySubtitle'),
      image: defaultImageUrl.value,
      brand: {
        '@type': 'Brand',
        name: salonName,
      },
      offers: presetAmounts.map(amount => ({
        '@type': 'Offer',
        priceCurrency: 'AMD',
        price: amount,
        availability: 'https://schema.org/InStock',
        url: `${siteUrl.value}${route.path}`,
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: t('nav.home'),
          item: siteUrl.value,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: t('giftCards.buyTitle'),
          item: `${siteUrl.value}${route.path}`,
        },
      ],
    },
  ],
}))

const submit = async () => {
  const amount = Number(form.amount)
  if (!Number.isFinite(amount) || amount < 10000 || amount > 200000) {
    toast.push({ type: 'error', title: t('giftCards.amountRangeError') })
    return
  }

  if (!form.recipient_email.trim() && !form.recipient_phone.trim()) {
    toast.push({ type: 'error', title: t('giftCards.recipientRequiredError') })
    return
  }

  creating.value = true
  try {
    const response = await api.post<any>('/gift-cards/orders', {
      amount,
      currency: 'AMD',
      payment_provider: paymentProvider.value,
      theme: selectedTheme.value,
      locale: locale.value,
      meta: {
        brand: brand.value,
      },
      recipient_name: form.recipient_name.trim() || undefined,
      recipient_email: form.recipient_email.trim() || undefined,
      recipient_phone: form.recipient_phone.trim() || undefined,
      sender_name: form.sender_name.trim() || undefined,
      sender_email: form.sender_email.trim() || undefined,
      message: form.message.trim() || undefined,
    })

    createdOrder.value = response?.data || null
    issuedCard.value = response?.data?.gift_card || null
    payment.value = response?.payment || null

    toast.push({ type: 'success', title: t('giftCards.orderCreated') })

    if (paymentProvider.value === 'idram' && idramPayload.value) {
      nextTick(() => {
        idramFormRef.value?.submit()
      })
    }
  }
  finally {
    creating.value = false
  }
}
</script>

<template>
  <section class="section-gap">
    <div class="container-shell mx-auto max-w-3xl space-y-6">
      <div>
        <h1 class="text-3xl sm:text-5xl">{{ t('giftCards.buyTitle') }}</h1>
        <p class="mt-2 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('giftCards.buySubtitle') }}</p>
      </div>

      <Card :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.18)]' : ''">
        <div class="grid gap-4">
          <div class="grid gap-4 rounded-2xl p-4 md:grid-cols-[1fr,1fr]" :class="isTor ? 'border border-white/10 bg-white/[0.04]' : 'border border-sand-200'">
            <GiftCardVisual
              :amount="selectedAmount"
              :label="giftCardBranding.label"
              :hint="t('giftCards.cardHint')"
              :theme="selectedTheme"
              :logo-src="giftCardBranding.logoSrc"
              :logo-alt="giftCardBranding.logoAlt"
              :issuer="giftCardBranding.issuer"
              :logo-badge-style="giftCardBranding.logoBadgeStyle"
            />

            <div class="space-y-2">
              <p class="text-sm font-semibold" :class="isTor ? 'text-stone-100' : 'text-sand-900'">{{ t('giftCards.themeTitle') }}</p>
              <div class="grid gap-2" :class="isTor ? 'grid-cols-2' : 'grid-cols-3'">
                <button
                  v-for="theme in cardThemes"
                  :key="theme"
                  type="button"
                  class="rounded-xl border px-2 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition"
                  :class="selectedTheme === theme
                    ? (isTor ? 'border-[#d79a49] bg-[#d79a49] text-black' : 'border-sand-900 bg-sand-900 text-white')
                    : (isTor ? 'border-white/10 bg-white/[0.04] text-stone-100 hover:border-[#c58a3a]/50' : 'border-sand-200 bg-white text-sand-900 hover:border-sand-600')"
                  @click="selectedTheme = theme"
                >
                  {{ t(`giftCards.theme${theme.charAt(0).toUpperCase()}${theme.slice(1)}`) }}
                </button>
              </div>

              <p class="text-sm font-semibold" :class="isTor ? 'text-stone-100' : 'text-sand-900'">{{ t('giftCards.popularAmounts') }}</p>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="amount in presetAmounts"
                  :key="amount"
                  type="button"
                  class="rounded-xl border px-3 py-2 text-sm font-semibold transition"
                  :class="Number(form.amount) === amount
                    ? (isTor ? 'border-[#d79a49] bg-[#d79a49] text-black' : 'border-sand-900 bg-sand-900 text-white')
                    : (isTor ? 'border-white/10 bg-white/[0.04] text-stone-100 hover:border-[#c58a3a]/50' : 'border-sand-200 bg-white text-sand-900 hover:border-sand-600')"
                  @click="applyAmountPreset(amount)"
                >
                  {{ formatMoney(amount, 'AMD') }}
                </button>
              </div>
              <p class="text-xs" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('giftCards.amountLimits') }}</p>
            </div>
          </div>

          <BaseInput v-model="form.amount" type="number" min="10000" max="200000" step="1000" :label="t('giftCards.amountLabel')" :theme="isTor ? 'dark' : 'light'" />
          <div class="grid gap-1">
            <span class="text-sm" :class="isTor ? 'text-stone-300' : 'text-sand-700'">{{ t('giftCards.paymentProviderTitle') }}</span>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                class="rounded-xl border px-3 py-2 text-sm font-semibold transition"
                :class="paymentProvider === 'idram'
                  ? (isTor ? 'border-[#d79a49] bg-[#d79a49] text-black' : 'border-sand-900 bg-sand-900 text-white')
                  : (isTor ? 'border-white/10 bg-white/[0.04] text-stone-100 hover:border-[#c58a3a]/50' : 'border-sand-200 bg-white text-sand-900 hover:border-sand-600')"
                @click="paymentProvider = 'idram'"
              >
                {{ t('giftCards.paymentProviderIdram') }}
              </button>
              <button
                type="button"
                class="rounded-xl border px-3 py-2 text-sm font-semibold transition"
                :class="paymentProvider === 'manual'
                  ? (isTor ? 'border-[#d79a49] bg-[#d79a49] text-black' : 'border-sand-900 bg-sand-900 text-white')
                  : (isTor ? 'border-white/10 bg-white/[0.04] text-stone-100 hover:border-[#c58a3a]/50' : 'border-sand-200 bg-white text-sand-900 hover:border-sand-600')"
                @click="paymentProvider = 'manual'"
              >
                {{ t('giftCards.paymentProviderBankCard') }}
              </button>
            </div>
          </div>
          <BaseInput v-model="form.recipient_name" :label="t('giftCards.recipientName')" :placeholder="t('giftCards.recipientNamePlaceholder')" :theme="isTor ? 'dark' : 'light'" />
          <BaseInput v-model="form.recipient_email" type="email" :label="t('giftCards.recipientEmail')" :placeholder="t('giftCards.recipientEmailPlaceholder')" :theme="isTor ? 'dark' : 'light'" />
          <BaseInput v-model="form.recipient_phone" type="tel" :label="t('giftCards.recipientPhone')" :placeholder="t('giftCards.recipientPhonePlaceholder')" :theme="isTor ? 'dark' : 'light'" />
          <BaseInput v-model="form.sender_name" :label="t('giftCards.senderName')" :placeholder="t('giftCards.senderNamePlaceholder')" :theme="isTor ? 'dark' : 'light'" />
          <BaseInput v-model="form.sender_email" type="email" :label="t('giftCards.senderEmail')" :placeholder="t('giftCards.senderEmailPlaceholder')" :theme="isTor ? 'dark' : 'light'" />

          <label class="grid gap-1">
            <span class="text-sm" :class="isTor ? 'text-stone-300' : 'text-sand-700'">{{ t('giftCards.message') }}</span>
            <textarea
              v-model="form.message"
              class="min-h-24 rounded-2xl px-3 py-2 text-sm outline-none transition"
              :class="isTor
                ? 'border border-white/10 bg-white/[0.04] text-white focus:border-[#c58a3a]'
                : 'border border-sand-200 bg-white text-sand-900 focus:border-sand-500'"
              :placeholder="t('giftCards.messagePlaceholder')"
            />
          </label>

          <div>
            <BaseButton :disabled="creating" @click="submit">{{ creating ? t('giftCards.creating') : t('giftCards.buyButton') }}</BaseButton>
          </div>
        </div>
      </Card>

      <Card v-if="createdOrder" class="space-y-3" :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100' : ''">
        <h2 class="text-2xl">{{ t('giftCards.order') }} #{{ createdOrder.id }}</h2>
        <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('giftCards.status') }}: <span class="font-semibold" :class="isTor ? 'text-stone-100' : 'text-sand-900'">{{ createdOrder.status }}</span></p>
        <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('giftCards.amount') }}: {{ formatMoney(createdOrder.amount, createdOrder.currency) }}</p>
        <p v-if="payment" class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('giftCards.payment') }}: <span class="font-semibold" :class="isTor ? 'text-stone-100' : 'text-sand-900'">{{ payment.status }}</span> — {{ payment.message }}</p>
        <form v-if="idramPayload" ref="idramFormRef" :action="idramPayload.action" method="POST" class="space-y-3 rounded-2xl p-4" :class="isTor ? 'border border-white/10 bg-white/[0.04]' : 'border border-sand-200'">
          <input v-for="(value, key) in idramPayload.fields" :key="String(key)" type="hidden" :name="String(key)" :value="String(value ?? '')">
          <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('giftCards.idramReady') }}</p>
          <BaseButton type="submit" size="sm">{{ t('giftCards.continueToIdram') }}</BaseButton>
        </form>

        <div v-if="issuedCard" class="grid gap-4 rounded-2xl p-4 md:grid-cols-[1fr,240px]" :class="isTor ? 'border border-white/10 bg-white/[0.04]' : 'border border-sand-200'">
          <div class="space-y-2">
            <p class="font-semibold">{{ t('giftCards.issued') }}</p>
            <p class="text-sm">{{ t('giftCards.code') }}: <span class="font-semibold">{{ issuedCard.code }}</span></p>
            <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('giftCards.balance') }}: {{ formatMoney(issuedCard.balance, issuedCard.currency) }}</p>
            <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('giftCards.expires') }}: {{ issuedCard.expires_at ? formatYerevanDateTime(issuedCard.expires_at) : t('giftCards.noExpiration') }}</p>
            <div class="pt-2">
              <a :href="issuedCard.image_url" :download="`${issuedCard.code}.png`" target="_blank" rel="noopener noreferrer">
                <BaseButton size="sm" variant="secondary">{{ t('giftCards.saveCardImage') }}</BaseButton>
              </a>
            </div>
          </div>
          <div class="flex justify-center md:justify-end">
            <img
              :src="qrUrl"
              :alt="`QR ${issuedCard.code}`"
              class="h-[240px] w-[240px] rounded-2xl p-2"
              :class="isTor ? 'border border-white/10 bg-white' : 'border border-sand-200 bg-white'"
            >
          </div>
        </div>
      </Card>
    </div>
  </section>
</template>
