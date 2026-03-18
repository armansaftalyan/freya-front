<script setup lang="ts">
const props = withDefaults(defineProps<{
  theme?: 'light' | 'dark'
  compact?: boolean
}>(), {
  theme: 'light',
  compact: false,
})

const cart = useCartStore()
const { t } = useLocale()
const { localePath } = useLocalizedPath()
const { brand } = useBrandContext()

const label = computed(() => `${t('nav.cart')}: ${cart.itemsCount}`)
const cartLink = computed(() => localePath(brand.value === 'tor' ? '/tor/cart' : '/cart'))
</script>

<template>
  <NuxtLink :to="cartLink" class="cart-badge relative inline-flex">
    <span
      class="relative inline-flex items-center justify-center rounded-full transition-all duration-200"
      :class="[
        props.theme === 'dark'
          ? 'border border-white/10 bg-white/[0.06] text-stone-100 hover:border-[#d79a49]/50 hover:bg-white/[0.12]'
          : 'ring-1 ring-sand-200 bg-white/70 text-sand-900 shadow-sm hover:-translate-y-0.5 hover:bg-white hover:shadow-md',
        props.compact ? 'h-10 w-10' : 'h-10 min-w-[5.25rem] gap-2.5 px-3.5',
      ]"
      :aria-label="label"
      :title="label"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="9" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
        <path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H7.4" />
      </svg>

      <span
        v-if="!props.compact"
        class="min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.08em]"
        :class="props.theme === 'dark' ? 'text-stone-100' : 'text-sand-700'"
      >
        {{ t('nav.cart') }}
      </span>

      <span
        class="inline-flex shrink-0 min-w-[1.55rem] items-center justify-center rounded-full px-1.5 py-1 text-[11px] font-bold leading-none"
        :class="[
          props.compact ? 'absolute -right-1.5 -top-1.5' : '',
          props.theme === 'dark' ? 'bg-[#d79a49] text-black' : 'bg-sand-700 text-white',
        ]"
      >
        {{ cart.itemsCount }}
      </span>
    </span>
  </NuxtLink>
</template>
