<script setup lang="ts">
import Card from '~/components/base/Card.vue'

const { t } = useLocale()
const { localePath } = useLocalizedPath()
const { isTor, authLoginPath } = useBrandContext()
const route = useRoute()
useLocalizedSeo(() => route.path)

useSeoMeta({
  title: () => t('auth.resetPasswordTitle'),
  description: () => t('account.resetPasswordSeoDescription'),
  robots: 'noindex, nofollow',
})

const api = useApi()
const toast = useToast()
const form = reactive({
  email: typeof route.query.email === 'string' ? route.query.email : '',
  token: typeof route.query.token === 'string' ? route.query.token : '',
  password: '',
  password_confirmation: '',
})
const saving = ref(false)

const submit = async () => {
  saving.value = true

  try {
    await api.post('/auth/reset-password', {
      email: form.email.trim(),
      token: form.token,
      password: form.password,
      password_confirmation: form.password_confirmation,
    }, { skipErrorToast: true })

    toast.push({ type: 'success', title: t('common.passwordResetSuccess') })
    await navigateTo(localePath(authLoginPath.value))
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
    <div class="container-shell">
      <Card class="mx-auto max-w-xl" :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.18)]' : ''">
        <h1 class="text-3xl sm:text-4xl">{{ t('auth.resetPasswordTitle') }}</h1>
        <p class="mt-2 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('auth.resetPasswordText') }}</p>
        <form class="mt-6 space-y-4" @submit.prevent="submit">
          <BaseInput v-model="form.email" type="email" :theme="isTor ? 'dark' : 'light'" :label="t('auth.email')" required />
          <BaseInput v-model="form.password" type="password" :theme="isTor ? 'dark' : 'light'" :label="t('auth.password')" required />
          <BaseInput v-model="form.password_confirmation" type="password" :theme="isTor ? 'dark' : 'light'" :label="t('auth.passwordConfirmation')" required />
          <BaseButton type="submit" :theme="isTor ? 'tor' : 'default'" :disabled="saving || !form.token" block>
            {{ saving ? `${t('auth.resetPassword')}...` : t('auth.resetPassword') }}
          </BaseButton>
        </form>
        <p class="mt-5 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">
          <NuxtLink :to="localePath(authLoginPath.value)" :class="isTor ? 'text-[#d79a49] underline' : 'text-sand-700 underline'">{{ t('auth.backToLogin') }}</NuxtLink>
        </p>
      </Card>
    </div>
  </section>
</template>
