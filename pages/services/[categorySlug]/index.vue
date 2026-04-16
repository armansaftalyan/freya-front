<script setup lang="ts">
import type { ApiListResponse } from '~/types/api'
import type { Category } from '~/types/category'
import type { Master } from '~/types/master'
import type { Service } from '~/types/service'
import ServiceCatalogCard from '~/components/catalog/ServiceCatalogCard.vue'

const api = useApi()
const { t, locale } = useLocale()
const { localePath } = useLocalizedPath()
const { formatPriceLabel } = useServicePricing()
const route = useRoute()
const config = useRuntimeConfig()
const { brand, isTor, servicesPath, bookingPath } = useBrandContext()

const categorySlug = computed(() => String(route.params.categorySlug || '').trim())
const selectedMasterId = computed(() => {
  const raw = typeof route.query.master_id === 'string' ? Number(route.query.master_id) : NaN
  return Number.isInteger(raw) && raw > 0 ? raw : null
})

const { data } = await useAsyncData(() => `service-category-${brand.value}-${categorySlug.value}-${locale.value}-${selectedMasterId.value ?? 'none'}`, async () => {
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

  const services = servicesResponse.data.filter((item) => item.category_id === category.id)
  const suggestions = servicesResponse.data
    .filter((item) => item.category_id !== category.id)
    .sort((left, right) => left.id - right.id)
    .slice(0, 3)

  return {
    category,
    services,
    suggestions,
    categories: categoriesResponse.data,
    selectedMaster: selectedMasterResponse?.data ?? null,
  }
})

const category = computed(() => data.value?.category || null)
const services = computed(() => data.value?.services || [])
const suggestions = computed(() => data.value?.suggestions || [])
const categories = computed(() => data.value?.categories || [])
const selectedMaster = computed(() => data.value?.selectedMaster || null)
const servicesCollectionLabel = computed(() => {
  if (brand.value !== 'tor') {
    return t('nav.services')
  }

  if (locale.value === 'ru') return 'Услуги Tor'
  if (locale.value === 'en') return 'Tor Services'
  return 'Tor ծառայություններ'
})
const suggestionCategoryNameById = computed(() => new Map(categories.value.map((item) => [item.id, item.name])))
const pageCopy = computed(() => {
  if (brand.value === 'tor') {
    if (locale.value === 'ru') {
      return {
        back: 'Все услуги',
        eyebrow: 'Каталог',
        primaryAction: 'Записаться',
        suggestionsTitle: 'Вам может подойти',
        suggestionsLead: 'Другие услуги Tor, которые часто выбирают вместе с этой категорией.',
      }
    }

    if (locale.value === 'en') {
      return {
        back: 'All services',
        eyebrow: 'Catalog',
        primaryAction: 'Book now',
        suggestionsTitle: 'You May Also Like',
        suggestionsLead: 'Other Tor services that pair well with this category.',
      }
    }

    return {
      back: 'Բոլոր ծառայությունները',
      eyebrow: 'Կատալոգ',
      primaryAction: 'Ամրագրել',
      suggestionsTitle: 'Ձեզ կարող է հետաքրքրել նաև',
      suggestionsLead: 'Tor-ի այլ ծառայություններ, որոնք հաճախ ընտրում են նաև այս կատեգորիայի հետ։',
    }
  }

  if (locale.value === 'ru') {
    return {
      back: t('nav.services'),
      eyebrow: t('servicesPage.catalog'),
      primaryAction: 'Открыть',
      suggestionsTitle: 'Вам может понравиться',
      suggestionsLead: 'Другие услуги Freya, которые часто выбирают вместе с этой категорией.',
    }
  }

  if (locale.value === 'en') {
    return {
      back: t('nav.services'),
      eyebrow: t('servicesPage.catalog'),
      primaryAction: 'Open',
      suggestionsTitle: 'You May Also Like',
      suggestionsLead: 'Other Freya services that pair well with this category.',
    }
  }

  return {
    back: t('nav.services'),
    eyebrow: t('servicesPage.catalog'),
    primaryAction: 'Բացել',
    suggestionsTitle: 'Ձեզ կարող է դուր գալ նաև',
    suggestionsLead: 'Freya-ի այլ ծառայություններ, որոնք հաճախ ընտրում են նաև այս կատեգորիայի հետ։',
  }
})

usePageSeo({
  title: () => {
    if (category.value?.seo_title) return category.value.seo_title
    const categoryName = category.value?.name || t('nav.services')
    if (brand.value === 'tor') {
      if (locale.value === 'ru') return `${categoryName} в Ереване | Tor Barbershop`
      if (locale.value === 'en') return `${categoryName} in Yerevan | Tor Barbershop`
      return `${categoryName} Երևանում | Tor Barbershop`
    }
    if (locale.value === 'ru') return `${categoryName} в Ереване | Freya Beauty Salon`
    if (locale.value === 'en' && category.value?.slug === 'hair') return 'Hair Services Yerevan | Cuts, Coloring & Styling | Freya'
    if (locale.value === 'en' && category.value?.slug === 'nails') return 'Manicure & Pedicure Yerevan | Gel, Design & Care | Freya'
    if (locale.value === 'en') return `${categoryName} in Yerevan | Freya Beauty Salon`
    return `${categoryName} Երևանում | Freya Beauty Salon`
  },
  description: () => category.value?.seo_description || category.value?.description || (brand.value === 'tor' ? pageCopy.value.suggestionsLead : t('servicesPage.seoDescription')),
  ogType: 'website',
})

useStructuredData(() => {
  if (!category.value) {
    return null
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.value.name,
    description: category.value.seo_description || category.value.description || undefined,
    url: `${config.public.siteUrl}${route.path}`,
    breadcrumb: {
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
          item: `${config.public.siteUrl}${route.path}`,
        },
      ],
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: services.value.map((service, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${config.public.siteUrl}${servicesPath.value}/${category.value?.slug}/${service.slug}`,
        name: service.name,
      })),
    },
  }
})
</script>

<template>
  <section :class="isTor ? 'container-shell py-14 text-stone-100' : 'section-gap'">
    <div :class="isTor ? 'space-y-8' : 'container-shell space-y-8'">
      <NuxtLink
        :to="localePath(servicesPath)"
        class="inline-flex items-center text-sm"
        :class="isTor ? 'text-[#c58a3a] hover:text-[#efbf7f]' : 'text-sand-700 hover:text-sand-900'"
      >
        ← {{ pageCopy.back }}
      </NuxtLink>

      <div v-if="category" class="space-y-4">
        <p class="text-xs uppercase tracking-[0.2em]" :class="isTor ? 'font-semibold text-[#c58a3a]' : 'text-sand-600'">{{ pageCopy.eyebrow }}</p>
        <h1 :class="isTor ? 'text-4xl font-black uppercase tracking-[0.05em] sm:text-6xl' : 'text-3xl leading-tight sm:text-5xl'">{{ category.name }}</h1>
        <p
          v-if="category.description"
          class="max-w-3xl text-base leading-7"
          :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'"
        >
          {{ category.description }}
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ServiceCatalogCard
          v-for="service in services"
          :key="service.id"
          :theme="isTor ? 'tor' : 'default'"
          :name="service.name"
          :description="service.description || t('servicesPage.defaultDescription')"
          :duration-minutes="service.duration_minutes"
          :duration-label="t('servicesPage.minutes')"
          :price-label="formatPriceLabel(service, selectedMaster)"
          :action-label="isTor ? pageCopy.primaryAction : pageCopy.primaryAction"
          :action-to="isTor
            ? localePath({ path: bookingPath, query: { category_id: String(service.category_id), service_id: String(service.id), ...(selectedMaster ? { master_id: String(selectedMaster.id) } : {}) } }) as string
            : localePath({ path: `${servicesPath}/${category?.slug}/${service.slug}`, query: selectedMaster ? { master_id: String(selectedMaster.id) } : undefined }) as string"
          :card-to="isTor ? { path: `${servicesPath}/${category?.slug}/${service.slug}`, query: selectedMaster ? { master_id: String(selectedMaster.id) } : undefined } : ''"
        />
      </div>

      <div v-if="suggestions.length" class="space-y-4" :class="isTor ? 'pt-4' : ''">
        <div class="max-w-3xl space-y-3">
          <h2 :class="isTor ? 'text-2xl font-black uppercase tracking-[0.05em] sm:text-4xl' : 'text-2xl sm:text-3xl'">{{ pageCopy.suggestionsTitle }}</h2>
          <p class="text-sm leading-6" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ pageCopy.suggestionsLead }}</p>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ServiceCatalogCard
            v-for="item in suggestions"
            :key="item.id"
            :theme="isTor ? 'tor' : 'default'"
            :eyebrow="suggestionCategoryNameById.get(item.category_id) || ''"
            :name="item.name"
            :description="item.description || t('servicesPage.defaultDescription')"
            :duration-minutes="item.duration_minutes"
            :duration-label="t('servicesPage.minutes')"
            :price-label="formatPriceLabel(item, selectedMaster)"
            :action-label="isTor ? pageCopy.primaryAction : t('nav.bookNow')"
            :action-to="localePath({ path: bookingPath, query: { category_id: String(item.category_id), service_id: String(item.id), ...(selectedMaster ? { master_id: String(selectedMaster.id) } : {}) } }) as string"
            :card-to="{ path: `${servicesPath}/${categories.find((categoryItem) => categoryItem.id === item.category_id)?.slug || category?.slug}/${item.slug}`, query: selectedMaster ? { master_id: String(selectedMaster.id) } : undefined }"
          />
        </div>
      </div>
    </div>
  </section>
</template>
