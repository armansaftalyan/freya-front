<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Card from "~/components/base/Card.vue";
import SkeletonBlock from "~/components/shared/SkeletonBlock.vue";

const { t, locale } = useLocale()
const { localePath } = useLocalizedPath()
const { formatAmd } = useCurrency()
const route = useRoute()
const config = useRuntimeConfig()
const { brand, bookingPath } = useBrandContext()

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
          <h2 class="text-[1.9rem] leading-tight text-sand-950 sm:text-[2.1rem]">{{ entry.category.name }}</h2>
          <div class="grid gap-4 md:grid-cols-3">
            <Card v-for="service in entry.items" :key="service.id" class="fade-in flex h-full flex-col">
              <div class="flex items-start justify-between gap-3">
                <p class="text-2xl leading-tight text-sand-950">{{ service.name }}</p>
                <span class="shrink-0 whitespace-nowrap rounded-full border border-sand-300 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-sand-700">
                  {{ service.duration_minutes }} {{ t('homePage.services.durationUnit') }}
                </span>
              </div>
              <p class="mt-3 min-h-[4.5rem] text-sm leading-6 text-[var(--muted)]">{{ service.description || t('servicesPage.defaultDescription') }}</p>
              <div class="mt-5 flex items-end justify-between gap-3">
                <p class="text-base font-semibold text-sand-700">
                  {{ formatAmd(service.price_from) }}
                  <span v-if="service.price_to && service.price_to !== service.price_from" class="text-[var(--muted)]">- {{ formatAmd(service.price_to) }}</span>
                </p>
                <NuxtLink :to="localePath(bookingPath)" class="inline-block">
                  <BaseButton size="sm">{{ t('nav.bookNow') }}</BaseButton>
                </NuxtLink>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
