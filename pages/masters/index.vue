<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Card from "~/components/base/Card.vue";
import SkeletonBlock from "~/components/shared/SkeletonBlock.vue";

const { t, locale } = useLocale()
const { siteUrl } = useSiteMeta()
const { localePath } = useLocalizedPath()
const { isTor, brand, bookingPath, mastersPath } = useBrandContext()
const route = useRoute()
const { canonicalUrl } = useLocalizedSeo(() => route.path)

useSeoMeta({
  title: () => `${brand.value === 'tor' ? 'Tor' : 'Freya'} - ${t('nav.masters')}`,
  description: () => t('mastersPage.seoDescription'),
  ogTitle: () => `${brand.value === 'tor' ? 'Tor' : 'Freya'} - ${t('nav.masters')}`,
  ogDescription: () => t('mastersPage.seoOgDescription'),
  ogUrl: () => canonicalUrl.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => `${brand.value === 'tor' ? 'Tor' : 'Freya'} - ${t('nav.masters')}`,
  twitterDescription: () => t('mastersPage.seoOgDescription'),
})
const mastersStore = useMastersStore()
const { masters, loading } = storeToRefs(mastersStore)

await useAsyncData(() => `masters-page-${brand.value}-${locale.value}`, async () => {
  await mastersStore.fetchMasters(undefined, undefined, brand.value)

  return true
})

useStructuredData(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      url: canonicalUrl.value,
      name: t('nav.masters'),
      description: t('mastersPage.seoDescription'),
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: masters.value.map((master, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${siteUrl.value}${mastersPath.value}/${master.slug || master.id}`,
          name: master.name,
        })),
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: t('nav.home'),
          item: siteUrl.value,
        },
          {
            '@type': 'ListItem',
            position: 2,
            name: t('nav.masters'),
            item: canonicalUrl.value,
          },
        ],
      },
  ],
}))
</script>

<template>
  <section class="section-gap">
    <div class="container-shell space-y-8">
      <div class="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.2em]" :class="isTor ? 'text-[#c58a3a]' : 'text-sand-700'">{{ t('mastersPage.team') }}</p>
          <h1 class="text-3xl leading-tight sm:text-5xl">{{ t('nav.masters') }}</h1>
        </div>
        <NuxtLink :to="localePath(bookingPath)"><BaseButton size="lg" :theme="isTor ? 'tor' : 'default'">{{ t('nav.bookNow') }}</BaseButton></NuxtLink>
      </div>

      <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonBlock v-for="idx in 6" :key="idx" class="h-56" />
      </div>

      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          v-for="master in masters"
          :key="master.id"
          class="fade-in"
          :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.18)]' : ''"
        >
          <img
            :src="master.avatar || 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=700&q=80'"
            :alt="master.name"
            class="h-56 w-full rounded-2xl object-cover"
            loading="lazy"
          >
          <p class="mt-4 text-2xl">{{ master.name }}</p>
          <p class="mt-2 min-h-10 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ master.bio || t('mastersPage.fallbackBio') }}</p>
          <p class="mt-3 text-xs uppercase tracking-[0.14em]" :class="isTor ? 'text-[#c58a3a]' : 'text-sand-700'">{{ t('mastersPage.bookWithMaster') }}</p>
          <div class="mt-4 flex flex-wrap gap-2">
            <NuxtLink :to="localePath(`${mastersPath}/${master.slug || master.id}`)"><BaseButton variant="secondary" :theme="isTor ? 'tor' : 'default'">{{ t('mastersPage.viewProfile') }}</BaseButton></NuxtLink>
            <NuxtLink :to="localePath(bookingPath)" class="inline-block"><BaseButton :theme="isTor ? 'tor' : 'default'">{{ t('nav.bookNow') }}</BaseButton></NuxtLink>
          </div>
        </Card>
      </div>
    </div>
  </section>
</template>
