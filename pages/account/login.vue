<script setup lang="ts">
useSeoMeta({
  title: 'Login',
  description: 'Вход в личный кабинет клиента.',
})

const auth = useAuthStore()
const { t } = useLocale()
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
    await navigateTo('/account/appointments')
  }
  catch (error: any) {
    const parsed = useApiError(error)
    toast.push({ type: 'error', title: t('common.requestFailed'), description: parsed.message })
  }
}
</script>

<template>
  <section class="section-gap">
    <div class="container-shell">
      <Card class="mx-auto max-w-xl">
        <h1 class="text-4xl">{{ t('auth.loginTitle') }}</h1>
        <p class="mt-2 text-sm text-[var(--muted)]">{{ t('auth.continueText') }}</p>
        <form class="mt-6 space-y-4" @submit.prevent="submit">
          <BaseInput v-model="form.email" type="email" :label="t('auth.email')" required />
          <BaseInput v-model="form.password" type="password" :label="t('auth.password')" required />
          <BaseButton type="submit" :disabled="auth.loading" block>
            {{ auth.loading ? `${t('auth.login')}...` : t('auth.login') }}
          </BaseButton>
        </form>
        <p class="mt-5 text-sm text-[var(--muted)]">
          {{ t('auth.noAccount') }}
          <NuxtLink to="/account/register" class="text-sand-700 underline">{{ t('auth.register') }}</NuxtLink>
        </p>
      </Card>
    </div>
  </section>
</template>
