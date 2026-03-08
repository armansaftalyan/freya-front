<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Card from "~/components/base/Card.vue";
import SkeletonBlock from "~/components/shared/SkeletonBlock.vue";

const { t } = useLocale()
const { formatAmd } = useCurrency()

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
      <div class="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-sand-600">{{ t('servicesPage.catalog') }}</p>
          <h1 class="text-3xl leading-tight sm:text-5xl">{{ t('nav.services') }}</h1>
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
        <NuxtLink
          v-for="service in filtered"
          :key="service.id"
          to="/booking"
          class="group block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-600/50 focus-visible:ring-offset-2"
        >
          <Card class="fade-in cursor-pointer transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-sand-300 group-hover:shadow-lg group-active:translate-y-0 group-active:shadow-soft">
            <div class="flex items-start justify-between gap-3">
              <p class="text-xl leading-tight sm:text-2xl">{{ service.name }}</p>
              <span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand-100 text-sand-700 transition-colors group-hover:bg-sand-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </span>
            </div>
            <p class="mt-2 line-clamp-2 text-sm text-[var(--muted)]">{{ service.description || t('servicesPage.defaultDescription') }}</p>
            <div class="mt-4 flex items-center justify-between">
              <p class="text-sm text-sand-700">{{ service.duration_minutes }} {{ t('servicesPage.minutes') }}</p>
              <p class="text-sm font-semibold text-sand-900">
                {{ formatAmd(service.price_from) }}
                <span v-if="service.price_to">- {{ formatAmd(service.price_to) }}</span>
              </p>
            </div>
            <div class="mt-5">
              <span class="inline-flex items-center gap-2 rounded-full bg-sand-700 px-4 py-2 text-sm font-semibold text-white shadow-soft transition-all duration-200 group-hover:bg-sand-900 group-hover:shadow-md">
                {{ t('nav.bookNow') }}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </span>
            </div>
          </Card>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
