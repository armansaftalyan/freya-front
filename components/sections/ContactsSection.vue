<script setup lang="ts">
import { storeToRefs } from 'pinia'

const branchesStore = useBranchesStore()
const { branches } = storeToRefs(branchesStore)

await useAsyncData('home-contacts', async () => {
  await branchesStore.fetchBranches()
})
</script>

<template>
  <section class="section-gap">
    <div class="container-shell">
      <div class="mb-8 flex items-end justify-between gap-3">
        <h2 class="text-4xl">Контакты</h2>
        <NuxtLink to="/contacts"><BaseButton variant="ghost">Все контакты</BaseButton></NuxtLink>
      </div>
      <div class="grid gap-4 lg:grid-cols-3">
        <Card v-for="branch in branches.slice(0, 3)" :key="branch.id" class="fade-in">
          <h3 class="text-2xl">{{ branch.name }}</h3>
          <p class="mt-2 text-sm text-[var(--muted)]">{{ branch.address || 'Адрес уточняется' }}</p>
          <p class="mt-2 text-sm text-[var(--muted)]">{{ branch.phone || '+1 000 000 0000' }}</p>
          <NuxtLink to="/booking" class="mt-5 inline-block">
            <BaseButton size="sm">Book now</BaseButton>
          </NuxtLink>
        </Card>
      </div>
    </div>
  </section>
</template>
