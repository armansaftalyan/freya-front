<script setup lang="ts">
import type { ApiListResponse } from '~/types/api'
import type { BlogArticleCard } from '~/types/blog'
import type { Category } from '~/types/category'
import type { Master } from '~/types/master'
import type { Product, ProductCategory } from '~/types/product'
import type { Service } from '~/types/service'

type BrandCatalog = {
  articles: BlogArticleCard[]
  categories: Category[]
  services: Service[]
  masters: Master[]
  productCategories: ProductCategory[]
  products: Product[]
}

type SitemapSectionLink = {
  title: string
  to: string
  description?: string | null
}

type SitemapSection = {
  title: string
  links: SitemapSectionLink[]
}

const { locale } = useLocale()
const { localePath } = useLocalizedPath()
const api = useApi()
const route = useRoute()
const { canonicalUrl } = useLocalizedSeo(() => route.path)
const { brand, rootPath } = useBrandContext()

const copy = computed(() => {
  if (locale.value === 'ru') {
    return {
      title: 'Карта сайта',
      description: 'HTML-карта сайта со всеми основными разделами, категориями, услугами, товарами и страницами мастеров Freya и Tor.',
      intro: 'Страница собирает внутренние ссылки в одном месте, чтобы пользователям и поисковым ботам было проще находить все важные URL.',
      corePages: 'Основные страницы',
      serviceCategories: 'Категории услуг',
      services: 'Все услуги',
      productCategories: 'Категории товаров',
      products: 'Все товары',
      masters: 'Все мастера',
      blog: 'Блог',
      blogArticles: 'Статьи блога',
      freya: 'Freya Beauty Salon',
      tor: 'Tor Barbershop',
      contacts: 'Контакты',
      privacyPolicy: 'Политика конфиденциальности',
      legal: 'Условия и политики',
      allPages: 'HTML-карта сайта',
      giftCards: 'Подарочные карты',
      booking: 'Онлайн-запись',
    }
  }

  if (locale.value === 'en') {
    return {
      title: 'All Pages',
      description: 'HTML sitemap with all major sections, categories, services, products, and master profile pages for Freya and Tor.',
      intro: 'This page centralizes internal links so users and search engines can discover important URLs faster.',
      corePages: 'Core pages',
      serviceCategories: 'Service categories',
      services: 'All services',
      productCategories: 'Product categories',
      products: 'All products',
      masters: 'All masters',
      blog: 'Blog',
      blogArticles: 'Blog articles',
      freya: 'Freya Beauty Salon',
      tor: 'Tor Barbershop',
      contacts: 'Contacts',
      privacyPolicy: 'Privacy Policy',
      legal: 'Terms and Policies',
      allPages: 'HTML Sitemap',
      giftCards: 'Gift Cards',
      booking: 'Online Booking',
    }
  }

  return {
    title: 'Կայքի քարտեզ',
    description: 'HTML կայքի քարտեզ Freya և Tor բրենդների հիմնական բաժիններով, կատեգորիաներով, ծառայություններով, ապրանքներով և վարպետների էջերով։',
    intro: 'Այս էջը հավաքում է ներքին հղումները մեկ տեղում, որպեսզի օգտատերերն ու որոնողական բոթերը արագ գտնեն կարևոր URL-ները։',
    corePages: 'Հիմնական էջեր',
    serviceCategories: 'Ծառայությունների կատեգորիաներ',
    services: 'Բոլոր ծառայությունները',
    productCategories: 'Ապրանքների կատեգորիաներ',
    products: 'Բոլոր ապրանքները',
    masters: 'Բոլոր վարպետները',
    blog: 'Բլոգ',
    blogArticles: 'Բլոգի հոդվածներ',
    freya: 'Freya Beauty Salon',
    tor: 'Tor Barbershop',
    contacts: 'Կոնտակտներ',
    privacyPolicy: 'Գաղտնիության քաղաքականություն',
    legal: 'Պայմաններ և քաղաքականություններ',
    allPages: 'HTML կայքի քարտեզ',
    giftCards: 'Նվեր քարտեր',
    booking: 'Օնլայն գրանցում',
  }
})

usePageSeo({
  title: () => copy.value.title,
  description: () => copy.value.description,
  ogType: 'website',
  noindex: true,
})

const { data } = await useAsyncData(`all-pages-${locale.value}`, async () => {
  const fetchBrandCatalog = async (brand: 'freya' | 'tor'): Promise<BrandCatalog> => {
    const [articlesResponse, categoriesResponse, servicesResponse, mastersResponse, productCategoriesResponse, productsResponse] = await Promise.all([
      api.get<ApiListResponse<BlogArticleCard>>('/blog', { brand, limit: 100 }, { skipErrorToast: true }),
      api.get<ApiListResponse<Category>>('/categories', { brand }, { skipErrorToast: true }),
      api.get<ApiListResponse<Service>>('/services', { brand }, { skipErrorToast: true }),
      api.get<ApiListResponse<Master>>('/masters', { brand }, { skipErrorToast: true }),
      api.get<ApiListResponse<ProductCategory>>('/product-categories', { brand }, { skipErrorToast: true }),
      api.get<ApiListResponse<Product>>('/products', { brand }, { skipErrorToast: true }),
    ])

    return {
      articles: articlesResponse.data,
      categories: categoriesResponse.data.filter((item) => item.is_active !== false),
      services: servicesResponse.data.filter((item) => item.is_active !== false),
      masters: mastersResponse.data.filter((item) => item.is_active !== false && Boolean(item.slug || item.id)),
      productCategories: productCategoriesResponse.data.filter((item) => item.is_active !== false),
      products: productsResponse.data.filter((item) => item.is_active !== false),
    }
  }

  const [freya, tor] = await Promise.all([
    fetchBrandCatalog('freya'),
    fetchBrandCatalog('tor'),
  ])

  return { freya, tor }
}, {
  default: () => ({
    freya: {
      articles: [],
      categories: [],
      services: [],
      masters: [],
      productCategories: [],
      products: [],
    },
    tor: {
      articles: [],
      categories: [],
      services: [],
      masters: [],
      productCategories: [],
      products: [],
    },
  }),
})

const brandCatalog = computed(() => data.value)

const staticSections = computed<Record<'freya' | 'tor', SitemapSection>>(() => ({
  freya: {
    title: copy.value.corePages,
    links: [
      { title: 'Freya Beauty Salon', to: '/' },
      { title: copy.value.allPages, to: '/all-pages' },
      { title: copy.value.blog, to: '/blog' },
      { title: copy.value.serviceCategories, to: '/services' },
      { title: copy.value.productCategories, to: '/products' },
      { title: copy.value.masters, to: '/masters' },
      { title: copy.value.booking, to: '/booking' },
      { title: copy.value.contacts, to: '/contacts' },
      { title: copy.value.legal, to: '/legal' },
      { title: copy.value.privacyPolicy, to: '/privacy-policy' },
      { title: copy.value.giftCards, to: '/gift-cards/buy' },
    ],
  },
  tor: {
    title: copy.value.corePages,
    links: [
      { title: 'Tor Barbershop', to: '/tor' },
      { title: copy.value.allPages, to: '/tor/all-pages' },
      { title: copy.value.blog, to: '/tor/blog' },
      { title: copy.value.serviceCategories, to: '/tor/services' },
      { title: copy.value.productCategories, to: '/tor/products' },
      { title: copy.value.masters, to: '/tor/masters' },
      { title: copy.value.booking, to: '/tor/booking' },
      { title: copy.value.contacts, to: '/tor/contacts' },
      { title: copy.value.legal, to: '/tor/legal' },
      { title: copy.value.privacyPolicy, to: '/tor/privacy-policy' },
      { title: copy.value.giftCards, to: '/tor/gift-cards/buy' },
    ],
  },
}))

const buildBrandSections = (brand: 'freya' | 'tor'): SitemapSection[] => {
  const catalog = brandCatalog.value[brand]
  const baseServicesPath = brand === 'tor' ? '/tor/services' : '/services'
  const baseProductsPath = brand === 'tor' ? '/tor/products' : '/products'
  const baseMastersPath = brand === 'tor' ? '/tor/masters' : '/masters'
  const baseBlogPath = brand === 'tor' ? '/tor/blog' : '/blog'

  const categoryById = new Map(catalog.categories.map((item) => [item.id, item]))
  const productCategoryById = new Map(catalog.productCategories.map((item) => [item.id, item]))

  return [
    staticSections.value[brand],
    {
      title: copy.value.serviceCategories,
      links: catalog.categories.map((category) => ({
        title: category.name,
        to: `${baseServicesPath}/${category.slug}`,
        description: category.description,
      })),
    },
    {
      title: copy.value.services,
      links: catalog.services
        .map((service) => {
          const category = categoryById.get(service.category_id)
          if (!category) return null

          return {
            title: service.name,
            to: `${baseServicesPath}/${category.slug}/${service.slug}`,
            description: service.description,
          }
        })
        .filter((item): item is SitemapSectionLink => Boolean(item)),
    },
    {
      title: copy.value.productCategories,
      links: catalog.productCategories.map((category) => ({
        title: category.name,
        to: `${baseProductsPath}/${category.slug}`,
        description: category.description,
      })),
    },
    {
      title: copy.value.products,
      links: catalog.products
        .map((product) => {
          const category = productCategoryById.get(product.category_id)
          if (!category) return null

          return {
            title: product.name,
            to: `${baseProductsPath}/${category.slug}/${product.slug}`,
            description: product.description,
          }
        })
        .filter((item): item is SitemapSectionLink => Boolean(item)),
    },
    {
      title: copy.value.masters,
      links: catalog.masters.map((master) => ({
        title: master.name,
        to: `${baseMastersPath}/${master.slug || master.id}`,
        description: master.bio,
      })),
    },
    {
      title: copy.value.blogArticles,
      links: catalog.articles.map((article) => ({
        title: article.title,
        to: `${baseBlogPath}/${article.slug}`,
        description: article.excerpt,
      })),
    },
  ].filter((section) => section.links.length > 0)
}

const freyaSections = computed(() => buildBrandSections('freya'))
const torSections = computed(() => buildBrandSections('tor'))
const brandHomeLabel = computed(() => brand.value === 'tor' ? copy.value.tor : copy.value.freya)

useStructuredData(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      url: canonicalUrl.value,
      name: copy.value.title,
      description: copy.value.description,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: brandHomeLabel.value,
          item: canonicalUrl.value.startsWith('http')
            ? `${new URL(canonicalUrl.value).origin}${localePath(rootPath.value || '/')}`
            : localePath(rootPath.value || '/'),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: copy.value.title,
          item: canonicalUrl.value,
        },
      ],
    },
  ],
}))
</script>

<template>
  <section class="section-gap">
    <div class="container-shell space-y-10">
      <div class="max-w-3xl space-y-4">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-sand-700">HTML Sitemap</p>
        <h1 class="text-3xl leading-tight sm:text-5xl">{{ copy.title }}</h1>
        <p class="text-base leading-7 text-[var(--muted)]">{{ copy.intro }}</p>
      </div>

      <div class="grid gap-6 xl:grid-cols-2">
        <section class="space-y-6 rounded-[32px] border border-sand-200 bg-white p-6 shadow-soft sm:p-8">
          <div class="space-y-2">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-sand-700">{{ copy.freya }}</p>
            <h2 class="text-2xl text-sand-900 sm:text-3xl">{{ copy.title }}</h2>
          </div>

          <div v-for="section in freyaSections" :key="`freya-${section.title}`" class="space-y-3">
            <h3 class="text-lg font-semibold text-sand-900">{{ section.title }}</h3>
            <div class="grid gap-3">
              <NuxtLink
                v-for="link in section.links"
                :key="link.to"
                :to="localePath(link.to)"
                class="rounded-2xl border border-sand-200 bg-sand-50/70 px-4 py-3 transition hover:border-sand-400 hover:bg-white"
              >
                <p class="font-medium text-sand-900">{{ link.title }}</p>
                <p class="mt-1 text-sm text-[var(--muted)] break-all">{{ localePath(link.to) }}</p>
                <p v-if="link.description" class="mt-2 line-clamp-2 text-sm text-[var(--muted)]">{{ link.description }}</p>
              </NuxtLink>
            </div>
          </div>
        </section>

        <section class="space-y-6 rounded-[32px] border border-[#2b2b2b] bg-[#111111] p-6 text-stone-100 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-8">
          <div class="space-y-2">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[#c58a3a]">{{ copy.tor }}</p>
            <h2 class="text-2xl sm:text-3xl">{{ copy.title }}</h2>
          </div>

          <div v-for="section in torSections" :key="`tor-${section.title}`" class="space-y-3">
            <h3 class="text-lg font-semibold text-white">{{ section.title }}</h3>
            <div class="grid gap-3">
              <NuxtLink
                v-for="link in section.links"
                :key="link.to"
                :to="localePath(link.to)"
                class="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 transition hover:border-[#c58a3a]/50 hover:bg-white/[0.07]"
              >
                <p class="font-medium text-white">{{ link.title }}</p>
                <p class="mt-1 break-all text-sm text-stone-400">{{ localePath(link.to) }}</p>
                <p v-if="link.description" class="mt-2 line-clamp-2 text-sm text-stone-400">{{ link.description }}</p>
              </NuxtLink>
            </div>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>
