<script setup lang="ts">
import FaqSection from '~/components/sections/FaqSection.vue'

const { locale } = useLocale()
const route = useRoute()
const { siteUrl } = useSiteMeta()
const { canonicalUrl } = useLocalizedSeo(() => route.path)
const { faqCopy } = usePageFaqContent('tor', 'privacy-policy')

useSeoMeta({
  title: 'Tor Barbershop - Privacy Policy',
  description: 'Privacy policy, personal data processing, cancellation and payment terms for Tor Barbershop.',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  ogTitle: 'Tor Barbershop - Privacy Policy',
  ogDescription: 'Privacy policy, personal data processing, cancellation and payment terms for Tor Barbershop.',
  ogUrl: () => canonicalUrl.value,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Tor Barbershop - Privacy Policy',
  twitterDescription: 'Privacy policy, personal data processing, cancellation and payment terms for Tor Barbershop.',
})

const content = computed(() => {
  if (locale.value === 'ru') {
    return {
      title: 'Политика конфиденциальности',
      updatedAt: 'Дата обновления: 11 марта 2026',
      intro: 'Tor Barbershop использует персональные данные только для записи, обратной связи, заказов и оплаты.',
    }
  }

  if (locale.value === 'en') {
    return {
      title: 'Privacy Policy',
      updatedAt: 'Updated on: March 11, 2026',
      intro: 'Tor Barbershop uses personal data only for bookings, communication, orders, and payments.',
    }
  }

  return {
    title: 'Գաղտնիության քաղաքականություն',
    updatedAt: 'Թարմացվել է` 2026 թ. մարտի 11',
    intro: 'Tor Barbershop-ը անձնական տվյալներն օգտագործում է միայն ամրագրման, կապի, պատվերների և վճարումների համար։',
  }
})

useStructuredData(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      url: canonicalUrl.value,
      name: content.value.title,
      description: 'Privacy policy, personal data processing, cancellation and payment terms for Tor Barbershop.',
      isPartOf: {
        '@id': `${siteUrl.value}/tor#website`,
      },
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
    <div class="container-shell mx-auto max-w-4xl space-y-6">
      <div class="space-y-2">
        <p class="text-xs uppercase tracking-[0.22em] text-[#c58a3a]">Tor Barbershop</p>
        <h1 class="text-3xl leading-tight text-stone-100 sm:text-5xl">{{ content.title }}</h1>
        <p class="text-sm text-stone-400">{{ content.updatedAt }}</p>
      </div>

      <div class="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
        <p class="text-sm leading-7 text-stone-300">{{ content.intro }}</p>
        <div class="mt-5 space-y-2 text-sm leading-7 text-stone-400">
          <p>Phone: +374 44 733773</p>
          <p>Email: support@freyabeauty.am</p>
          <p>Telegram: https://t.me/freyabeauty</p>
        </div>
      </div>

      <FaqSection
        theme="tor"
        :eyebrow="faqCopy.eyebrow"
        :title="faqCopy.title"
        :lead="faqCopy.lead"
        :items="faqCopy.items"
      />
    </div>
  </section>
</template>
