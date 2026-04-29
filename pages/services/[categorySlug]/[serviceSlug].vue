<script setup lang="ts">
import type { ApiListResponse } from '~/types/api'
import type { BlogArticleCard } from '~/types/blog'
import type { Category } from '~/types/category'
import type { Master } from '~/types/master'
import type { Service } from '~/types/service'
import ServiceCatalogCard from '~/components/catalog/ServiceCatalogCard.vue'
import BlogArticleCardComponent from '~/components/blog/BlogArticleCard.vue'

const api = useApi()
const { t, locale } = useLocale()
const { resolvePriceRange, formatPriceLabel } = useServicePricing()
const { isVisible: isPromoVisible, promoCopy, promoPricingFor } = useFirstBookingPromo()
const route = useRoute()
const config = useRuntimeConfig()
const { localePath } = useLocalizedPath()
const { brand, isTor, bookingPath, servicesPath, blogPath } = useBrandContext()

const categorySlug = computed(() => String(route.params.categorySlug || '').trim())
const serviceSlug = computed(() => String(route.params.serviceSlug || '').trim())
const selectedMasterId = computed(() => {
  const raw = typeof route.query.master_id === 'string' ? Number(route.query.master_id) : NaN
  return Number.isInteger(raw) && raw > 0 ? raw : null
})

const { data } = await useAsyncData(() => `service-detail-${brand.value}-${categorySlug.value}-${serviceSlug.value}-${locale.value}-${selectedMasterId.value ?? 'none'}`, async () => {
  const [categoriesResponse, servicesResponse, selectedMasterResponse] = await Promise.all([
    api.get<ApiListResponse<Category>>('/categories', { brand: brand.value }, { skipErrorToast: true }),
    api.get<ApiListResponse<Service>>('/services', { brand: brand.value }, { skipErrorToast: true }),
    selectedMasterId.value
      ? api.get<{ data: Master }>(`/masters/${selectedMasterId.value}`, { brand: brand.value }, { skipErrorToast: true }).catch(() => null)
      : Promise.resolve(null),
  ])

  const category = categoriesResponse.data.find((item) => item.slug === categorySlug.value) || null

  if (!category) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found' })
  }

  const service = servicesResponse.data.find((item) => item.category_id === category.id && item.slug === serviceSlug.value) || null

  if (!service) {
    throw createError({ statusCode: 404, statusMessage: 'Service not found' })
  }

  const relatedServices = servicesResponse.data
    .filter((item) => item.category_id === category.id && item.id !== service.id)
    .slice(0, 6)

  return {
    category,
    service,
    relatedServices,
    selectedMaster: selectedMasterResponse?.data ?? null,
  }
})

const category = computed(() => data.value?.category || null)
const service = computed(() => data.value?.service || null)
const relatedServices = computed(() => data.value?.relatedServices || [])
const selectedMaster = computed(() => data.value?.selectedMaster || null)
const { data: relatedArticles } = await useAsyncData(
  () => `service-articles-${brand.value}-${serviceSlug.value}-${locale.value}`,
  async () => {
    if (!service.value?.id) return [] as BlogArticleCard[]
    const response = await api.get<ApiListResponse<BlogArticleCard>>('/blog', { brand: brand.value, service_id: service.value.id, limit: 3 }, { skipErrorToast: true })
    return response.data
  },
  { watch: [service] },
)
const currentPrice = computed(() => service.value ? resolvePriceRange(service.value, selectedMaster.value) : null)
const servicesCollectionLabel = computed(() => {
  if (brand.value !== 'tor') {
    return t('nav.services')
  }

  if (locale.value === 'ru') return 'Услуги Tor'
  if (locale.value === 'en') return 'Tor Services'
  return 'Tor ծառայություններ'
})
const pageCopy = computed(() => {
  if (brand.value === 'tor') {
    if (locale.value === 'ru') {
      return {
        primaryAction: 'Записаться',
        provider: 'Tor',
        whyTitle: 'Почему эта услуга',
        relatedTitle: 'Похожие услуги',
      }
    }

    if (locale.value === 'en') {
      return {
        primaryAction: 'Book now',
        provider: 'Tor',
        whyTitle: 'Why This Service',
        relatedTitle: 'Related Services',
      }
    }

    return {
      primaryAction: 'Ամրագրել',
      provider: 'Tor',
      whyTitle: 'Ինչու ընտրել այս ծառայությունը',
      relatedTitle: 'Նմանատիպ ծառայություններ',
    }
  }

  return {
    primaryAction: t('nav.bookNow'),
    provider: 'Freya',
    whyTitle: t('servicesPage.whyThisService'),
    relatedTitle: t('servicesPage.relatedServices'),
  }
})

usePageSeo({
  title: () => {
    if (service.value?.seo_title) return service.value.seo_title
    const serviceName = service.value?.name || t('nav.services')
    if (brand.value === 'tor') {
      if (locale.value === 'ru') return `${serviceName} в Ереване | Tor Barbershop`
      if (locale.value === 'en') return `${serviceName} in Yerevan | Tor Barbershop`
      return `${serviceName} Երևանում | Tor Barbershop`
    }
    if (locale.value === 'ru') return `${serviceName} в Ереване | Freya Beauty Salon`
    if (locale.value === 'en') return `${serviceName} in Yerevan | Freya Beauty Salon`
    return `${serviceName} Երևանում | Freya Beauty Salon`
  },
  description: () => service.value?.seo_description || service.value?.description || t('servicesPage.defaultDescription'),
  ogType: 'website',
})

useStructuredData(() => {
  if (!service.value || !category.value) {
    return null
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: service.value.name,
        description: service.value.seo_description || service.value.description || undefined,
        url: `${config.public.siteUrl}${route.path}`,
        category: category.value.name,
        provider: {
          '@type': brand.value === 'tor' ? 'Barbershop' : 'BeautySalon',
          name: brand.value === 'tor' ? 'Tor Barbershop' : 'Freya Beauty Salon',
          url: `${config.public.siteUrl}${brand.value === 'tor' ? '/tor' : ''}`,
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'AMD',
          price: currentPrice.value?.priceFrom ?? service.value.price_from,
          url: `${config.public.siteUrl}${route.path}`,
        },
        areaServed: 'Yerevan',
        duration: service.value.duration_minutes ? `PT${service.value.duration_minutes}M` : undefined,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: servicesCollectionLabel.value,
            item: `${config.public.siteUrl}${servicesPath.value}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: category.value.name,
            item: `${config.public.siteUrl}${servicesPath.value}/${category.value.slug}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: service.value.name,
            item: `${config.public.siteUrl}${route.path}`,
          },
        ],
      },
    ],
  }
})
</script>

<template>
  <section :class="isTor ? 'container-shell py-14 text-stone-100' : 'section-gap'">
    <div :class="isTor ? 'space-y-8' : 'container-shell space-y-8'">
      <NuxtLink
        v-if="category"
        :to="localePath(`${servicesPath}/${category.slug}`)"
        class="inline-flex items-center text-sm"
        :class="isTor ? 'text-[#c58a3a] hover:text-[#efbf7f]' : 'text-sand-700 hover:text-sand-900'"
      >
        ← {{ category.name }}
      </NuxtLink>

      <div v-if="service && category" class="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <div class="space-y-5">
          <p class="text-xs uppercase tracking-[0.2em]" :class="isTor ? 'font-semibold text-[#c58a3a]' : 'text-sand-600'">{{ category.name }}</p>
          <h1 :class="isTor ? 'text-4xl font-black uppercase tracking-[0.05em] sm:text-6xl' : 'text-3xl leading-tight sm:text-5xl'">{{ service.name }}</h1>
          <p class="max-w-3xl text-base leading-7" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">
            {{ service.description || t('servicesPage.defaultDescription') }}
          </p>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-3xl p-5" :class="isTor ? 'border border-white/10 bg-white/[0.04]' : 'border border-sand-200 bg-white'">
              <p class="text-xs uppercase tracking-[0.14em]" :class="isTor ? 'font-semibold text-[#c58a3a]' : 'text-sand-600'">{{ t('servicesPage.durationLabel') }}</p>
              <p class="mt-2 text-2xl" :class="isTor ? 'text-stone-100' : ''">{{ service.duration_minutes }} {{ t('servicesPage.minutes') }}</p>
            </div>
            <div class="rounded-3xl p-5" :class="isTor ? 'border border-white/10 bg-white/[0.04]' : 'border border-sand-200 bg-white'">
              <p class="text-xs uppercase tracking-[0.14em]" :class="isTor ? 'font-semibold text-[#c58a3a]' : 'text-sand-600'">{{ t('servicesPage.priceLabel') }}</p>
              <p
                v-if="isPromoVisible"
                class="mt-2 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]"
                :class="isTor ? 'border-[#c58a3a]/45 text-[#d8a15a]' : 'border-rose-200 bg-rose-50 text-rose-700'"
              >
                {{ promoCopy.badge }}
              </p>
              <p v-if="isPromoVisible" class="mt-2 text-sm line-through" :class="isTor ? 'text-stone-500' : 'text-sand-500'">
                {{ formatPriceLabel(service, selectedMaster) }}
              </p>
              <p class="mt-2 text-2xl" :class="isTor ? 'text-stone-100' : ''">
                {{ isPromoVisible ? promoPricingFor(service, selectedMaster).promoLabel : formatPriceLabel(service, selectedMaster) }}
              </p>
              <p v-if="isPromoVisible" class="mt-2 text-xs leading-5" :class="isTor ? 'text-stone-500' : 'text-[var(--muted)]'">
                {{ promoCopy.disclaimer }}
              </p>
            </div>
          </div>

          <NuxtLink
            :to="localePath({ path: bookingPath, query: { category_id: String(service.category_id), service_id: String(service.id), ...(selectedMaster ? { master_id: String(selectedMaster.id) } : {}) } })"
            class="inline-block"
          >
            <BaseButton size="lg" :theme="isTor ? 'tor' : 'default'">{{ pageCopy.primaryAction }}</BaseButton>
          </NuxtLink>
        </div>

        <div
          class="rounded-[2rem] p-6"
          :class="isTor
            ? 'border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] shadow-[0_18px_40px_rgba(0,0,0,0.28)]'
            : 'border border-sand-200 bg-[linear-gradient(180deg,rgba(255,251,244,0.95),rgba(245,234,216,0.9))] shadow-soft'"
        >
          <p class="text-xs uppercase tracking-[0.14em]" :class="isTor ? 'font-semibold text-[#c58a3a]' : 'text-sand-600'">{{ pageCopy.provider }}</p>
          <h2 class="mt-3 text-2xl" :class="isTor ? 'font-black uppercase tracking-[0.04em]' : ''">{{ pageCopy.whyTitle }}</h2>
          <div class="mt-5 space-y-4 text-sm leading-7" :class="isTor ? 'text-stone-300' : 'text-sand-800'">
            <p>{{ service.description || t('servicesPage.defaultDescription') }}</p>
            <p>{{ category.description || t('servicesPage.seoDescription') }}</p>
          </div>
        </div>
      </div>

      <div v-if="relatedServices.length" class="space-y-4" :class="isTor ? 'pt-2' : ''">
        <h2 :class="isTor ? 'text-2xl font-black uppercase tracking-[0.05em] sm:text-4xl' : 'text-2xl'">{{ pageCopy.relatedTitle }}</h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ServiceCatalogCard
            v-for="item in relatedServices"
            :key="item.id"
            :theme="isTor ? 'tor' : 'default'"
            :name="item.name"
            :description="item.description || t('servicesPage.defaultDescription')"
            :duration-minutes="item.duration_minutes"
            :duration-label="t('servicesPage.minutes')"
            :price-label="formatPriceLabel(item, selectedMaster)"
            :promo-price-label="isPromoVisible ? promoPricingFor(item, selectedMaster).promoLabel : ''"
            :promo-badge="isPromoVisible ? promoCopy.badge : ''"
            :promo-disclaimer="isPromoVisible ? promoCopy.disclaimer : ''"
            :action-label="pageCopy.primaryAction"
            :action-to="localePath({ path: bookingPath, query: { category_id: String(item.category_id), service_id: String(item.id), ...(selectedMaster ? { master_id: String(selectedMaster.id) } : {}) } }) as string"
            :card-to="{ path: `${servicesPath}/${category?.slug}/${item.slug}`, query: selectedMaster ? { master_id: String(selectedMaster.id) } : undefined }"
          />
        </div>
      </div>
      <div v-if="relatedArticles?.length" class="space-y-5">
        <div class="max-w-3xl space-y-2">
          <h2 :class="isTor ? 'text-3xl font-black uppercase tracking-[0.05em]' : 'text-2xl sm:text-3xl'">{{ t('blog.serviceDetailTitle') }}</h2>
          <p class="text-sm leading-7" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('blog.serviceDetailLead') }}</p>
        </div>

        <div class="grid gap-5 lg:grid-cols-3">
          <BlogArticleCardComponent
            v-for="article in relatedArticles"
            :key="article.id"
            :article="article"
            :theme="isTor ? 'tor' : 'default'"
            :to="localePath(`${blogPath}/${article.slug}`) as string"
          />
        </div>
      </div>
    </div>
  </section>
</template>
