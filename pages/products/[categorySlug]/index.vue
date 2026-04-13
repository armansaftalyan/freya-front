<script setup lang="ts">
import type { ApiListResponse } from '~/types/api'
import type { Product, ProductCategory } from '~/types/product'
import ProductCard from '~/components/product/ProductCard.vue'
import SeoIntentSection from '~/components/sections/SeoIntentSection.vue'

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

const { data } = await useAsyncData(() => `product-category-${brand.value}-${categorySlug.value}-${locale.value}`, async () => {
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

const seoIntentCopy = computed(() => {
  const categoryName = category.value?.name || t('nav.products')

  if (isTor.value) {
    if (locale.value === 'ru') {
      return {
        title: `${categoryName} Tor Barbershop`,
        intro: [
          `Категория ${categoryName} в Tor должна усиливать спрос по товарам этой группы и по покупке мужского ухода в Ереване.`,
          `Здесь нужны только точные запросы по самой категории, брендам внутри нее, цене и покупке, без посторонних общих ключей.`,
        ],
        intents: [categoryName, `${categoryName} цена`, `${categoryName} купить`, `${categoryName} Tor`, `${categoryName} Ереван`, `товары ${categoryName}`],
      }
    }

    if (locale.value === 'en') {
      return {
        title: `${categoryName} at Tor Barbershop`,
        intro: [
          `The ${categoryName} category at Tor should support searches for this product group and product purchases in Yerevan.`,
          `Only category-level keywords are useful here: exact category name, brands inside it, pricing, and buying intent.`,
        ],
        intents: [categoryName, `${categoryName} price`, `${categoryName} buy`, `${categoryName} Tor`, `${categoryName} Yerevan`, `${categoryName} products`],
      }
    }

    return {
      title: `${categoryName} Tor Barbershop-ում`,
      intro: [
        `Tor-ի ${categoryName} ապրանքային կատեգորիան պետք է ուժեղացնի այս կոնկրետ խմբի ապրանքների որոնումները և Երևանում գնման պահանջարկը։`,
        `Այստեղ կարևոր են միայն ${categoryName}-ի, գնի, բրենդների և գնման հետ կապված նպատակային հարցումները։`,
      ],
      intents: [categoryName, `${categoryName} գին`, `${categoryName} գնել`, `${categoryName} Tor`, `${categoryName} Երևան`, `${categoryName} ապրանքներ`],
    }
  }

  if (locale.value === 'ru') {
    return {
      title: `${categoryName} в Freya Beauty Salon`,
      intro: [
        `Категория ${categoryName} в Freya должна поддерживать спрос по этой группе товаров и по покупке home care в Ереване.`,
        `Для нее полезны только точные запросы по категории, цене, брендам и покупке, без лишнего SEO-шума.`,
      ],
      intents: [categoryName, `${categoryName} цена`, `${categoryName} купить`, `${categoryName} Freya`, `${categoryName} Ереван`, `товары ${categoryName}`],
    }
  }

  if (locale.value === 'en') {
    return {
      title: `${categoryName} at Freya Beauty Salon`,
      intro: [
        `The ${categoryName} category at Freya should support searches for this product group and home care purchases in Yerevan.`,
        `Relevant intent here is limited to the category name, pricing, brands, and buying path.`,
      ],
      intents: [categoryName, `${categoryName} price`, `${categoryName} buy`, `${categoryName} Freya`, `${categoryName} Yerevan`, `${categoryName} products`],
    }
  }

  return {
    title: `${categoryName} Freya Beauty Salon-ում`,
    intro: [
      `Freya-ի ${categoryName} ապրանքային կատեգորիան պետք է ուժեղացնի այս խմբի ապրանքների և տնային խնամքի գնման որոնումները Երևանում։`,
      `Այս էջում պետք է մնան միայն կատեգորիայի, գնի, բրենդների և գնման ուղու հետ կապված թիրախային intent-ները։`,
    ],
    intents: [categoryName, `${categoryName} գին`, `${categoryName} գնել`, `${categoryName} Freya`, `${categoryName} Երևան`, `${categoryName} ապրանքներ`],
  }
})

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
          :to="productPath(category?.slug || '', product.slug)"
          :quantity="productQuantity(product.id)"
          :theme="isTor ? 'tor' : 'default'"
          compact
          @add="addToCart"
          @decrease="decreaseFromCart"
        />
      </div>

      <SeoIntentSection
        :section="'product-category'"
        :theme="isTor ? 'tor' : 'default'"
        :title="seoIntentCopy.title"
        :intro="seoIntentCopy.intro"
        :intents="seoIntentCopy.intents"
      />
    </div>
  </section>
</template>
