<script setup lang="ts">
import Card from "~/components/base/Card.vue";
import { useNoindexSeoMeta } from '~/composables/useNoindexSeoMeta'

const { t, locale } = useLocale()
const { localePath } = useLocalizedPath()
const { isTor, brand, authLoginPath, authAppointmentsPath, legalPath, privacyPolicyPath } = useBrandContext()

useNoindexSeoMeta({
  title: () => t('auth.registerTitle'),
  description: () => t('account.registerSeoDescription'),
})

const auth = useAuthStore()
const form = reactive<{ first_name: string; last_name: string; email: string; phone: string; gender: '' | 'female' | 'male'; birth_date: string; password: string; password_confirmation: string }>({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  gender: '',
  birth_date: '',
  password: '',
  password_confirmation: '',
})
const toast = useToast()
const genderOptions = computed(() => [
  { value: 'female', label: t('auth.genderFemale') },
  { value: 'male', label: t('auth.genderMale') },
])

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

const isPhoneValid = (value: string) => /^\+[1-9]\d{7,14}$/.test(value)

const validate = () => {
  if (!form.first_name.trim() || !form.last_name.trim()) {
    return t('common.nameRequired')
  }
  if (form.first_name.trim().length < 2 || form.last_name.trim().length < 2) {
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
  if (!form.password_confirmation.trim()) {
    return t('common.passwordConfirmationRequired')
  }
  if (form.password !== form.password_confirmation) {
    return t('common.passwordMismatch')
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
      gender: form.gender || undefined,
      birth_date: form.birth_date || undefined,
      password_confirmation: form.password_confirmation,
      brand: brand.value,
      locale: locale.value,
    })
    await navigateTo(localePath(authAppointmentsPath.value))
  }
  catch (error: any) {
    const parsed = parseApiError(error, t)
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
          <BaseInput v-model="form.first_name" :theme="isTor ? 'dark' : 'light'" :label="t('auth.firstName')" required />
          <BaseInput v-model="form.last_name" :theme="isTor ? 'dark' : 'light'" :label="t('auth.lastName')" required />
          <BaseInput v-model="form.email" type="email" :theme="isTor ? 'dark' : 'light'" :label="t('auth.email')" required />
          <BaseInput v-model="form.phone" type="tel" :theme="isTor ? 'dark' : 'light'" :label="t('auth.phone')" />
          <BaseSelect v-model="form.gender" :theme="isTor ? 'dark' : 'light'" :label="t('auth.gender')" :options="genderOptions" :placeholder="t('auth.genderPlaceholder')" />
          <BaseInput v-model="form.birth_date" type="date" :theme="isTor ? 'dark' : 'light'" :label="t('common.birthDate')" />
          <BaseInput v-model="form.password" type="password" :theme="isTor ? 'dark' : 'light'" :label="t('auth.password')" required />
          <BaseInput v-model="form.password_confirmation" type="password" :theme="isTor ? 'dark' : 'light'" :label="t('auth.passwordConfirmation')" required />
          <BaseButton type="submit" :theme="isTor ? 'tor' : 'default'" :disabled="auth.loading" block>
            {{ auth.loading ? `${t('auth.createAccount')}...` : t('auth.createAccount') }}
          </BaseButton>
          <p class="text-xs leading-6" :class="isTor ? 'text-stone-500' : 'text-[var(--muted)]'">
            {{ t('account.registerAgreementPrefix') }}
            <NuxtLink :to="localePath(legalPath)" :class="isTor ? 'text-[#d79a49] underline' : 'text-sand-700 underline'">
              {{ t('account.legalLinkLabel') }}
            </NuxtLink>
            {{ ` ${t('account.registerAgreementJoin')} ` }}
            <NuxtLink :to="localePath(privacyPolicyPath)" :class="isTor ? 'text-[#d79a49] underline' : 'text-sand-700 underline'">
              {{ t('account.privacyLinkLabel') }}
            </NuxtLink>
            .
          </p>
        </form>
        <p class="mt-5 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">
          {{ t('auth.hasAccount') }}
          <NuxtLink :to="localePath(authLoginPath)" :class="isTor ? 'text-[#d79a49] underline' : 'text-sand-700 underline'">{{ t('auth.login') }}</NuxtLink>
        </p>
      </Card>
    </div>
  </section>
</template>
