<script setup lang="ts">
import { storeToRefs } from 'pinia'

const mastersStore = useMastersStore()
const { masters } = storeToRefs(mastersStore)

await useAsyncData('home-masters', async () => {
  await mastersStore.fetchMasters()
})
</script>

<template>
  <section class="section-gap">
    <div class="container-shell">
      <div class="mb-8 flex items-end justify-between gap-3">
        <h2 class="text-4xl">Мастера</h2>
        <NuxtLink to="/masters"><BaseButton variant="ghost">Вся команда</BaseButton></NuxtLink>
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
              <p class="text-sm text-[var(--muted)] line-clamp-2">{{ master.bio || 'Топ-мастер салона.' }}</p>
            </div>
          </div>
          <NuxtLink to="/booking" class="mt-4 inline-block"><BaseButton size="sm">Book now</BaseButton></NuxtLink>
        </Card>
      </div>
    </div>
  </section>
</template>
