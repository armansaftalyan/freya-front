<script setup lang="ts">
import Card from "~/components/base/Card.vue";

const { t, locale } = useLocale()
const { localePath } = useLocalizedPath()
const route = useRoute()
const { salonName, telephone, email, address, sameAs, siteUrl, defaultImageUrl } = useSiteMeta()
const { canonicalUrl } = useLocalizedSeo(() => route.path)

useSeoMeta({
  title: () => `Freya - ${t('nav.contacts')}`,
  description: () => t('contactsPage.seoDescription'),
  ogTitle: () => `Freya - ${t('nav.contacts')}`,
  ogDescription: () => t('contactsPage.seoDescription'),
  ogUrl: () => canonicalUrl.value,
  ogImage: () => defaultImageUrl.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => `Freya - ${t('nav.contacts')}`,
  twitterDescription: () => t('contactsPage.seoDescription'),
  twitterImage: () => defaultImageUrl.value,
})

const fixedAddress = computed(() => {
  if (locale.value === 'ru') return 'Азатутян 21, Ереван'
  if (locale.value === 'en') return '21 Azatutyan, Yerevan'
  return 'Ազատության 21, Երևան'
})
const fixedSchedule = computed(() => {
  if (locale.value === 'ru') return 'Ежедневно, 10:00-19:00'
  if (locale.value === 'en') return 'Daily, 10:00-19:00'
  return 'Ամեն օր, 10:00-19:00'
})
const fixedPhone = '+374 44 733773'
const yandexMapUrl = 'https://yandex.ru/map-widget/v1/?oid=161971752484&ol=biz&z=17'
const yandexRouteUrl = 'https://yandex.ru/maps/?oid=161971752484&ol=biz'
const googleRouteUrl = 'https://www.google.com/maps/search/?api=1&query=%D0%90%D0%B7%D0%B0%D1%82%D1%83%D1%82%D1%8F%D0%BD%2021%2C%20%D0%95%D1%80%D0%B5%D0%B2%D0%B0%D0%BD'
const mapButtonCopy = computed(() => {
  if (locale.value === 'ru') {
    return { yandex: 'Открыть в Яндекс', google: 'Открыть в Google' }
  }
  if (locale.value === 'en') {
    return { yandex: 'Open in Yandex', google: 'Open in Google' }
  }
  return { yandex: 'Բացել Yandex-ում', google: 'Բացել Google-ում' }
})

useStructuredData(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      url: canonicalUrl.value,
      name: `${salonName} Contacts`,
      description: t('contactsPage.seoDescription'),
      mainEntity: {
        '@id': `${siteUrl.value}#salon`,
      },
    },
    {
      '@type': 'BeautySalon',
      '@id': `${siteUrl.value}${route.path}#contact-salon`,
      name: salonName,
      url: canonicalUrl.value,
      image: defaultImageUrl.value,
      telephone,
      email,
      address,
      sameAs,
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '10:00',
          closes: '19:00',
        },
      ],
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
          name: t('nav.contacts'),
          item: canonicalUrl.value,
        },
      ],
    },
  ],
}))
</script>

<template>
  <section class="section-gap">
    <div class="container-shell mx-auto max-w-6xl space-y-8">
      <div class="grid gap-4 lg:grid-cols-[1fr,auto] lg:items-end">
        <div class="min-w-0">
          <p class="text-xs uppercase tracking-[0.2em] text-sand-600">{{ t('contactsPage.reachUs') }}</p>
          <h1 class="max-w-3xl text-3xl leading-tight sm:text-5xl">{{ t('nav.contacts') }}</h1>
        </div>
        <NuxtLink :to="localePath('/booking')" class="inline-flex lg:justify-self-start">
          <BaseButton>{{ t('nav.bookNow') }}</BaseButton>
        </NuxtLink>
      </div>

      <div class="grid gap-4">
        <Card class="fade-in">
          <div class="grid gap-6 lg:grid-cols-[1fr,auto] lg:items-start">
            <div class="min-w-0">
              <p class="mt-1 break-words text-sm leading-6 text-[var(--muted)]">{{ fixedAddress }}</p>
              <p class="mt-1 break-all text-sm leading-6 text-[var(--muted)]">{{ fixedPhone }}</p>
              <p class="mt-4 text-xs uppercase tracking-[0.15em] text-sand-600">{{ t('contactsPage.schedule') }}</p>
              <p class="mt-2 rounded-xl bg-sand-50 p-3 text-sm text-sand-700">{{ fixedSchedule }}</p>
            </div>
            <div class="flex flex-wrap gap-3 lg:max-w-[15rem] lg:justify-end">
              <NuxtLink :to="localePath('/booking')" class="inline-flex">
                <BaseButton size="sm">{{ t('nav.bookNow') }}</BaseButton>
              </NuxtLink>
            </div>
          </div>
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
        <a :href="yandexRouteUrl" target="_blank" rel="noopener noreferrer"><BaseButton variant="secondary">{{ mapButtonCopy.yandex }}</BaseButton></a>
        <a :href="googleRouteUrl" target="_blank" rel="noopener noreferrer"><BaseButton variant="secondary">{{ mapButtonCopy.google }}</BaseButton></a>
      </div>
    </div>
  </section>
</template>
