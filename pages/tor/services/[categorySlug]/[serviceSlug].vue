<script setup lang="ts">
import type { ApiListResponse } from '~/types/api'
import type { Category } from '~/types/category'
import type { Service } from '~/types/service'
import ServiceCatalogCard from '~/components/catalog/ServiceCatalogCard.vue'

definePageMeta({
  layout: 'tor',
})

const api = useApi()
const { t, locale } = useLocale()
const { formatAmd } = useCurrency()
const route = useRoute()
const config = useRuntimeConfig()
const { localePath } = useLocalizedPath()
const { bookingPath, servicesPath } = useBrandContext()

const categorySlug = computed(() => String(route.params.categorySlug || '').trim())
const serviceSlug = computed(() => String(route.params.serviceSlug || '').trim())

const { data } = await useAsyncData(() => `tor-service-detail-${categorySlug.value}-${serviceSlug.value}-${locale.value}`, async () => {
  const [categoriesResponse, servicesResponse] = await Promise.all([
    api.get<ApiListResponse<Category>>('/categories', { brand: 'tor' }, { skipErrorToast: true }),
    api.get<ApiListResponse<Service>>('/services', { brand: 'tor' }, { skipErrorToast: true }),
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

const copy = computed(() => {
  if (locale.value === 'ru') {
    return {
      book: 'Записаться',
      provider: 'Tor',
      why: 'Почему эта услуга',
      related: 'Похожие услуги',
    }
  }

  if (locale.value === 'en') {
    return {
      book: 'Book now',
      provider: 'Tor',
      why: 'Why This Service',
      related: 'Related Services',
    }
  }

  return {
    book: 'Ամրագրել',
    provider: 'Tor',
    why: 'Ինչու ընտրել այս ծառայությունը',
    related: 'Նմանատիպ ծառայություններ',
  }
})

usePageSeo({
  title: () => service.value?.seo_title || `${service.value?.name || 'Tor Services'} | Tor`,
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
          '@type': 'Barbershop',
          name: 'Tor Barbershop',
          url: `${config.public.siteUrl}/tor`,
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
            name: 'Tor Services',
            item: `${config.public.siteUrl}/tor/services`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: category.value.name,
            item: `${config.public.siteUrl}/tor/services/${category.value.slug}`,
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
  <section class="container-shell py-14 text-stone-100">
    <div class="space-y-8">
      <NuxtLink
        v-if="category"
        :to="localePath(`${servicesPath}/${category.slug}`)"
        class="inline-flex items-center text-sm text-[#c58a3a] hover:text-[#efbf7f]"
      >
        ← {{ category.name }}
      </NuxtLink>

      <div v-if="service && category" class="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <div class="space-y-5">
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-[#c58a3a]">{{ category.name }}</p>
          <h1 class="text-4xl font-black uppercase tracking-[0.05em] sm:text-6xl">{{ service.name }}</h1>
          <p class="max-w-3xl text-base leading-7 text-stone-400">
            {{ service.description || t('servicesPage.defaultDescription') }}
          </p>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-[#c58a3a]">{{ t('servicesPage.durationLabel') }}</p>
              <p class="mt-2 text-2xl text-stone-100">{{ service.duration_minutes }} {{ t('servicesPage.minutes') }}</p>
            </div>
            <div class="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-[#c58a3a]">{{ t('servicesPage.priceLabel') }}</p>
              <p class="mt-2 text-2xl text-stone-100">
                {{ formatAmd(service.price_from) }}
                <span v-if="service.price_to">- {{ formatAmd(service.price_to) }}</span>
              </p>
            </div>
          </div>

          <NuxtLink
            :to="localePath({ path: bookingPath, query: { category_id: String(service.category_id), service_id: String(service.id) } })"
            class="inline-block"
          >
            <BaseButton size="lg" theme="tor">{{ copy.book }}</BaseButton>
          </NuxtLink>
        </div>

        <div class="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-[#c58a3a]">{{ copy.provider }}</p>
          <h2 class="mt-3 text-2xl font-black uppercase tracking-[0.04em]">{{ copy.why }}</h2>
          <div class="mt-5 space-y-4 text-sm leading-7 text-stone-300">
            <p>{{ service.description || t('servicesPage.defaultDescription') }}</p>
            <p>{{ category.description || t('servicesPage.seoDescription') }}</p>
          </div>
        </div>
      </div>

      <div v-if="relatedServices.length" class="space-y-4 pt-2">
        <h2 class="text-2xl font-black uppercase tracking-[0.05em] sm:text-4xl">{{ copy.related }}</h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ServiceCatalogCard
            v-for="item in relatedServices"
            :key="item.id"
            theme="tor"
            :name="item.name"
            :description="item.description || t('servicesPage.defaultDescription')"
            :duration-minutes="item.duration_minutes"
            :duration-label="t('servicesPage.minutes')"
            :price-label="formatAmd(item.price_from)"
            :action-label="copy.book"
            :action-to="localePath({ path: bookingPath, query: { category_id: String(item.category_id), service_id: String(item.id) } }) as string"
            :card-to="localePath(`${servicesPath}/${category?.slug}/${item.slug}`) as string"
          />
        </div>
      </div>
    </div>
  </section>
</template>
