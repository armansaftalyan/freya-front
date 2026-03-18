<script setup lang="ts">
import type { ApiListResponse } from '~/types/api'
import type { Category } from '~/types/category'
import type { Service } from '~/types/service'

const api = useApi()
const { t, locale } = useLocale()
const { localePath } = useLocalizedPath()
const { formatAmd } = useCurrency()
const route = useRoute()
const config = useRuntimeConfig()
const { brand } = useBrandContext()

const categorySlug = computed(() => String(route.params.categorySlug || '').trim())

const { data } = await useAsyncData(() => `service-category-${categorySlug.value}-${locale.value}`, async () => {
  const [categoriesResponse, servicesResponse] = await Promise.all([
    api.get<ApiListResponse<Category>>('/categories', { brand: brand.value }, { skipErrorToast: true }),
    api.get<ApiListResponse<Service>>('/services', { brand: brand.value }, { skipErrorToast: true }),
  ])

  const category = categoriesResponse.data.find((item) => item.slug === categorySlug.value) || null

  if (!category) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found' })
  }

  const services = servicesResponse.data.filter((item) => item.category_id === category.id)

  return { category, services }
})

const category = computed(() => data.value?.category || null)
const services = computed(() => data.value?.services || [])

usePageSeo({
  title: () => category.value?.seo_title || `${category.value?.name || t('nav.services')} | Freya`,
  description: () => category.value?.seo_description || category.value?.description || t('servicesPage.seoDescription'),
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
          name: t('nav.services'),
          item: `${config.public.siteUrl}/services`,
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
        url: `${config.public.siteUrl}/services/${category.value?.slug}/${service.slug}`,
        name: service.name,
      })),
    },
  }
})
</script>

<template>
  <section class="section-gap">
    <div class="container-shell space-y-8">
      <NuxtLink :to="localePath('/services')" class="inline-flex items-center text-sm text-sand-700 hover:text-sand-900">
        ← {{ t('nav.services') }}
      </NuxtLink>

      <div v-if="category" class="space-y-4">
        <p class="text-xs uppercase tracking-[0.2em] text-sand-600">{{ t('servicesPage.catalog') }}</p>
        <h1 class="text-3xl leading-tight sm:text-5xl">{{ category.name }}</h1>
        <p v-if="category.description" class="max-w-3xl text-base leading-7 text-[var(--muted)]">
          {{ category.description }}
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="service in services"
          :key="service.id"
          :to="localePath(`/services/${category?.slug}/${service.slug}`)"
          class="group flex h-full flex-col rounded-3xl border border-sand-200 bg-white p-6 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-sand-300 hover:shadow-lg"
        >
          <div class="flex items-start justify-between gap-3">
            <p class="min-h-[3.5rem] text-xl leading-tight sm:text-2xl">{{ service.name }}</p>
            <span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand-100 text-sand-700 transition-colors group-hover:bg-sand-200">→</span>
          </div>
          <p class="mt-2 min-h-[4.5rem] text-sm text-[var(--muted)]">{{ service.description || t('servicesPage.defaultDescription') }}</p>
          <div class="mt-auto flex items-center justify-between pt-4">
            <p class="text-sm text-sand-700">{{ service.duration_minutes }} {{ t('servicesPage.minutes') }}</p>
            <p class="text-sm font-semibold text-sand-900">
              {{ formatAmd(service.price_from) }}
              <span v-if="service.price_to">- {{ formatAmd(service.price_to) }}</span>
            </p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
