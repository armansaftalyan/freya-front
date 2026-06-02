<script setup lang="ts">
import type { Product, ProductCategory } from '~/types/product'
import ProductCard from '~/components/product/ProductCard.vue'
import ProductCategorySection from '~/components/product/ProductCategorySection.vue'

const props = withDefaults(defineProps<{
  theme?: 'default' | 'tor'
  title: string
  eyebrow?: string
  lead?: string
  backLabel?: string
  backTo?: string
  groupedProducts: Array<ProductCategory & { products: Product[], suggestedProducts?: Product[] }>
  productsPath: string
  productPath: (product: Product) => string
}>(), {
  theme: 'default',
  eyebrow: '',
  lead: '',
  backLabel: '',
  backTo: '',
})

const { localePath } = useLocalizedPath()
const { locale, t } = useLocale()
const cart = useCartStore()
const isTor = computed(() => props.theme === 'tor')
const localizedPath = (target: string) => localePath(target) as string
const productQuantity = (productId: number) => cart.getItemQuantity(productId)
const addToCart = (product: Product) => cart.addItem(product, 1)
const decreaseFromCart = (productId: number) => cart.decreaseItem(productId, 1)
</script>

<template>
  <section :class="isTor ? 'container-shell py-14 text-stone-100' : 'section-gap'">
    <div :class="isTor ? '' : 'container-shell max-w-[88rem] space-y-10'">
      <NuxtLink
        v-if="backLabel && backTo"
        :to="localePath(backTo)"
        class="inline-flex text-sm font-semibold uppercase tracking-[0.16em]"
        :class="isTor ? 'text-[#c58a3a]' : 'text-sand-700'"
      >
        ← {{ backLabel }}
      </NuxtLink>

      <div :class="isTor ? 'mt-6 max-w-3xl' : 'max-w-3xl'">
        <p
          class="text-xs uppercase tracking-[0.2em]"
          :class="isTor ? 'text-[#c58a3a]' : 'text-sand-700'"
        >
          {{ eyebrow }}
        </p>
        <h1 :class="isTor ? 'mt-2 text-4xl font-black uppercase tracking-[0.06em] sm:text-6xl' : 'text-3xl leading-tight sm:text-5xl'">
          {{ title }}
        </h1>
        <p class="mt-3" :class="isTor ? 'text-stone-300' : 'text-sm text-[var(--muted)]'">
          {{ lead }}
        </p>
      </div>

      <div :class="isTor ? 'mt-10 flex flex-wrap gap-3' : 'flex flex-wrap gap-2'">
        <NuxtLink
          v-for="category in groupedProducts"
          :key="category.id"
          :to="localePath(`${productsPath}/${localizedSlugFor(category, locale)}`)"
          :class="isTor
            ? 'inline-flex items-center rounded-full border border-[#c58a3a]/25 bg-white/[0.03] px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-stone-200 transition hover:border-[#c58a3a]/55 hover:bg-white/[0.06] hover:text-[#d79a49]'
            : ''"
        >
          <BaseButton v-if="!isTor" variant="secondary" size="sm">
            {{ category.name }}
          </BaseButton>
          <template v-else>{{ category.name }}</template>
        </NuxtLink>
      </div>

      <div :class="isTor ? 'mt-12 space-y-12' : 'space-y-12'">
        <ProductCategorySection
          v-for="category in groupedProducts"
          :key="category.id"
          :theme="theme"
          :title="category.name"
          :description="category.description"
          :action-label="locale === 'ru' ? 'Открыть категорию' : locale === 'en' ? 'Open category' : 'Բացել կատեգորիան'"
          :action-to="localizedPath(`${productsPath}/${localizedSlugFor(category, locale)}`)"
        >
          <div :class="isTor ? 'grid gap-4 md:grid-cols-2 xl:grid-cols-4' : 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'">
            <ProductCard
              v-for="product in category.products"
              :key="product.id"
              :theme="theme"
              :product="product"
              :to="productPath(product)"
              :quantity="productQuantity(product.id)"
              :show-compare-price="!isTor"
              @add="addToCart"
              @decrease="decreaseFromCart"
            />
          </div>

          <div
            v-if="category.products.length < 6 && category.suggestedProducts?.length"
            class="mt-8 border-t pt-6"
            :class="isTor ? 'border-white/10' : 'border-sand-200'"
          >
            <h3
              class="text-xl"
              :class="isTor ? 'font-black uppercase tracking-[0.05em] text-white' : 'leading-tight text-sand-900'"
            >
              {{ t('productsPage.youMayLike') }}
            </h3>
            <div
              class="mt-5"
              :class="isTor ? 'grid gap-4 md:grid-cols-2 xl:grid-cols-4' : 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'"
            >
              <ProductCard
                v-for="product in category.suggestedProducts"
                :key="`suggested-${category.id}-${product.id}`"
                :theme="theme"
                :product="product"
                :to="productPath(product)"
                :quantity="productQuantity(product.id)"
                :show-compare-price="!isTor"
                @add="addToCart"
                @decrease="decreaseFromCart"
              />
            </div>
          </div>
        </ProductCategorySection>
      </div>

    </div>
  </section>
</template>
