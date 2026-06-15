<script setup lang="ts">
import type { ApiItemResponse, ApiListResponse } from '~/types/api'
import type { BlogArticle, BlogArticleCard } from '~/types/blog'
import BlogArticleCardComponent from '~/components/blog/BlogArticleCard.vue'
import { supportedLocales, type SupportedLocale } from '~/composables/useLocalizedPath'

const api = useApi()
const route = useRoute()
const config = useRuntimeConfig()
const { t, locale } = useLocale()
const { localePath } = useLocalizedPath()
const { brand, isTor, blogPath, servicesPath, rootPath } = useBrandContext()

const slug = computed(() => String(route.params.slug || '').trim())
const isArmenianLocale = computed(() => locale.value === 'hy')
const brandHomeLabel = computed(() => brand.value === 'tor' ? 'Tor Barbershop' : 'Freya Beauty Salon')

const { data, error } = await useAsyncData(
  () => `blog-article-${brand.value}-${slug.value}-${locale.value}`,
  async () => {
    const articleResponse = await api.get<ApiItemResponse<BlogArticle>>(`/blog/${slug.value}`, { brand: brand.value }, { skipErrorToast: true })
    const article = articleResponse.data

    const relatedResponse = await api.get<ApiListResponse<BlogArticleCard>>(
      '/blog',
      {
        brand: brand.value,
        category_id: article.category?.id,
        limit: 4,
      },
      { skipErrorToast: true },
    )

    return {
      article,
      related: relatedResponse.data.filter(item => item.id !== article.id).slice(0, 3),
    }
  },
)

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Blog article not found',
    fatal: true,
  })
}

const article = computed(() => data.value?.article || null)
const relatedArticles = computed(() => data.value?.related || [])
const currentLocale = computed(() => locale.value as SupportedLocale)
const localizedArticlePaths = computed(() => Object.fromEntries(
  supportedLocales.map((targetLocale) => [
    targetLocale,
    `${blogPath.value}/${localizedSlugFor(article.value, targetLocale)}`,
  ]),
) as Partial<Record<SupportedLocale, string>>)

const dateLabel = computed(() => {
  if (!article.value?.published_at) return ''

  return new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.value.published_at))
})

usePageSeo({
  localizedPaths: () => localizedArticlePaths.value,
  title: () => article.value?.seo_title || article.value?.title || t('blog.guides'),
  description: () => article.value?.seo_description || article.value?.excerpt || t('blog.guides'),
  image: () => article.value?.cover_image_url || undefined,
  ogType: 'article',
})

useStructuredData(() => {
  if (!article.value) return null

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: article.value.title,
        description: article.value.seo_description || article.value.excerpt || undefined,
        datePublished: article.value.published_at || undefined,
        dateModified: article.value.published_at || undefined,
        mainEntityOfPage: `${config.public.siteUrl}${route.path}`,
        image: article.value.cover_image_url || undefined,
        articleSection: article.value.category?.name || t('blog.guides'),
      },
      ...(article.value.faq_items.length
        ? [{
            '@type': 'FAQPage',
            mainEntity: article.value.faq_items.map(item => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }]
        : []),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: brandHomeLabel.value,
            item: `${config.public.siteUrl}${localePath(rootPath.value || '/')}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: t('blog.guides'),
            item: `${config.public.siteUrl}${localePath(blogPath.value)}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: article.value.title,
            item: `${config.public.siteUrl}${route.path}`,
          },
        ],
      },
    ],
  }
})
</script>

<template>
  <section v-if="article" :class="isTor ? 'container-shell py-14 text-stone-100' : 'section-gap'">
    <div :class="isTor ? 'space-y-10' : 'container-shell space-y-10'">
      <NuxtLink
        :to="localePath(blogPath)"
        class="inline-flex items-center text-sm"
        :class="isTor ? 'text-[#c58a3a] hover:text-[#efbf7f]' : 'text-sand-700 hover:text-sand-900'"
      >
        ← {{ t('blog.backToBlog') }}
      </NuxtLink>

      <div class="grid gap-8 xl:grid-cols-[0.95fr,0.55fr]">
        <article class="space-y-8">
          <header class="space-y-4">
            <p class="text-xs uppercase tracking-[0.22em]" :class="isTor ? 'font-semibold text-[#d79a49]' : 'text-sand-600'">
              {{ article.category?.name || t('blog.guides') }}
            </p>
            <h1 :class="[
              isTor
                ? (isArmenianLocale
                    ? 'max-w-4xl text-3xl font-semibold leading-[1.08] tracking-[0.01em] sm:text-5xl'
                    : 'max-w-4xl text-4xl font-black uppercase tracking-[0.05em] sm:text-6xl')
                : 'text-3xl leading-tight sm:text-5xl',
            ]">
              {{ article.title }}
            </h1>
            <div class="flex flex-wrap gap-3 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">
              <span>{{ dateLabel }}</span>
              <span>•</span>
              <span>{{ article.reading_minutes }} {{ t('blog.minutesRead') }}</span>
            </div>
            <p class="max-w-3xl text-base leading-7" :class="isTor ? 'text-stone-300' : 'text-[var(--muted)]'">
              {{ article.excerpt }}
            </p>
          </header>

          <div
            class="blog-article leading-8"
            :class="isTor ? 'blog-article--tor text-stone-200' : 'text-sand-950'"
            v-html="article.body_html"
          />

          <section v-if="article.related_services.length" class="space-y-4">
            <h2 :class="isTor
              ? (isArmenianLocale ? 'text-2xl font-semibold leading-tight' : 'text-2xl font-black uppercase tracking-[0.05em]')
              : 'text-2xl font-semibold'">{{ t('blog.relatedServices') }}</h2>
            <div class="grid gap-4 md:grid-cols-2">
              <NuxtLink
                v-for="service in article.related_services"
                :key="service.id"
                :to="localePath(`${servicesPath}/${localizedSlugFor({
                  slug: service.category_slug,
                  slug_i18n: service.category_slug_i18n,
                }, currentLocale)}/${localizedSlugFor(service, currentLocale)}`)"
                class="rounded-[24px] border p-4 transition"
                :class="isTor
                  ? 'border-white/10 bg-white/[0.03] hover:border-[#d79a49]/40'
                  : 'border-sand-200 bg-white hover:border-sand-300'"
              >
                <p class="text-xs uppercase tracking-[0.18em]" :class="isTor ? 'text-[#d79a49]' : 'text-sand-600'">{{ service.category_name }}</p>
                <h3 class="mt-2 text-lg font-semibold">{{ service.name }}</h3>
                <p class="mt-2 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">
                  {{ service.duration_minutes }} {{ t('servicesPage.minutes') }} • {{ service.price_from }} AMD
                </p>
              </NuxtLink>
            </div>
          </section>

          <section v-if="article.faq_items.length" class="space-y-4">
            <h2 :class="isTor
              ? (isArmenianLocale ? 'text-2xl font-semibold leading-tight' : 'text-2xl font-black uppercase tracking-[0.05em]')
              : 'text-2xl font-semibold'">{{ t('blog.faqTitle') }}</h2>
            <div class="space-y-3">
              <details
                v-for="(item, index) in article.faq_items"
                :key="`${item.question}-${index}`"
                class="rounded-[24px] border p-5"
                :class="isTor ? 'border-white/10 bg-white/[0.03]' : 'border-sand-200 bg-white'"
              >
                <summary class="cursor-pointer text-base font-semibold">{{ item.question }}</summary>
                <p class="mt-3 text-sm leading-7" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ item.answer }}</p>
              </details>
            </div>
          </section>
        </article>

        <aside class="space-y-6">
          <div class="rounded-[28px] border p-6" :class="isTor ? 'border-white/10 bg-white/[0.03]' : 'border-sand-200 bg-white'">
            <p class="text-xs uppercase tracking-[0.18em]" :class="isTor ? 'text-[#d79a49]' : 'text-sand-600'">{{ t('blog.guides') }}</p>
            <p class="mt-3 text-lg font-semibold">{{ t('blog.sidebarTitle') }}</p>
            <p class="mt-2 text-sm leading-7" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('blog.sidebarDescription') }}</p>
          </div>

          <div v-if="relatedArticles.length" class="space-y-4">
            <h2 :class="isTor
              ? (isArmenianLocale ? 'text-2xl font-semibold leading-tight' : 'text-2xl font-black uppercase tracking-[0.05em]')
              : 'text-2xl font-semibold'">{{ t('blog.relatedArticles') }}</h2>
            <BlogArticleCardComponent
              v-for="item in relatedArticles"
              :key="item.id"
              :article="item"
              :theme="isTor ? 'tor' : 'default'"
              :to="localePath(`${blogPath}/${item.slug}`) as string"
            />
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.blog-article :deep(h2) {
  margin-top: 2rem;
  margin-bottom: 0.9rem;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.blog-article :deep(p),
.blog-article :deep(ul) {
  margin-top: 0.9rem;
}

.blog-article :deep(ul) {
  padding-left: 1.2rem;
  list-style: disc;
}

.blog-article :deep(li + li) {
  margin-top: 0.65rem;
}

.blog-article :deep(a) {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.blog-article--tor :deep(a) {
  color: #efbf7f;
}
</style>
