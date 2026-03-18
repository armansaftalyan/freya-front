<script setup lang="ts">
import type { ApiListResponse } from '~/types/api'
import type { Product, ProductCategory } from '~/types/product'
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

const { data } = await useAsyncData(() => `product-category-${categorySlug.value}-${locale.value}`, async () => {
  const [categoriesResponse, productsResponse] = await Promise.all([
    api.get<ApiListResponse<ProductCategory>>('/product-categories', { brand: brand.value }, { skipErrorToast: true }),
    api.get<ApiListResponse<Product>>('/products', { brand: brand.value }, { skipErrorToast: true }),
  ])

  const category = categoriesResponse.data.find(item => item.slug === categorySlug.value) || null

  if (!category) {
    throw createError({ statusCode: 404, statusMessage: 'Product category not found' })
  }

  const products = productsResponse.data.filter(item => item.category_id === category.id)

  return { category, products }
})

const category = computed(() => data.value?.category || null)
const products = computed(() => data.value?.products || [])
const productPath = (categorySlugValue: string, productSlugValue: string) => localizedPath(`${productsPath.value}/${categorySlugValue}/${productSlugValue}`)
const productQuantity = (productId: number) => cart.getItemQuantity(productId)
const addToCart = (product: Product) => cart.addItem(product, 1)
const decreaseFromCart = (productId: number) => cart.decreaseItem(productId, 1)

usePageSeo({
  title: () => category.value?.seo_title || `${category.value?.name || t('nav.products')} | Freya`,
  description: () => category.value?.seo_description || category.value?.description || t('productsPage.seoDescription'),
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
            url: `${siteUrl.value}${route.path}/${product.slug}`,
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
        :to="productsPath"
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
          :to="productPath(category?.slug || '', product.slug)"
          :quantity="productQuantity(product.id)"
          :theme="isTor ? 'tor' : 'default'"
          compact
          @add="addToCart"
          @decrease="decreaseFromCart"
        />
      </div>
    </div>
  </section>
</template>
