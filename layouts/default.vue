<script setup lang="ts">
import SharedLanguageSwitcher from '~/components/shared/LanguageSwitcher.vue'
import SharedToastStack from "~/components/shared/ToastStack.vue";

const auth = useAuthStore()
const { t } = useLocale()
const route = useRoute()
const isMobileMenuOpen = ref(false)

const links = [
  { to: '/', key: 'nav.home' },
  { to: '/services', key: 'nav.services' },
  { to: '/masters', key: 'nav.masters' },
  { to: '/booking', key: 'nav.booking' },
  { to: '/contacts', key: 'nav.contacts' },
]

watch(
  () => route.fullPath,
  () => {
    isMobileMenuOpen.value = false
  },
)
</script>

<template>
  <div>
    <SharedToastStack />
    <header class="sticky top-0 z-40 border-b border-sand-100 bg-[var(--bg)]/85 backdrop-blur">
      <div class="container-shell flex h-16 items-center justify-between gap-4">
        <NuxtLink to="/" class="inline-flex items-center">
          <img src="/logo.svg" alt="Freya Beauty Salon" class="h-10 w-10 rounded-full object-cover sm:h-11 sm:w-11">
        </NuxtLink>

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

        <div class="hidden items-center gap-2 md:flex">
          <SharedLanguageSwitcher />
          <NuxtLink :to="auth.isAuth ? '/account/appointments' : '/account/login'">
            <BaseButton variant="secondary" size="sm">{{ auth.isAuth ? t('nav.myAppointments') : t('nav.login') }}</BaseButton>
          </NuxtLink>
          <NuxtLink to="/booking"><BaseButton size="sm">{{ t('nav.bookNow') }}</BaseButton></NuxtLink>
        </div>

        <div class="flex items-center gap-2 md:hidden">
          <NuxtLink to="/booking"><BaseButton size="sm">{{ t('nav.bookNow') }}</BaseButton></NuxtLink>
          <button
            class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-sand-200 bg-white text-sand-900"
            :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 4a1 1 0 100 2h12a1 1 0 100-2H4z" clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <Transition name="fade">
        <div
          v-if="isMobileMenuOpen"
          class="border-t border-sand-200 bg-[var(--bg)] md:hidden"
        >
          <div class="container-shell space-y-4 py-4">
            <nav class="grid gap-2">
              <NuxtLink
                v-for="link in links"
                :key="link.to"
                :to="link.to"
                class="rounded-xl bg-white px-4 py-3 text-sm font-medium text-sand-900 shadow-soft"
              >
                {{ t(link.key) }}
              </NuxtLink>
            </nav>

            <div class="flex items-center justify-between gap-3">
              <SharedLanguageSwitcher />
              <NuxtLink :to="auth.isAuth ? '/account/appointments' : '/account/login'" class="flex-1">
                <BaseButton variant="secondary" size="sm" block>
                  {{ auth.isAuth ? t('nav.myAppointments') : t('nav.login') }}
                </BaseButton>
              </NuxtLink>
            </div>
          </div>
        </div>
      </Transition>
    </header>

    <main>
      <slot />
    </main>

    <footer class="mt-12 border-t border-sand-200 py-10">
      <div class="container-shell flex flex-col gap-3 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>© {{ new Date().getFullYear() }} Freya Beauty Salon</p>
        <div class="flex gap-4">
          <NuxtLink to="/contacts" class="hover:text-sand-800">{{ t('nav.contacts') }}</NuxtLink>
          <NuxtLink to="/booking" class="hover:text-sand-800">{{ t('nav.bookNow') }}</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
