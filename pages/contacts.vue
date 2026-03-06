<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Card from "~/components/base/Card.vue";
import SkeletonBlock from "~/components/shared/SkeletonBlock.vue";

const { t } = useLocale()

useSeoMeta({
  title: () => `Freya - ${t('nav.contacts')}`,
  description: () => t('contactsPage.seoDescription'),
})

const branchesStore = useBranchesStore()
const { branches, loading } = storeToRefs(branchesStore)
const fixedAddress = 'Азатутян 21, Ереван'
const fixedSchedule = 'Ежедневно, 10:00-19:00'
const fixedPhone = '+374 44 733773'
const yandexMapUrl = 'https://yandex.ru/map-widget/v1/?oid=161971752484&ol=biz&z=17'
const yandexRouteUrl = 'https://yandex.ru/maps/?oid=161971752484&ol=biz'
const googleRouteUrl = 'https://www.google.com/maps/search/?api=1&query=%D0%90%D0%B7%D0%B0%D1%82%D1%83%D1%82%D1%8F%D0%BD%2021%2C%20%D0%95%D1%80%D0%B5%D0%B2%D0%B0%D0%BD'

await useAsyncData('contacts-page', async () => {
  await branchesStore.fetchBranches()

  return true
})
</script>

<template>
  <section class="section-gap">
    <div class="container-shell mx-auto max-w-6xl space-y-8">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-sand-600">{{ t('contactsPage.reachUs') }}</p>
          <h1 class="text-3xl sm:text-5xl">{{ t('nav.contacts') }}</h1>
        </div>
        <NuxtLink to="/booking"><BaseButton>{{ t('nav.bookNow') }}</BaseButton></NuxtLink>
      </div>

      <div v-if="loading" class="grid gap-4">
        <SkeletonBlock v-for="idx in 4" :key="idx" class="h-48" />
      </div>

      <div v-else class="grid gap-4">
        <Card v-for="branch in branches" :key="branch.id" class="fade-in">
          <p class="mt-3 text-sm text-[var(--muted)]">{{ fixedAddress }}</p>
          <p class="mt-1 text-sm text-[var(--muted)]">{{ fixedPhone }}</p>
          <p class="mt-4 text-xs uppercase tracking-[0.15em] text-sand-600">{{ t('contactsPage.schedule') }}</p>
          <p class="mt-2 rounded-xl bg-sand-50 p-3 text-sm text-sand-700">{{ fixedSchedule }}</p>
          <NuxtLink to="/booking" class="mt-5 inline-block"><BaseButton size="sm">{{ t('nav.bookNow') }}</BaseButton></NuxtLink>
        </Card>
      </div>

      <div class="overflow-hidden rounded-3xl border border-sand-200 shadow-soft">
        <iframe
          title="Salon map"
          :src="yandexMapUrl"
          class="h-[420px] w-full"
          loading="lazy"
        />
      </div>

      <div class="flex flex-wrap gap-3">
        <a :href="yandexRouteUrl" target="_blank" rel="noopener noreferrer"><BaseButton variant="secondary">Открыть в Яндекс</BaseButton></a>
        <a :href="googleRouteUrl" target="_blank" rel="noopener noreferrer"><BaseButton variant="secondary">Открыть в Google</BaseButton></a>
      </div>
    </div>
  </section>
</template>
