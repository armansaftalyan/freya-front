<script setup lang="ts">
import type { Product } from '~/types/product'

const props = withDefaults(defineProps<{
  product: Product
  to: string
  quantity: number
  theme?: 'default' | 'tor'
  showComparePrice?: boolean
  compact?: boolean
}>(), {
  theme: 'default',
  showComparePrice: false,
  compact: false,
})

const emit = defineEmits<{
  (e: 'add', product: Product): void
  (e: 'decrease', productId: number): void
}>()

const { t, locale } = useLocale()
const { formatAmd } = useCurrency()

const addLabel = computed(() => {
  if (props.theme === 'tor') {
    return locale.value === 'ru'
      ? 'В корзину'
      : locale.value === 'en'
        ? 'Add to cart'
        : 'Ավելացնել'
  }

  return t('cartPage.addToCart')
})

const articleClass = computed(() => props.theme === 'tor'
  ? 'border border-white/10 bg-white/[0.03] shadow-[0_20px_50px_rgba(0,0,0,0.22)] hover:border-[#c58a3a]/40 hover:bg-white/[0.05]'
  : 'border border-sand-200 bg-white shadow-soft hover:border-sand-300 hover:shadow-lg')

const titleClass = computed(() => props.theme === 'tor'
  ? 'text-lg font-bold uppercase leading-tight tracking-[0.03em] hover:text-[#c58a3a]'
  : 'text-xl leading-tight hover:text-sand-700')

const brandClass = computed(() => props.theme === 'tor'
  ? 'text-[#c58a3a]'
  : 'text-sand-700')

const descriptionClass = computed(() => props.theme === 'tor'
  ? 'text-stone-400'
  : 'text-[var(--muted)]')

const priceClass = computed(() => props.theme === 'tor'
  ? 'text-white'
  : 'text-sand-900')

const volumeClass = computed(() => props.theme === 'tor'
  ? 'text-stone-500'
  : 'text-sand-600')

const primaryButtonClass = computed(() => props.theme === 'tor'
  ? 'bg-[#c58a3a] text-black hover:bg-[#d79a49]'
  : 'bg-sand-700 text-white hover:bg-sand-900')

const quantityWrapClass = computed(() => props.theme === 'tor'
  ? 'border border-[#c58a3a]/35 bg-[#161616]'
  : 'border border-sand-200 bg-sand-50')

const quantityButtonClass = computed(() => props.theme === 'tor'
  ? 'text-[#c58a3a] hover:bg-white/[0.05]'
  : 'text-sand-700 hover:bg-white')

const quantityValueClass = computed(() => props.theme === 'tor'
  ? 'text-white'
  : 'text-sand-900')

const imageHeightClass = computed(() => props.compact ? 'h-48' : 'h-52')
</script>

<template>
  <article
    class="flex h-full min-h-[27rem] flex-col rounded-[1.5rem] p-5 transition-all duration-200 hover:-translate-y-0.5"
    :class="articleClass"
  >
    <NuxtLink :to="to" class="block rounded-3xl focus-visible:outline-none">
      <img
        :src="product.image_url || '/logo.png'"
        :alt="[product.brand, product.name, product.volume_label].filter(Boolean).join(' ')"
        class="w-full rounded-2xl object-cover"
        :class="imageHeightClass"
        loading="lazy"
        decoding="async"
      >
    </NuxtLink>

    <NuxtLink :to="to" class="mt-4 min-h-[3.25rem]" :class="titleClass">
      {{ product.name }}
    </NuxtLink>

    <p
      v-if="product.brand"
      class="mt-1 text-xs uppercase tracking-[0.14em]"
      :class="brandClass"
    >
      {{ product.brand }}
    </p>

    <p class="mt-3 min-h-[4.5rem] text-sm leading-6" :class="descriptionClass">
      {{ product.description || t('productsPage.defaultDescription') }}
    </p>

    <div class="mt-auto flex items-end justify-between gap-3 pt-5">
      <div>
        <p class="text-lg font-semibold" :class="priceClass">{{ formatAmd(product.price) }}</p>
        <p
          v-if="showComparePrice && product.compare_at_price"
          class="text-xs line-through"
          :class="descriptionClass"
        >
          {{ formatAmd(product.compare_at_price) }}
        </p>
      </div>
      <p
        v-if="product.volume_label"
        class="text-xs uppercase tracking-[0.14em]"
        :class="volumeClass"
      >
        {{ product.volume_label }}
      </p>
    </div>

    <div class="mt-4">
      <button
        v-if="!quantity"
        type="button"
        class="inline-flex h-10 w-full items-center justify-center rounded-full px-4 text-sm font-semibold uppercase tracking-[0.12em] transition"
        :class="primaryButtonClass"
        @click="emit('add', product)"
      >
        {{ addLabel }}
      </button>

      <div
        v-else
        class="flex h-10 items-center overflow-hidden rounded-full"
        :class="quantityWrapClass"
      >
        <button
          type="button"
          class="flex h-full w-12 items-center justify-center text-lg font-semibold transition"
          :class="quantityButtonClass"
          @click="emit('decrease', product.id)"
        >
          -
        </button>
        <div class="flex-1 text-center text-sm font-semibold" :class="quantityValueClass">
          {{ quantity }}
        </div>
        <button
          type="button"
          class="flex h-full w-12 items-center justify-center text-lg font-semibold transition"
          :class="quantityButtonClass"
          @click="emit('add', product)"
        >
          +
        </button>
      </div>
    </div>
  </article>
</template>
