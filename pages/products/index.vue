<script setup lang="ts">
import type { ApiListResponse } from '~/types/api'
import type { Product, ProductCategory } from '~/types/product'
import ProductCard from '~/components/product/ProductCard.vue'
import ProductCategorySection from '~/components/product/ProductCategorySection.vue'
import SeoIntentSection from '~/components/sections/SeoIntentSection.vue'

const api = useApi()
const route = useRoute()
const { t, locale } = useLocale()
const { siteUrl } = useSiteMeta()
const { brand, productsPath } = useBrandContext()
const { localePath } = useLocalizedPath()
const cart = useCartStore()
const localizedPath = (target: string) => localePath(target) as string

usePageSeo({
  title: () => `Freya - ${t('nav.products')}`,
  description: () => t('productsPage.seoDescription'),
})

const { data } = await useAsyncData(() => `products-page-${brand.value}-${locale.value}`, async () => {
  const [categoriesResponse, productsResponse] = await Promise.all([
    api.get<ApiListResponse<ProductCategory>>('/product-categories', { brand: brand.value }, { skipErrorToast: true }),
    api.get<ApiListResponse<Product>>('/products', { brand: brand.value }, { skipErrorToast: true }),
  ])

  return {
    categories: categoriesResponse.data,
    products: productsResponse.data,
  }
})

const categories = computed(() => data.value?.categories || [])
const products = computed(() => data.value?.products || [])
const categoryById = computed(() => new Map(categories.value.map(category => [category.id, category])))
const groupedProducts = computed(() =>
  categories.value
    .map(category => ({
      ...category,
      products: products.value.filter(product => product.category_id === category.id),
    }))
    .filter(category => category.products.length > 0),
)
const productPath = (product: Product) => localizedPath(`${productsPath.value}/${categoryById.value.get(product.category_id)?.slug || 'catalog'}/${product.slug}`)
const productQuantity = (productId: number) => cart.getItemQuantity(productId)
const addToCart = (product: Product) => cart.addItem(product, 1)
const decreaseFromCart = (productId: number) => cart.decreaseItem(productId, 1)

useStructuredData(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      url: `${siteUrl.value}${route.path}`,
      name: t('nav.products'),
      description: t('productsPage.seoDescription'),
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: products.value.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${siteUrl.value}${productsPath.value}/${categoryById.value.get(product.category_id)?.slug || 'catalog'}/${product.slug}`,
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
          item: `${siteUrl.value}${route.path}`,
        },
      ],
    },
  ],
}))
</script>

<template>
  <section class="section-gap">
    <div class="container-shell max-w-[88rem] space-y-10">
      <div class="max-w-3xl">
        <p class="text-xs uppercase tracking-[0.2em] text-sand-700">{{ t('productsPage.catalog') }}</p>
        <h1 class="text-3xl leading-tight sm:text-5xl">{{ t('nav.products') }}</h1>
        <p class="mt-3 text-sm text-[var(--muted)]">{{ t('productsPage.seoDescription') }}</p>
      </div>

      <div class="flex flex-wrap gap-2">
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="localePath(`${productsPath}/${category.slug}`)"
        >
          <BaseButton variant="secondary" size="sm">
            {{ category.name }}
          </BaseButton>
        </NuxtLink>
      </div>

      <div class="space-y-12">
        <ProductCategorySection
          v-for="category in groupedProducts"
          :key="category.id"
          :title="category.name"
          :description="category.description"
          :action-label="locale === 'ru' ? 'Открыть категорию' : locale === 'en' ? 'Open category' : 'Բացել կատեգորիան'"
          :action-to="localizedPath(`${productsPath}/${category.slug}`)"
        >
          <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            <ProductCard
              v-for="product in category.products"
              :key="product.id"
              :product="product"
              :to="productPath(product)"
              :quantity="productQuantity(product.id)"
              :show-compare-price="true"
              @add="addToCart"
              @decrease="decreaseFromCart"
            />
          </div>
        </ProductCategorySection>
      </div>

      <SeoIntentSection section="products" />
    </div>
  </section>
</template>
