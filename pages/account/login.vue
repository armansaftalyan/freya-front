<script setup lang="ts">
import Card from "~/components/base/Card.vue";

const { t } = useLocale()
const { localePath } = useLocalizedPath()
const { isTor, authRegisterPath, authAppointmentsPath } = useBrandContext()
const route = useRoute()
useLocalizedSeo(() => route.path)

useSeoMeta({
  title: () => t('auth.loginTitle'),
  description: () => t('account.loginSeoDescription'),
  robots: 'noindex, nofollow',
})

const auth = useAuthStore()
const form = reactive({ email: '', password: '' })
const toast = useToast()

const validate = () => {
  if (!form.email.trim()) {
    return t('common.emailRequired')
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    return t('common.emailInvalid')
  }

  if (!form.password.trim()) {
    return t('common.passwordRequired')
  }

  return ''
}

const submit = async () => {
  const validationError = validate()
  if (validationError) {
    toast.push({ type: 'error', title: t('common.requestFailed'), description: validationError })
    return
  }

  try {
    await auth.login(form)
    await navigateTo(localePath(authAppointmentsPath.value))
  }
  catch (error: any) {
    const parsed = useApiError(error)
    toast.push({ type: 'error', title: t('common.requestFailed'), description: parsed.message })
  }
}
</script>

<template>
  <section class="section-gap" :class="isTor ? 'text-stone-100' : ''">
    <div class="container-shell">
      <Card class="mx-auto max-w-xl" :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.18)]' : ''">
        <h1 class="text-3xl sm:text-4xl">{{ t('auth.loginTitle') }}</h1>
        <p class="mt-2 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('auth.continueText') }}</p>
        <form class="mt-6 space-y-4" @submit.prevent="submit">
          <BaseInput v-model="form.email" type="email" :theme="isTor ? 'dark' : 'light'" :label="t('auth.email')" required />
          <BaseInput v-model="form.password" type="password" :theme="isTor ? 'dark' : 'light'" :label="t('auth.password')" required />
          <BaseButton type="submit" :theme="isTor ? 'tor' : 'default'" :disabled="auth.loading" block>
            {{ auth.loading ? `${t('auth.login')}...` : t('auth.login') }}
          </BaseButton>
        </form>
        <p class="mt-5 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">
          {{ t('auth.noAccount') }}
          <NuxtLink :to="localePath(authRegisterPath)" :class="isTor ? 'text-[#d79a49] underline' : 'text-sand-700 underline'">{{ t('auth.register') }}</NuxtLink>
        </p>
      </Card>
    </div>
  </section>
</template>
