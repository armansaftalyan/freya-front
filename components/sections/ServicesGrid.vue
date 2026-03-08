<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Card from "~/components/base/Card.vue";

const { t } = useLocale()
const { formatAmd } = useCurrency()
const servicesStore = useServicesStore()
const { categories, services } = storeToRefs(servicesStore)

await useAsyncData('home-services', async () => {
  await servicesStore.init()

  return true
})

const grouped = computed(() =>
  categories.value
    .map((category) => ({
      category,
      items: services.value.filter((service) => service.category_id === category.id).slice(0, 3),
    }))
    .filter((entry) => entry.items.length),
)
</script>

<template>
  <section class="section-gap">
    <div class="container-shell">
      <div class="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 class="text-3xl leading-tight sm:text-4xl">{{ t('homePage.services.title') }}</h2>
        <NuxtLink to="/services" class="inline-flex">
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
          <h3 class="text-2xl">{{ entry.category.name }}</h3>
          <div class="grid gap-4 md:grid-cols-3">
            <Card v-for="service in entry.items" :key="service.id" class="fade-in">
              <p class="text-xl">{{ service.name }}</p>
              <p class="mt-2 text-sm text-[var(--muted)]">{{ service.duration_minutes }} {{ t('homePage.services.durationUnit') }}</p>
              <p class="mt-2 text-sm font-semibold text-sand-700">{{ formatAmd(service.price_from) }} <span v-if="service.price_to">- {{ formatAmd(service.price_to) }}</span></p>
              <NuxtLink to="/booking" class="mt-4 inline-block"><BaseButton size="sm">{{ t('nav.bookNow') }}</BaseButton></NuxtLink>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
