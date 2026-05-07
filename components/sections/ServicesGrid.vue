<script setup lang="ts">
import { storeToRefs } from 'pinia'
import ServiceCatalogCard from '~/components/catalog/ServiceCatalogCard.vue'

const { t, locale } = useLocale()
const { localePath } = useLocalizedPath()
const { brand, bookingPath, rootPath, servicesPath } = useBrandContext()
const { formatPriceLabel } = useServicePricing()
const { isVisible: isPromoVisible, promoCopy, promoPricingFor } = useFirstBookingPromo()
const servicesStore = useServicesStore()
const { categories, services } = storeToRefs(servicesStore)

await useAsyncData(() => `home-services-${brand.value}-${locale.value}`, async () => {
  await servicesStore.init()

  return true
})

const ensureHomeServices = async () => {
  const hasBrandCategories = categories.value.some(category => category.brand === brand.value)
  const hasBrandServices = services.value.some(service => service.brand === brand.value)

  if (hasBrandCategories && hasBrandServices) {
    return
  }

  await servicesStore.init()
}

onMounted(() => {
  void ensureHomeServices()
})

watch([() => brand.value, () => locale.value], () => {
  void ensureHomeServices()
})

const grouped = computed(() =>
  categories.value
    .filter((category) => category.brand === brand.value)
    .map((category) => ({
      category,
      items: services.value
        .filter((service) => service.brand === brand.value && service.category_id === category.id)
        .slice(0, 3),
    }))
    .filter((entry) => entry.items.length),
)

const detailPathFor = (categorySlug: string, service: { slug: string }) =>
  localePath(`${servicesPath.value}/${categorySlug}/${service.slug}`) as string
</script>

<template>
  <section class="section-gap">
    <div class="container-shell">
      <div class="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 class="text-4xl leading-tight tracking-[-0.02em] text-sand-950 sm:text-5xl">{{ t('homePage.services.title') }}</h2>
        <NuxtLink :to="localePath(`${rootPath}/services`)" class="inline-flex">
          <BaseButton variant="secondary" size="sm">
            {{ t('homePage.services.all') }}
            <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </BaseButton>
        </NuxtLink>
      </div>
      <div class="space-y-8">
        <div v-for="entry in grouped" :key="entry.category.id" class="space-y-4">
          <h3 class="text-[1.9rem] leading-tight text-sand-950 sm:text-[2.1rem]">{{ entry.category.name }}</h3>
          <div class="grid gap-4 md:grid-cols-3">
            <ServiceCatalogCard
              v-for="service in entry.items"
              :key="service.id"
              class="fade-in"
              :name="service.name"
              :description="service.description"
              :duration-minutes="service.duration_minutes"
              :duration-label="t('homePage.services.durationUnit')"
              :price-label="formatPriceLabel(service)"
              :promo-price-label="isPromoVisible ? promoPricingFor(service).promoLabel : ''"
              :promo-badge="isPromoVisible ? promoCopy.badge : ''"
              :promo-disclaimer="isPromoVisible ? promoCopy.disclaimer : ''"
              :action-label="t('nav.bookNow')"
              :action-to="localePath({ path: bookingPath, query: { category_id: String(service.category_id), service_id: String(service.id) } }) as string"
              :card-to="detailPathFor(entry.category.slug, service)"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
