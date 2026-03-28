<script setup lang="ts">
import type { ApiListResponse } from '~/types/api'
import type { Product, ProductCategory } from '~/types/product'
import ProductCard from '~/components/product/ProductCard.vue'
import ProductCategorySection from '~/components/product/ProductCategorySection.vue'
import SeoIntentSection from '~/components/sections/SeoIntentSection.vue'

definePageMeta({
  layout: 'tor',
})

const api = useApi()
const route = useRoute()
const { locale, t } = useLocale()
const { localePath } = useLocalizedPath()
const { siteUrl } = useSiteMeta()
const { productsPath } = useBrandContext()
const cart = useCartStore()
const localizedPath = (target: string) => localePath(target) as string

const copy = computed(() => {
  if (locale.value === 'ru') {
    return {
      title: 'Tor Care',
      lead: 'Подборка мужских товаров для бороды, волос, кожи, ежедневного ухода и grooming-процедур.',
      back: 'Назад в Tor',
    }
  }

  if (locale.value === 'en') {
    return {
      title: 'Tor Care',
      lead: 'Selected beard, hair, skin, and grooming products for the Tor side of the brand.',
      back: 'Back to Tor',
    }
  }

  return {
    title: 'Tor Care',
    lead: 'Tor բրենդային ուղղության համար ընտրված մորուքի, մազերի, մաշկի և grooming խնամքի ապրանքներ։',
    back: 'Վերադառնալ Tor',
  }
})

const { data } = await useAsyncData(() => `tor-products-page-${locale.value}`, async () => {
  const [categoriesResponse, productsResponse] = await Promise.all([
    api.get<ApiListResponse<ProductCategory>>('/product-categories', { brand: 'tor' }, { skipErrorToast: true }),
    api.get<ApiListResponse<Product>>('/products', { brand: 'tor' }, { skipErrorToast: true }),
  ])

  return {
    categories: categoriesResponse.data,
    products: productsResponse.data,
  }
})

const categories = computed(() => data.value?.categories || [])
const products = computed(() => data.value?.products || [])
const categoryById = computed(() => new Map(categories.value.map(item => [item.id, item])))
const groupedProducts = computed(() =>
  categories.value
    .map(category => ({
      ...category,
      products: products.value.filter(product => product.category_id === category.id),
    }))
    .filter(category => category.products.length > 0),
)
const productPath = (product: Product) => localizedPath(`${productsPath.value}/${categoryById.value.get(product.category_id)?.slug || 'beard-care'}/${product.slug}`)
const productQuantity = (productId: number) => cart.getItemQuantity(productId)
const addToCart = (product: Product) => cart.addItem(product, 1)
const decreaseFromCart = (productId: number) => cart.decreaseItem(productId, 1)

usePageSeo({
  title: () => copy.value.title,
  description: () => copy.value.lead,
})

useStructuredData(() => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: copy.value.title,
  description: copy.value.lead,
  url: `${siteUrl.value}${route.path}`,
}))
</script>

<template>
  <section class="container-shell py-14 text-stone-100">
    <NuxtLink :to="localePath('/tor')" class="inline-flex text-sm font-semibold uppercase tracking-[0.16em] text-[#c58a3a]">
      ← {{ copy.back }}
    </NuxtLink>

    <div class="mt-6 max-w-3xl">
      <h1 class="text-4xl font-black uppercase tracking-[0.06em] sm:text-6xl">{{ copy.title }}</h1>
      <p class="mt-4 text-stone-300">{{ copy.lead }}</p>
    </div>

    <div v-if="groupedProducts.length" class="mt-10 flex flex-wrap gap-3">
      <NuxtLink
        v-for="category in groupedProducts"
        :key="category.id"
        :to="localePath(`${productsPath}/${category.slug}`)"
        class="inline-flex items-center rounded-full border border-[#c58a3a]/25 bg-white/[0.03] px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-stone-200 transition hover:border-[#c58a3a]/55 hover:bg-white/[0.06] hover:text-[#d79a49]"
      >
        {{ category.name }}
      </NuxtLink>
    </div>

    <div class="mt-12 space-y-12">
      <ProductCategorySection
        v-for="category in groupedProducts"
        :key="category.id"
        theme="tor"
        :title="category.name"
        :description="category.description"
        :action-label="locale === 'ru' ? 'Открыть категорию' : locale === 'en' ? 'Open category' : 'Բացել կատեգորիան'"
        :action-to="localizedPath(`${productsPath}/${category.slug}`)"
      >
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ProductCard
            v-for="product in category.products"
            :key="product.id"
            theme="tor"
            :product="product"
            :to="productPath(product)"
            :quantity="productQuantity(product.id)"
            @add="addToCart"
            @decrease="decreaseFromCart"
          />
        </div>
        </ProductCategorySection>
      </div>

      <SeoIntentSection section="products" theme="tor" />
    </section>
</template>
