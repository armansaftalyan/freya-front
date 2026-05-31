<script setup lang="ts">
import type { ApiItemResponse, ApiListResponse } from '~/types/api'
import type { ClientBalanceTransaction, ClientBalanceTransactionType } from '~/types/client-balance'
import type { User } from '~/types/user'
import Card from '~/components/base/Card.vue'
import AccountNav from '~/components/account/AccountNav.vue'
import { useNoindexSeoMeta } from '~/composables/useNoindexSeoMeta'

definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
const api = useApi()
const toast = useToast()
const { t } = useLocale()
const { formatYerevanDateTime } = useDateTime()
const { formatAmd } = useCurrency()
const { localePath } = useLocalizedPath()
const { isTor, authMasterProfilePath } = useBrandContext()
const config = useRuntimeConfig()

useNoindexSeoMeta({
  title: () => t('nav.myProfile'),
  description: () => t('account.profileSeoDescription'),
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
  { default: () => [], server: false },
)

const saving = ref(false)
const uploadingAvatar = ref(false)
const avatarVersion = ref(0)
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

const syncFormFromUser = (user?: User | null) => {
  form.first_name = user?.first_name || ''
  form.last_name = user?.last_name || ''
  form.email = user?.email || ''
  form.phone = user?.phone || ''
  form.gender = user?.gender || ''
  form.birth_date = user?.birth_date || ''
}

const backendBaseUrl = computed(() => String(config.public.apiBase || '').replace(/\/api\/?$/, ''))

const resolveMediaUrl = (value: string | null | undefined) => {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) {
    try {
      const parsed = new URL(value)
      const backend = backendBaseUrl.value ? new URL(backendBaseUrl.value) : null

      if (
        backend
        && parsed.origin !== backend.origin
        && (parsed.pathname.startsWith('/storage/') || parsed.pathname.startsWith('/users/'))
      ) {
        return `${backend.origin}${parsed.pathname}${parsed.search}`
      }
    }
    catch {
      return value
    }

    return value
  }
  if (value.startsWith('/')) {
    return backendBaseUrl.value ? `${backendBaseUrl.value}${value}` : value
  }

  return backendBaseUrl.value ? `${backendBaseUrl.value}/${value.replace(/^\/+/, '')}` : value
}

const profileName = computed(() => [form.first_name, form.last_name].map(value => value.trim()).filter(Boolean).join(' ') || auth.user?.name || 'Profile')
const avatarFallback = computed(() => `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 720">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${isTor.value ? '#1c1917' : '#f5ede1'}" />
      <stop offset="100%" stop-color="${isTor.value ? '#0c0a09' : '#e7d5c2'}" />
    </linearGradient>
  </defs>
  <rect width="720" height="720" fill="url(#bg)" />
  <circle cx="360" cy="270" r="120" fill="${isTor.value ? '#d79a49' : '#8a6a45'}" fill-opacity="0.18" />
  <circle cx="360" cy="250" r="88" fill="${isTor.value ? '#f5f5f4' : '#8a6a45'}" fill-opacity="0.9" />
  <path d="M190 575c36-92 114-138 170-138s134 46 170 138" fill="${isTor.value ? '#f5f5f4' : '#8a6a45'}" fill-opacity="0.9" />
</svg>
`)}`)
const avatarPreview = computed(() => {
  const resolved = resolveMediaUrl(auth.user?.avatar)
  if (!resolved) return avatarFallback.value
  if (resolved.startsWith('data:')) return resolved

  const separator = resolved.includes('?') ? '&' : '?'
  return `${resolved}${separator}v=${avatarVersion.value}`
})

const onAvatarError = (event: Event) => {
  const target = event.target as HTMLImageElement | null
  if (!target) return
  target.src = avatarFallback.value
}

const genderOptions = computed(() => [
  { value: 'female', label: t('auth.genderFemale') },
  { value: 'male', label: t('auth.genderMale') },
])

watch(() => auth.user, (user) => {
  syncFormFromUser(user)
}, { immediate: true })

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
    syncFormFromUser(response.data)
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

const onAvatarChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  const body = new FormData()
  body.append('avatar', file)

  uploadingAvatar.value = true
  try {
    const response = await api.post<{ avatar: string, data: User }>('/auth/me/avatar', body, { skipErrorToast: true })
    auth.setUser({
      ...response.data,
      avatar: response.avatar || response.data.avatar,
    })
    avatarVersion.value += 1
    toast.push({ type: 'success', title: t('account.avatarUpdated') })
  }
  catch (error: any) {
    const parsed = useApiError(error)
    toast.push({ type: 'error', title: t('common.requestFailed'), description: parsed.message })
  }
  finally {
    input.value = ''
    uploadingAvatar.value = false
  }
}

const removeAvatar = async () => {
  uploadingAvatar.value = true
  try {
    const response = await api.del<ApiItemResponse<User>>('/auth/me/avatar', { skipErrorToast: true })
    auth.setUser(response.data)
    avatarVersion.value += 1
    toast.push({ type: 'success', title: t('account.avatarUpdated') })
  }
  catch (error: any) {
    const parsed = useApiError(error)
    toast.push({ type: 'error', title: t('common.requestFailed'), description: parsed.message })
  }
  finally {
    uploadingAvatar.value = false
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

      <div class="grid gap-6 xl:grid-cols-[340px,1fr]">
        <Card :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.18)]' : ''">
          <img
            :src="avatarPreview"
            :alt="profileName"
            class="h-80 w-full rounded-2xl object-cover"
            @error="onAvatarError"
          >
          <div class="mt-4 space-y-3">
            <div class="space-y-1">
              <p
                class="text-xs uppercase tracking-[0.2em]"
                :class="isTor ? 'text-[#c58a3a]' : 'text-[var(--muted)]'"
              >
                {{ t('nav.myProfile') }}
              </p>
              <h2 class="text-2xl font-semibold" :class="isTor ? 'text-white' : 'text-sand-950'">{{ profileName }}</h2>
              <p class="text-sm" :class="isTor ? 'text-stone-500' : 'text-[var(--muted)]'">{{ auth.user?.email }}</p>
            </div>

            <label class="block">
              <span class="mb-2 block text-sm font-medium" :class="isTor ? 'text-stone-300' : 'text-sand-900'">{{ t('account.avatarLabel') }}</span>
              <input
                type="file"
                accept="image/*"
                class="block w-full text-sm"
                :class="isTor ? 'text-stone-300 file:mr-4 file:rounded-full file:border-0 file:bg-[#d79a49] file:px-4 file:py-2 file:text-black' : 'text-sand-700 file:mr-4 file:rounded-full file:border-0 file:bg-sand-900 file:px-4 file:py-2 file:text-white'"
                :disabled="uploadingAvatar"
                @change="onAvatarChange"
              >
            </label>
            <p class="text-xs" :class="isTor ? 'text-stone-500' : 'text-[var(--muted)]'">
              {{ uploadingAvatar ? t('account.uploading') : t('account.avatarHint') }}
            </p>
            <BaseButton
              v-if="auth.user?.avatar"
              type="button"
              variant="secondary"
              size="sm"
              :theme="isTor ? 'tor' : 'default'"
              :disabled="uploadingAvatar"
              @click="removeAvatar"
            >
              {{ t('account.removeAvatar') }}
            </BaseButton>
          </div>
        </Card>

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
    </div>
  </section>
</template>
