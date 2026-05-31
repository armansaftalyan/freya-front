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
const auth = useAuthStore()
const { siteUrl, salonName, defaultImageUrl } = useSiteMeta()
const { isTor, brand, authGiftCardScanBasePath } = useBrandContext()

const form = reactive({
  amount: '5000',
  recipient_first_name: '',
  recipient_last_name: '',
  recipient_email: '',
  recipient_phone: '',
  sender_first_name: '',
  sender_last_name: '',
  sender_email: '',
  sender_phone: '',
  message: '',
})

const creating = ref(false)
const paymentStatusLoading = ref(false)
const paymentStatusLookupFailed = ref(false)
const createdOrder = ref<any | null>(null)
const issuedCard = ref<GiftCard | null>(null)
const payment = ref<{ status: string, message: string, payload?: any } | null>(null)
const presetAmounts = [5000, 10000, 20000, 50000, 100000,200000]
const selectedTheme = ref<'gold' | 'black' | 'rose'>('gold')
const paymentProvider = ref<'idram' | 'bank_card'>('bank_card')
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

const seoCopy = computed(() => {
  if (isTor.value) {
    if (locale.value === 'ru') {
      return {
        title: 'Подарочная карта барбершопа в Ереване | Tor Barbershop',
        description: 'Подарочная карта Tor Barbershop в Ереване: подарок на мужскую стрижку, бороду, grooming, мужской маникюр, педикюр, элос и массаж.',
        lead: 'Подарочная карта Tor Barbershop: подарок на мужскую стрижку, бороду, grooming, мужской маникюр, педикюр, элос и массаж в Ереване.',
        productName: 'Tor Barbershop Gift Card',
      }
    }

    if (locale.value === 'en') {
      return {
        title: 'Barbershop Gift Card in Yerevan | Tor Barbershop',
        description: 'Tor Barbershop gift card in Yerevan for men haircut, beard trim, grooming, men manicure, pedicure, elos, and massage.',
        lead: 'Tor Barbershop gift card for men haircut, beard care, grooming, men nails, elos, and massage in Yerevan.',
        productName: 'Tor Barbershop Gift Card',
      }
    }

    return {
      title: 'Barbershop նվեր քարտ Երևանում | Tor Barbershop',
      description: 'Tor Barbershop-ի նվեր քարտ Երևանում՝ տղամարդկանց սանրվածք, մորուք, grooming, տղամարդկանց manicure, pedicure, elos և massage ծառայությունների համար։',
      lead: 'Tor Barbershop-ի նվեր քարտ՝ տղամարդկանց սանրվածք, մորուք, grooming, տղամարդկանց manicure, pedicure, elos և massage ծառայությունների համար Երևանում։',
      productName: 'Tor Barbershop Gift Card',
    }
  }

  if (locale.value === 'ru') {
    return {
      title: 'Подарочная карта салона красоты в Ереване | Freya Beauty Salon',
      description: 'Подарочная карта Freya Beauty Salon в Ереване: подарок на маникюр, педикюр, косметологию, массаж, элос, женские стрижки и окрашивание.',
      lead: 'Подарочная карта Freya Beauty Salon: подарок на маникюр, педикюр, косметологию, массаж, элос, женские стрижки и окрашивание в Ереване.',
      productName: 'Freya Beauty Gift Card',
    }
  }

  if (locale.value === 'en') {
    return {
      title: 'Beauty Salon Gift Card in Yerevan | Freya Beauty Salon',
      description: 'Freya Beauty Salon gift card in Yerevan for manicure, pedicure, cosmetology, massage, elos, women haircuts, and coloring.',
      lead: 'Freya Beauty Salon gift card for manicure, pedicure, cosmetology, massage, elos, women haircuts, and coloring in Yerevan.',
      productName: 'Freya Beauty Gift Card',
    }
  }

  return {
    title: 'Գեղեցկության սրահի նվեր քարտ Երևանում | Freya Beauty Salon',
    description: 'Freya Beauty Salon-ի նվեր քարտ Երևանում՝ մանիկյուր, պեդիկյուր, կոսմետոլոգիա, մերսում, էլոս, կանացի կտրվածք և ներկում ծառայությունների համար։',
    lead: 'Freya Beauty Salon-ի նվեր քարտ՝ մանիկյուր, պեդիկյուր, կոսմետոլոգիա, մերսում, էլոս, կանացի կտրվածք և ներկում ծառայությունների համար Երևանում։',
    productName: 'Freya Beauty Gift Card',
  }
})

usePageSeo({
  title: () => seoCopy.value.title,
  description: () => seoCopy.value.description,
  image: () => defaultImageUrl.value,
})

const selectedAmount = computed(() => {
  const parsed = Number(form.amount)
  if (!Number.isFinite(parsed)) return 5000
  return Math.min(200000, Math.max(5000, parsed))
})

const qrUrl = computed(() => {
  if (!issuedCard.value) return ''
  const scanUrl = `${config.public.siteUrl}${authGiftCardScanBasePath.value}/${encodeURIComponent(issuedCard.value.qr_token)}`
  const backendBaseUrl = String(config.public.apiBase).replace(/\/api\/?$/, '')
  return `${backendBaseUrl}/mail/qr/${encodeURIComponent(scanUrl)}.png`
})

const issuedCardImageUrl = computed(() => {
  if (!issuedCard.value) return ''
  const apiBase = String(config.public.apiBase).replace(/\/$/, '')
  return `${apiBase}/gift-card-images/${encodeURIComponent(issuedCard.value.qr_token)}`
})

const idramPayload = computed(() => {
  if (payment.value?.status !== 'redirect' || !payment.value?.payload?.fields) return null
  return payment.value.payload
})

const returnPaymentStatus = computed(() => {
  const value = Array.isArray(route.query.payment_status) ? route.query.payment_status[0] : route.query.payment_status
  return typeof value === 'string' ? value : ''
})

const returnPaymentNotice = computed(() => {
  if (paymentStatusLoading.value) {
    return {
      title: t('giftCards.paymentStatusLoading'),
      text: '',
      tone: 'pending',
    }
  }

  if (paymentStatusLookupFailed.value) {
    return {
      title: t('giftCards.paymentStatusUnavailable'),
      text: t('giftCards.paymentPendingText'),
      tone: 'pending',
    }
  }

  const status = payment.value?.status || returnPaymentStatus.value
  if (status === 'success' || status === 'paid') {
    return {
      title: t('giftCards.paymentSuccessTitle'),
      text: t('giftCards.paymentSuccessText'),
      tone: 'success',
    }
  }

  if (status === 'fail' || status === 'failed') {
    return {
      title: t('giftCards.paymentFailTitle'),
      text: t('giftCards.paymentFailText'),
      tone: 'fail',
    }
  }

  if (status === 'pending') {
    return {
      title: t('giftCards.paymentPendingTitle'),
      text: t('giftCards.paymentPendingText'),
      tone: 'pending',
    }
  }

  return null
})

const formatMoney = (value: number, currency: string) => {
  if (currency === 'AMD')
    return formatAmd(value)

  return `${value.toFixed(2)} ${currency}`
}

const applyAmountPreset = (amount: number) => {
  form.amount = String(amount)
}

const normalizePhone = (value: string) => {
  const digits = (value || '').replace(/\D+/g, '')
  return digits ? `+${digits}` : ''
}
const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const buildFullName = (firstName: string, lastName: string) => {
  return [firstName.trim(), lastName.trim()].filter(Boolean).join(' ')
}

const queryValue = (value: unknown) => Array.isArray(value) ? String(value[0] || '') : String(value || '')

const loadReturnedPaymentStatus = async () => {
  const orderId = queryValue(route.query.order_id)
  const token = queryValue(route.query.payment_token)

  if (!orderId || !token)
    return

  paymentStatusLoading.value = true
  paymentStatusLookupFailed.value = false

  try {
    const response = await api.get<any>(`/gift-cards/orders/${encodeURIComponent(orderId)}/payment-status?token=${encodeURIComponent(token)}`)
    createdOrder.value = response?.data || null
    issuedCard.value = response?.data?.gift_card || null
    payment.value = response?.payment || {
      status: returnPaymentStatus.value || 'pending',
      message: '',
      payload: null,
    }
  }
  catch {
    paymentStatusLookupFailed.value = true
    payment.value = {
      status: returnPaymentStatus.value || 'pending',
      message: '',
      payload: null,
    }
  }
  finally {
    paymentStatusLoading.value = false
  }
}

watch(isTor, (torMode) => {
  if (torMode && selectedTheme.value === 'rose')
    selectedTheme.value = 'gold'
}, { immediate: true })

onMounted(() => {
  loadReturnedPaymentStatus()
})

watch(
  () => auth.user,
  (user) => {
    if (!user) return

    if (!form.sender_first_name.trim()) {
      form.sender_first_name = user.first_name || ''
    }

    if (!form.sender_last_name.trim()) {
      form.sender_last_name = user.last_name || ''
    }

    if (!form.sender_phone.trim()) {
      form.sender_phone = user.phone || ''
    }

    if (!form.sender_email.trim()) {
      form.sender_email = user.email || ''
    }
  },
  { immediate: true },
)

useStructuredData(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Product',
      name: seoCopy.value.productName,
      description: seoCopy.value.description,
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
  if (!Number.isFinite(amount) || amount < 5000 || amount > 200000) {
    toast.push({ type: 'error', title: t('giftCards.amountRangeError') })
    return
  }

  if (!form.recipient_first_name.trim() || !form.recipient_last_name.trim()) {
    toast.push({ type: 'error', title: t('giftCards.recipientNameRequiredError') })
    return
  }

  if (!form.sender_first_name.trim() || !form.sender_last_name.trim()) {
    toast.push({ type: 'error', title: t('giftCards.senderNameRequiredError') })
    return
  }

  const recipientEmail = form.recipient_email.trim()
  const senderEmail = form.sender_email.trim()

  if (!recipientEmail || !isValidEmail(recipientEmail)) {
    toast.push({ type: 'error', title: t('giftCards.recipientRequiredError') })
    return
  }

  if (senderEmail && !isValidEmail(senderEmail)) {
    toast.push({ type: 'error', title: t('productsPage.invalidEmailError') })
    return
  }

  if (!form.sender_phone.trim()) {
    toast.push({ type: 'error', title: t('giftCards.senderPhoneRequiredError') })
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
      recipient_name: buildFullName(form.recipient_first_name, form.recipient_last_name) || undefined,
      recipient_email: recipientEmail,
      recipient_phone: normalizePhone(form.recipient_phone) || undefined,
      sender_name: buildFullName(form.sender_first_name, form.sender_last_name) || undefined,
      sender_email: senderEmail || undefined,
      sender_phone: normalizePhone(form.sender_phone) || undefined,
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

    if (paymentProvider.value === 'bank_card' && payment.value?.status === 'redirect' && payment.value?.payload?.action) {
      await navigateTo(String(payment.value.payload.action), { external: true })
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
        <p class="mt-2 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ seoCopy.lead }}</p>
      </div>

      <Card v-if="returnPaymentNotice" class="space-y-2" :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100' : ''">
        <p class="text-base font-semibold" :class="returnPaymentNotice.tone === 'success' ? (isTor ? 'text-[#d79a49]' : 'text-emerald-700') : returnPaymentNotice.tone === 'fail' ? 'text-red-600' : (isTor ? 'text-stone-100' : 'text-sand-900')">
          {{ returnPaymentNotice.title }}
        </p>
        <p v-if="returnPaymentNotice.text" class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ returnPaymentNotice.text }}</p>
      </Card>

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

          <BaseInput v-model="form.amount" type="number" min="5000" max="200000" step="1000" :label="t('giftCards.amountLabel')" :theme="isTor ? 'dark' : 'light'" />
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
                :class="paymentProvider === 'bank_card'
                  ? (isTor ? 'border-[#d79a49] bg-[#d79a49] text-black' : 'border-sand-900 bg-sand-900 text-white')
                  : (isTor ? 'border-white/10 bg-white/[0.04] text-stone-100 hover:border-[#c58a3a]/50' : 'border-sand-200 bg-white text-sand-900 hover:border-sand-600')"
                @click="paymentProvider = 'bank_card'"
              >
                {{ t('giftCards.paymentProviderBankCard') }}
              </button>
            </div>
          </div>
          <BaseInput v-model="form.recipient_first_name" :label="t('giftCards.recipientFirstName')" :placeholder="t('giftCards.recipientFirstNamePlaceholder')" :theme="isTor ? 'dark' : 'light'" />
          <BaseInput v-model="form.recipient_last_name" :label="t('giftCards.recipientLastName')" :placeholder="t('giftCards.recipientLastNamePlaceholder')" :theme="isTor ? 'dark' : 'light'" />
          <BaseInput v-model="form.recipient_email" type="email" :label="t('giftCards.recipientEmail')" :placeholder="t('giftCards.recipientEmailPlaceholder')" :theme="isTor ? 'dark' : 'light'" />
          <BaseInput v-model="form.recipient_phone" type="tel" :label="t('giftCards.recipientPhone')" :placeholder="t('giftCards.recipientPhonePlaceholder')" :theme="isTor ? 'dark' : 'light'" />
          <BaseInput v-model="form.sender_first_name" :label="t('giftCards.senderFirstName')" :placeholder="t('giftCards.senderFirstNamePlaceholder')" :theme="isTor ? 'dark' : 'light'" />
          <BaseInput v-model="form.sender_last_name" :label="t('giftCards.senderLastName')" :placeholder="t('giftCards.senderLastNamePlaceholder')" :theme="isTor ? 'dark' : 'light'" />
          <BaseInput v-model="form.sender_email" type="email" :label="t('giftCards.senderEmail')" :placeholder="t('giftCards.senderEmailPlaceholder')" :theme="isTor ? 'dark' : 'light'" />
          <BaseInput v-model="form.sender_phone" type="tel" :label="t('giftCards.senderPhone')" :placeholder="t('giftCards.senderPhonePlaceholder')" :theme="isTor ? 'dark' : 'light'" />

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
        <form v-if="idramPayload" ref="idramFormRef" :action="idramPayload.action" :method="idramPayload.method || 'POST'" class="space-y-3 rounded-2xl p-4" :class="isTor ? 'border border-white/10 bg-white/[0.04]' : 'border border-sand-200'">
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
              <a :href="issuedCardImageUrl" :download="`${issuedCard.code}.png`">
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
