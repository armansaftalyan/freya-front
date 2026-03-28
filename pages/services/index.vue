<script setup lang="ts">
import { storeToRefs } from 'pinia'
import ServiceCatalogCard from "~/components/catalog/ServiceCatalogCard.vue";
import FaqSection from "~/components/sections/FaqSection.vue";
import SeoIntentSection from "~/components/sections/SeoIntentSection.vue";
import SkeletonBlock from "~/components/shared/SkeletonBlock.vue";

const { t, locale } = useLocale()
const { localePath } = useLocalizedPath()
const { formatAmd } = useCurrency()
const route = useRoute()
const config = useRuntimeConfig()
const { brand, bookingPath, servicesPath } = useBrandContext()
const { faqCopy } = usePageFaqContent('freya', 'services')
const categoryCta = computed(() => {
  if (locale.value === 'ru') return 'Все →'
  if (locale.value === 'en') return 'All →'
  return 'Բոլորը →'
})

usePageSeo({
  title: () => `Freya - ${t('nav.services')}`,
  description: () => t('servicesPage.seoDescription'),
})

const servicesStore = useServicesStore()
const { categories, services, loading } = storeToRefs(servicesStore)
await useAsyncData(() => `services-page-${brand.value}-${locale.value}`, async () => {
  await servicesStore.init()

  return true
})

const categoryById = computed(() => new Map(categories.value.map((category) => [category.id, category])))
const grouped = computed(() =>
  categories.value
    .filter((category) => category.brand === brand.value)
    .map((category) => ({
      category,
      items: services.value.filter((service) => service.brand === brand.value && service.category_id === category.id),
    }))
    .filter((entry) => entry.items.length),
)

useStructuredData(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      name: t('nav.services'),
      url: `${config.public.siteUrl}${route.path}`,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: services.value.map((service, index) => {
          const category = categoryById.value.get(service.category_id)

          return {
            '@type': 'ListItem',
            position: index + 1,
            url: `${config.public.siteUrl}/services/${category?.slug || 'category'}/${service.slug}`,
            name: service.name,
          }
        }),
      },
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
  <section class="section-gap">
    <div class="container-shell space-y-8">
      <div class="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-sand-700">{{ t('servicesPage.catalog') }}</p>
          <h1 class="text-3xl leading-tight sm:text-5xl">{{ t('nav.services') }}</h1>
        </div>
        <NuxtLink :to="localePath(bookingPath)"><BaseButton size="lg">{{ t('nav.bookNow') }}</BaseButton></NuxtLink>
      </div>

      <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonBlock v-for="idx in 6" :key="idx" class="h-48" />
      </div>

      <div v-else class="space-y-8">
        <div v-for="entry in grouped" :key="entry.category.id" class="space-y-4">
          <div class="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 class="text-[1.9rem] leading-tight text-sand-950 sm:text-[2.1rem]">{{ entry.category.name }}</h2>
            <NuxtLink
              :to="localePath(`${brand === 'tor' ? '/tor' : ''}/services/${entry.category.slug}`)"
              class="inline-flex items-center rounded-full border border-sand-300 px-4 py-2 text-sm font-semibold text-sand-800 transition hover:border-sand-500 hover:text-sand-950"
            >
              {{ categoryCta }}
            </NuxtLink>
          </div>
          <div class="grid gap-4 md:grid-cols-3">
            <ServiceCatalogCard
              v-for="service in entry.items"
              :key="service.id"
              class="fade-in"
              :name="service.name"
              :description="service.description || t('servicesPage.defaultDescription')"
              :duration-minutes="service.duration_minutes"
              :duration-label="t('homePage.services.durationUnit')"
              :price-label="`${formatAmd(service.price_from)}${service.price_to && service.price_to !== service.price_from ? ` - ${formatAmd(service.price_to)}` : ''}`"
              :action-label="t('nav.bookNow')"
              :action-to="localePath(bookingPath) as string"
              :card-to="localePath(`${servicesPath}/${entry.category.slug}/${service.slug}`) as string"
            />
          </div>
        </div>
      </div>

      <SeoIntentSection section="services" />

      <FaqSection
        :eyebrow="faqCopy.eyebrow"
        :title="faqCopy.title"
        :lead="faqCopy.lead"
        :items="faqCopy.items"
      />
    </div>
  </section>
</template>
