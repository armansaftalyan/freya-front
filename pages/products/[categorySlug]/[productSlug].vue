<script setup lang="ts">
import type { ApiListResponse } from '~/types/api'
import type { Product, ProductCategory } from '~/types/product'
import SeoIntentSection from '~/components/sections/SeoIntentSection.vue'

const api = useApi()
const route = useRoute()
const toast = useToast()
const { t, locale } = useLocale()
const { formatAmd } = useCurrency()
const { siteUrl, salonName } = useSiteMeta()
const { localePath } = useLocalizedPath()
const cart = useCartStore()
const { brand, productsPath } = useBrandContext()
const isTor = computed(() => brand.value === 'tor')
const cartPath = computed(() => localePath(isTor.value ? '/tor/cart' : '/cart'))

const categorySlug = computed(() => String(route.params.categorySlug || '').trim())
const productSlug = computed(() => String(route.params.productSlug || '').trim())

const quantity = ref(1)

const { data } = await useAsyncData(() => `product-${brand.value}-${categorySlug.value}-${productSlug.value}-${locale.value}`, async () => {
  const [categoriesResponse, productsResponse] = await Promise.all([
    api.get<ApiListResponse<ProductCategory>>('/product-categories', { brand: brand.value }, { skipErrorToast: true }),
    api.get<ApiListResponse<Product>>('/products', { brand: brand.value }, { skipErrorToast: true }),
  ])

  const category = categoriesResponse.data.find(item => item.slug === categorySlug.value) || null
  if (!category) {
    throw createError({ statusCode: 404, statusMessage: 'Product category not found' })
  }

  const product = productsResponse.data.find(item => item.category_id === category.id && item.slug === productSlug.value) || null
  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }

  const relatedProducts = productsResponse.data
    .filter(item => item.category_id === category.id && item.id !== product.id)
    .slice(0, 4)

  return { category, product, relatedProducts }
})

const category = computed(() => data.value?.category || null)
const product = computed(() => data.value?.product || null)
const relatedProducts = computed(() => data.value?.relatedProducts || [])
const keywordIntents = computed(() => useSeoIntentKeywords({
  brand: brand.value,
  kind: 'product-detail',
  slug: product.value?.slug,
  name: product.value?.name,
  categorySlug: category.value?.slug,
}))
const cartQuantity = computed(() => product.value ? cart.getItemQuantity(product.value.id) : 0)
const selectedQuantity = computed(() => cartQuantity.value || Math.max(1, Number(quantity.value || 1)))
const orderTotal = computed(() => (product.value?.price || 0) * selectedQuantity.value)

const seoIntentCopy = computed(() => {
  const productName = product.value?.name || t('nav.products')
  const categoryName = category.value?.name || t('nav.products')

  if (isTor.value) {
    if (locale.value === 'ru') {
      return {
        title: `${productName} в Tor Barbershop`,
        intro: [
          `Эта карточка товара должна быть релевантна поискам по "${productName}", его цене, назначению и покупке в Tor.`,
          `Запросы вокруг ${productName} часто связаны с уходом за бородой, волосами, стайлингом и более широкой категорией ${categoryName}.`,
        ],
        intents: [productName, `${productName} цена`, `${productName} купить`, `${productName} yerevan`, ...keywordIntents.value],
      }
    }

    if (locale.value === 'en') {
      return {
        title: `${productName} at Tor Barbershop`,
        intro: [
          `This product card should match searches around "${productName}", its price, use case, and buying path at Tor.`,
          `Demand around ${productName} usually overlaps with beard care, hair styling, grooming retail intent, and the wider ${categoryName} category.`,
        ],
        intents: [productName, `${productName} price`, `${productName} buy`, `${productName} yerevan`, ...keywordIntents.value],
      }
    }

    return {
      title: `${productName} Tor Barbershop-ում`,
      intro: [
        `Այս ապրանքի քարտը պետք է համապատասխանի "${productName}" անվան, գնի, նշանակության և Tor-ում գնման որոնումներին։`,
        `${productName}-ի intent-ը հաճախ կապվում է beard care, hair styling, men grooming products և ${categoryName} ավելի լայն կատեգորիայի հետ։`,
      ],
      intents: [productName, `${productName} price`, `${productName} buy`, `${productName} yerevan`, ...keywordIntents.value],
    }
  }

  if (locale.value === 'ru') {
    return {
      title: `${productName} в Freya Beauty Salon`,
      intro: [
        `Эта карточка товара должна усиливать поиски по "${productName}", его цене, эффекту, объему и покупке в Freya.`,
        `Запросы вокруг ${productName} часто пересекаются с beauty products, hair care, skin care и более широкой категорией ${categoryName}.`,
      ],
      intents: [productName, `${productName} цена`, `${productName} купить`, `${productName} ереван`, ...keywordIntents.value],
    }
  }

  if (locale.value === 'en') {
    return {
      title: `${productName} at Freya Beauty Salon`,
      intro: [
        `This product card should strengthen searches around "${productName}", its price, effect, size, and buying path at Freya.`,
        `Demand around ${productName} often overlaps with beauty products, hair care, skin care, and the wider ${categoryName} category.`,
      ],
      intents: [productName, `${productName} price`, `${productName} buy`, `${productName} yerevan`, ...keywordIntents.value],
    }
  }

  return {
    title: `${productName} Freya Beauty Salon-ում`,
    intro: [
      `Այս ապրանքի քարտը պետք է ուժեղացնի "${productName}" ապրանքի, դրա գնի, ազդեցության, ծավալի և Freya-ում գնման որոնումները։`,
      `${productName}-ի շուրջ intent-ը հաճախ հատվում է beauty products, hair care, skin care և ${categoryName} ավելի լայն կատեգորիայի հետ։`,
    ],
    intents: [productName, `${productName} price`, `${productName} buy`, `${productName} yerevan`, ...keywordIntents.value],
  }
})

usePageSeo({
  title: () => product.value?.seo_title || `${product.value?.name || t('nav.products')} | Freya`,
  description: () => product.value?.seo_description || product.value?.description || t('productsPage.defaultDescription'),
  image: () => product.value?.image_url || undefined,
})

useStructuredData(() => {
  if (!product.value || !category.value) return null

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: product.value.name,
        description: product.value.seo_description || product.value.description || undefined,
        image: product.value.image_url || undefined,
        sku: product.value.sku || undefined,
        brand: product.value.brand ? { '@type': 'Brand', name: product.value.brand } : undefined,
        category: category.value.name,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'AMD',
          price: product.value.price,
          availability: 'https://schema.org/InStock',
          url: `${siteUrl.value}${route.path}`,
          seller: {
            '@id': `${siteUrl.value}#salon`,
          },
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
            item: `${siteUrl.value}${productsPath.value}/${category.value.slug}`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: product.value.name,
            item: `${siteUrl.value}${route.path}`,
          },
        ],
      },
    ],
  }
})

const addToCart = () => {
  if (!product.value) return

  cart.addItem(product.value, Math.max(1, Number(quantity.value || 1)))
  toast.push({
    type: 'success',
    title: t('cartPage.addedTitle'),
    description: product.value.name,
  })
}

const increaseCartQuantity = () => {
  if (!product.value) return
  cart.addItem(product.value, 1)
}

const decreaseCartQuantity = () => {
  if (!product.value) return
  cart.decreaseItem(product.value.id, 1)
}

const buyNow = async () => {
  if (!cartQuantity.value) {
    addToCart()
  }
  await navigateTo(cartPath.value)
}
</script>

<template>
  <section class="section-gap" :class="isTor ? 'text-stone-100' : ''">
    <div class="container-shell space-y-8">
      <NuxtLink
        v-if="category"
        :to="localePath(`${productsPath}/${category.slug}`)"
        class="inline-flex items-center text-sm"
        :class="isTor ? 'text-stone-300 hover:text-white' : 'text-sand-700 hover:text-sand-900'"
      >
        ← {{ category.name }}
      </NuxtLink>

      <div v-if="product && category" class="grid gap-8 lg:grid-cols-[1.05fr,0.95fr]">
        <div class="space-y-5">
          <img
            :src="product.image_url || '/logo.png'"
            :alt="product.name"
            class="h-[420px] w-full rounded-[2rem] object-cover"
            :class="isTor ? 'border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.22)]' : 'border border-sand-200 shadow-soft'"
          >

          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.2em]" :class="isTor ? 'text-[#c58a3a]' : 'text-sand-600'">{{ category.name }}</p>
            <h1 class="text-3xl leading-tight sm:text-5xl">{{ product.name }}</h1>
            <p class="max-w-3xl text-base leading-7" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">
              {{ product.description || t('productsPage.defaultDescription') }}
            </p>
          </div>

          <div class="grid gap-4 sm:grid-cols-3">
            <div class="rounded-3xl p-5" :class="isTor ? 'border border-white/10 bg-white/[0.03]' : 'border border-sand-200 bg-white'">
              <p class="text-xs uppercase tracking-[0.14em]" :class="isTor ? 'text-[#c58a3a]' : 'text-sand-600'">{{ t('productsPage.priceLabel') }}</p>
              <p class="mt-2 text-2xl">{{ formatAmd(product.price) }}</p>
            </div>
            <div class="rounded-3xl p-5" :class="isTor ? 'border border-white/10 bg-white/[0.03]' : 'border border-sand-200 bg-white'">
              <p class="text-xs uppercase tracking-[0.14em]" :class="isTor ? 'text-[#c58a3a]' : 'text-sand-600'">{{ t('productsPage.brandLabel') }}</p>
              <p class="mt-2 text-2xl">{{ product.brand || salonName }}</p>
            </div>
            <div class="rounded-3xl p-5" :class="isTor ? 'border border-white/10 bg-white/[0.03]' : 'border border-sand-200 bg-white'">
              <p class="text-xs uppercase tracking-[0.14em]" :class="isTor ? 'text-[#c58a3a]' : 'text-sand-600'">{{ t('productsPage.volumeLabel') }}</p>
              <p class="mt-2 text-2xl">{{ product.volume_label || '-' }}</p>
            </div>
          </div>
        </div>

        <div
          class="rounded-[2rem] p-6"
          :class="isTor
            ? 'border border-white/10 bg-[linear-gradient(180deg,rgba(22,22,22,0.96),rgba(12,12,12,0.94))] shadow-[0_20px_50px_rgba(0,0,0,0.24)]'
            : 'border border-sand-200 bg-[linear-gradient(180deg,rgba(255,251,244,0.98),rgba(245,234,216,0.95))] shadow-soft'"
        >
          <div class="space-y-2">
            <p class="text-xs uppercase tracking-[0.14em]" :class="isTor ? 'text-[#c58a3a]' : 'text-sand-600'">{{ t('productsPage.quickOrder') }}</p>
            <h2 class="text-2xl">{{ t('cartPage.addToCart') }}</h2>
            <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('cartPage.seoDescription') }}</p>
          </div>

          <div class="mt-5 grid gap-4">
            <div class="space-y-2">
              <p class="text-sm" :class="isTor ? 'text-stone-300' : 'text-sand-700'">{{ t('productsPage.quantity') }}</p>

              <button
                v-if="!cartQuantity"
                type="button"
                class="inline-flex h-12 w-full items-center justify-center rounded-full px-4 text-sm font-semibold uppercase tracking-[0.12em] transition"
                :class="isTor
                  ? 'bg-[#c58a3a] text-black hover:bg-[#d79a49]'
                  : 'bg-sand-700 text-white hover:bg-sand-900'"
                @click="addToCart"
              >
                {{ t('cartPage.addToCart') }}
              </button>

              <div
                v-else
                class="flex h-12 items-center overflow-hidden rounded-full"
                :class="isTor ? 'border border-[#c58a3a]/35 bg-[#161616]' : 'border border-sand-200 bg-sand-50'"
              >
                <button
                  type="button"
                  class="flex h-full w-14 items-center justify-center text-lg font-semibold transition"
                  :class="isTor ? 'text-[#c58a3a] hover:bg-white/[0.05]' : 'text-sand-700 hover:bg-white'"
                  @click="decreaseCartQuantity"
                >
                  -
                </button>
                <div class="flex-1 text-center text-sm font-semibold" :class="isTor ? 'text-white' : 'text-sand-900'">
                  {{ cartQuantity }}
                </div>
                <button
                  type="button"
                  class="flex h-full w-14 items-center justify-center text-lg font-semibold transition"
                  :class="isTor ? 'text-[#c58a3a] hover:bg-white/[0.05]' : 'text-sand-700 hover:bg-white'"
                  @click="increaseCartQuantity"
                >
                  +
                </button>
              </div>
            </div>

            <div class="rounded-2xl p-4" :class="isTor ? 'border border-white/10 bg-white/[0.04]' : 'border border-sand-200 bg-white'">
              <div class="flex items-center justify-between gap-3">
                <span class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('productsPage.total') }}</span>
                <span class="text-lg font-semibold" :class="isTor ? 'text-white' : 'text-sand-900'">{{ formatAmd(orderTotal) }}</span>
              </div>
            </div>

            <BaseButton :variant="isTor ? 'secondary' : 'primary'" @click="buyNow">
              {{ t('cartPage.checkoutButton') }}
            </BaseButton>
          </div>
        </div>
      </div>

      <div v-if="relatedProducts.length && category" class="space-y-4">
        <h2 class="text-2xl">{{ t('productsPage.relatedProducts') }}</h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NuxtLink
            v-for="item in relatedProducts"
            :key="item.id"
            :to="localePath(`${productsPath}/${category.slug}/${item.slug}`)"
            class="rounded-3xl p-4 transition hover:-translate-y-0.5"
            :class="isTor
              ? 'border border-white/10 bg-white/[0.03] shadow-[0_20px_50px_rgba(0,0,0,0.18)] hover:border-[#c58a3a]/40'
              : 'border border-sand-200 bg-white shadow-soft hover:border-sand-300'"
          >
            <img :src="item.image_url || '/logo.png'" :alt="item.name" class="h-40 w-full rounded-2xl object-cover">
            <p class="mt-3 text-lg">{{ item.name }}</p>
            <p class="mt-2 text-sm font-semibold" :class="isTor ? 'text-white' : 'text-sand-900'">{{ formatAmd(item.price) }}</p>
          </NuxtLink>
        </div>
      </div>

      <SeoIntentSection
        :section="'product-detail'"
        :theme="isTor ? 'tor' : 'default'"
        :title="seoIntentCopy.title"
        :intro="seoIntentCopy.intro"
        :intents="seoIntentCopy.intents"
      />
    </div>
  </section>
</template>
