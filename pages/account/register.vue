<script setup lang="ts">
import Card from "~/components/base/Card.vue";

const { t } = useLocale()
const { localePath } = useLocalizedPath()
const { isTor, authLoginPath, authAppointmentsPath } = useBrandContext()
const route = useRoute()
useLocalizedSeo(() => route.path)

useSeoMeta({
  title: () => t('auth.registerTitle'),
  description: () => t('account.registerSeoDescription'),
  robots: 'noindex, nofollow',
})

const auth = useAuthStore()
const form = reactive({ name: '', email: '', phone: '', password: '' })
const toast = useToast()

const normalizePhone = (value: string) => {
  const digits = (value || '').replace(/\D+/g, '')
  return digits ? `+${digits}` : ''
}

const isPhoneValid = (value: string) => /^\+[1-9]\d{7,14}$/.test(value)

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

  if (form.phone.trim()) {
    const normalized = normalizePhone(form.phone)
    if (!isPhoneValid(normalized)) {
      return t('common.phoneInvalid')
    }
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
    const normalizedPhone = normalizePhone(form.phone)
    await auth.register({
      ...form,
      phone: normalizedPhone || undefined,
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
        <h1 class="text-3xl sm:text-4xl">{{ t('auth.registerTitle') }}</h1>
        <p class="mt-2 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('auth.createText') }}</p>
        <form class="mt-6 space-y-4" @submit.prevent="submit">
          <BaseInput v-model="form.name" :theme="isTor ? 'dark' : 'light'" :label="t('auth.name')" required />
          <BaseInput v-model="form.email" type="email" :theme="isTor ? 'dark' : 'light'" :label="t('auth.email')" required />
          <BaseInput v-model="form.phone" type="tel" :theme="isTor ? 'dark' : 'light'" :label="t('auth.phone')" />
          <BaseInput v-model="form.password" type="password" :theme="isTor ? 'dark' : 'light'" :label="t('auth.password')" required />
          <BaseButton type="submit" :theme="isTor ? 'tor' : 'default'" :disabled="auth.loading" block>
            {{ auth.loading ? `${t('auth.createAccount')}...` : t('auth.createAccount') }}
          </BaseButton>
        </form>
        <p class="mt-5 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">
          {{ t('auth.hasAccount') }}
          <NuxtLink :to="localePath(authLoginPath)" :class="isTor ? 'text-[#d79a49] underline' : 'text-sand-700 underline'">{{ t('auth.login') }}</NuxtLink>
        </p>
      </Card>
    </div>
  </section>
</template>
