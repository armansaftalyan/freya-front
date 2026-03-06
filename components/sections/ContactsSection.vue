<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Card from "~/components/base/Card.vue";

const { t } = useLocale()
const branchesStore = useBranchesStore()
const { branches } = storeToRefs(branchesStore)
const fixedAddress = 'Азатутян 21, Ереван'
const fixedPhone = '+374 44 733773'
const fixedSchedule = 'Ежедневно, 10:00-19:00'

await useAsyncData('home-contacts', async () => {
  await branchesStore.fetchBranches()

  return true
})
</script>

<template>
  <section class="section-gap">
    <div class="container-shell">
      <div class="mb-8 flex items-end justify-between gap-3">
        <h2 class="text-3xl sm:text-4xl">{{ t('homePage.contacts.title') }}</h2>
        <NuxtLink to="/contacts"><BaseButton variant="ghost">{{ t('homePage.contacts.all') }}</BaseButton></NuxtLink>
      </div>
      <div class="grid gap-4">
        <Card v-for="branch in branches.slice(0, 1)" :key="branch.id" class="fade-in">
          <p class="mt-2 text-sm text-[var(--muted)]">{{ fixedAddress }}</p>
          <p class="mt-2 text-sm text-[var(--muted)]">{{ fixedPhone }}</p>
          <p class="mt-2 text-sm text-[var(--muted)]">{{ fixedSchedule }}</p>
          <NuxtLink to="/booking" class="mt-5 inline-block">
            <BaseButton size="sm">{{ t('nav.bookNow') }}</BaseButton>
          </NuxtLink>
        </Card>
      </div>
    </div>
  </section>
</template>
