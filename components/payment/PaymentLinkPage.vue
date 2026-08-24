<script setup lang="ts">
interface PaymentLinkData {
  amount: string
  currency: string
  brand: 'freya' | 'tor'
  description: string | null
  customer_name: string | null
  status: 'active' | 'pending' | 'paid' | 'failed' | 'cancelled' | 'expired'
  expires_at: string | null
  paid_at: string | null
}

const api = useApi()
const route = useRoute()
const { locale } = useLocale()
const { formatAmd } = useCurrency()
const { isTor } = useBrandContext()
const token = computed(() => String(route.params.token || ''))
const paying = ref(false)
const payError = ref('')
const paymentProvider = ref<'bank_card' | 'idram'>('bank_card')
const idramFormRef = ref<HTMLFormElement | null>(null)
const idramPayment = ref<{ action: string, method: string, fields: Record<string, string> } | null>(null)

const copy = computed(() => {
  if (locale.value === 'hy') {
    return {
      title: 'Ծառայությունների կանխավճար',
      greeting: 'Բարև',
      purpose: 'Վճարման նպատակը',
      amount: 'Վճարման գումարը',
      pay: 'Վճարել բանկային քարտով',
      payIdram: 'Վճարել Idram-ով',
      method: 'Վճարման եղանակը',
      card: 'Բանկային քարտ',
      cardHint: 'Visa, Mastercard, ArCa',
      idram: 'Idram',
      idramHint: 'Idram դրամապանակ',
      secureBadge: 'Անվտանգ վճարում',
      secure: 'Վճարումը կատարվում է բանկի պաշտպանված էջում։ Քարտի տվյալները չեն պահվում կայքում։',
      paid: 'Վճարումը հաջողությամբ կատարված է',
      paidText: 'Շնորհակալություն։ Կանխավճարը հաստատված է։',
      unavailable: 'Այս հղումով վճարումն այլևս հասանելի չէ',
      expired: 'Հղման ժամկետը լրացել է կամ այն չեղարկվել է։',
      failed: 'Չհաջողվեց բացել վճարման էջը։ Փորձեք կրկին։',
    }
  }

  if (locale.value === 'en') {
    return {
      title: 'Service deposit',
      greeting: 'Hello',
      purpose: 'Payment details',
      amount: 'Amount due',
      pay: 'Pay by bank card',
      payIdram: 'Pay with Idram',
      method: 'Payment method',
      card: 'Bank card',
      cardHint: 'Visa, Mastercard, ArCa',
      idram: 'Idram',
      idramHint: 'Idram wallet',
      secureBadge: 'Secure payment',
      secure: 'Payment is completed on the bank’s secure page. Card details are not stored on this website.',
      paid: 'Payment completed successfully',
      paidText: 'Thank you. Your deposit has been confirmed.',
      unavailable: 'This payment link is no longer available',
      expired: 'The link has expired or was cancelled.',
      failed: 'Could not open the payment page. Please try again.',
    }
  }

  return {
    title: 'Предоплата за услуги',
    greeting: 'Здравствуйте',
    purpose: 'Назначение платежа',
    amount: 'Сумма к оплате',
    pay: 'Оплатить банковской картой',
    payIdram: 'Оплатить через Idram',
    method: 'Способ оплаты',
    card: 'Банковская карта',
    cardHint: 'Visa, Mastercard, ArCa',
    idram: 'Idram',
    idramHint: 'Кошелёк Idram',
    secureBadge: 'Безопасная оплата',
    secure: 'Оплата проходит на защищенной странице банка. Данные карты не сохраняются на сайте.',
    paid: 'Оплата прошла успешно',
    paidText: 'Спасибо! Ваша предоплата подтверждена.',
    unavailable: 'Оплата по этой ссылке недоступна',
    expired: 'Срок действия ссылки истек или она была отменена.',
    failed: 'Не удалось открыть страницу оплаты. Попробуйте еще раз.',
  }
})

const { data, error, refresh } = await useAsyncData(
  () => `payment-link-${token.value}`,
  async () => {
    const response = await api.get<{ data: PaymentLinkData }>(`/payment-links/${encodeURIComponent(token.value)}`)
    return response.data
  },
)

const isUnavailable = computed(() => ['cancelled', 'expired'].includes(data.value?.status || ''))

const startPayment = async () => {
  if (!data.value || paying.value) return

  paying.value = true
  payError.value = ''
  try {
    const response = await api.post<{ payment: { status: string, url?: string, type?: string, action?: string, method?: string, fields?: Record<string, string> } }>(
      `/payment-links/${encodeURIComponent(token.value)}/pay`,
      { provider: paymentProvider.value },
    )
    if (response.payment?.type === 'form' && response.payment.action && response.payment.fields) {
      idramPayment.value = {
        action: response.payment.action,
        method: response.payment.method || 'POST',
        fields: response.payment.fields,
      }
      await nextTick()
      idramFormRef.value?.submit()
      return
    }
    if (response.payment?.url) {
      await navigateTo(response.payment.url, { external: true })
      return
    }
    payError.value = copy.value.failed
  }
  catch (paymentError: any) {
    payError.value = paymentError?.data?.message || paymentError?.message || copy.value.failed
    await refresh()
  }
  finally {
    paying.value = false
  }
}

if (route.query.payment_status) {
  await refresh()
}

useSeoMeta({
  title: () => `${copy.value.title} | ${isTor.value ? 'Tor Barbershop' : 'Freya Beauty Salon'}`,
  robots: 'noindex, nofollow',
})

useHead({
  meta: [
    { name: 'referrer', content: 'no-referrer' },
  ],
})
</script>

<template>
  <main class="mx-auto flex min-h-[58vh] w-full max-w-xl items-center px-4 py-8 sm:px-6 sm:py-12">
    <Card
      class="relative w-full overflow-hidden !rounded-[2rem] !p-0"
      :class="isTor
        ? '!border-[#d79a49]/30 !bg-[linear-gradient(145deg,#171513_0%,#0d0c0b_70%)] !text-stone-100 shadow-[0_24px_80px_rgba(0,0,0,0.38)]'
        : '!border-sand-200/80 !bg-[#fffdf9]/95 shadow-[0_24px_70px_rgba(122,95,63,0.12)]'"
    >
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-16 top-0 h-px"
        :class="isTor ? 'bg-gradient-to-r from-transparent via-[#e9ad5b] to-transparent' : 'bg-gradient-to-r from-transparent via-sand-600 to-transparent'"
      />

      <div v-if="error || !data" class="space-y-3 px-6 py-12 text-center sm:px-9">
        <h1 class="text-2xl font-semibold">{{ copy.unavailable }}</h1>
        <p :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ copy.expired }}</p>
      </div>

      <div v-else-if="data.status === 'paid'" class="space-y-4 px-6 py-12 text-center sm:px-9">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">✓</div>
        <h1 class="text-2xl font-semibold text-emerald-700">{{ copy.paid }}</h1>
        <p :class="isTor ? 'text-stone-300' : 'text-[var(--muted)]'">{{ copy.paidText }}</p>
        <p class="text-3xl font-semibold">{{ formatAmd(Number(data.amount)) }}</p>
      </div>

      <div v-else-if="isUnavailable" class="space-y-3 px-6 py-12 text-center sm:px-9">
        <h1 class="text-2xl font-semibold">{{ copy.unavailable }}</h1>
        <p :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ copy.expired }}</p>
      </div>

      <div v-else class="space-y-6 px-5 py-7 sm:px-9 sm:py-9">
        <div class="space-y-3 text-center">
          <div
            class="mx-auto flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border"
            :class="isTor ? 'border-[#d79a49]/40 bg-black shadow-[0_0_30px_rgba(215,154,73,0.15)]' : 'border-sand-200 bg-sand-50'"
          >
            <img
              :src="isTor ? '/tor-logo-96.jpg' : '/logo.svg'"
              :alt="isTor ? 'Tor Barbershop' : 'Freya Beauty Salon'"
              class="h-full w-full object-contain"
            >
          </div>
          <p class="text-sm font-medium uppercase tracking-[0.2em]" :class="isTor ? 'text-[#d79a49]' : 'text-sand-700'">
            {{ isTor ? 'Tor Barbershop' : 'Freya Beauty Salon' }}
          </p>
          <h1 class="text-2xl font-semibold leading-tight sm:text-3xl">{{ copy.title }}</h1>
          <p v-if="data.customer_name" :class="isTor ? 'text-stone-300' : 'text-[var(--muted)]'">
            {{ copy.greeting }}, {{ data.customer_name }}!
          </p>
        </div>

        <div
          class="space-y-4 rounded-2xl border p-5 text-center"
          :class="isTor ? 'border-white/[0.08] bg-white/[0.045]' : 'border-sand-200/70 bg-sand-50/80'"
        >
          <div v-if="data.description" class="space-y-1 border-b pb-4" :class="isTor ? 'border-white/[0.08]' : 'border-sand-200/70'">
            <p class="text-xs uppercase tracking-wide" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ copy.purpose }}</p>
            <p class="font-medium">{{ data.description }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-xs uppercase tracking-wide" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ copy.amount }}</p>
            <p class="text-4xl font-bold tracking-tight sm:text-5xl">{{ formatAmd(Number(data.amount)) }}</p>
          </div>
        </div>

        <p v-if="payError" class="rounded-xl bg-red-50 p-3 text-sm text-red-700">{{ payError }}</p>

        <div class="space-y-2">
          <p class="text-sm font-medium" :class="isTor ? 'text-stone-300' : 'text-[var(--muted)]'">{{ copy.method }}</p>
          <div class="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              class="flex min-h-16 items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition"
              :class="paymentProvider === 'bank_card'
                ? (isTor ? 'border-[#d79a49] bg-[#d79a49]/15 text-stone-100 ring-1 ring-[#d79a49]/30' : 'border-sand-700 bg-sand-50 text-sand-950 ring-1 ring-sand-700/20')
                : (isTor ? 'border-white/10 bg-white/[0.025] text-stone-100 hover:border-white/20' : 'border-sand-200 bg-white hover:border-sand-300')"
              @click="paymentProvider = 'bank_card'"
            >
              <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" :class="isTor ? 'bg-white/[0.07]' : 'bg-sand-100'">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                  <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
                  <path d="M3 9.5h18M6.5 15.5h4" />
                </svg>
              </span>
              <span class="min-w-0 flex-1">
                <span class="block text-sm font-semibold">{{ copy.card }}</span>
                <span class="block truncate text-[11px] opacity-60">{{ copy.cardHint }}</span>
              </span>
              <span class="h-2.5 w-2.5 shrink-0 rounded-full" :class="paymentProvider === 'bank_card' ? (isTor ? 'bg-[#e9ad5b]' : 'bg-sand-700') : 'bg-current opacity-20'" />
            </button>
            <button
              type="button"
              class="flex min-h-16 items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition"
              :class="paymentProvider === 'idram'
                ? (isTor ? 'border-[#d79a49] bg-[#d79a49]/15 text-stone-100 ring-1 ring-[#d79a49]/30' : 'border-sand-700 bg-sand-50 text-sand-950 ring-1 ring-sand-700/20')
                : (isTor ? 'border-white/10 bg-white/[0.025] text-stone-100 hover:border-white/20' : 'border-sand-200 bg-white hover:border-sand-300')"
              @click="paymentProvider = 'idram'"
            >
              <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f58220] text-sm font-bold text-white">i</span>
              <span class="min-w-0 flex-1">
                <span class="block text-sm font-semibold">{{ copy.idram }}</span>
                <span class="block truncate text-[11px] opacity-60">{{ copy.idramHint }}</span>
              </span>
              <span class="h-2.5 w-2.5 shrink-0 rounded-full" :class="paymentProvider === 'idram' ? (isTor ? 'bg-[#e9ad5b]' : 'bg-sand-700') : 'bg-current opacity-20'" />
            </button>
          </div>
        </div>

        <button
          type="button"
          class="w-full rounded-2xl px-6 py-4 text-base font-semibold shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          :class="isTor ? 'bg-gradient-to-r from-[#d99843] to-[#efb565] text-black shadow-[#d79a49]/10 hover:from-[#e3a454] hover:to-[#f3be75]' : 'bg-sand-700 text-white shadow-sand-900/10 hover:bg-sand-900'"
          :disabled="paying"
          @click="startPayment"
        >
          {{ paying ? '…' : (paymentProvider === 'idram' ? copy.payIdram : copy.pay) }}
        </button>
        <form v-if="idramPayment" ref="idramFormRef" :action="idramPayment.action" :method="idramPayment.method" class="hidden">
          <input v-for="(value, key) in idramPayment.fields" :key="key" type="hidden" :name="key" :value="String(value)">
        </form>
        <div class="space-y-2 text-center">
          <p class="inline-flex items-center gap-1.5 text-xs font-medium" :class="isTor ? 'text-stone-300' : 'text-sand-700'">
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <rect x="5" y="10" width="14" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
            {{ copy.secureBadge }}
          </p>
          <p class="text-xs leading-relaxed" :class="isTor ? 'text-stone-500' : 'text-[var(--muted)]'">{{ copy.secure }}</p>
        </div>
      </div>
    </Card>
  </main>
</template>
