<script setup lang="ts">
import type { ApiItemResponse, ApiListResponse } from '~/types/api'
import type { ClientBalanceTransaction, ClientBalanceTransactionType } from '~/types/client-balance'
import type { User } from '~/types/user'
import Card from '~/components/base/Card.vue'
import AccountNav from '~/components/account/AccountNav.vue'

definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
const api = useApi()
const toast = useToast()
const { t } = useLocale()
const { formatYerevanDateTime } = useDateTime()
const { formatAmd } = useCurrency()
const { localePath } = useLocalizedPath()
const { isTor, authMasterProfilePath } = useBrandContext()
const route = useRoute()
useLocalizedSeo(() => route.path)

useSeoMeta({
  title: () => t('nav.myProfile'),
  description: () => t('account.profileSeoDescription'),
  robots: 'noindex, nofollow',
})

await auth.fetchMe()

const localizedPath = (target: string) => localePath(target) as string

if (auth.user?.roles?.includes('master')) {
  await navigateTo(localizedPath(authMasterProfilePath.value))
}

const { data: balanceTransactions, pending: balanceTransactionsPending } = await useAsyncData(
  `client-balance-transactions-${auth.user?.id ?? 'current'}`,
  async () => {
    const response = await api.get<ApiListResponse<ClientBalanceTransaction>>('/client-balance/transactions')
    return response.data
  },
  { default: () => [] },
)

const saving = ref(false)
const form = reactive({
  first_name: auth.user?.first_name || '',
  last_name: auth.user?.last_name || '',
  email: auth.user?.email || '',
  phone: auth.user?.phone || '',
  gender: auth.user?.gender || '',
  birth_date: auth.user?.birth_date || '',
  password: '',
  password_confirmation: '',
})

const genderOptions = computed(() => [
  { value: 'female', label: t('auth.genderFemale') },
  { value: 'male', label: t('auth.genderMale') },
])

const transactionTitle = (type: ClientBalanceTransactionType) => {
  switch (type) {
    case 'appointment_reward':
      return t('account.appointmentReward')
    case 'appointment_payment':
      return t('account.appointmentPayment')
    case 'manual_credit':
      return t('account.manualCredit')
    case 'manual_debit':
      return t('account.manualDebit')
    default:
      return type
  }
}

const saveProfile = async () => {
  saving.value = true

  try {
    const response = await api.patch<ApiItemResponse<User>>('/auth/me', {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      gender: form.gender || null,
      birth_date: form.birth_date || null,
      password: form.password || undefined,
      password_confirmation: form.password ? form.password_confirmation : undefined,
    }, { skipErrorToast: true })

    auth.setUser(response.data)
    form.password = ''
    form.password_confirmation = ''
    toast.push({ type: 'success', title: t('account.profileSaved') })
  }
  catch (error: any) {
    const parsed = useApiError(error)
    toast.push({ type: 'error', title: t('common.requestFailed'), description: parsed.message })
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="section-gap" :class="isTor ? 'text-stone-100' : ''">
    <div class="container-shell space-y-8">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl sm:text-5xl">{{ t('nav.myProfile') }}</h1>
          <p class="mt-2 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('account.profileIntro') }}</p>
        </div>
        <AccountNav />
      </div>

      <Card :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.18)]' : ''">
        <form class="space-y-6" @submit.prevent="saveProfile">
          <div class="grid gap-6 md:grid-cols-2">
            <BaseInput v-model="form.first_name" :theme="isTor ? 'dark' : 'light'" :label="t('auth.firstName')" />
            <BaseInput v-model="form.last_name" :theme="isTor ? 'dark' : 'light'" :label="t('auth.lastName')" />
            <BaseInput v-model="form.email" :theme="isTor ? 'dark' : 'light'" type="email" :label="t('auth.email')" />
            <BaseInput v-model="form.phone" :theme="isTor ? 'dark' : 'light'" type="tel" :label="t('auth.phone')" />
            <BaseSelect v-model="form.gender" :theme="isTor ? 'dark' : 'light'" :label="t('auth.gender')" :placeholder="t('auth.genderPlaceholder')" :options="genderOptions" />
            <BaseInput v-model="form.birth_date" :theme="isTor ? 'dark' : 'light'" type="date" :label="t('common.birthDate')" />
          </div>

          <div class="space-y-4">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 class="text-xl font-semibold">{{ t('account.balanceTitle') }}</h2>
                <p class="mt-1 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('account.balanceHint') }}</p>
              </div>
              <div class="rounded-2xl px-4 py-3 text-right" :class="isTor ? 'border border-white/10 bg-white/[0.04]' : 'border border-sand-200 bg-sand-50'">
                <p class="text-xs uppercase tracking-[0.2em]" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('account.currentBalance') }}</p>
                <p class="mt-2 text-2xl font-semibold">{{ formatAmd(auth.user?.client_balance ?? 0) }}</p>
              </div>
            </div>

            <div class="space-y-3">
              <h3 class="text-lg font-semibold">{{ t('account.transactionsTitle') }}</h3>
              <div v-if="balanceTransactionsPending" class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('giftCards.loading') }}</div>
              <div v-else-if="!balanceTransactions.length" class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('account.noBalanceTransactions') }}</div>
              <div v-else class="space-y-3">
                <div v-for="item in balanceTransactions" :key="item.id" class="rounded-2xl p-4" :class="isTor ? 'border border-white/10 bg-white/[0.04]' : 'border border-sand-200 bg-sand-50/60'">
                  <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p class="font-semibold">{{ transactionTitle(item.type) }}</p>
                      <p v-if="item.comment" class="mt-1 text-sm" :class="isTor ? 'text-stone-300' : 'text-sand-800'">{{ item.comment }}</p>
                      <p v-if="item.appointment_id" class="mt-1 text-xs uppercase tracking-[0.18em]" :class="isTor ? 'text-stone-500' : 'text-[var(--muted)]'">#{{ item.appointment_id }}</p>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold">{{ formatAmd(item.amount) }}</p>
                      <p class="mt-1 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('account.balanceAfter') }}: {{ formatAmd(item.balance_after) }}</p>
                      <p class="mt-1 text-xs" :class="isTor ? 'text-stone-500' : 'text-[var(--muted)]'">{{ formatYerevanDateTime(item.created_at) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h2 class="text-xl font-semibold">{{ t('account.profileDetails') }}</h2>
            <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('account.passwordHint') }}</p>
            <div class="grid gap-6 md:grid-cols-2">
              <BaseInput v-model="form.password" :theme="isTor ? 'dark' : 'light'" type="password" :label="t('auth.password')" />
              <BaseInput v-model="form.password_confirmation" :theme="isTor ? 'dark' : 'light'" type="password" :label="t('auth.passwordConfirmation')" />
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <BaseButton type="submit" :theme="isTor ? 'tor' : 'default'" :disabled="saving">{{ saving ? t('account.saving') : t('account.saveProfile') }}</BaseButton>
            <BaseButton type="button" variant="secondary" :theme="isTor ? 'tor' : 'default'" @click="auth.logout">{{ t('nav.logout') }}</BaseButton>
          </div>
        </form>
      </Card>
    </div>
  </section>
</template>
