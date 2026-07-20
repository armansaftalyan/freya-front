<script setup lang="ts">
import type { ApiItemResponse } from '~/types/api'
import AccountNav from '~/components/account/AccountNav.vue'
import BadgeStatus from '~/components/base/BadgeStatus.vue'
import Card from '~/components/base/Card.vue'
import InfiniteScrollTrigger from '~/components/shared/InfiniteScrollTrigger.vue'
import { useNoindexSeoMeta } from '~/composables/useNoindexSeoMeta'

interface ReferralAppointment {
  id: number
  status: string
  occurred_at: string
  source_type: 'appointment' | 'product_order' | 'gift_card_order' | 'payout' | 'payout_reversal'
  client_name: string
  title: string
  total_price: number
  commission_percent: number
  earned_amount: number
}

interface ReferralDashboardData {
  referral_code: string | null
  commission_percent: number
  product_commission_percent: number
  gift_card_commission_percent: number
  expires_at: string | null
  balance: number
  referred_clients_count: number
  appointments: ReferralAppointment[]
  operations_meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    has_more: boolean
  }
}

const auth = useAuthStore()
const api = useApi()
const toast = useToast()
const { locale, t } = useLocale()
const { formatAmd } = useCurrency()
const { formatYerevanDateTime } = useDateTime()
const { localePath } = useLocalizedPath()
const { isTor, authProfilePath } = useBrandContext()
const origin = ref('')

const labels = computed(() => {
  if (locale.value === 'en') {
    return { title: 'Referral dashboard', link: 'Your referral link', copy: 'Copy', copied: 'Link copied', balance: 'Balance', rate: 'Rate', clients: 'Clients', appointments: 'Referral operations', client: 'Client', service: 'Service or product', price: 'Amount', earned: 'Balance change', payout: 'Referral payout', payoutReversal: 'Payout reversal', loading: 'Loading more…', empty: 'No referral operations yet.' }
  }
  if (locale.value === 'hy') {
    return { title: 'Ուղղորդումների էջ', link: 'Ձեր ուղղորդման հղումը', copy: 'Պատճենել', copied: 'Հղումը պատճենված է', balance: 'Բալանս', rate: 'Տոկոս', clients: 'Հաճախորդներ', appointments: 'Ուղղորդման գործարքներ', client: 'Հաճախորդ', service: 'Ծառայություն կամ ապրանք', price: 'Գումար', earned: 'Բալանսի փոփոխություն', payout: 'Ուղղորդման վճարում', payoutReversal: 'Վճարման չեղարկում', loading: 'Բեռնվում է…', empty: 'Ուղղորդման գործարքներ դեռ չկան։' }
  }
  return { title: 'Реферальный кабинет', link: 'Ваша реферальная ссылка', copy: 'Копировать', copied: 'Ссылка скопирована', balance: 'Баланс', rate: 'Процент', clients: 'Клиенты', appointments: 'Реферальные операции', client: 'Клиент', service: 'Услуга или товар', price: 'Сумма', earned: 'Изменение баланса', payout: 'Выплата рефереру', payoutReversal: 'Отмена выплаты', loading: 'Загружаем ещё…', empty: 'Реферальных операций пока нет.' }
})

useNoindexSeoMeta({ title: () => labels.value.title, description: () => labels.value.title })

await auth.fetchMe()
if (!auth.user?.roles?.includes('referrer')) {
  await navigateTo(localePath(authProfilePath.value))
}

const { data: dashboard, pending } = await useAsyncData(
  `referral-dashboard-${auth.user?.id ?? 'current'}`,
  async () => {
    if (!auth.user?.roles?.includes('referrer')) return null
    return (await api.get<ApiItemResponse<ReferralDashboardData>>('/referrals/dashboard')).data
  },
  { server: false },
)

const loadingMore = ref(false)
const hasMore = computed(() => dashboard.value?.operations_meta?.has_more ?? false)

const loadMore = async () => {
  if (!dashboard.value || loadingMore.value || !hasMore.value) return

  loadingMore.value = true
  try {
    const nextPage = dashboard.value.operations_meta.current_page + 1
    const next = (await api.get<ApiItemResponse<ReferralDashboardData>>('/referrals/dashboard', { page: nextPage })).data
    dashboard.value = {
      ...next,
      appointments: [...dashboard.value.appointments, ...next.appointments],
    }
  }
  finally {
    loadingMore.value = false
  }
}

onMounted(() => {
  origin.value = window.location.origin
})

const referralLink = computed(() => {
  if (!dashboard.value?.referral_code) return ''
  const bookingPath = localePath(isTor.value ? '/tor/booking' : '/booking') as string
  return `${origin.value}${bookingPath}?ref=${encodeURIComponent(dashboard.value.referral_code)}`
})

const copyLink = async () => {
  if (!referralLink.value) return
  await navigator.clipboard.writeText(referralLink.value)
  toast.push({ type: 'success', title: labels.value.copied })
}

const operationTitle = (item: ReferralAppointment) => {
  if (item.source_type === 'payout' && item.title === 'Referral payout') return labels.value.payout
  if (item.source_type === 'payout_reversal' && (item.title === 'Payout reversal' || !item.title)) return labels.value.payoutReversal
  return item.title || '—'
}
</script>

<template>
  <section class="section-gap" :class="isTor ? 'text-stone-100' : ''">
    <div class="container-shell space-y-8">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <h1 class="text-3xl sm:text-5xl">{{ labels.title }}</h1>
        <AccountNav />
      </div>

      <div v-if="pending" class="grid gap-4 sm:grid-cols-3">
        <div v-for="item in 3" :key="item" class="h-28 animate-pulse rounded-3xl bg-black/5" />
      </div>

      <template v-else-if="dashboard">
        <Card>
          <p class="text-sm text-[var(--muted)]">{{ labels.link }}</p>
          <p v-if="dashboard.expires_at" class="mt-1 text-xs text-[var(--muted)]">{{ locale === 'ru' ? 'Действует до' : locale === 'hy' ? 'Գործում է մինչև' : 'Valid until' }}: {{ dashboard.expires_at }}</p>
          <div class="mt-3 flex flex-col gap-3 sm:flex-row">
            <input :value="referralLink" readonly class="min-h-11 flex-1 rounded-xl border border-black/10 bg-transparent px-4 text-sm" />
            <BaseButton :theme="isTor ? 'tor' : 'default'" @click="copyLink">{{ labels.copy }}</BaseButton>
          </div>
        </Card>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card><p class="text-sm text-[var(--muted)]">{{ labels.balance }}</p><p class="mt-2 text-3xl font-semibold">{{ formatAmd(dashboard.balance) }}</p></Card>
          <Card><p class="text-sm text-[var(--muted)]">Appointments</p><p class="mt-2 text-3xl font-semibold">{{ dashboard.commission_percent }}%</p></Card>
          <Card><p class="text-sm text-[var(--muted)]">Products</p><p class="mt-2 text-3xl font-semibold">{{ dashboard.product_commission_percent }}%</p></Card>
          <Card><p class="text-sm text-[var(--muted)]">Gift cards</p><p class="mt-2 text-3xl font-semibold">{{ dashboard.gift_card_commission_percent }}%</p></Card>
          <Card><p class="text-sm text-[var(--muted)]">{{ labels.clients }}</p><p class="mt-2 text-3xl font-semibold">{{ dashboard.referred_clients_count }}</p></Card>
        </div>

        <Card>
          <h2 class="text-2xl">{{ labels.appointments }}</h2>
          <div v-if="dashboard.appointments.length" class="mt-5 overflow-x-auto">
            <table class="w-full min-w-[760px] text-left text-sm">
              <thead class="border-b border-black/10 text-[var(--muted)]"><tr><th class="py-3 pr-4"># / {{ t('common.date') }}</th><th class="p-3">{{ labels.client }}</th><th class="p-3">{{ labels.service }}</th><th class="p-3">Status</th><th class="p-3">{{ labels.price }}</th><th class="py-3 pl-3">{{ labels.earned }}</th></tr></thead>
              <tbody>
                <tr v-for="item in dashboard.appointments" :key="`${item.source_type}-${item.id}`" class="border-b border-black/5">
                  <td class="py-4 pr-4">{{ item.source_type }} #{{ item.id }}<br><span class="text-xs text-[var(--muted)]">{{ formatYerevanDateTime(item.occurred_at) }}</span></td>
                  <td class="p-3">{{ item.client_name || '—' }}</td><td class="p-3">{{ operationTitle(item) }}</td><td class="p-3"><BadgeStatus :status="item.status" /></td><td class="p-3">{{ formatAmd(item.total_price) }}</td><td class="py-3 pl-3 font-semibold">{{ formatAmd(item.earned_amount) }} <span v-if="!item.source_type.startsWith('payout')" class="text-xs font-normal text-[var(--muted)]">({{ item.commission_percent }}%)</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else class="mt-5 text-sm text-[var(--muted)]">{{ labels.empty }}</p>
          <InfiniteScrollTrigger v-if="hasMore || loadingMore" :loading="loadingMore" :disabled="!hasMore" @load="loadMore">
            <span class="text-sm text-[var(--muted)]">{{ labels.loading }}</span>
          </InfiniteScrollTrigger>
        </Card>
      </template>
    </div>
  </section>
</template>
