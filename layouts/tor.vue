<script setup lang="ts">
import SharedLanguageSwitcher from '~/components/shared/LanguageSwitcher.vue'
import SharedCartBadge from '~/components/shared/CartBadge.vue'
import SharedToastStack from '~/components/shared/ToastStack.vue'

const auth = useAuthStore()
const route = useRoute()
const { locale } = useLocale()
const isMobileMenuOpen = ref(false)
const { localePath } = useLocalizedPath()
const { siteUrl, defaultImageUrl } = useSiteMeta()
const { rootPath, mastersPath, giftCardsPath, authLoginPath, authAppointmentsPath } = useBrandContext()
const isArmenian = computed(() => locale.value === 'hy')
const { canonicalUrl, alternates } = useLocalizedSeo(() => route.path)

const navLinks = computed(() => [
  { to: `${rootPath.value}/services`, label: copy.value.services },
  { to: `${rootPath.value}/products`, label: copy.value.care },
  { to: mastersPath.value, label: locale.value === 'ru' ? 'Мастера' : locale.value === 'en' ? 'Masters' : 'Մասնագետներ' },
  { to: giftCardsPath.value, label: locale.value === 'ru' ? 'Подарочные карты' : locale.value === 'en' ? 'Gift Cards' : 'Նվեր քարտեր' },
  { to: '/', label: copy.value.home },
])

const copy = computed(() => {
  if (locale.value === 'ru') {
      return {
        home: 'Freya Beauty',
        account: auth.isAuth ? 'Мой профиль' : 'Войти',
        cart: 'Корзина',
        services: 'Услуги',
      care: 'Уход',
      tagline: 'Точные стрижки, борода и уверенный уход.',
    }
  }

  if (locale.value === 'en') {
      return {
        home: 'Freya Beauty',
        account: auth.isAuth ? 'My profile' : 'Log in',
        cart: 'Cart',
        services: 'Services',
      care: 'Care',
      tagline: 'Craft cuts, beard work, sharp care.',
    }
  }

  return {
    home: 'Freya Beauty',
    account: auth.isAuth ? 'Իմ էջը' : 'Մուտք',
    cart: 'Զամբյուղ',
    services: 'Ծառայություններ',
    care: 'Խնամք',
    tagline: 'Ճշգրիտ սանրվածք, մորուք և վստահ խնամք։',
  }
})

watch(
  () => route.fullPath,
  () => {
    isMobileMenuOpen.value = false
  },
)

useHead(() => ({
  bodyAttrs: {
    class: 'tor-theme',
  },
  link: [
    { rel: 'canonical', href: canonicalUrl.value },
    ...alternates.value.map((item) => ({ rel: 'alternate', hreflang: item.locale, href: item.href })),
    { rel: 'alternate', hreflang: 'x-default', href: alternates.value.find((item) => item.locale === 'hy')?.href || canonicalUrl.value },
    { rel: 'icon', type: 'image/png', href: '/tor-favicon-96x96.png?v=1', sizes: '96x96' },
    { rel: 'shortcut icon', href: '/tor-favicon-96x96.png?v=1' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/tor-apple-touch-icon.png?v=1' },
  ],
  meta: [
    { property: 'og:url', content: canonicalUrl.value },
    { property: 'og:site_name', content: 'Tor Barbershop' },
  ],
  script: [
    {
      key: 'tor-site-structured-data',
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Barbershop',
            '@id': `${siteUrl.value}/tor#barbershop`,
            name: 'Tor Barbershop',
            url: `${siteUrl.value}/tor`,
            image: defaultImageUrl.value,
            sameAs: ['https://t.me/freyabeauty'],
          },
          {
            '@type': 'WebSite',
            '@id': `${siteUrl.value}/tor#website`,
            url: `${siteUrl.value}/tor`,
            name: 'Tor Barbershop',
            inLanguage: locale.value,
            publisher: {
              '@id': `${siteUrl.value}/tor#barbershop`,
            },
          },
        ],
      }),
    },
  ],
}))
</script>

<template>
  <div class="tor-shell flex min-h-screen flex-col" :class="{ 'locale-hy': isArmenian }">
    <SharedToastStack />

    <header class="sticky top-0 z-40 border-b border-white/10 bg-[#0b0b0b]/90 backdrop-blur">
      <div class="container-shell flex min-h-16 items-center justify-between gap-4 py-3">
        <div class="flex shrink-0 items-center gap-2">
          <NuxtLink :to="localePath('/tor')" class="inline-flex items-center gap-3">
            <img src="/tor-logo.jpg" alt="Tor Barbershop" class="h-12 w-12 rounded-full border border-[#c58a3a]/40 object-cover shadow-[0_0_0_4px_rgba(197,138,58,0.08)]">
          </NuxtLink>
          <NuxtLink :to="localePath('/')" class="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] p-1.5 transition hover:border-white/20 hover:bg-white/[0.1] lg:hidden">
            <img src="/logo.svg" alt="Freya Beauty Salon" class="h-7 w-7 rounded-full bg-white object-cover p-0.5">
          </NuxtLink>
        </div>

        <nav class="hidden items-center gap-3 lg:flex xl:gap-4">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="localePath(link.to)"
            class="tor-nav-link"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <div class="hidden items-center gap-1.5 lg:flex">
          <SharedLanguageSwitcher theme="dark" />
          <NuxtLink :to="localePath('/tor/booking')">
            <BaseButton size="sm" theme="tor">{{ locale === 'ru' ? 'Записаться' : locale === 'en' ? 'Book now' : 'Ամրագրել' }}</BaseButton>
          </NuxtLink>
          <SharedCartBadge theme="dark" />
          <NuxtLink :to="localePath(auth.isAuth ? authAppointmentsPath : authLoginPath)">
            <BaseButton variant="secondary" theme="tor" size="sm">{{ copy.account }}</BaseButton>
          </NuxtLink>
        </div>

        <div class="flex shrink-0 items-center gap-2 lg:hidden">
          <SharedCartBadge theme="dark" compact />
          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-stone-100"
            :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
            @click.stop="isMobileMenuOpen = !isMobileMenuOpen"
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
          class="absolute left-0 right-0 top-full z-50 border-b border-t border-white/10 bg-[#0b0b0b] shadow-[0_18px_45px_rgba(0,0,0,0.35)] lg:hidden"
        >
          <div class="container-shell space-y-4 py-4">
            <nav class="grid gap-2">
              <NuxtLink
                v-for="link in navLinks"
                :key="link.to"
                :to="localePath(link.to)"
                class="tor-drawer-link"
              >
                {{ link.label }}
              </NuxtLink>
            </nav>

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
              <SharedLanguageSwitcher theme="dark" />
              <NuxtLink :to="localePath('/tor/booking')" class="sm:flex-1">
                <BaseButton size="sm" theme="tor" block>{{ locale === 'ru' ? 'Записаться' : locale === 'en' ? 'Book now' : 'Ամրագրել' }}</BaseButton>
              </NuxtLink>
              <NuxtLink :to="localePath('/tor/cart')" class="sm:flex-1">
                <BaseButton variant="secondary" theme="tor" size="sm" block>{{ copy.cart }}</BaseButton>
              </NuxtLink>
              <NuxtLink :to="localePath(auth.isAuth ? authAppointmentsPath : authLoginPath)" class="sm:flex-1">
                <BaseButton variant="secondary" theme="tor" size="sm" block>{{ copy.account }}</BaseButton>
              </NuxtLink>
            </div>
          </div>
        </div>
      </Transition>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-white/10 bg-black py-8">
      <div class="container-shell flex flex-col gap-4 text-sm text-stone-400">
        <div class="flex flex-wrap items-center gap-2">
          <img src="/payments/visa.svg" alt="Visa" class="h-8 w-auto rounded-lg border border-white/10 bg-white/[0.06] p-1">
          <img src="/payments/mastercard.svg" alt="Mastercard" class="h-8 w-auto rounded-lg border border-white/10 bg-white/[0.06] p-1">
          <img src="/payments/arca.svg" alt="ArCa" class="h-8 w-auto rounded-lg border border-white/10 bg-white/[0.06] p-1">
          <img src="/payments/idram.svg" alt="Idram" class="h-8 w-auto rounded-lg border border-white/10 bg-white/[0.06] p-1">
        </div>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="font-semibold uppercase tracking-[0.22em] text-stone-200">© {{ new Date().getFullYear() }} Tor Barbershop</p>
            <p class="mt-1">{{ copy.tagline }}</p>
          </div>
          <div class="flex gap-4">
            <NuxtLink :to="localePath(mastersPath)" class="transition hover:text-[#d79a49]">{{ locale === 'ru' ? 'Мастера' : locale === 'en' ? 'Masters' : 'Մասնագետներ' }}</NuxtLink>
            <NuxtLink :to="localePath('/tor/services')" class="transition hover:text-[#d79a49]">{{ copy.services }}</NuxtLink>
            <NuxtLink :to="localePath('/tor/products')" class="transition hover:text-[#d79a49]">{{ copy.care }}</NuxtLink>
            <NuxtLink :to="localePath(giftCardsPath)" class="transition hover:text-[#d79a49]">{{ locale === 'ru' ? 'Подарочные карты' : locale === 'en' ? 'Gift Cards' : 'Նվեր քարտեր' }}</NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.tor-shell {
  background:
    radial-gradient(circle at top right, rgba(197, 138, 58, 0.16), transparent 28%),
    radial-gradient(circle at bottom left, rgba(255, 255, 255, 0.08), transparent 22%),
    linear-gradient(180deg, #111111 0%, #090909 100%);
  color: #f5efe6;
  font-family: "Arial Narrow", "Helvetica Neue", sans-serif;
}

.tor-nav-link {
  color: #d6ccbe;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  white-space: nowrap;
  text-transform: uppercase;
  transition: color 0.16s ease;
}

:deep(.locale-hy) .tor-nav-link {
  font-size: 0.72rem;
  letter-spacing: 0.08em;
}

.tor-nav-link:hover {
  color: #ffffff;
}

.tor-mobile-link {
  white-space: nowrap;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  color: #f5efe6;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  padding: 0.55rem 0.9rem;
  text-transform: uppercase;
}

.tor-drawer-link {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.04);
  color: #f5efe6;
  font-size: 0.88rem;
  font-weight: 600;
  padding: 0.9rem 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
