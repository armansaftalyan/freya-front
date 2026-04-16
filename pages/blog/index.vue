<script setup lang="ts">
import type { ApiListResponse } from '~/types/api'
import type { BlogArticleCard } from '~/types/blog'
import BlogArticleCardComponent from '~/components/blog/BlogArticleCard.vue'

const api = useApi()
const route = useRoute()
const { t, locale } = useLocale()
const { localePath } = useLocalizedPath()
const { brand, isTor, blogPath, rootPath } = useBrandContext()
const pageTitle = computed(() => brand.value === 'tor' ? t('blog.pageTitleTor') : t('blog.pageTitleFreya'))
const pageDescription = computed(() => brand.value === 'tor' ? t('blog.pageDescriptionTor') : t('blog.pageDescriptionFreya'))
const brandHomeLabel = computed(() => brand.value === 'tor' ? 'Tor Barbershop' : 'Freya Beauty Salon')

const { data: articles } = await useAsyncData(
  () => `blog-list-${brand.value}-${locale.value}`,
  async () => {
    const response = await api.get<ApiListResponse<BlogArticleCard>>('/blog', { brand: brand.value, limit: 36 }, { skipErrorToast: true })
    return response.data
  },
)

usePageSeo({
  title: () => pageTitle.value,
  description: () => pageDescription.value,
  ogType: 'website',
})

const siteUrl = useRuntimeConfig().public.siteUrl

useStructuredData(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Blog',
      name: pageTitle.value,
      description: pageDescription.value,
      url: `${siteUrl}${route.path}`,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: brandHomeLabel.value,
          item: `${siteUrl}${localePath(rootPath.value || '/')}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: t('blog.guides'),
          item: `${siteUrl}${route.path}`,
        },
      ],
    },
    {
      '@type': 'ItemList',
      itemListElement: (articles.value || []).map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteUrl}${localePath(`${blogPath.value}/${article.slug}`)}`,
        name: article.title,
      })),
    },
  ],
}))
</script>

<template>
  <section :class="isTor ? 'container-shell py-14 text-stone-100' : 'section-gap'">
    <div :class="isTor ? 'space-y-8' : 'container-shell space-y-8'">
      <div class="max-w-4xl space-y-4">
        <p class="text-xs uppercase tracking-[0.22em]" :class="isTor ? 'font-semibold text-[#d79a49]' : 'text-sand-600'">{{ t('blog.guides') }}</p>
        <h1 :class="isTor ? 'text-4xl font-black uppercase tracking-[0.05em] sm:text-6xl' : 'text-3xl leading-tight sm:text-5xl'">
          {{ pageTitle }}
        </h1>
        <p class="max-w-3xl text-base leading-7" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">
          {{ pageDescription }}
        </p>
      </div>

      <div class="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        <BlogArticleCardComponent
          v-for="article in articles || []"
          :key="article.id"
          :article="article"
          :theme="isTor ? 'tor' : 'default'"
          :to="localePath(`${blogPath}/${article.slug}`) as string"
        />
      </div>
    </div>
  </section>
</template>
