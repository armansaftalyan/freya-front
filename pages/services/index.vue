<script setup lang="ts">
import type { ApiListResponse } from '~/types/api'
import type { BlogArticleCard } from '~/types/blog'
import ServicesCatalogPageContent from '~/components/pages/ServicesCatalogPageContent.vue'
import BlogArticleCardComponent from '~/components/blog/BlogArticleCard.vue'

const api = useApi()
const { t, locale } = useLocale()
const { brand, isTor, bookingPath, servicesPath, blogPath } = useBrandContext()
const { faqCopy } = usePageFaqContent(brand.value, 'services')
const { grouped, loading, structuredData } = await useServicesCatalogPage({
  mode: brand.value === 'tor' ? 'api' : 'store',
  brand: brand.value,
  cacheKey: () => brand.value === 'tor' ? `tor-services-page-${locale.value}` : `services-page-${brand.value}-${locale.value}`,
})
const { localePath } = useLocalizedPath()
const { data: latestArticles } = await useAsyncData(
  () => `latest-blog-${brand.value}-${locale.value}`,
  async () => {
    const response = await api.get<ApiListResponse<BlogArticleCard>>('/blog', { brand: brand.value, limit: 3 }, { skipErrorToast: true })
    return response.data
  },
)

const categoryCta = computed(() => {
  if (locale.value === 'ru') return 'Все →'
  if (locale.value === 'en') return 'All →'
  return 'Բոլորը →'
})

const copy = computed(() => {
  if (brand.value === 'tor') {
    if (locale.value === 'ru') {
      return {
        title: 'Услуги Tor Barbershop в Ереване',
        eyebrow: 'Tor',
        lead: 'Мужские стрижки, окантовка, борода, мужской маникюр, педикюр, мужской уход и grooming в подаче Tor.',
        back: 'Назад в Tor',
        cta: 'Записаться',
      }
    }

    if (locale.value === 'en') {
      return {
        title: 'Tor Barbershop Services in Yerevan',
        eyebrow: 'Tor',
        lead: 'Cuts, beard shaping, line-ups, men manicure, pedicure, men’s care, and focused grooming under the Tor direction.',
        back: 'Back to Tor',
        cta: 'Book now',
      }
    }

    return {
      title: 'Tor Barbershop ծառայություններ Երևանում',
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
  title: () => {
    if (brand.value === 'tor') return copy.value.title
    if (locale.value === 'ru') return 'Услуги салона в Ереване онлайн | Freya Beauty Salon'
    if (locale.value === 'en') return 'Beauty Services in Yerevan 2026 | Book Online '
    return 'Սրահի ծառայություններ Երևանում | Freya Beauty Salon'
  },
  description: () => brand.value === 'tor' ? copy.value.lead : t('servicesPage.seoDescription'),
  ogType: 'website',
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

  <section v-if="latestArticles?.length" :class="isTor ? 'container-shell pb-14' : 'container-shell pb-16'">
    <div class="space-y-5">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="max-w-3xl space-y-2">
          <p class="text-xs uppercase tracking-[0.22em]" :class="isTor ? 'font-semibold text-[#d79a49]' : 'text-sand-600'">{{ t('blog.latestArticles') }}</p>
          <h2 :class="isTor ? 'text-3xl font-black uppercase tracking-[0.05em]' : 'text-2xl sm:text-3xl'">{{ t('blog.guides') }}</h2>
          <p class="text-sm leading-7" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('blog.latestArticlesLead') }}</p>
        </div>
        <NuxtLink
          :to="localePath(blogPath)"
          class="text-sm font-medium"
          :class="isTor ? 'text-[#efbf7f]' : 'text-sand-800'"
        >
          {{ t('blog.openBlog') }} →
        </NuxtLink>
      </div>

      <div class="grid gap-5 lg:grid-cols-3">
        <BlogArticleCardComponent
          v-for="article in latestArticles"
          :key="article.id"
          :article="article"
          :theme="isTor ? 'tor' : 'default'"
          :to="localePath(`${blogPath}/${article.slug}`) as string"
        />
      </div>
    </div>
  </section>
</template>
