<script setup lang="ts">
import FaqSection from '~/components/sections/FaqSection.vue'

const { locale } = useLocale()
const { siteUrl, defaultImageUrl } = useSiteMeta()
const { brand, isTor } = useBrandContext()
const route = useRoute()
const { canonicalUrl } = useLocalizedSeo(() => route.path)
const { faqCopy } = await usePageFaqContent(brand.value, 'privacy-policy')
const brandOgImage = computed(() => brand.value === 'tor' ? `${siteUrl.value}/tor-logo.jpg` : defaultImageUrl.value)

usePageSeo({
  title: () => {
    const name = brand.value === 'tor' ? 'Tor Barbershop' : 'Freya Beauty Salon'
    if (locale.value === 'ru') return `Политика конфиденциальности | ${name}`
    if (locale.value === 'hy') return `Գաղտնիության քաղաքականություն | ${name}`
    return `Privacy Policy | ${name}`
  },
  description: () => {
    const name = brand.value === 'tor' ? 'Tor Barbershop' : 'Freya Beauty Salon'
    if (locale.value === 'ru') return `Политика конфиденциальности и обработки персональных данных, условия отмены и оплаты ${name}.`
    if (locale.value === 'hy') return `${name}-ի գաղտնիության և անձնական տվյալների մշակման քաղաքականությունը, չեղարկման և վճարման պայմանները։`
    return `Privacy and personal data processing policy, cancellation, and payment terms for ${name}.`
  },
  image: () => brandOgImage.value,
})

const content = computed(() => {
  if (locale.value === 'ru') {
    return {
      title: 'Политика конфиденциальности',
      updatedAt: 'Дата обновления: 11 марта 2026',
      brandLabel: brand.value === 'tor' ? 'Tor Barbershop' : 'Freya Beauty Salon',
      intro: brand.value === 'tor'
        ? 'Tor Barbershop использует персональные данные только для записи, обратной связи, заказов и оплаты.'
        : 'Freya Beauty Salon использует персональные данные только для записи, обратной связи, заказов и оплаты.',
    }
  }

  if (locale.value === 'en') {
    return {
      title: 'Privacy Policy',
      updatedAt: 'Updated on: March 11, 2026',
      brandLabel: brand.value === 'tor' ? 'Tor Barbershop' : 'Freya Beauty Salon',
      intro: brand.value === 'tor'
        ? 'Tor Barbershop uses personal data only for bookings, communication, orders, and payments.'
        : 'Freya Beauty Salon uses personal data only for bookings, communication, orders, and payments.',
    }
  }

  return {
    title: 'Գաղտնիության քաղաքականություն',
    updatedAt: 'Թարմացվել է` 2026 թ. մարտի 11',
    brandLabel: brand.value === 'tor' ? 'Tor Barbershop' : 'Freya Beauty Salon',
    intro: brand.value === 'tor'
      ? 'Tor Barbershop-ը անձնական տվյալներն օգտագործում է միայն ամրագրման, կապի, պատվերների և վճարումների համար։'
      : 'Freya Beauty Salon-ը անձնական տվյալներն օգտագործում է միայն ամրագրման, կապի, պատվերների և վճարումների համար։',
  }
})

useStructuredData(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      url: canonicalUrl.value,
      name: content.value.title,
      description: `Privacy policy, personal data processing, cancellation and payment terms for ${content.value.brandLabel}.`,
      isPartOf: {
        '@id': `${siteUrl.value}${brand.value === 'tor' ? '/tor' : ''}#website`,
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
  <section :class="isTor ? 'section-gap text-stone-100' : 'section-gap'">
    <div class="container-shell mx-auto max-w-4xl space-y-6">
      <div class="space-y-2">
        <p v-if="isTor" class="text-xs uppercase tracking-[0.22em] text-[#c58a3a]">{{ content.brandLabel }}</p>
        <h1 class="text-3xl leading-tight sm:text-5xl" :class="isTor ? 'text-stone-100' : ''">{{ content.title }}</h1>
        <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ content.updatedAt }}</p>
      </div>

      <div
        class="rounded-3xl p-5 sm:p-6"
        :class="isTor
          ? 'border border-white/10 bg-white/[0.04] shadow-[0_18px_50px_rgba(0,0,0,0.28)]'
          : 'border border-sand-200 bg-white shadow-soft'"
      >
        <p class="text-sm leading-7" :class="isTor ? 'text-stone-300' : 'text-sand-700'">{{ content.intro }}</p>
        <div class="mt-5 space-y-2 text-sm leading-7" :class="isTor ? 'text-stone-400' : 'text-sand-700'">
          <p>{{ locale === 'ru' ? 'Телефон' : locale === 'hy' ? 'Հեռախոս' : 'Phone' }}: +374 44 733773</p>
          <p>WhatsApp: https://wa.me/37444733773</p>
          <p>Email: support@freyabeauty.am</p>
          <p>Telegram: https://t.me/freyabeautyam</p>
        </div>
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
