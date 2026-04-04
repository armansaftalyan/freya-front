<script setup lang="ts">
import ServicesCatalogPageContent from '~/components/pages/ServicesCatalogPageContent.vue'

const { t, locale } = useLocale()
const { brand, isTor, bookingPath, servicesPath } = useBrandContext()
const { faqCopy } = usePageFaqContent(brand.value, 'services')
const { grouped, loading, structuredData } = await useServicesCatalogPage({
  mode: brand.value === 'tor' ? 'api' : 'store',
  brand: brand.value,
  cacheKey: () => brand.value === 'tor' ? `tor-services-page-${locale.value}` : `services-page-${brand.value}-${locale.value}`,
})

const categoryCta = computed(() => {
  if (locale.value === 'ru') return 'Все →'
  if (locale.value === 'en') return 'All →'
  return 'Բոլորը →'
})

const copy = computed(() => {
  if (brand.value === 'tor') {
    if (locale.value === 'ru') {
      return {
        title: 'Услуги Tor',
        eyebrow: 'Tor',
        lead: 'Мужские стрижки, окантовка, борода, мужской маникюр, педикюр, мужской уход и grooming в подаче Tor.',
        back: 'Назад в Tor',
        cta: 'Записаться',
      }
    }

    if (locale.value === 'en') {
      return {
        title: 'Tor Services',
        eyebrow: 'Tor',
        lead: 'Cuts, beard shaping, line-ups, men manicure, pedicure, men’s care, and focused grooming under the Tor direction.',
        back: 'Back to Tor',
        cta: 'Book now',
      }
    }

    return {
      title: 'Tor ծառայություններ',
      eyebrow: 'Tor',
      lead: 'Տղամարդկանց սանրվածք, մորուք, եզրագծում, տղամարդկանց manicure, pedicure և grooming Tor ուղղությամբ։',
      back: 'Վերադառնալ Tor',
      cta: 'Ամրագրել',
    }
  }

  return {
    title: t('nav.services'),
    eyebrow: t('servicesPage.catalog'),
    lead: '',
    back: '',
    cta: t('nav.bookNow'),
  }
})

usePageSeo({
  title: () => brand.value === 'tor' ? copy.value.title : `Freya - ${t('nav.services')}`,
  description: () => brand.value === 'tor' ? copy.value.lead : t('servicesPage.seoDescription'),
})

useStructuredData(() => ({
  ...(brand.value === 'tor'
    ? {
        ...structuredData.value,
        '@graph': [
          {
            ...structuredData.value['@graph'][0],
            name: copy.value.title,
            description: copy.value.lead,
          },
        ],
      }
    : structuredData.value),
  '@graph': [
    ...(brand.value === 'tor'
      ? [{
          ...structuredData.value['@graph'][0],
          name: copy.value.title,
          description: copy.value.lead,
        }]
      : structuredData.value['@graph']),
    {
      '@type': 'FAQPage',
      mainEntity: faqCopy.value.items.map(item => ({
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
  <ServicesCatalogPageContent
    :theme="isTor ? 'tor' : 'default'"
    :title="copy.title"
    :eyebrow="copy.eyebrow"
    :lead="copy.lead"
    :back-label="isTor ? copy.back : ''"
    :back-to="isTor ? '/tor' : ''"
    :category-cta="categoryCta"
    :action-label="copy.cta"
    :grouped="grouped"
    :loading="isTor ? false : loading"
    :booking-path="bookingPath"
    :services-path="servicesPath"
    :faq-copy="faqCopy"
    :default-description="t('servicesPage.defaultDescription')"
    :duration-label="isTor ? t('servicesPage.minutes') : t('homePage.services.durationUnit')"
    :bordered-seo="!isTor"
  />
</template>
