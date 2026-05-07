<script setup lang="ts">
import HeroSection from "~/components/sections/HeroSection.vue";
import ServicesGrid from "~/components/sections/ServicesGrid.vue";
import MastersGrid from "~/components/sections/MastersGrid.vue";
import HowToBookSection from "~/components/sections/HowToBookSection.vue";
import ContactsSection from "~/components/sections/ContactsSection.vue";
import CtaBookingSection from "~/components/sections/CtaBookingSection.vue";
import FaqSection from "~/components/sections/FaqSection.vue";
import BaseModal from "~/components/base/BaseModal.vue";

const { t, locale } = useLocale()
const { localePath } = useLocalizedPath()
const route = useRoute()
const { siteUrl, salonName, telephone, address, openingHoursSpecification, sameAs, defaultImageUrl } = useSiteMeta()
const { canonicalUrl } = useLocalizedSeo(() => route.path)
const { faqCopy } = usePageFaqContent('freya', 'home')
const showGiftPromo = ref(false)
const giftPromoStorageKey = 'freya_gift_promo_seen_session_v1'

onMounted(() => {
  try {
    const alreadySeen = sessionStorage.getItem(giftPromoStorageKey) === '1'
    if (!alreadySeen) {
      showGiftPromo.value = true
      sessionStorage.setItem(giftPromoStorageKey, '1')
    }
  }
  catch {
    showGiftPromo.value = false
  }
})

const seoTitle = computed(() => {
  if (locale.value === 'ru') return 'Салон красоты в Ереване онлайн | Freya Beauty Salon'
  if (locale.value === 'en') return 'Beauty Salon in Yerevan | Hair, Nails & Cosmetology'
  return 'Գեղեցկության սրահ Երևանում օնլայն | Freya Beauty Salon'
})

const seoDescription = computed(() => {
  if (locale.value === 'ru') return 'Салон красоты Freya Beauty Salon в Ереване: онлайн-запись, мастера, услуги, подарочные карты и удобный выбор времени для визита.'
  if (locale.value === 'en') return 'Freya Beauty Salon in Yerevan with online booking, beauty services, masters, gift cards, and easy appointment scheduling.'
  return 'Freya Beauty Salon գեղեցկության սրահ Երևանում՝ օնլայն ամրագրում, ծառայություններ, վարպետներ, նվեր քարտեր և այցի հարմար ժամի ընտրություն։'
})

usePageSeo({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => t('homePage.ogDescription'),
  image: () => defaultImageUrl.value,
})

useStructuredData(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BeautySalon',
      '@id': `${siteUrl.value}#salon`,
      name: salonName,
      url: canonicalUrl.value,
      image: defaultImageUrl.value,
      telephone,
      priceRange: '$$',
      address,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 40.1776,
        longitude: 44.5126,
      },
      openingHoursSpecification,
      sameAs,
    },
    {
      '@type': 'WebPage',
      '@id': `${canonicalUrl.value}#webpage`,
      url: canonicalUrl.value,
      name: salonName,
      description: seoDescription.value,
      isPartOf: {
        '@id': `${siteUrl.value}#website`,
      },
      about: {
        '@id': `${siteUrl.value}#salon`,
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: salonName,
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
  <div>
    <BaseModal v-model="showGiftPromo" :title="t('homePage.giftPromo.title')" max-width-class="max-w-3xl">
      <div class="space-y-4">
        <div class="rounded-3xl bg-[radial-gradient(circle_at_top_left,#f9d57c_0%,#f0ba57_36%,#111827_100%)] p-5 text-white">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sand-100/90">{{ t('homePage.giftPromo.badge') }}</p>
            <p class="mt-3 text-lg font-semibold leading-tight sm:text-2xl">{{ t('homePage.giftPromo.title') }}</p>
            <p class="mt-2 text-sm text-sand-100/90">{{ t('homePage.giftPromo.subtitle') }}</p>
          </div>
        </div>
        <div class="grid gap-2 sm:grid-cols-2">
          <NuxtLink :to="localePath('/booking')" class="inline-flex items-center justify-center rounded-2xl bg-sand-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black" @click="showGiftPromo = false">
            {{ t('homePage.giftPromo.primary') }}
          </NuxtLink>
          <NuxtLink :to="localePath({ path: '/booking', query: { category_id: 10 } })" class="inline-flex items-center justify-center rounded-2xl border border-sand-300 bg-white px-4 py-3 text-sm font-semibold text-sand-900 transition hover:border-sand-600" @click="showGiftPromo = false">
            {{ t('homePage.giftPromo.secondary') }}
          </NuxtLink>
        </div>
      </div>
    </BaseModal>
    <HeroSection />
    <ServicesGrid />
    <MastersGrid />
    <HowToBookSection />
    <FaqSection
      :eyebrow="faqCopy.eyebrow"
      :title="faqCopy.title"
      :lead="faqCopy.lead"
      :items="faqCopy.items"
    />
    <ContactsSection />
    <CtaBookingSection />
  </div>
</template>
