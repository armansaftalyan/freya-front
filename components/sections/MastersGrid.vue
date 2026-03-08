<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Card from "~/components/base/Card.vue";

const { t } = useLocale()
const mastersStore = useMastersStore()
const { masters } = storeToRefs(mastersStore)

await useAsyncData('home-masters', async () => {
  await mastersStore.fetchMasters()

  return true
})
</script>

<template>
  <section class="section-gap">
    <div class="container-shell">
      <div class="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 class="text-3xl leading-tight sm:text-4xl">{{ t('homePage.masters.title') }}</h2>
        <NuxtLink to="/masters" class="inline-flex">
          <BaseButton variant="secondary" size="sm">
            {{ t('homePage.masters.all') }}
            <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </BaseButton>
        </NuxtLink>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card v-for="master in masters.slice(0, 6)" :key="master.id" class="fade-in">
          <div class="flex items-center gap-4">
            <img
              :src="master.avatar || 'https://images.unsplash.com/photo-1519415943484-9fa1873496d4?auto=format&fit=crop&w=300&q=80'"
              :alt="master.name"
              class="h-16 w-16 rounded-2xl object-cover"
              loading="lazy"
            >
            <div>
              <p class="text-lg font-semibold">{{ master.name }}</p>
              <p class="text-sm text-[var(--muted)] line-clamp-2">{{ master.bio || t('homePage.masters.fallbackBio') }}</p>
            </div>
          </div>
          <div class="mt-4 flex flex-wrap gap-2">
            <NuxtLink :to="`/masters/${master.slug || master.id}`"><BaseButton size="sm" variant="secondary">{{ t('mastersPage.viewProfile') }}</BaseButton></NuxtLink>
            <NuxtLink to="/booking"><BaseButton size="sm">{{ t('nav.bookNow') }}</BaseButton></NuxtLink>
          </div>
        </Card>
      </div>
    </div>
  </section>
</template>
