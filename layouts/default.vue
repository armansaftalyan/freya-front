<script setup lang="ts">
import SharedLanguageSwitcher from '~/components/shared/LanguageSwitcher.vue'
import SharedCartBadge from '~/components/shared/CartBadge.vue'
import SharedToastStack from "~/components/shared/ToastStack.vue";
import PaymentMethodIcons from '~/components/layout/PaymentMethodIcons.vue'
import MobileBottomNav from '~/components/layout/MobileBottomNav.vue'

const auth = useAuthStore()
const { t, locale, locales } = useLocale()
const route = useRoute()
const { brand, authLoginPath, authProfilePath, contactsPath, legalPath, privacyPolicyPath, blogPath, rootPath } = useBrandContext()
const { salonName, torSalonName, telephone, email, address, sameAs, siteUrl, logoUrl, defaultImageUrl } = useSiteMeta()
const isMobileMenuOpen = ref(false)
const isMoreMenuOpen = ref(false)
const moreMenuRef = ref<HTMLElement | null>(null)
const { localePath } = useLocalizedPath()
const localizedPath = computed(() => withLocalePath(stripLocalePrefix(route.path), normalizeLocale(locale.value)))
const canonicalUrl = computed(() => `${siteUrl.value}${localizedPath.value}`)
const brandName = computed(() => brand.value === 'tor' ? torSalonName : salonName)
const showMobileBottomNav = computed(() => {
  const normalizedPath = stripLocalePrefix(route.path)
  return normalizedPath !== '/booking' && normalizedPath !== '/tor/booking'
})
const allPagesPath = computed(() => `${rootPath.value}/all-pages`)
const alternateLinks = computed(() => locales.map(item => ({
  rel: 'alternate',
  hreflang: item.code,
  href: `${siteUrl.value}${withLocalePath(stripLocalePrefix(route.path), item.code)}`,
})))
const bookingCta = computed(() => locale.value === 'hy' ? 'Ամրագրել' : t('nav.bookNow'))
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
const moreLabel = computed(() => {
  if (locale.value === 'ru') return 'Еще'
  if (locale.value === 'en') return 'More'
  return 'Ավելին'
})
const siteNavigationItems = computed(() => [
  { name: t('nav.home'), url: `${siteUrl.value}${withLocalePath('/', locale.value)}` },
  { name: blogLabel.value, url: `${siteUrl.value}${withLocalePath('/blog', locale.value)}` },
  { name: t('nav.services'), url: `${siteUrl.value}${withLocalePath('/services', locale.value)}` },
  { name: t('nav.products'), url: `${siteUrl.value}${withLocalePath('/products', locale.value)}` },
  { name: t('nav.masters'), url: `${siteUrl.value}${withLocalePath('/masters', locale.value)}` },
  { name: t('nav.giftCards'), url: `${siteUrl.value}${withLocalePath('/gift-cards/buy', locale.value)}` },
  { name: t('nav.booking'), url: `${siteUrl.value}${withLocalePath('/booking', locale.value)}` },
  { name: t('nav.contacts'), url: `${siteUrl.value}${withLocalePath(contactsPath.value, locale.value)}` },
])
const navLinkClass = computed(() => 'whitespace-nowrap text-[15px] font-medium text-sand-900 transition hover:text-sand-600 xl:text-base')
const titleTemplate = (title?: string | null) => {
  const baseTitle = brandName.value

  if (!title) {
    return baseTitle
  }else if (title.length < 41){
      return title.toLowerCase().includes(baseTitle.toLowerCase()) ? title : `${title} | ${baseTitle}`
  }
  return title
}

const links: Array<{ to: string; key: string; label?: string }> = [
  { to: '/services', key: 'nav.services' },
  { to: '/products', key: 'nav.products' },
  { to: '/masters', key: 'nav.masters' },
  { to: '/gift-cards/buy', key: 'nav.giftCards' },
]

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
  htmlAttrs: {
    lang: locale.value,
  },
  titleTemplate,
  link: [
    { rel: 'canonical', href: canonicalUrl.value },
    ...alternateLinks.value,
    { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl.value}${withLocalePath(stripLocalePrefix(route.path), defaultLocale)}` },
  ],
  meta: [
    { property: 'og:url', content: canonicalUrl.value },
    { property: 'og:site_name', content: brandName.value },
    { name: 'yandex-verification', content: '80a17421b9f1f3e7' },
  ],
  script: [
    {
      key: 'site-structured-data',
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': brand.value === 'tor' ? 'Barbershop' : 'BeautySalon',
            '@id': `${siteUrl.value}${rootPath.value}#salon`,
            name: brandName.value,
            url: siteUrl.value,
            image: defaultImageUrl.value,
            logo: logoUrl.value,
            telephone,
            email,
            priceRange: '$$',
            address,
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 40.1776,
              longitude: 44.5126,
            },
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                  'Sunday',
                ],
                opens: '10:00',
                closes: '19:00',
              },
            ],
            sameAs,
          },
          {
            '@type': 'WebSite',
            '@id': `${siteUrl.value}${rootPath.value}#website`,
            url: siteUrl.value,
            name: brandName.value,
            inLanguage: locale.value,
            publisher: {
              '@id': `${siteUrl.value}${rootPath.value}#salon`,
            },
          },
          ...siteNavigationItems.value.map((item, index) => ({
            '@type': 'SiteNavigationElement',
            '@id': `${siteUrl.value}#nav-${index + 1}`,
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
    class="flex min-h-screen flex-col"
    :class="[
      { 'locale-hy': locale === 'hy' },
      showMobileBottomNav ? 'pb-[calc(4.65rem+env(safe-area-inset-bottom))] lg:pb-0' : '',
    ]"
  >
    <SharedToastStack />
    <header class="sticky top-0 z-40 border-b border-sand-100 bg-[var(--bg)]/85 backdrop-blur">
      <div class="container-shell flex min-h-16 items-center justify-between gap-2 py-2">
        <div class="flex shrink-0 items-center gap-2">
          <NuxtLink :to="localePath('/')" class="inline-flex items-center">
            <img src="/logo.svg" alt="Freya Beauty Salon" width="48" height="48" decoding="async" class="h-11 w-11 rounded-full object-cover sm:h-12 sm:w-12">
          </NuxtLink>
          <NuxtLink :to="localePath('/tor')" class="inline-flex items-center rounded-full border border-sand-200/80 bg-white/80 p-1.5 shadow-sm transition hover:border-sand-300 hover:bg-white lg:hidden">
            <img src="/tor-logo-96.jpg" alt="Tor Barbershop" width="28" height="28" decoding="async" class="h-7 w-7 rounded-full object-cover">
          </NuxtLink>
        </div>

        <nav class="hidden min-w-0 items-center gap-4 lg:flex xl:gap-5">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="localePath(link.to)"
            :class="navLinkClass"
          >
            {{ link.label || t(link.key) }}
          </NuxtLink>

          <div ref="moreMenuRef" class="relative">
            <button
              type="button"
              :class="navLinkClass"
              class="inline-flex items-center gap-1"
              @click="isMoreMenuOpen = !isMoreMenuOpen"
            >
              <span>{{ moreLabel }}</span>
              <span class="text-xs">▾</span>
            </button>

            <div
              v-if="isMoreMenuOpen"
              class="absolute right-0 top-full z-50 mt-3 min-w-[180px] rounded-2xl border border-sand-200 bg-white p-2 shadow-soft"
            >
              <NuxtLink
                :to="localePath('/tor')"
                class="block rounded-xl px-4 py-3 text-sm font-medium text-sand-900 transition hover:bg-sand-50"
                @click="isMoreMenuOpen = false"
              >
                TOR
              </NuxtLink>
              <NuxtLink
                :to="localePath(blogPath)"
                class="block rounded-xl px-4 py-3 text-sm font-medium text-sand-900 transition hover:bg-sand-50"
                @click="isMoreMenuOpen = false"
              >
                {{ blogLabel }}
              </NuxtLink>
              <NuxtLink
                :to="localePath(contactsPath)"
                class="block rounded-xl px-4 py-3 text-sm font-medium text-sand-900 transition hover:bg-sand-50"
                @click="isMoreMenuOpen = false"
              >
                {{ t('nav.contacts') }}
              </NuxtLink>
            </div>
          </div>
        </nav>

        <div class="hidden shrink-0 items-center gap-2 lg:flex">
          <SharedLanguageSwitcher />
          <NuxtLink :to="localePath('/booking')">
            <BaseButton size="sm">{{ bookingCta }}</BaseButton>
          </NuxtLink>
          <SharedCartBadge />
          <NuxtLink :to="localePath(auth.isAuth ? authProfilePath : authLoginPath)">
            <BaseButton variant="secondary" size="sm">{{ auth.isAuth ? t('nav.myProfile') : t('nav.login') }}</BaseButton>
          </NuxtLink>
        </div>

        <div class="flex shrink-0 items-center gap-2 lg:hidden">
          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-sand-200 bg-white text-sand-900"
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
          class="absolute left-0 right-0 top-full z-50 border-b border-t border-sand-200 bg-[var(--bg)] shadow-soft lg:hidden"
        >
          <div class="container-shell space-y-4 py-4">
            <nav class="grid gap-2">
              <NuxtLink
                v-for="link in links"
                :key="link.to"
                :to="localePath(link.to)"
                class="rounded-xl bg-white px-4 py-3 text-sm font-medium text-sand-900 shadow-soft"
              >
                {{ link.label || t(link.key) }}
              </NuxtLink>
              <NuxtLink
                :to="localePath('/tor')"
                class="rounded-xl bg-white px-4 py-3 text-sm font-medium text-sand-900 shadow-soft"
              >
                TOR
              </NuxtLink>
              <NuxtLink
                :to="localePath(blogPath)"
                class="rounded-xl bg-white px-4 py-3 text-sm font-medium text-sand-900 shadow-soft"
              >
                {{ blogLabel }}
              </NuxtLink>
            </nav>

            <div class="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
              <SharedLanguageSwitcher />
              <NuxtLink :to="localePath('/booking')" class="flex-1">
                <BaseButton size="sm" block>
                  {{ bookingCta }}
                </BaseButton>
              </NuxtLink>
              <NuxtLink :to="localePath('/cart')" class="flex-1">
                <BaseButton variant="secondary" size="sm" block>
                  {{ t('nav.cart') }}
                </BaseButton>
              </NuxtLink>
              <NuxtLink :to="localePath(auth.isAuth ? authProfilePath : authLoginPath)" class="flex-1">
                <BaseButton variant="secondary" size="sm" block>
                  {{ auth.isAuth ? t('nav.myProfile') : t('nav.login') }}
                </BaseButton>
              </NuxtLink>
            </div>
          </div>
        </div>
      </Transition>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="overflow-x-clip border-t border-sand-200 py-8">
      <div class="container-shell min-w-0 flex flex-col gap-4 text-sm text-[var(--muted)]">
        <PaymentMethodIcons />

        <div class="rounded-2xl border border-sand-200 bg-sand-50/70 p-4 text-sand-900">
          <h3 class="text-base font-semibold">{{ brandName }}</h3>
          <p class="mt-1">21 Azatutyan, Yerevan, Armenia</p>
          <p class="mt-1">
            <a href="tel:+37444733773" class="hover:text-sand-700">+374 44 733773</a>
          </p>
          <p class="mt-1">Daily: 10:00-19:00</p>
        </div>

        <div class="min-w-0 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p class="min-w-0 shrink-0">© {{ new Date().getFullYear() }} {{ brandName }}</p>
        <div class="grid min-w-0 grid-cols-2 gap-x-4 gap-y-2 sm:flex sm:flex-wrap sm:justify-end">
          <NuxtLink :to="localePath(blogPath)" class="min-w-0 break-words hover:text-sand-800 sm:whitespace-nowrap">{{ blogLabel }}</NuxtLink>
          <NuxtLink :to="localePath(contactsPath)" class="min-w-0 break-words hover:text-sand-800 sm:whitespace-nowrap">{{ t('nav.contacts') }}</NuxtLink>
          <NuxtLink :to="localePath(legalPath)" class="min-w-0 break-words hover:text-sand-800 sm:whitespace-nowrap">{{ legalLabel }}</NuxtLink>
          <NuxtLink :to="localePath(privacyPolicyPath)" class="min-w-0 break-words hover:text-sand-800 sm:whitespace-nowrap">{{ privacyPolicyLabel }}</NuxtLink>
          <NuxtLink :to="localePath(allPagesPath)" class="min-w-0 break-words hover:text-sand-800 sm:whitespace-nowrap">{{ allPagesLabel }}</NuxtLink>
        </div>
        </div>
      </div>
    </footer>
    <MobileBottomNav v-if="showMobileBottomNav" />
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
