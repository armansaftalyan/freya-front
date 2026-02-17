<script setup lang="ts">
import { storeToRefs } from 'pinia'

useSeoMeta({
  title: 'Services',
  description: 'Каталог услуг салона с фильтром по категориям.',
  ogTitle: 'Aurum Services',
  ogDescription: 'Категории, длительность и диапазон цен. Book now онлайн.',
})

const servicesStore = useServicesStore()
const { categories, services, loading } = storeToRefs(servicesStore)
const activeCategory = ref<number | null>(null)

await useAsyncData('services-page', async () => {
  await servicesStore.init()
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
          <p class="text-xs uppercase tracking-[0.2em] text-sand-600">Catalog</p>
          <h1 class="text-5xl">Услуги</h1>
        </div>
        <NuxtLink to="/booking"><BaseButton size="lg">Записаться</BaseButton></NuxtLink>
      </div>

      <div class="flex flex-wrap gap-2">
        <BaseButton :variant="activeCategory === null ? 'primary' : 'secondary'" size="sm" @click="activeCategory = null">
          Все
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
          <p class="mt-2 line-clamp-2 text-sm text-[var(--muted)]">{{ service.description || 'Премиальная процедура от команды мастеров.' }}</p>
          <div class="mt-4 flex items-center justify-between">
            <p class="text-sm text-sand-700">{{ service.duration_minutes }} мин</p>
            <p class="text-sm font-semibold text-sand-900">
              ${{ service.price_from }}
              <span v-if="service.price_to">- ${{ service.price_to }}</span>
            </p>
          </div>
          <NuxtLink to="/booking" class="mt-5 inline-block"><BaseButton>Book now</BaseButton></NuxtLink>
        </Card>
      </div>
    </div>
  </section>
</template>
