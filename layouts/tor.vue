<script setup lang="ts">
import SharedLanguageSwitcher from '~/components/shared/LanguageSwitcher.vue'
import SharedCartBadge from '~/components/shared/CartBadge.vue'
import SharedToastStack from '~/components/shared/ToastStack.vue'
import PwaInstallButton from '~/components/shared/PwaInstallButton.vue'
import PaymentMethodIcons from '~/components/layout/PaymentMethodIcons.vue'
import MobileBottomNav from '~/components/layout/MobileBottomNav.vue'

const auth = useAuthStore()
const route = useRoute()
const { locale } = useLocale()
const isMobileMenuOpen = ref(false)
const isMoreMenuOpen = ref(false)
const moreMenuRef = ref<HTMLElement | null>(null)
const { localePath } = useLocalizedPath()
const { siteUrl, telephone, telephoneHref, whatsappUrl, telegramUrl, sameAs } = useSiteMeta()
const { rootPath, mastersPath, contactsPath, legalPath, privacyPolicyPath, giftCardsPath, authLoginPath, authProfilePath, blogPath } = useBrandContext()
const { canonicalUrl, alternates } = useLocalizedSeo(() => route.path)
const markdownAlternatePath = computed(() => {
  const normalizedPath = stripLocalePrefix(route.path)
  if (!/^\/tor(?:\/(?:services|products|masters|blog)(?:\/.*)?)?$/.test(normalizedPath)) {
    return null
  }

  return `/md${route.path.replace(/\/$/, '')}`
})
const torLogoUrl = computed(() => `${siteUrl.value}/tor-logo.jpg`)
const showMobileBottomNav = computed(() => {
  const normalizedPath = stripLocalePrefix(route.path)
  return normalizedPath !== '/booking' && normalizedPath !== '/tor/booking'
})

const navLinks = computed(() => [
  { to: `${rootPath.value}/services`, label: copy.value.services },
  { to: `${rootPath.value}/products`, label: copy.value.care },
  { to: mastersPath.value, label: locale.value === 'ru' ? 'Мастера' : locale.value === 'en' ? 'Masters' : 'Մասնագետներ' },
  { to: giftCardsPath.value, label: locale.value === 'ru' ? 'Подарочные карты' : locale.value === 'en' ? 'Gift Cards' : 'Նվեր քարտեր' },
])

const copy = computed(() => {
  if (locale.value === 'ru') {
      return {
        home: 'Freya Beauty',
        account: auth.isAuth ? 'Мой профиль' : 'Войти',
        cart: 'Корзина',
        services: 'Услуги',
      care: 'Товары',
      tagline: 'Точные стрижки, борода и уверенный уход.',
    }
  }

  if (locale.value === 'en') {
      return {
        home: 'Freya Beauty',
        account: auth.isAuth ? 'My profile' : 'Log in',
        cart: 'Cart',
        services: 'Services',
      care: 'Products',
      tagline: 'Craft cuts, beard work, sharp care.',
    }
  }

  return {
    home: 'Freya Beauty',
    account: auth.isAuth ? 'Իմ էջը' : 'Մուտք',
    cart: 'Զամբյուղ',
    services: 'Ծառայություններ',
    care: 'Ապրանքներ',
    tagline: 'Ճշգրիտ սանրվածք, մորուք և վստահ խնամք։',
  }
})

const privacyPolicyLabel = computed(() => {
  if (locale.value === 'ru') return 'Политика конфиденциальности'
  if (locale.value === 'en') return 'Privacy Policy'
  return 'Գաղտնիության քաղաքականություն'
})
const legalLabel = computed(() => {
  if (locale.value === 'ru') return 'Условия и политики'
  if (locale.value === 'en') return 'Terms and Policies'
  return 'Պայմաններ և քաղաքականություններ'
})
const allPagesLabel = computed(() => {
  if (locale.value === 'ru') return 'Карта сайта'
  if (locale.value === 'en') return 'All Pages'
  return 'Կայքի քարտեզ'
})
const blogLabel = computed(() => {
  if (locale.value === 'ru') return 'Блог'
  if (locale.value === 'en') return 'Blog'
  return 'Բլոգ'
})
const freyaLabel = computed(() => 'Freya Beauty')
const moreLabel = computed(() => {
  if (locale.value === 'ru') return 'Еще'
  if (locale.value === 'en') return 'More'
  return 'Ավելին'
})
const siteNavigationItems = computed(() => [
  { name: locale.value === 'ru' ? 'Tor' : locale.value === 'en' ? 'Tor' : 'Tor', url: `${siteUrl.value}${localePath('/tor')}` },
  { name: blogLabel.value, url: `${siteUrl.value}${localePath('/tor/blog')}` },
  { name: copy.value.services, url: `${siteUrl.value}${localePath('/tor/services')}` },
  { name: copy.value.care, url: `${siteUrl.value}${localePath('/tor/products')}` },
  { name: locale.value === 'ru' ? 'Мастера' : locale.value === 'en' ? 'Masters' : 'Մասնագետներ', url: `${siteUrl.value}${localePath(mastersPath.value)}` },
  { name: locale.value === 'ru' ? 'Подарочные карты' : locale.value === 'en' ? 'Gift Cards' : 'Նվեր քարտեր', url: `${siteUrl.value}${localePath(giftCardsPath.value)}` },
  { name: locale.value === 'ru' ? 'Записаться' : locale.value === 'en' ? 'Book now' : 'Ամրագրել', url: `${siteUrl.value}${localePath('/tor/booking')}` },
  { name: locale.value === 'ru' ? 'Контакты' : locale.value === 'en' ? 'Contacts' : 'Կոնտակտներ', url: `${siteUrl.value}${localePath(contactsPath.value)}` },
])
const titleTemplate = (title?: string | null) => {
  const baseTitle = 'Tor Barbershop'

  if (!title) {
    return baseTitle
  }

  return /\bTor\b/i.test(title) ? title : `${title} | ${baseTitle}`
}

watch(
  () => route.fullPath,
  () => {
    isMobileMenuOpen.value = false
    isMoreMenuOpen.value = false
  },
)

onMounted(() => {
  const handlePointerDown = (event: PointerEvent) => {
    if (!isMoreMenuOpen.value) return

    const target = event.target as Node | null

    if (target && moreMenuRef.value?.contains(target)) {
      return
    }

    isMoreMenuOpen.value = false
  }

  document.addEventListener('pointerdown', handlePointerDown)

  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handlePointerDown)
  })
})

useHead(() => ({
  bodyAttrs: {
    class: 'tor-theme',
  },
  titleTemplate,
  link: [
    { rel: 'canonical', href: canonicalUrl.value },
    ...alternates.value.map((item) => ({ rel: 'alternate', hreflang: item.locale, href: item.href })),
    { rel: 'alternate', hreflang: 'x-default', href: alternates.value.find((item) => item.locale === 'hy')?.href || canonicalUrl.value },
    ...(markdownAlternatePath.value
      ? [{ key: 'markdown-alternate', rel: 'alternate', type: 'text/markdown', href: markdownAlternatePath.value }]
      : []),
    { key: 'app-manifest', rel: 'manifest', href: '/tor.webmanifest?v=1' },
    { key: 'app-icon-png', rel: 'icon', type: 'image/png', href: '/tor-favicon-96x96.png?v=1', sizes: '96x96' },
    { key: 'app-icon-svg', rel: 'icon', type: 'image/png', href: '/tor-favicon-96x96.png?v=1', sizes: '96x96' },
    { key: 'app-shortcut-icon', rel: 'shortcut icon', href: '/tor-favicon-96x96.png?v=1' },
    { key: 'app-apple-touch-icon', rel: 'apple-touch-icon', sizes: '180x180', href: '/tor-apple-touch-icon.png?v=1' },
  ],
  meta: [
    { property: 'og:url', content: canonicalUrl.value },
    { property: 'og:site_name', content: 'Tor Barbershop' },
    { property: 'og:image', content: torLogoUrl.value },
    { property: 'twitter:image', content: torLogoUrl.value },
    { name: 'theme-color', content: '#0b0b0b' },
    { key: 'app-mobile-title', name: 'apple-mobile-web-app-title', content: 'Tor' },
    { name: 'application-name', content: 'Tor Barbershop' },
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
            image: torLogoUrl.value,
            logo: torLogoUrl.value,
            sameAs,
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
          ...siteNavigationItems.value.map((item, index) => ({
            '@type': 'SiteNavigationElement',
            '@id': `${siteUrl.value}/tor#nav-${index + 1}`,
            name: item.name,
            url: item.url,
          })),
        ],
      }),
    },
  ],
}))
</script>

<template>
  <div
    class="tor-shell flex min-h-screen flex-col"
    :class="[
      { 'locale-hy': locale === 'hy' },
      showMobileBottomNav ? 'pb-[calc(4.65rem+env(safe-area-inset-bottom))] lg:pb-0' : '',
    ]"
  >
    <SharedToastStack />

    <header class="sticky top-0 z-40 border-b border-white/10 bg-[#0b0b0b]/90 backdrop-blur">
      <div class="container-shell flex min-h-16 items-center justify-between gap-4 py-3">
        <div class="flex shrink-0 items-center gap-2">
          <NuxtLink :to="localePath('/tor')" class="inline-flex items-center gap-3">
            <img src="/tor-logo-96.jpg" alt="Tor Barbershop" width="48" height="48" decoding="async" class="h-12 w-12 rounded-full border border-[#c58a3a]/40 object-cover shadow-[0_0_0_4px_rgba(197,138,58,0.08)]">
          </NuxtLink>
          <NuxtLink :to="localePath('/')" class="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] p-1.5 transition hover:border-white/20 hover:bg-white/[0.1] lg:hidden">
            <img src="/logo.svg" alt="Freya Beauty Salon" width="28" height="28" decoding="async" class="h-7 w-7 rounded-full bg-white object-cover p-0.5">
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

          <div ref="moreMenuRef" class="relative">
            <button
              type="button"
              class="tor-nav-link inline-flex items-center gap-1"
              @click="isMoreMenuOpen = !isMoreMenuOpen"
            >
              <span>{{ moreLabel }}</span>
              <span class="text-xs">▾</span>
            </button>

            <div
              v-if="isMoreMenuOpen"
              class="absolute right-0 top-full z-50 mt-3 min-w-[180px] rounded-2xl border border-white/10 bg-[#111111] p-2 shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
            >
              <NuxtLink
                :to="localePath('/')"
                class="block rounded-xl px-4 py-3 text-sm font-medium text-stone-100 transition hover:bg-white/[0.06]"
                @click="isMoreMenuOpen = false"
              >
                {{ freyaLabel }}
              </NuxtLink>
              <NuxtLink
                :to="localePath(blogPath)"
                class="block rounded-xl px-4 py-3 text-sm font-medium text-stone-100 transition hover:bg-white/[0.06]"
                @click="isMoreMenuOpen = false"
              >
                {{ blogLabel }}
              </NuxtLink>
              <NuxtLink
                :to="localePath(contactsPath)"
                class="block rounded-xl px-4 py-3 text-sm font-medium text-stone-100 transition hover:bg-white/[0.06]"
                @click="isMoreMenuOpen = false"
              >
                {{ locale === 'ru' ? 'Контакты' : locale === 'en' ? 'Contacts' : 'Կոնտակտներ' }}
              </NuxtLink>
            </div>
          </div>
        </nav>

        <div class="hidden items-center gap-1.5 lg:flex">
          <SharedLanguageSwitcher theme="dark" compact />
          <NuxtLink :to="localePath('/tor/booking')">
            <BaseButton size="sm" theme="tor">{{ locale === 'ru' ? 'Записаться' : locale === 'en' ? 'Book now' : 'Ամրագրել' }}</BaseButton>
          </NuxtLink>
          <SharedCartBadge theme="dark" />
          <NuxtLink :to="localePath(auth.isAuth ? authProfilePath : authLoginPath)">
            <BaseButton variant="secondary" theme="tor" size="sm">{{ copy.account }}</BaseButton>
          </NuxtLink>
        </div>

        <div class="flex shrink-0 items-center gap-2 lg:hidden">
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
          class="absolute left-0 right-0 top-full z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-t border-white/10 bg-[#0b0b0b] shadow-[0_18px_45px_rgba(0,0,0,0.35)] lg:hidden"
        >
          <div
            class="container-shell space-y-4 pt-4"
            :class="showMobileBottomNav ? 'pb-[calc(5.5rem+env(safe-area-inset-bottom))]' : 'pb-4'"
          >
            <nav class="grid gap-2">
              <NuxtLink
                v-for="link in navLinks"
                :key="link.to"
                :to="localePath(link.to)"
                class="tor-drawer-link"
              >
                {{ link.label }}
              </NuxtLink>
              <NuxtLink
                :to="localePath(blogPath)"
                class="tor-drawer-link"
              >
                {{ blogLabel }}
              </NuxtLink>
              <NuxtLink
                :to="localePath('/')"
                class="tor-drawer-link"
              >
                {{ freyaLabel }}
              </NuxtLink>
            </nav>

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
              <SharedLanguageSwitcher theme="dark" compact />
              <PwaInstallButton theme="tor" block />
              <NuxtLink :to="localePath('/tor/cart')" class="sm:flex-1">
                <BaseButton variant="secondary" theme="tor" size="sm" block>{{ copy.cart }}</BaseButton>
              </NuxtLink>
              <NuxtLink :to="localePath(auth.isAuth ? authProfilePath : authLoginPath)" class="sm:flex-1">
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

    <footer class="overflow-x-clip border-t border-white/10 bg-black py-8">
      <div class="container-shell min-w-0 flex flex-col gap-4 text-sm text-stone-400">
        <PaymentMethodIcons dark />

        <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-stone-200">
          <h3 class="text-base font-semibold">Tor Barbershop</h3>
          <p class="mt-1">21 Azatutyan, Yerevan, Armenia</p>
          <p class="mt-1">
            <a :href="telephoneHref" class="transition hover:text-[#d79a49]">{{ telephone }}</a>
          </p>
          <div class="mt-2 flex flex-wrap gap-3">
            <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer" class="transition hover:text-[#d79a49]">WhatsApp</a>
            <a :href="telegramUrl" target="_blank" rel="noopener noreferrer" class="transition hover:text-[#d79a49]">Telegram</a>
          </div>
          <p class="mt-1">Daily: 10:00-19:00</p>
        </div>

        <div class="min-w-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="min-w-0">
            <p class="font-semibold uppercase tracking-[0.22em] text-stone-200">© {{ new Date().getFullYear() }} Tor Barbershop</p>
            <p class="mt-1">{{ copy.tagline }}</p>
          </div>
          <div class="grid min-w-0 grid-cols-2 gap-x-4 gap-y-2 sm:flex sm:flex-wrap sm:justify-end">
            <NuxtLink :to="localePath(blogPath)" class="min-w-0 break-words transition hover:text-[#d79a49] sm:whitespace-nowrap">{{ blogLabel }}</NuxtLink>
            <NuxtLink :to="localePath(contactsPath)" class="min-w-0 break-words transition hover:text-[#d79a49] sm:whitespace-nowrap">{{ locale === 'ru' ? 'Контакты' : locale === 'en' ? 'Contacts' : 'Կոնտակտներ' }}</NuxtLink>
            <NuxtLink :to="localePath(legalPath)" class="min-w-0 break-words transition hover:text-[#d79a49] sm:whitespace-nowrap">{{ legalLabel }}</NuxtLink>
            <NuxtLink :to="localePath(privacyPolicyPath)" class="min-w-0 break-words transition hover:text-[#d79a49] sm:whitespace-nowrap">{{ privacyPolicyLabel }}</NuxtLink>
            <NuxtLink :to="localePath('/tor/all-pages')" class="min-w-0 break-words transition hover:text-[#d79a49] sm:whitespace-nowrap">{{ allPagesLabel }}</NuxtLink>
          </div>
        </div>
      </div>
    </footer>
    <MobileBottomNav v-if="showMobileBottomNav" />
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
