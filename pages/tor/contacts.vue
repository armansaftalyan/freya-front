<script setup lang="ts">
import FaqSection from '~/components/sections/FaqSection.vue'

const { locale } = useLocale()
const { localePath } = useLocalizedPath()
const route = useRoute()
const { siteUrl } = useSiteMeta()
const { canonicalUrl } = useLocalizedSeo(() => route.path)

useSeoMeta({
  title: () => locale.value === 'ru' ? 'Tor Barbershop - Контакты' : locale.value === 'en' ? 'Tor Barbershop - Contacts' : 'Tor Barbershop - Կոնտակտներ',
  description: () => locale.value === 'ru' ? 'Контакты Tor Barbershop в Ереване, адрес, телефон и карта.' : locale.value === 'en' ? 'Tor Barbershop contact details in Yerevan, address, phone, and map.' : 'Tor Barbershop-ի կոնտակտները Երևանում, հասցեն, հեռախոսը և քարտեզը։',
  ogUrl: () => canonicalUrl.value,
  twitterCard: 'summary_large_image',
})

const address = computed(() => {
  if (locale.value === 'ru') return 'Азатутян 21, Ереван'
  if (locale.value === 'en') return '21 Azatutyan, Yerevan'
  return 'Ազատության 21, Երևան'
})
const schedule = computed(() => {
  if (locale.value === 'ru') return 'Ежедневно, 10:00-19:00'
  if (locale.value === 'en') return 'Daily, 10:00-19:00'
  return 'Ամեն օր, 10:00-19:00'
})
const pageTitle = computed(() => {
  if (locale.value === 'ru') return 'Контакты'
  if (locale.value === 'en') return 'Contacts'
  return 'Կոնտակտներ'
})
const reachUs = computed(() => {
  if (locale.value === 'ru') return 'Связаться с нами'
  if (locale.value === 'en') return 'Reach Us'
  return 'Կապ մեզ հետ'
})
const yandexMapUrl = 'https://yandex.ru/map-widget/v1/?oid=161971752484&ol=biz&z=17'
const yandexRouteUrl = 'https://yandex.ru/maps/?oid=161971752484&ol=biz'
const googleRouteUrl = 'https://www.google.com/maps/search/?api=1&query=%D0%90%D0%B7%D0%B0%D1%82%D1%83%D1%82%D1%8F%D0%BD%2021%2C%20%D0%95%D1%80%D0%B5%D0%B2%D0%B0%D0%BD'
const { faqCopy } = usePageFaqContent('tor', 'contacts')

useStructuredData(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      url: canonicalUrl.value,
      name: `Tor Barbershop ${pageTitle.value}`,
    },
    {
      '@type': 'Barbershop',
      '@id': `${siteUrl.value}/tor#barbershop-contact`,
      name: 'Tor Barbershop',
      url: canonicalUrl.value,
      telephone: '+374 44 733773',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '21 Azatutyan',
        addressLocality: 'Yerevan',
        addressCountry: 'AM',
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
    <div class="container-shell mx-auto max-w-6xl space-y-8">
      <div class="grid gap-4 lg:grid-cols-[1fr,auto] lg:items-end">
        <div class="min-w-0">
          <p class="text-xs uppercase tracking-[0.22em] text-[#c58a3a]">{{ reachUs }}</p>
          <h1 class="max-w-3xl text-3xl leading-tight text-stone-100 sm:text-5xl">{{ pageTitle }}</h1>
        </div>
        <NuxtLink :to="localePath('/tor/booking')" class="inline-flex lg:justify-self-start">
          <BaseButton theme="tor">{{ locale === 'ru' ? 'Записаться' : locale === 'en' ? 'Book now' : 'Ամրագրել' }}</BaseButton>
        </NuxtLink>
      </div>

      <div class="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
        <div class="grid gap-6 lg:grid-cols-[1fr,auto] lg:items-start">
          <div class="min-w-0">
            <p class="text-sm leading-6 text-stone-300">{{ address }}</p>
            <p class="mt-1 text-sm leading-6 text-stone-300">+374 44 733773</p>
            <p class="mt-4 text-xs uppercase tracking-[0.18em] text-[#c58a3a]">{{ locale === 'ru' ? 'График' : locale === 'en' ? 'Schedule' : 'Գրաֆիկ' }}</p>
            <p class="mt-2 rounded-2xl bg-white/[0.06] p-3 text-sm text-stone-200">{{ schedule }}</p>
          </div>
          <div class="flex flex-wrap gap-3 lg:max-w-[15rem] lg:justify-end">
            <NuxtLink :to="localePath('/tor/booking')" class="inline-flex">
              <BaseButton size="sm" theme="tor">{{ locale === 'ru' ? 'Записаться' : locale === 'en' ? 'Book now' : 'Ամրագրել' }}</BaseButton>
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="overflow-hidden rounded-[28px] border border-white/10 shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
        <iframe
          title="Tor Barbershop map"
          :src="yandexMapUrl"
          class="h-[420px] w-full"
          loading="lazy"
        />
      </div>

      <div class="flex flex-wrap gap-3">
        <a :href="yandexRouteUrl" target="_blank" rel="noopener noreferrer"><BaseButton variant="secondary" theme="tor">{{ locale === 'ru' ? 'Открыть в Яндекс' : locale === 'en' ? 'Open in Yandex' : 'Բացել Yandex-ում' }}</BaseButton></a>
        <a :href="googleRouteUrl" target="_blank" rel="noopener noreferrer"><BaseButton variant="secondary" theme="tor">{{ locale === 'ru' ? 'Открыть в Google' : locale === 'en' ? 'Open in Google' : 'Բացել Google-ում' }}</BaseButton></a>
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
