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
      idram: 'Idram',
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
      idram: 'Idram',
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
    idram: 'Idram',
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
  <main class="mx-auto flex min-h-[65vh] w-full max-w-2xl items-center px-4 py-12 sm:px-6">
    <Card class="w-full overflow-hidden" :class="isTor ? '!border-white/10 !bg-[#181614] !text-stone-100' : ''">
      <div v-if="error || !data" class="space-y-3 py-8 text-center">
        <h1 class="text-2xl font-semibold">{{ copy.unavailable }}</h1>
        <p :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ copy.expired }}</p>
      </div>

      <div v-else-if="data.status === 'paid'" class="space-y-4 py-8 text-center">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">✓</div>
        <h1 class="text-2xl font-semibold text-emerald-700">{{ copy.paid }}</h1>
        <p :class="isTor ? 'text-stone-300' : 'text-[var(--muted)]'">{{ copy.paidText }}</p>
        <p class="text-3xl font-semibold">{{ formatAmd(Number(data.amount)) }}</p>
      </div>

      <div v-else-if="isUnavailable" class="space-y-3 py-8 text-center">
        <h1 class="text-2xl font-semibold">{{ copy.unavailable }}</h1>
        <p :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ copy.expired }}</p>
      </div>

      <div v-else class="space-y-7 py-4">
        <div class="space-y-2 text-center">
          <p class="text-sm font-medium uppercase tracking-[0.2em]" :class="isTor ? 'text-[#d79a49]' : 'text-amber-700'">
            {{ isTor ? 'Tor Barbershop' : 'Freya Beauty Salon' }}
          </p>
          <h1 class="text-3xl font-semibold">{{ copy.title }}</h1>
          <p v-if="data.customer_name" :class="isTor ? 'text-stone-300' : 'text-[var(--muted)]'">
            {{ copy.greeting }}, {{ data.customer_name }}!
          </p>
        </div>

        <div class="space-y-5 rounded-2xl p-5" :class="isTor ? 'bg-white/[0.05]' : 'bg-amber-50'">
          <div v-if="data.description" class="space-y-1">
            <p class="text-xs uppercase tracking-wide" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ copy.purpose }}</p>
            <p class="font-medium">{{ data.description }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-xs uppercase tracking-wide" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ copy.amount }}</p>
            <p class="text-4xl font-semibold">{{ formatAmd(Number(data.amount)) }}</p>
          </div>
        </div>

        <p v-if="payError" class="rounded-xl bg-red-50 p-3 text-sm text-red-700">{{ payError }}</p>

        <div class="space-y-2">
          <p class="text-sm font-medium" :class="isTor ? 'text-stone-300' : 'text-[var(--muted)]'">{{ copy.method }}</p>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              class="rounded-xl border px-3 py-3 text-sm font-semibold transition"
              :class="paymentProvider === 'bank_card'
                ? (isTor ? 'border-[#d79a49] bg-[#d79a49] text-black' : 'border-amber-700 bg-amber-700 text-white')
                : (isTor ? 'border-white/10 bg-white/[0.04] text-stone-100' : 'border-amber-200 bg-white')"
              @click="paymentProvider = 'bank_card'"
            >
              {{ copy.card }}
            </button>
            <button
              type="button"
              class="rounded-xl border px-3 py-3 text-sm font-semibold transition"
              :class="paymentProvider === 'idram'
                ? (isTor ? 'border-[#d79a49] bg-[#d79a49] text-black' : 'border-amber-700 bg-amber-700 text-white')
                : (isTor ? 'border-white/10 bg-white/[0.04] text-stone-100' : 'border-amber-200 bg-white')"
              @click="paymentProvider = 'idram'"
            >
              {{ copy.idram }}
            </button>
          </div>
        </div>

        <button
          type="button"
          class="w-full rounded-full px-6 py-4 text-base font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
          :class="isTor ? 'bg-[#d79a49] text-black hover:bg-[#e4aa5e]' : 'bg-amber-700 text-white hover:bg-amber-800'"
          :disabled="paying"
          @click="startPayment"
        >
          {{ paying ? '…' : (paymentProvider === 'idram' ? copy.payIdram : copy.pay) }}
        </button>
        <form v-if="idramPayment" ref="idramFormRef" :action="idramPayment.action" :method="idramPayment.method" class="hidden">
          <input v-for="(value, key) in idramPayment.fields" :key="key" type="hidden" :name="key" :value="String(value)">
        </form>
        <p class="text-center text-xs leading-relaxed" :class="isTor ? 'text-stone-500' : 'text-[var(--muted)]'">{{ copy.secure }}</p>
      </div>
    </Card>
  </main>
</template>
