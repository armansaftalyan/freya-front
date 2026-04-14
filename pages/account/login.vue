<script setup lang="ts">
import Card from "~/components/base/Card.vue";
import { useNoindexSeoMeta } from '~/composables/useNoindexSeoMeta'

const { t } = useLocale()
const { localePath } = useLocalizedPath()
const { isTor, authRegisterPath, authForgotPasswordPath, authAppointmentsPath } = useBrandContext()

useNoindexSeoMeta({
  title: () => t('auth.loginTitle'),
  description: () => t('account.loginSeoDescription'),
})

const auth = useAuthStore()
const form = reactive({ login: '', password: '' })
const toast = useToast()

onMounted(async () => {
  if (auth.token && !auth.user) {
    await auth.fetchMe()
  }

  if (auth.isAuth) {
    await navigateTo(localePath(authAppointmentsPath.value))
  }
})

const normalizePhone = (value: string) => {
  const digits = (value || '').replace(/\D+/g, '')
  return digits ? `+${digits}` : ''
}

const isPhoneLike = (value: string) => /[\d()+\-\s]/.test(value)

const validate = () => {
  const login = form.login.trim()
  if (!login) {
    return t('common.loginRequired')
  }

  if (login.includes('@')) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login)) {
      return t('common.emailInvalid')
    }
  } else if (isPhoneLike(login)) {
    const normalized = normalizePhone(login)
    if (!/^\+[1-9]\d{7,14}$/.test(normalized)) {
      return t('common.phoneInvalid')
    }
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
    await auth.login({
      login: form.login.trim(),
      password: form.password,
    })
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
          <BaseInput v-model="form.login" :theme="isTor ? 'dark' : 'light'" :label="t('auth.loginField')" required />
          <BaseInput v-model="form.password" type="password" :theme="isTor ? 'dark' : 'light'" :label="t('auth.password')" required />
          <div class="flex justify-end">
            <NuxtLink :to="localePath(authForgotPasswordPath)" :class="isTor ? 'text-[#d79a49] text-sm underline' : 'text-sand-700 text-sm underline'">{{ t('auth.forgotPassword') }}</NuxtLink>
          </div>
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
