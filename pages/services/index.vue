<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Card from "~/components/base/Card.vue";
import SkeletonBlock from "~/components/shared/SkeletonBlock.vue";

const { t } = useLocale()

useSeoMeta({
  title: () => `Freya - ${t('nav.services')}`,
  description: () => t('servicesPage.seoDescription'),
  ogTitle: () => `Freya - ${t('nav.services')}`,
  ogDescription: () => t('servicesPage.seoDescription'),
})

const servicesStore = useServicesStore()
const { categories, services, loading } = storeToRefs(servicesStore)
const activeCategory = ref<number | null>(null)

await useAsyncData('services-page', async () => {
  await servicesStore.init()

  return true
})

const filtered = computed(() => {
  if (!activeCategory.value) return services.value
  return services.value.filter((service) => service.category_id === activeCategory.value)
})
</script>

<template>
  <section class="section-gap">
    <div class="container-shell space-y-8">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-sand-600">{{ t('servicesPage.catalog') }}</p>
          <h1 class="text-3xl sm:text-5xl">{{ t('nav.services') }}</h1>
        </div>
        <NuxtLink to="/booking"><BaseButton size="lg">{{ t('nav.bookNow') }}</BaseButton></NuxtLink>
      </div>

      <div class="flex flex-wrap gap-2">
        <BaseButton :variant="activeCategory === null ? 'primary' : 'secondary'" size="sm" @click="activeCategory = null">
          {{ t('servicesPage.all') }}
        </BaseButton>
        <BaseButton
          v-for="category in categories"
          :key="category.id"
          :variant="activeCategory === category.id ? 'primary' : 'secondary'"
          size="sm"
          @click="activeCategory = category.id"
        >
          {{ category.name }}
        </BaseButton>
      </div>

      <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonBlock v-for="idx in 6" :key="idx" class="h-48" />
      </div>

      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card v-for="service in filtered" :key="service.id" class="fade-in">
          <p class="text-2xl">{{ service.name }}</p>
          <p class="mt-2 line-clamp-2 text-sm text-[var(--muted)]">{{ service.description || t('servicesPage.defaultDescription') }}</p>
          <div class="mt-4 flex items-center justify-between">
            <p class="text-sm text-sand-700">{{ service.duration_minutes }} {{ t('servicesPage.minutes') }}</p>
            <p class="text-sm font-semibold text-sand-900">
              ${{ service.price_from }}
              <span v-if="service.price_to">- ${{ service.price_to }}</span>
            </p>
          </div>
          <NuxtLink to="/booking" class="mt-5 inline-block"><BaseButton>{{ t('nav.bookNow') }}</BaseButton></NuxtLink>
        </Card>
      </div>
    </div>
  </section>
</template>
