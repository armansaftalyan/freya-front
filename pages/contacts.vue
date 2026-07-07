<script setup lang="ts">
import Card from '~/components/base/Card.vue'
import FaqSection from '~/components/sections/FaqSection.vue'

const { t, locale } = useLocale()
const { localePath } = useLocalizedPath()
const route = useRoute()
const { siteUrl, defaultImageUrl, telephone, telephoneHref, whatsappUrl, telegramUrl, instagramUrl, twoGisUrl, address, geoCoordinates, googleMapsUrl, openingHoursSpecification, sameAs } = useSiteMeta()
const { brand, isTor, bookingPath } = useBrandContext()
const { canonicalUrl } = useLocalizedSeo(() => route.path)
const brandOgImage = computed(() => brand.value === 'tor' ? `${siteUrl.value}/tor-logo.jpg` : defaultImageUrl.value)

const copy = computed(() => {
  if (brand.value === 'tor') {
    if (locale.value === 'ru') {
      return {
        title: 'Контакты',
        eyebrow: 'Связаться с нами',
        description: 'Контакты Tor Barbershop в Ереване: барбершоп, мужской grooming, адрес, телефон и карта.',
        salonType: 'Barbershop',
        salonName: 'Tor Barbershop',
        routeTitle: 'Tor Barbershop map',
        scheduleLabel: 'График',
        book: 'Записаться',
      }
    }

    if (locale.value === 'en') {
      return {
        title: 'Contacts',
        eyebrow: 'Reach Us',
        description: 'Tor Barbershop contact details in Yerevan for barbershop and men’s grooming, with address, phone, and map.',
        salonType: 'Barbershop',
        salonName: 'Tor Barbershop',
        routeTitle: 'Tor Barbershop map',
        scheduleLabel: 'Schedule',
        book: 'Book now',
      }
    }

    return {
      title: 'Կոնտակտներ',
      eyebrow: 'Կապ մեզ հետ',
      description: 'Tor Barbershop-ի կոնտակտները Երևանում՝ barbershop և տղամարդկանց grooming ուղղությամբ, հասցեն, հեռախոսը և քարտեզը։',
      salonType: 'Barbershop',
      salonName: 'Tor Barbershop',
      routeTitle: 'Tor Barbershop map',
      scheduleLabel: 'Գրաֆիկ',
      book: 'Ամրագրել',
    }
  }

  return {
    title: t('nav.contacts'),
    eyebrow: t('contactsPage.reachUs'),
    description: t('contactsPage.seoDescription'),
    salonType: 'BeautySalon',
    salonName: 'Freya Beauty Salon',
    routeTitle: 'Salon map',
    scheduleLabel: t('contactsPage.schedule'),
    book: t('nav.bookNow'),
  }
})

const fixedAddress = computed(() => {
  if (locale.value === 'ru') return 'Азатутян 21, Ереван'
  if (locale.value === 'en') return '21 Azatutyan, Yerevan'
  return 'Ազատության 21, Երևան'
})

const fixedSchedule = computed(() => {
  if (locale.value === 'ru') return 'Ежедневно, 10:00-20:00'
  if (locale.value === 'en') return 'Daily, 10:00-20:00'
  return 'Ամեն օր, 10:00-20:00'
})

const fixedPhone = '+374 44 733773'
const yandexBusinessOid = computed(() => brand.value === 'tor' ? '157536408300' : '161971752484')
const yandexMapUrl = computed(() => `https://yandex.ru/map-widget/v1/?oid=${yandexBusinessOid.value}&ol=biz&z=17`)
const yandexRouteUrl = computed(() => `https://yandex.ru/maps/?oid=${yandexBusinessOid.value}&ol=biz`)

const mapButtonCopy = computed(() => {
  if (locale.value === 'ru') {
    return { yandex: 'Открыть в Яндекс', google: 'Открыть в Google' }
  }

  if (locale.value === 'en') {
    return { yandex: 'Open in Yandex', google: 'Open in Google' }
  }

  return { yandex: 'Բացել Yandex-ում', google: 'Բացել Google-ում' }
})

const { faqCopy } = await usePageFaqContent(brand.value, 'contacts')

const seoTitle = computed(() => {
  if (brand.value === 'tor') {
    if (locale.value === 'ru') return 'Контакты барбершопа в Ереване | Tor Barbershop'
    if (locale.value === 'en') return 'Barbershop Contacts in Yerevan | Tor Barbershop'
    return 'Barbershop կոնտակտներ Երևանում | Tor Barbershop'
  }

  if (locale.value === 'ru') return 'Контакты салона красоты в Ереване | Freya Beauty Salon'
  if (locale.value === 'en') return 'Beauty Salon Contacts in Yerevan | Freya Beauty Salon'
  return 'Գեղեցկության սրահի կոնտակտներ | Freya Beauty Salon'
})

usePageSeo({
  title: () => seoTitle.value,
  description: () => copy.value.description,
  ogTitle: () => seoTitle.value,
  ogDescription: () => copy.value.description,
  image: () => brandOgImage.value,
})

useStructuredData(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      url: canonicalUrl.value,
      name: `${copy.value.salonName} ${copy.value.title}`,
      description: copy.value.description,
    },
    {
      '@type': copy.value.salonType,
      '@id': `${siteUrl.value}${brand.value === 'tor' ? '/tor' : ''}#contact-salon`,
      name: copy.value.salonName,
      url: canonicalUrl.value,
      image: brandOgImage.value,
      telephone,
      address,
      geo: geoCoordinates.value,
      hasMap: googleMapsUrl.value,
      openingHoursSpecification,
      sameAs: sameAs.value,
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
          name: copy.value.title,
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
  <section :class="isTor ? 'section-gap text-stone-100' : 'section-gap'">
    <div class="container-shell mx-auto max-w-6xl space-y-8">
      <div class="grid gap-4 lg:grid-cols-[1fr,auto] lg:items-end">
        <div class="min-w-0">
          <p class="text-xs uppercase tracking-[0.2em]" :class="isTor ? 'text-[#c58a3a]' : 'text-sand-600'">{{ copy.eyebrow }}</p>
          <h1 class="max-w-3xl text-3xl leading-tight sm:text-5xl" :class="isTor ? 'text-stone-100' : ''">{{ copy.title }}</h1>
          <p v-if="!isTor" class="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">{{ t('contactsPage.intro') }}</p>
        </div>
        <NuxtLink :to="localePath(bookingPath)" class="inline-flex lg:justify-self-start">
          <BaseButton :theme="isTor ? 'tor' : 'default'">{{ copy.book }}</BaseButton>
        </NuxtLink>
      </div>

      <div class="grid gap-4">
        <Card class="fade-in" :class="isTor ? '!border-white/10 !bg-white/[0.04] !text-stone-100 shadow-[0_18px_50px_rgba(0,0,0,0.28)]' : ''">
          <div class="grid gap-6 lg:grid-cols-[1fr,auto] lg:items-start">
            <div class="min-w-0">
              <p class="mt-1 break-words text-sm leading-6" :class="isTor ? 'text-stone-300' : 'text-[var(--muted)]'">{{ fixedAddress }}</p>
              <p class="mt-1 break-all text-sm leading-6" :class="isTor ? 'text-stone-300' : 'text-[var(--muted)]'">
                <a :href="telephoneHref" :class="isTor ? 'transition hover:text-[#d79a49]' : 'hover:text-sand-700'">{{ fixedPhone }}</a>
              </p>
              <div class="mt-3 flex flex-wrap gap-3 text-sm">
                <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer" :class="isTor ? 'text-stone-200 transition hover:text-[#d79a49]' : 'text-sand-800 hover:text-sand-600'">WhatsApp</a>
                <a :href="telegramUrl" target="_blank" rel="noopener noreferrer" :class="isTor ? 'text-stone-200 transition hover:text-[#d79a49]' : 'text-sand-800 hover:text-sand-600'">Telegram</a>
                <a :href="instagramUrl" target="_blank" rel="noopener noreferrer" :class="isTor ? 'text-stone-200 transition hover:text-[#d79a49]' : 'text-sand-800 hover:text-sand-600'">Instagram</a>
                <a :href="twoGisUrl" target="_blank" rel="noopener noreferrer" :class="isTor ? 'text-stone-200 transition hover:text-[#d79a49]' : 'text-sand-800 hover:text-sand-600'">2GIS</a>
              </div>
              <p class="mt-4 text-xs uppercase tracking-[0.15em]" :class="isTor ? 'text-[#c58a3a]' : 'text-sand-600'">{{ copy.scheduleLabel }}</p>
              <p class="mt-2 rounded-xl p-3 text-sm" :class="isTor ? 'bg-white/[0.06] text-stone-200' : 'bg-sand-50 text-sand-700'">{{ fixedSchedule }}</p>
            </div>
            <div class="flex flex-wrap gap-3 lg:max-w-[15rem] lg:justify-end">
              <NuxtLink :to="localePath(bookingPath)" class="inline-flex">
                <BaseButton size="sm" :theme="isTor ? 'tor' : 'default'">{{ copy.book }}</BaseButton>
              </NuxtLink>
            </div>
          </div>
        </Card>
      </div>

      <div class="overflow-hidden rounded-3xl shadow-soft" :class="isTor ? 'border border-white/10 shadow-[0_18px_50px_rgba(0,0,0,0.28)]' : 'border border-sand-200'">
        <iframe
          :title="copy.routeTitle"
          :src="yandexMapUrl"
          class="h-[420px] w-full"
          loading="lazy"
        />
      </div>

      <div class="flex flex-wrap gap-3">
        <a :href="yandexRouteUrl" target="_blank" rel="noopener noreferrer"><BaseButton variant="secondary" :theme="isTor ? 'tor' : 'default'">{{ mapButtonCopy.yandex }}</BaseButton></a>
        <a :href="googleMapsUrl" target="_blank" rel="noopener noreferrer"><BaseButton variant="secondary" :theme="isTor ? 'tor' : 'default'">{{ mapButtonCopy.google }}</BaseButton></a>
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
