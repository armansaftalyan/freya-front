<script setup lang="ts">
import SharedLanguageSwitcher from '~/components/shared/LanguageSwitcher.vue'
import SharedToastStack from "~/components/shared/ToastStack.vue";

const auth = useAuthStore()
const { t } = useLocale()

const links = [
  { to: '/', key: 'nav.home' },
  { to: '/services', key: 'nav.services' },
  { to: '/masters', key: 'nav.masters' },
  { to: '/booking', key: 'nav.booking' },
  { to: '/contacts', key: 'nav.contacts' },
]
</script>

<template>
  <div>
      <SharedToastStack />
    <header class="sticky top-0 z-40 border-b border-sand-100 bg-[var(--bg)]/85 backdrop-blur">
      <div class="container-shell flex h-16 items-center justify-between gap-4">
        <NuxtLink to="/" class="text-2xl font-semibold">Aurum</NuxtLink>
        <nav class="hidden items-center gap-5 md:flex">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="text-sm text-sand-900 transition hover:text-sand-600"
          >
            {{ t(link.key) }}
          </NuxtLink>
        </nav>
        <div class="flex items-center gap-2">
          <SharedLanguageSwitcher />
          <NuxtLink :to="auth.isAuth ? '/account/appointments' : '/account/login'">
            <BaseButton variant="secondary" size="sm">{{ auth.isAuth ? t('nav.myAppointments') : t('nav.login') }}</BaseButton>
          </NuxtLink>
          <NuxtLink to="/booking"><BaseButton size="sm">{{ t('nav.bookNow') }}</BaseButton></NuxtLink>
        </div>
      </div>
    </header>

    <main>
      <slot />
    </main>

    <footer class="mt-12 border-t border-sand-200 py-10">
      <div class="container-shell flex flex-col gap-3 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>© {{ new Date().getFullYear() }} Aurum Beauty Salon</p>
        <div class="flex gap-4">
          <NuxtLink to="/contacts" class="hover:text-sand-800">{{ t('nav.contacts') }}</NuxtLink>
          <NuxtLink to="/booking" class="hover:text-sand-800">{{ t('nav.bookNow') }}</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>
