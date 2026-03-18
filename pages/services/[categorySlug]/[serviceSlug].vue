<script setup lang="ts">
import type { ApiListResponse } from '~/types/api'
import type { Category } from '~/types/category'
import type { Service } from '~/types/service'

const api = useApi()
const { t, locale } = useLocale()
const { formatAmd } = useCurrency()
const route = useRoute()
const config = useRuntimeConfig()
const { localePath } = useLocalizedPath()
const { brand, bookingPath, servicesPath } = useBrandContext()

const categorySlug = computed(() => String(route.params.categorySlug || '').trim())
const serviceSlug = computed(() => String(route.params.serviceSlug || '').trim())

const { data } = await useAsyncData(() => `service-detail-${brand.value}-${categorySlug.value}-${serviceSlug.value}-${locale.value}`, async () => {
  const [categoriesResponse, servicesResponse] = await Promise.all([
    api.get<ApiListResponse<Category>>('/categories', { brand: brand.value }, { skipErrorToast: true }),
    api.get<ApiListResponse<Service>>('/services', { brand: brand.value }, { skipErrorToast: true }),
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

  return { category, service, relatedServices }
})

const category = computed(() => data.value?.category || null)
const service = computed(() => data.value?.service || null)
const relatedServices = computed(() => data.value?.relatedServices || [])

usePageSeo({
  title: () => service.value?.seo_title || `${service.value?.name || t('nav.services')} | Freya`,
  description: () => service.value?.seo_description || service.value?.description || t('servicesPage.defaultDescription'),
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
          '@type': 'BeautySalon',
          name: 'Freya Beauty Salon',
          url: config.public.siteUrl,
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'AMD',
          price: service.value.price_from,
          url: `${config.public.siteUrl}${route.path}`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: t('nav.services'),
            item: `${config.public.siteUrl}/services`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: category.value.name,
            item: `${config.public.siteUrl}/services/${category.value.slug}`,
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
  <section class="section-gap">
    <div class="container-shell space-y-8">
      <NuxtLink v-if="category" :to="localePath(`${servicesPath}/${category.slug}`)" class="inline-flex items-center text-sm text-sand-700 hover:text-sand-900">
        ← {{ category.name }}
      </NuxtLink>

      <div v-if="service && category" class="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <div class="space-y-5">
          <p class="text-xs uppercase tracking-[0.2em] text-sand-600">{{ category.name }}</p>
          <h1 class="text-3xl leading-tight sm:text-5xl">{{ service.name }}</h1>
          <p class="max-w-3xl text-base leading-7 text-[var(--muted)]">
            {{ service.description || t('servicesPage.defaultDescription') }}
          </p>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-3xl border border-sand-200 bg-white p-5">
              <p class="text-xs uppercase tracking-[0.14em] text-sand-600">{{ t('servicesPage.durationLabel') }}</p>
              <p class="mt-2 text-2xl">{{ service.duration_minutes }} {{ t('servicesPage.minutes') }}</p>
            </div>
            <div class="rounded-3xl border border-sand-200 bg-white p-5">
              <p class="text-xs uppercase tracking-[0.14em] text-sand-600">{{ t('servicesPage.priceLabel') }}</p>
              <p class="mt-2 text-2xl">
                {{ formatAmd(service.price_from) }}
                <span v-if="service.price_to">- {{ formatAmd(service.price_to) }}</span>
              </p>
            </div>
          </div>

          <NuxtLink
            :to="localePath({ path: bookingPath, query: { category_id: String(service.category_id), service_id: String(service.id) } })"
            class="inline-block"
          >
            <BaseButton size="lg">{{ t('nav.bookNow') }}</BaseButton>
          </NuxtLink>
        </div>

        <div class="rounded-[2rem] border border-sand-200 bg-[linear-gradient(180deg,rgba(255,251,244,0.95),rgba(245,234,216,0.9))] p-6 shadow-soft">
          <p class="text-xs uppercase tracking-[0.14em] text-sand-600">Freya</p>
          <h2 class="mt-3 text-2xl">{{ t('servicesPage.whyThisService') }}</h2>
          <div class="mt-5 space-y-4 text-sm leading-7 text-sand-800">
            <p>{{ service.description || t('servicesPage.defaultDescription') }}</p>
            <p>{{ category.description || t('servicesPage.seoDescription') }}</p>
          </div>
        </div>
      </div>

      <div v-if="relatedServices.length" class="space-y-4">
        <h2 class="text-2xl">{{ t('servicesPage.relatedServices') }}</h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="item in relatedServices"
            :key="item.id"
            :to="localePath(`${servicesPath}/${category?.slug}/${item.slug}`)"
            class="rounded-3xl border border-sand-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-sand-300"
          >
            <p class="text-lg">{{ item.name }}</p>
            <p class="mt-2 text-sm text-[var(--muted)]">{{ item.description || t('servicesPage.defaultDescription') }}</p>
            <p class="mt-4 text-sm font-semibold text-sand-900">{{ formatAmd(item.price_from) }}</p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
