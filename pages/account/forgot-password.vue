<script setup lang="ts">
import Card from '~/components/base/Card.vue'

const { t, locale } = useLocale()
const { localePath } = useLocalizedPath()
const { isTor, brand, authLoginPath, authProfilePath } = useBrandContext()
const route = useRoute()
useLocalizedSeo(() => route.path)

useSeoMeta({
  title: () => t('auth.forgotPasswordTitle'),
  description: () => t('account.forgotPasswordSeoDescription'),
  robots: 'noindex, nofollow',
})

const auth = useAuthStore()
const api = useApi()
const toast = useToast()
const form = reactive({ email: '' })
const sending = ref(false)

onMounted(async () => {
  if (auth.token && !auth.user) {
    await auth.fetchMe()
  }

  if (auth.isAuth) {
    await navigateTo(localePath(authProfilePath.value))
  }
})

const submit = async () => {
  sending.value = true

  try {
    await api.post('/auth/forgot-password', {
      email: form.email.trim(),
      brand: brand.value,
      locale: locale.value,
    }, { skipErrorToast: true })

    toast.push({ type: 'success', title: t('common.resetLinkSent') })
  }
  catch (error: any) {
    const parsed = useApiError(error)
    toast.push({ type: 'error', title: t('common.requestFailed'), description: parsed.message })
  }
  finally {
    sending.value = false
  }
}
</script>

<template>
  <section class="section-gap" :class="isTor ? 'text-stone-100' : ''">
    <div class="container-shell">
      <Card class="mx-auto max-w-xl" :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.18)]' : ''">
        <h1 class="text-3xl sm:text-4xl">{{ t('auth.forgotPasswordTitle') }}</h1>
        <p class="mt-2 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('auth.forgotPasswordText') }}</p>
        <form class="mt-6 space-y-4" @submit.prevent="submit">
          <BaseInput v-model="form.email" type="email" :theme="isTor ? 'dark' : 'light'" :label="t('auth.email')" required />
          <BaseButton type="submit" :theme="isTor ? 'tor' : 'default'" :disabled="sending" block>
            {{ sending ? `${t('auth.sendResetLink')}...` : t('auth.sendResetLink') }}
          </BaseButton>
        </form>
        <p class="mt-5 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">
          <NuxtLink :to="localePath(authLoginPath.value)" :class="isTor ? 'text-[#d79a49] underline' : 'text-sand-700 underline'">{{ t('auth.backToLogin') }}</NuxtLink>
        </p>
      </Card>
    </div>
  </section>
</template>
