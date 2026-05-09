<script setup lang="ts">
const cart = useCartStore()
const route = useRoute()
const { t, locale } = useLocale()
const { localePath } = useLocalizedPath()
const { brand, isTor, servicesPath, productsPath, bookingPath, mastersPath } = useBrandContext()

const mastersLabel = computed(() => locale.value === 'ru' ? 'Мастера' : locale.value === 'en' ? 'Masters' : 'Մասնագետներ')

const items = computed(() => [
  {
    key: 'services',
    label: t('nav.services'),
    to: servicesPath.value,
    icon: 'services',
  },
  {
    key: 'products',
    label: t('nav.products'),
    to: productsPath.value,
    icon: 'products',
  },
  {
    key: 'booking',
    label: locale.value === 'hy' ? 'Ամրագրել' : t('nav.bookNow'),
    to: bookingPath.value,
    icon: 'booking',
    primary: true,
  },
  {
    key: 'cart',
    label: t('nav.cart'),
    to: brand.value === 'tor' ? '/tor/cart' : '/cart',
    icon: 'cart',
    badge: cart.itemsCount,
  },
  {
    key: 'masters',
    label: mastersLabel.value,
    to: mastersPath.value,
    icon: 'masters',
  },
])

const isActive = (path: string) => {
  const normalizedCurrent = stripLocalePrefix(route.path)
  const normalizedTarget = stripLocalePrefix(path)

  if (normalizedTarget === '/' || normalizedTarget === '/tor') {
    return normalizedCurrent === normalizedTarget
  }

  return normalizedCurrent === normalizedTarget || normalizedCurrent.startsWith(`${normalizedTarget}/`)
}
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-50 border-t px-2 pb-[calc(0.45rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-18px_45px_rgba(56,38,20,0.14)] backdrop-blur-xl lg:hidden"
    :class="isTor ? 'border-white/10 bg-[#090909]/92 shadow-[0_-18px_45px_rgba(0,0,0,0.4)]' : 'border-sand-200/80 bg-[#fffaf2]/94'"
    aria-label="Mobile primary navigation"
  >
    <div class="mx-auto grid max-w-md grid-cols-5 items-end gap-1">
      <NuxtLink
        v-for="item in items"
        :key="item.key"
        :to="localePath(item.to)"
        class="relative flex min-h-[3.5rem] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-center text-[10px] font-semibold leading-none transition"
        :class="[
          item.primary
            ? isTor
              ? 'bg-[#d79a49] text-black shadow-[0_10px_24px_rgba(215,154,73,0.24)]'
              : 'bg-sand-900 text-white shadow-[0_10px_24px_rgba(122,95,63,0.22)]'
            : isActive(item.to)
              ? isTor
                ? 'bg-white/[0.09] text-[#d79a49]'
                : 'bg-white text-sand-900 shadow-sm'
              : isTor
                ? 'text-stone-400 hover:bg-white/[0.06] hover:text-stone-100'
                : 'text-sand-600 hover:bg-white/80 hover:text-sand-900',
        ]"
        :aria-current="isActive(item.to) ? 'page' : undefined"
      >
        <span class="relative inline-flex h-5 w-5 items-center justify-center">
          <svg v-if="item.icon === 'services'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h10" />
          </svg>
          <svg v-else-if="item.icon === 'products'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 8h12l-1 12H7L6 8Z" />
            <path d="M9 8a3 3 0 0 1 6 0" />
          </svg>
          <svg v-else-if="item.icon === 'booking'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 4v3" />
            <path d="M17 4v3" />
            <path d="M5 8h14" />
            <rect x="4" y="6" width="16" height="14" rx="3" />
            <path d="m9 14 2 2 4-5" />
          </svg>
          <svg v-else-if="item.icon === 'cart'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
            <path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H7.4" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M6 21a6 6 0 0 1 12 0" />
            <path d="M17 8a3 3 0 0 1 3 3" />
            <path d="M4 11a3 3 0 0 1 3-3" />
          </svg>

          <span
            v-if="item.badge !== undefined"
            class="absolute -right-2 -top-2 inline-flex min-w-[1.1rem] items-center justify-center rounded-full px-1 py-0.5 text-[9px] font-bold leading-none"
            :class="isTor ? 'bg-[#d79a49] text-black' : 'bg-sand-900 text-white'"
          >
            {{ item.badge }}
          </span>
        </span>
        <span class="max-w-full truncate">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
