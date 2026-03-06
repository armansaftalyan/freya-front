<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Card from "~/components/base/Card.vue";
import SkeletonBlock from "~/components/shared/SkeletonBlock.vue";

const { t } = useLocale()

useSeoMeta({
  title: () => `Freya - ${t('nav.masters')}`,
  description: () => t('mastersPage.seoDescription'),
  ogTitle: () => `Freya - ${t('nav.masters')}`,
  ogDescription: () => t('mastersPage.seoOgDescription'),
})

const route = useRoute()
const router = useRouter()
const servicesStore = useServicesStore()
const mastersStore = useMastersStore()
const { services } = storeToRefs(servicesStore)
const { masters, loading } = storeToRefs(mastersStore)

const serviceId = ref<number | null>(route.query.service_id ? Number(route.query.service_id) : null)
const selectedService = computed({
  get: () => (serviceId.value ? String(serviceId.value) : ''),
  set: (value: string) => {
    serviceId.value = value ? Number(value) : null
  },
})

await useAsyncData('masters-page', async () => {
  await servicesStore.fetchServices()
  await mastersStore.fetchMasters(serviceId.value || undefined)

  return true
})

watch(serviceId, async (value) => {
  await mastersStore.fetchMasters(value || undefined)
  router.replace({ query: value ? { service_id: String(value) } : {} })
})
</script>

<template>
  <section class="section-gap">
    <div class="container-shell space-y-8">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-sand-600">{{ t('mastersPage.team') }}</p>
          <h1 class="text-3xl sm:text-5xl">{{ t('nav.masters') }}</h1>
        </div>
        <NuxtLink to="/booking"><BaseButton size="lg">{{ t('nav.bookNow') }}</BaseButton></NuxtLink>
      </div>

      <BaseSelect
        v-model="selectedService"
        :label="t('mastersPage.filterByService')"
        :options="services.map((item) => ({ label: item.name, value: item.id }))"
        :placeholder="t('mastersPage.allServices')"
      />

      <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonBlock v-for="idx in 6" :key="idx" class="h-56" />
      </div>

      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card v-for="master in masters" :key="master.id" class="fade-in">
          <img
            :src="master.avatar || 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=700&q=80'"
            :alt="master.name"
            class="h-56 w-full rounded-2xl object-cover"
            loading="lazy"
          >
          <p class="mt-4 text-2xl">{{ master.name }}</p>
          <p class="mt-2 min-h-10 text-sm text-[var(--muted)]">{{ master.bio || t('mastersPage.fallbackBio') }}</p>
          <p class="mt-3 text-xs uppercase tracking-[0.14em] text-sand-600">{{ t('mastersPage.bookWithMaster') }}</p>
          <NuxtLink to="/booking" class="mt-4 inline-block"><BaseButton>{{ t('nav.bookNow') }}</BaseButton></NuxtLink>
        </Card>
      </div>
    </div>
  </section>
</template>
