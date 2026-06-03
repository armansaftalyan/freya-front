<script setup lang="ts">
import type { ApiListResponse } from '~/types/api'
import type { Product, ProductCategory } from '~/types/product'
import { supportedLocales, type SupportedLocale } from '~/composables/useLocalizedPath'
import ProductCard from '~/components/product/ProductCard.vue'

const api = useApi()
const route = useRoute()
const { t, locale } = useLocale()
const { siteUrl } = useSiteMeta()
const { brand, productsPath } = useBrandContext()
const isTor = computed(() => brand.value === 'tor')
const { localePath } = useLocalizedPath()
const cart = useCartStore()
const localizedPath = (target: string) => localePath(target) as string

const categorySlug = computed(() => String(route.params.categorySlug || '').trim())

const { data, error } = await useAsyncData(() => `product-category-${brand.value}-${categorySlug.value}-${locale.value}`, async () => {
  const [categoriesResponse, productsResponse] = await Promise.all([
    api.get<ApiListResponse<ProductCategory>>('/product-categories', { brand: brand.value }, { skipErrorToast: true }),
    api.get<ApiListResponse<Product>>('/products', { brand: brand.value }, { skipErrorToast: true }),
  ])

  const category = categoriesResponse.data.find(item => slugMatches(item, categorySlug.value) && item.is_active) || null

  if (!category) {
    throw createError({ statusCode: 404, statusMessage: 'Product category not found' })
  }

  const products = productsResponse.data.filter(item => item.category_id === category.id && item.is_active)
  const suggestedProducts = productsResponse.data
    .filter(item => item.category_id !== category.id && item.is_active)
    .map(product => ({
      product,
      rank: stableProductRank(category.id, product.id),
    }))
    .sort((left, right) => left.rank - right.rank)
    .slice(0, 8)
    .map(item => item.product)

  if (products.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Product category has no visible products' })
  }

  return { categories: categoriesResponse.data, category, products, suggestedProducts }
})

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode || 404,
    statusMessage: error.value.statusMessage || 'Product category not found',
    fatal: true,
  })
}

const category = computed(() => data.value?.category || null)
const products = computed(() => data.value?.products || [])
const categoryById = computed(() => new Map((data.value?.categories || []).map(category => [category.id, category])))
const suggestedProducts = computed(() => products.value.length < 6 ? (data.value?.suggestedProducts || []) : [])
const currentLocale = computed(() => locale.value as SupportedLocale)
const localizedCategoryPaths = computed(() => Object.fromEntries(
  supportedLocales.map((targetLocale) => [
    targetLocale,
    `${productsPath.value}/${localizedSlugFor(category.value, targetLocale)}`,
  ]),
) as Partial<Record<SupportedLocale, string>>)
const canonicalCategoryPath = computed(() => `${productsPath.value}/${localizedSlugFor(category.value, currentLocale.value)}`)
const productPath = (product: Product) => localizedPath(`${productsPath.value}/${localizedSlugFor(categoryById.value.get(product.category_id) || category.value, currentLocale.value)}/${localizedSlugFor(product, currentLocale.value)}`)
const productQuantity = (productId: number) => cart.getItemQuantity(productId)
const addToCart = (product: Product) => cart.addItem(product, 1)
const decreaseFromCart = (productId: number) => cart.decreaseItem(productId, 1)

if (category.value && categorySlug.value !== localizedSlugFor(category.value, currentLocale.value)) {
  await navigateTo(localePath(canonicalCategoryPath.value), { redirectCode: 301 })
}

usePageSeo({
  localizedPaths: () => localizedCategoryPaths.value,
  title: () => {
    if (category.value?.seo_title) return category.value.seo_title
    const categoryName = category.value?.name || t('nav.products')
    if (isTor.value) {
      if (locale.value === 'ru') return `${categoryName} купить в Ереване | Tor Barbershop`
      if (locale.value === 'en') return `${categoryName} in Yerevan | Tor Barbershop`
      return `${categoryName} Երևանում | Tor Barbershop`
    }
    if (locale.value === 'ru') return `${categoryName} купить в Ереване | Freya Beauty`
    if (locale.value === 'en') return `${categoryName} in Yerevan | Freya Beauty Salon`
    return `${categoryName} Երևանում | Freya Beauty Salon`
  },
  description: () => category.value?.seo_description || category.value?.description || t('productsPage.seoDescription'),
  ogType: 'website',
})

useStructuredData(() => {
  if (!category.value) return null

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        url: `${siteUrl.value}${route.path}`,
        name: category.value.name,
        description: category.value.seo_description || category.value.description || undefined,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: products.value.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${siteUrl.value}${canonicalCategoryPath.value}/${localizedSlugFor(product, currentLocale.value)}`,
            name: product.name,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: t('nav.home'),
            item: siteUrl.value,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: t('nav.products'),
            item: `${siteUrl.value}${productsPath.value}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: category.value.name,
            item: `${siteUrl.value}${route.path}`,
          },
        ],
      },
    ],
  }
})
</script>

<template>
  <section class="section-gap" :class="isTor ? 'text-stone-100' : ''">
    <div class="container-shell space-y-8">
      <NuxtLink
        :to="localePath(productsPath)"
        class="inline-flex items-center text-sm"
        :class="isTor ? 'text-stone-300 hover:text-white' : 'text-sand-700 hover:text-sand-900'"
      >
        ← {{ t('nav.products') }}
      </NuxtLink>

      <div v-if="category" class="space-y-4">
        <p class="text-xs uppercase tracking-[0.2em]" :class="isTor ? 'text-[#c58a3a]' : 'text-sand-600'">{{ t('productsPage.catalog') }}</p>
        <h1 class="text-3xl leading-tight sm:text-5xl">{{ category.name }}</h1>
        <p v-if="category.description" class="max-w-3xl text-base leading-7" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">
          {{ category.description }}
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          :to="productPath(product)"
          :quantity="productQuantity(product.id)"
          :theme="isTor ? 'tor' : 'default'"
          compact
          @add="addToCart"
          @decrease="decreaseFromCart"
        />
      </div>

      <div
        v-if="suggestedProducts.length"
        class="border-t pt-8"
        :class="isTor ? 'border-white/10' : 'border-sand-200'"
      >
        <h2
          class="text-2xl"
          :class="isTor ? 'font-black uppercase tracking-[0.05em] text-white' : 'leading-tight text-sand-900'"
        >
          {{ t('productsPage.youMayLike') }}
        </h2>

        <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ProductCard
            v-for="product in suggestedProducts"
            :key="`suggested-${product.id}`"
            :product="product"
            :to="productPath(product)"
            :quantity="productQuantity(product.id)"
            :theme="isTor ? 'tor' : 'default'"
            compact
            @add="addToCart"
            @decrease="decreaseFromCart"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
const stableProductRank = (categoryId: number, productId: number): number => {
  let value = Math.imul(categoryId + 17, 2654435761) ^ Math.imul(productId + 31, 1597334677)
  value ^= value >>> 16
  value = Math.imul(value, 2246822507)
  value ^= value >>> 13

  return value >>> 0
}
</script>
