<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Card from "~/components/base/Card.vue";
import FaqSection from "~/components/sections/FaqSection.vue";
import SkeletonBlock from "~/components/shared/SkeletonBlock.vue";

const { t, locale } = useLocale()
const { siteUrl, defaultImageUrl } = useSiteMeta()
const { localePath } = useLocalizedPath()
const { isTor, brand, bookingPath, mastersPath } = useBrandContext()
const { masterAvatarSrc, onMasterAvatarError } = useMasterAvatar()
const route = useRoute()
const { canonicalUrl } = useLocalizedSeo(() => route.path)
const { faqCopy } = usePageFaqContent(isTor.value ? 'tor' : 'freya', 'masters')
const brandOgImage = computed(() => brand.value === 'tor' ? `${siteUrl.value}/tor-logo.jpg` : defaultImageUrl.value)

const seoCopy = computed(() => {
  if (brand.value === 'tor') {
    if (locale.value === 'ru') {
      return {
        title: 'Мастера Tor | Барбер, мужской маникюр, элос, массаж',
        description: 'Мастера Tor в Ереване: барбер, мужской маникюр, педикюр, мужской элос и массаж. Выберите специалиста и запишитесь онлайн.',
      }
    }

    if (locale.value === 'en') {
      return {
        title: 'Tor Masters | Barber, Men Nails, Elos, Massage',
        description: 'Meet Tor masters in Yerevan for barber services, men manicure, pedicure, men elos, and massage. Choose your specialist and book online.',
      }
    }

    return {
      title: 'Tor վարպետներ | Barber, men nails, elos, massage',
      description: 'Tor-ի վարպետները Երևանում` barber ծառայություններ, տղամարդկանց manicure, pedicure, elos և massage։ Ընտրեք մասնագետին և ամրագրեք օնլայն։',
    }
  }

  if (locale.value === 'ru') {
    return {
      title: 'Мастера Freya | Маникюр, косметология, массаж, волосы',
      description: 'Мастера Freya Beauty Salon в Ереване: маникюр, педикюр, косметология, массаж, элос, женские стрижки и окрашивание. Выберите специалиста и запишитесь онлайн.',
    }
  }

  if (locale.value === 'en') {
    return {
      title: 'Beauty Experts in Yerevan | Meet Our Masters | Freya Salon',
      description: 'Meet Freya Beauty Salon masters in Yerevan for nails, cosmetology, massage, elos, women haircuts, coloring, and premium beauty care.',
    }
  }

  return {
    title: 'Freya վարպետներ | Nails, cosmetology, massage, hair',
    description: 'Freya Beauty Salon-ի վարպետները Երևանում` մանիկյուր, պեդիկյուր, կոսմետոլոգիա, մերսում, էլոս, կանացի կտրվածք և ներկում։ Ընտրեք մասնագետին և ամրագրեք օնլայն։',
  }
})

usePageSeo({
  title: () => seoCopy.value.title,
  description: () => seoCopy.value.description,
  ogTitle: () => seoCopy.value.title,
  ogDescription: () => seoCopy.value.description,
  image: () => brandOgImage.value,
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
      description: seoCopy.value.description,
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
    {
      '@type': 'FAQPage',
      mainEntity: faqCopy.value.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
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
              :src="masterAvatarSrc(master.avatar, master.name)"
              :alt="`${master.name} – ${isTor ? 'Tor specialist' : 'Freya beauty specialist'}`"
              class="h-56 w-full rounded-2xl object-cover"
              loading="lazy"
              decoding="async"
              @error="onMasterAvatarError($event, master.name)"
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

      <FaqSection
        :theme="isTor ? 'tor' : 'default'"
        :eyebrow="faqCopy.eyebrow"
        :title="faqCopy.title"
        :lead="faqCopy.lead"
        :items="faqCopy.items"
      />
    </div>
  </section>
</template>
