<script setup lang="ts">
import { storeToRefs } from 'pinia'

const { t } = useLocale()

useSeoMeta({
  title: () => `Freya - ${t('nav.contacts')}`,
  description: () => t('contactsPage.seoDescription'),
})

const branchesStore = useBranchesStore()
const { branches, loading } = storeToRefs(branchesStore)

await useAsyncData('contacts-page', async () => {
  await branchesStore.fetchBranches()
})
</script>

<template>
  <section class="section-gap">
    <div class="container-shell space-y-8">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-sand-600">{{ t('contactsPage.reachUs') }}</p>
          <h1 class="text-3xl sm:text-5xl">{{ t('nav.contacts') }}</h1>
        </div>
        <NuxtLink to="/booking"><BaseButton>{{ t('nav.bookNow') }}</BaseButton></NuxtLink>
      </div>

      <div v-if="loading" class="grid gap-4 md:grid-cols-2">
        <SkeletonBlock v-for="idx in 4" :key="idx" class="h-48" />
      </div>

      <div v-else class="grid gap-4 md:grid-cols-2">
        <Card v-for="branch in branches" :key="branch.id" class="fade-in">
          <h2 class="text-3xl">{{ branch.name }}</h2>
          <p class="mt-3 text-sm text-[var(--muted)]">{{ branch.address || t('contactsPage.addressTbd') }}</p>
          <p class="mt-1 text-sm text-[var(--muted)]">{{ branch.phone || '+1 000 000 0000' }}</p>
          <p class="mt-4 text-xs uppercase tracking-[0.15em] text-sand-600">{{ t('contactsPage.schedule') }}</p>
          <pre class="mt-2 overflow-auto rounded-xl bg-sand-50 p-3 text-xs text-sand-700">{{ JSON.stringify(branch.working_hours, null, 2) }}</pre>
          <NuxtLink to="/booking" class="mt-5 inline-block"><BaseButton size="sm">{{ t('nav.bookNow') }}</BaseButton></NuxtLink>
        </Card>
      </div>

      <div class="overflow-hidden rounded-3xl border border-sand-200 shadow-soft">
        <iframe
          title="Salon map"
          src="https://maps.google.com/maps?q=Manhattan&t=&z=12&ie=UTF8&iwloc=&output=embed"
          class="h-[320px] w-full"
          loading="lazy"
        />
      </div>
    </div>
  </section>
</template>
