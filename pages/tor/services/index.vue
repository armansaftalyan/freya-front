<script setup lang="ts">
import type { ApiListResponse } from '~/types/api'
import type { Category } from '~/types/category'
import type { Service } from '~/types/service'
import ServiceCatalogCard from '~/components/catalog/ServiceCatalogCard.vue'
import FaqSection from '~/components/sections/FaqSection.vue'

definePageMeta({
  layout: 'tor',
})

const api = useApi()
const route = useRoute()
const { locale, t } = useLocale()
const { localePath } = useLocalizedPath()
const { formatAmd } = useCurrency()
const { siteUrl } = useSiteMeta()
const { bookingPath, servicesPath } = useBrandContext()
const { faqCopy } = usePageFaqContent('tor', 'services')

const copy = computed(() => {
  if (locale.value === 'ru') {
    return {
      title: 'Услуги Tor',
      lead: 'Мужские стрижки, окантовка, борода и мужской уход в отдельной подаче Tor.',
      back: 'Назад в Tor',
      cta: 'Записаться',
    }
  }

  if (locale.value === 'en') {
    return {
      title: 'Tor Services',
      lead: 'Cuts, beard shaping, line-ups and focused grooming under the Tor direction.',
      back: 'Back to Tor',
      cta: 'Book now',
    }
  }

  return {
    title: 'Tor ծառայություններ',
    lead: 'Տղամարդկանց սանրվածք, մորուք, եզրագծում և տղամարդկանց խնամք Tor ուղղությամբ։',
    back: 'Վերադառնալ Tor',
    cta: 'Ամրագրել',
  }
})

const { data } = await useAsyncData(() => `tor-services-page-${locale.value}`, async () => {
  const [categoriesResponse, servicesResponse] = await Promise.all([
    api.get<ApiListResponse<Category>>('/categories', { brand: 'tor' }, { skipErrorToast: true }),
    api.get<ApiListResponse<Service>>('/services', { brand: 'tor' }, { skipErrorToast: true }),
  ])

  return {
    categories: categoriesResponse.data,
    services: servicesResponse.data,
  }
})

const categories = computed(() => data.value?.categories || [])
const services = computed(() => data.value?.services || [])
const menCategory = computed(() => categories.value.find(item => item.slug === 'men-hair') || null)
const categoryUrl = computed(() => menCategory.value ? localePath(`/tor/services/${menCategory.value.slug}`) : localePath('/tor/services'))
const categoryCta = computed(() => {
  if (locale.value === 'ru') return 'Все →'
  if (locale.value === 'en') return 'All →'
  return 'Բոլորը →'
})
const menServices = computed(() => {
  if (!menCategory.value) return []
  return services.value.filter(item => item.category_id === menCategory.value?.id)
})
const detailPathFor = (service: Service) => localePath(`${servicesPath.value}/${menCategory.value?.slug || 'men-hair'}/${service.slug}`) as string

usePageSeo({
  title: () => copy.value.title,
  description: () => copy.value.lead,
})

useStructuredData(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      name: copy.value.title,
      description: copy.value.lead,
      url: `${siteUrl.value}${route.path}`,
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqCopy.value.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ],
}))
</script>

<template>
  <section class="container-shell py-14 text-stone-100">
    <NuxtLink :to="localePath('/tor')" class="inline-flex text-sm font-semibold uppercase tracking-[0.16em] text-[#c58a3a]">
      ← {{ copy.back }}
    </NuxtLink>

    <div class="mt-6 max-w-3xl">
      <h1 class="text-4xl font-black uppercase tracking-[0.06em] sm:text-6xl">{{ copy.title }}</h1>
      <p class="mt-4 text-stone-300">{{ copy.lead }}</p>
    </div>

    <div v-if="menCategory" class="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-[1.9rem] leading-tight text-stone-100 sm:text-[2.1rem]">{{ menCategory.name }}</h2>
      <NuxtLink
        :to="categoryUrl"
        class="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-[#d8a15a] transition hover:border-[#c58a3a]/40 hover:text-[#efbf7f]"
      >
        {{ categoryCta }}
      </NuxtLink>
    </div>

    <div class="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <ServiceCatalogCard
        v-for="service in menServices"
        :key="service.id"
        class="fade-in"
        theme="tor"
        :name="service.name"
        :description="service.description || ''"
        :duration-minutes="service.duration_minutes"
        :duration-label="t('servicesPage.minutes')"
        :price-label="`${formatAmd(service.price_from)}${service.price_to && service.price_to !== service.price_from ? ` - ${formatAmd(service.price_to)}` : ''}`"
        :action-label="copy.cta"
        :action-to="localePath({ path: bookingPath, query: { category_id: String(service.category_id), service_id: String(service.id) } }) as string"
        :card-to="detailPathFor(service)"
      />
    </div>

    <FaqSection
      theme="tor"
      :bordered="false"
      :eyebrow="faqCopy.eyebrow"
      :title="faqCopy.title"
      :lead="faqCopy.lead"
      :items="faqCopy.items"
    />
  </section>
</template>
