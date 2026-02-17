<script setup lang="ts">
useSeoMeta({
  title: 'Register',
  description: 'Регистрация клиента для онлайн-записи.',
})

const auth = useAuthStore()
const { t } = useLocale()
const form = reactive({ name: '', email: '', phone: '', password: '' })
const toast = useToast()

const validate = () => {
  if (!form.name.trim()) {
    return t('common.nameRequired')
  }
  if (form.name.trim().length < 2) {
    return t('common.nameShort')
  }

  if (!form.email.trim()) {
    return t('common.emailRequired')
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    return t('common.emailInvalid')
  }

  if (form.phone && form.phone.length < 6) {
    return t('common.phoneShort')
  }

  if (!form.password.trim()) {
    return t('common.passwordRequired')
  }
  if (form.password.length < 8) {
    return t('common.passwordShort')
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
    await auth.register(form)
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
        <h1 class="text-4xl">{{ t('auth.registerTitle') }}</h1>
        <p class="mt-2 text-sm text-[var(--muted)]">{{ t('auth.createText') }}</p>
        <form class="mt-6 space-y-4" @submit.prevent="submit">
          <BaseInput v-model="form.name" :label="t('auth.name')" required />
          <BaseInput v-model="form.email" type="email" :label="t('auth.email')" required />
          <BaseInput v-model="form.phone" :label="t('auth.phone')" />
          <BaseInput v-model="form.password" type="password" :label="t('auth.password')" required />
          <BaseButton type="submit" :disabled="auth.loading" block>
            {{ auth.loading ? `${t('auth.createAccount')}...` : t('auth.createAccount') }}
          </BaseButton>
        </form>
        <p class="mt-5 text-sm text-[var(--muted)]">
          {{ t('auth.hasAccount') }}
          <NuxtLink to="/account/login" class="text-sand-700 underline">{{ t('auth.login') }}</NuxtLink>
        </p>
      </Card>
    </div>
  </section>
</template>
