<script setup lang="ts">
import type { ApiItemResponse } from '~/types/api'
import type { Master } from '~/types/master'
import Card from '~/components/base/Card.vue'

definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
const api = useApi()
const toast = useToast()
const { t } = useLocale()
const { localePath } = useLocalizedPath()
const { isTor, bookingPath, authAppointmentsPath } = useBrandContext()
const config = useRuntimeConfig()
const localizedPath = (target: string) => localePath(target) as string
const route = useRoute()
useLocalizedSeo(() => route.path)

useSeoMeta({
  title: () => t('account.masterProfile'),
  description: () => t('account.masterProfileSeoDescription'),
  robots: 'noindex, nofollow',
})

await auth.fetchMe()

if (!auth.user?.roles?.includes('master')) {
  await navigateTo(localizedPath(authAppointmentsPath.value))
}

const profile = ref<Master | null>(null)
const loading = ref(true)
const saving = ref(false)
const uploadingAvatar = ref(false)
const uploadingPortfolio = ref(false)

const form = reactive({
  name: '',
  bio: '',
  experience_years: '',
  instagram: '',
  specialtiesText: '',
  languagesText: '',
  portfolio: [] as string[],
})

const portfolioCountLabel = computed(() => String(form.portfolio.length).padStart(2, '0'))

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
        && (parsed.pathname.startsWith('/storage/') || parsed.pathname.startsWith('/masters/'))
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

const fallbackAvatar = 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=80'
const portfolioFallback = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 960">
  <defs>
    <linearGradient id="bg" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#1a1a1a" />
      <stop offset="100%" stop-color="#0b0b0b" />
    </linearGradient>
  </defs>
  <rect width="720" height="960" fill="url(#bg)" />
  <circle cx="560" cy="170" r="92" fill="rgba(215,154,73,0.18)" />
  <circle cx="170" cy="760" r="120" fill="rgba(255,255,255,0.06)" />
  <rect x="170" y="248" rx="120" ry="120" width="380" height="464" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" />
  <text x="360" y="468" text-anchor="middle" fill="#d79a49" font-family="Arial, sans-serif" font-size="42" letter-spacing="8">PORTFOLIO</text>
  <text x="360" y="528" text-anchor="middle" fill="#8f8a83" font-family="Arial, sans-serif" font-size="24" letter-spacing="5">IMAGE</text>
</svg>
`)}`;
const avatarPreview = computed(() => resolveMediaUrl(profile.value?.avatar) || fallbackAvatar)
const portfolioPreviews = computed(() => form.portfolio.map(image => resolveMediaUrl(image) || ''))

const onAvatarError = (event: Event) => {
  const target = event.target as HTMLImageElement | null
  if (!target) return
  target.src = fallbackAvatar
}

const onPortfolioError = (event: Event) => {
  const target = event.target as HTMLImageElement | null
  if (!target) return
  target.src = portfolioFallback
}

const extractMaster = (payload: any): Master => {
  if (payload?.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
    return payload.data as Master
  }

  return payload as Master
}

const parseLines = (value: string) =>
  value
    .split('\n')
    .map(item => item.trim())
    .filter(Boolean)

const syncForm = (master: Master) => {
  form.name = master.name || ''
  form.bio = master.bio || ''
  form.experience_years = master.experience_years === null ? '' : String(master.experience_years)
  form.instagram = master.instagram || ''
  form.specialtiesText = (master.specialties || []).join('\n')
  form.languagesText = (master.languages || []).join('\n')
  form.portfolio = [...(master.portfolio || [])]
}

const loadProfile = async () => {
  loading.value = true
  try {
    const response = await api.get<ApiItemResponse<Master>>('/master/profile')
    profile.value = response.data
    syncForm(response.data)
  }
  finally {
    loading.value = false
  }
}

await loadProfile()

const persistPortfolio = async () => {
  const response = await api.patch<ApiItemResponse<Master>>('/master/profile', {
    name: form.name.trim(),
    bio: form.bio.trim() || null,
    experience_years: form.experience_years.trim() ? Number(form.experience_years) : null,
    instagram: form.instagram.trim() || null,
    specialties: parseLines(form.specialtiesText),
    languages: parseLines(form.languagesText),
    portfolio: form.portfolio,
  })

  const master = extractMaster(response)
  profile.value = master
  syncForm(master)
}

const saveProfile = async () => {
  saving.value = true
  try {
    await persistPortfolio()
    toast.push({ type: 'success', title: t('account.profileSaved') })
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
    const response = await api.post<{ avatar: string, data: Master }>('/master/profile/avatar', body)
    const master = extractMaster(response.data)
    profile.value = master
    syncForm(master)
    toast.push({ type: 'success', title: t('account.avatarUpdated') })
  }
  finally {
    input.value = ''
    uploadingAvatar.value = false
  }
}

const onPortfolioChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || [])

  if (!files.length) return

  const body = new FormData()
  files.forEach(file => body.append('images[]', file))

  uploadingPortfolio.value = true
  try {
    await persistPortfolio()
    const response = await api.post<{ images: string[], data: Master }>('/master/profile/portfolio', body)
    const master = extractMaster(response.data)
    profile.value = master
    syncForm(master)
    toast.push({ type: 'success', title: t('account.portfolioUpdated') })
  }
  finally {
    input.value = ''
    uploadingPortfolio.value = false
  }
}

const removePortfolioItem = async (index: number) => {
  form.portfolio.splice(index, 1)
  await persistPortfolio()
  toast.push({ type: 'success', title: t('account.portfolioUpdated') })
}
</script>

<template>
  <section class="section-gap" :class="isTor ? 'text-stone-100' : ''">
    <div class="container-shell space-y-8">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl sm:text-5xl">{{ t('account.masterProfile') }}</h1>
          <p class="mt-2 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('account.masterProfileSeoDescription') }}</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <NuxtLink :to="localizedPath(authAppointmentsPath)"><BaseButton variant="secondary" :theme="isTor ? 'tor' : 'default'">{{ t('nav.myAppointments') }}</BaseButton></NuxtLink>
          <NuxtLink :to="localizedPath(bookingPath)"><BaseButton :theme="isTor ? 'tor' : 'default'">{{ t('nav.bookNow') }}</BaseButton></NuxtLink>
        </div>
      </div>

      <Card v-if="loading" :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100' : ''">
        <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('common.loading') }}</p>
      </Card>

      <div v-else-if="profile" class="grid gap-6 xl:grid-cols-[340px,1fr]">
        <Card :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.18)]' : ''">
          <img
            :src="avatarPreview"
            :alt="profile.name"
            class="h-80 w-full rounded-2xl object-cover"
            @error="onAvatarError"
          >
          <div class="mt-4 space-y-3">
            <div v-if="isTor" class="space-y-1">
              <p class="text-xs uppercase tracking-[0.2em] text-[#c58a3a]">{{ t('account.masterProfile') }}</p>
              <h2 class="text-2xl font-semibold text-white">{{ form.name || profile.name }}</h2>
              <p class="text-sm text-stone-500">{{ profile.instagram || '@master' }}</p>
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
          </div>
        </Card>

        <Card :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100' : ''">
          <form class="space-y-6" @submit.prevent="saveProfile">
            <div class="grid gap-4 md:grid-cols-2">
              <BaseInput v-model="form.name" :label="t('auth.name')" :theme="isTor ? 'dark' : 'light'" required />
              <BaseInput v-model="form.experience_years" type="number" min="0" max="60" :label="t('account.experienceYears')" :theme="isTor ? 'dark' : 'light'" />
            </div>

            <BaseInput v-model="form.instagram" :label="t('account.instagram')" :theme="isTor ? 'dark' : 'light'" placeholder="@username" />

            <label class="block space-y-2">
              <span class="text-sm font-medium" :class="isTor ? 'text-stone-300' : 'text-sand-900'">{{ t('account.bio') }}</span>
              <textarea
                v-model="form.bio"
                rows="5"
                class="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition"
                :class="isTor ? 'border-white/10 bg-white/[0.04] text-white placeholder:text-stone-500 focus:border-[#d79a49]' : 'border-sand-200 bg-white text-sand-900 focus:border-sand-600'"
              />
            </label>

            <div class="grid gap-4 md:grid-cols-2">
              <label class="block space-y-2">
                <span class="text-sm font-medium" :class="isTor ? 'text-stone-300' : 'text-sand-900'">{{ t('account.specialties') }}</span>
                <textarea
                  v-model="form.specialtiesText"
                  rows="5"
                  class="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition"
                  :class="isTor ? 'border-white/10 bg-white/[0.04] text-white placeholder:text-stone-500 focus:border-[#d79a49]' : 'border-sand-200 bg-white text-sand-900 focus:border-sand-600'"
                  :placeholder="t('account.listHint')"
                />
              </label>

              <label class="block space-y-2">
                <span class="text-sm font-medium" :class="isTor ? 'text-stone-300' : 'text-sand-900'">{{ t('account.languages') }}</span>
                <textarea
                  v-model="form.languagesText"
                  rows="5"
                  class="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition"
                  :class="isTor ? 'border-white/10 bg-white/[0.04] text-white placeholder:text-stone-500 focus:border-[#d79a49]' : 'border-sand-200 bg-white text-sand-900 focus:border-sand-600'"
                  :placeholder="t('account.listHint')"
                />
              </label>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <h2 class="text-2xl">{{ t('account.portfolio') }}</h2>
                  <p class="mt-1 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('account.portfolioHint') }}</p>
                </div>
                <label class="inline-flex cursor-pointer items-center">
                  <input type="file" accept="image/*" multiple class="hidden" :disabled="uploadingPortfolio" @change="onPortfolioChange">
                  <span
                    class="inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition-all"
                    :class="isTor ? 'border border-white/10 bg-white/[0.06] text-stone-100 hover:border-[#d79a49]/50 hover:bg-white/[0.12]' : 'bg-white/70 text-sand-900 ring-1 ring-sand-200 shadow-sm hover:-translate-y-0.5 hover:bg-white hover:shadow-md'"
                  >
                    {{ uploadingPortfolio ? t('account.uploading') : t('account.addPortfolioImages') }}
                  </span>
                </label>
              </div>

              <div v-if="form.portfolio.length" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <article
                  v-for="(image, index) in form.portfolio"
                  :key="`${image}-${index}`"
                  class="overflow-hidden rounded-[28px]"
                  :class="isTor ? 'border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(0,0,0,0.35)_100%)]' : 'border border-sand-200 bg-white'"
                >
                  <img :src="portfolioPreviews[index] || portfolioFallback" :alt="`${profile.name} portfolio ${index + 1}`" class="h-56 w-full object-cover" @error="onPortfolioError">
                  <div class="flex items-center justify-between gap-2 p-3">
                    <span class="text-sm" :class="isTor ? 'text-stone-300' : 'text-sand-700'">#{{ index + 1 }}</span>
                    <BaseButton size="sm" variant="secondary" :theme="isTor ? 'tor' : 'default'" @click="removePortfolioItem(index)">
                      {{ t('cartPage.remove') }}
                    </BaseButton>
                  </div>
                </article>
              </div>

              <div v-else class="rounded-3xl border border-dashed p-6 text-sm" :class="isTor ? 'border-white/10 bg-white/[0.03] text-stone-400' : 'border-sand-300 bg-white text-sand-700'">
                {{ t('account.portfolioEmpty') }}
              </div>
            </div>

            <div class="flex flex-wrap gap-3">
              <BaseButton type="submit" :theme="isTor ? 'tor' : 'default'" :disabled="saving">{{ saving ? t('account.saving') : t('account.saveProfile') }}</BaseButton>
            </div>
          </form>
        </Card>
      </div>
    </div>
  </section>
</template>
