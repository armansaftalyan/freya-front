<script setup lang="ts">
import { storeToRefs } from 'pinia'

const { t } = useLocale()
const servicesStore = useServicesStore()
const { categories, services } = storeToRefs(servicesStore)

await useAsyncData('home-services', async () => {
  await servicesStore.init()
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
      <div class="mb-8 flex items-end justify-between gap-3">
        <h2 class="text-3xl sm:text-4xl">{{ t('homePage.services.title') }}</h2>
        <NuxtLink to="/services"><BaseButton variant="ghost">{{ t('homePage.services.all') }}</BaseButton></NuxtLink>
      </div>
      <div class="space-y-8">
        <div v-for="entry in grouped" :key="entry.category.id" class="space-y-4">
          <h3 class="text-2xl">{{ entry.category.name }}</h3>
          <div class="grid gap-4 md:grid-cols-3">
            <Card v-for="service in entry.items" :key="service.id" class="fade-in">
              <p class="text-xl">{{ service.name }}</p>
              <p class="mt-2 text-sm text-[var(--muted)]">{{ service.duration_minutes }} {{ t('homePage.services.durationUnit') }}</p>
              <p class="mt-2 text-sm font-semibold text-sand-700">${{ service.price_from }} <span v-if="service.price_to">- ${{ service.price_to }}</span></p>
              <NuxtLink to="/booking" class="mt-4 inline-block"><BaseButton size="sm">{{ t('nav.bookNow') }}</BaseButton></NuxtLink>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
