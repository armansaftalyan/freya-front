<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Card from "~/components/base/Card.vue";

const { t, locale } = useLocale()
const { localePath } = useLocalizedPath()
const { brand, bookingPath, rootPath } = useBrandContext()
const { formatPriceLabel } = useServicePricing()
const { isVisible: isPromoVisible, promoCopy, promoPricingFor } = useFirstBookingPromo()
const servicesStore = useServicesStore()
const { categories, services } = storeToRefs(servicesStore)

await useAsyncData(() => `home-services-${brand.value}-${locale.value}`, async () => {
  await servicesStore.init()

  return true
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
            <Card v-for="service in entry.items" :key="service.id" class="fade-in flex h-full flex-col">
              <div class="flex-1">
                <div class="flex items-start justify-between gap-3">
                  <p class="text-2xl leading-tight text-sand-950">{{ service.name }}</p>
                  <span class="shrink-0 whitespace-nowrap rounded-full border border-sand-300 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-sand-700">
                    {{ service.duration_minutes }} {{ t('homePage.services.durationUnit') }}
                  </span>
                </div>
                <p class="mt-3 text-sm leading-6 text-[var(--muted)]">{{ service.description }}</p>
              </div>
              <div class="mt-auto flex items-end justify-between gap-3 pt-6">
                <div>
                  <p
                    v-if="isPromoVisible"
                    class="mb-1 inline-flex rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-rose-700"
                  >
                    {{ promoCopy.badge }}
                  </p>
                  <p v-if="isPromoVisible" class="text-xs text-sand-500 line-through">
                    {{ formatPriceLabel(service) }}
                  </p>
                  <p class="text-base font-semibold text-sand-700">
                    {{ isPromoVisible ? promoPricingFor(service).promoLabel : formatPriceLabel(service) }}
                  </p>
                </div>
                <NuxtLink :to="localePath({ path: bookingPath, query: { category_id: String(service.category_id), service_id: String(service.id) } })" class="inline-block">
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
