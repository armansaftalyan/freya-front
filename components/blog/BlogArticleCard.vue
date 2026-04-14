<script setup lang="ts">
import type { BlogArticleCard } from '~/types/blog'

const props = defineProps<{
  article: BlogArticleCard
  to: string
  theme?: 'default' | 'tor'
}>()

const { t, locale } = useLocale()
const isArmenianLocale = computed(() => locale.value === 'hy')

const dateLabel = computed(() => {
  if (!props.article.published_at) return ''

  return new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(props.article.published_at))
})
</script>

<template>
  <NuxtLink
    :to="to"
    class="group block h-full rounded-[28px] border p-6 transition"
    :class="theme === 'tor'
      ? 'border-white/10 bg-white/[0.03] text-stone-100 hover:border-[#d79a49]/40 hover:bg-white/[0.05]'
      : 'border-sand-200 bg-white/90 text-sand-950 hover:border-sand-300 hover:bg-white'"
  >
    <div class="flex h-full flex-col gap-4">
      <div class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em]" :class="theme === 'tor' ? 'text-[#d79a49]' : 'text-sand-600'">
        <span>{{ article.category?.name || t('blog.guides') }}</span>
        <span>•</span>
        <span>{{ article.reading_minutes }} {{ t('blog.minutesRead') }}</span>
      </div>

      <div class="space-y-3">
        <h3
          class="transition"
          :class="[
            theme === 'tor'
              ? (isArmenianLocale ? 'text-lg font-semibold leading-snug' : 'text-xl font-semibold leading-tight')
              : 'text-xl font-semibold leading-tight',
            theme === 'tor' ? 'group-hover:text-[#efbf7f]' : 'group-hover:text-sand-700',
          ]"
        >
          {{ article.title }}
        </h3>
        <p class="text-sm leading-6" :class="theme === 'tor' ? 'text-stone-400' : 'text-[var(--muted)]'">
          {{ article.excerpt }}
        </p>
      </div>

      <div class="mt-auto flex items-center justify-between gap-4 pt-2 text-sm" :class="theme === 'tor' ? 'text-stone-400' : 'text-[var(--muted)]'">
        <span>{{ dateLabel }}</span>
        <span class="font-medium" :class="theme === 'tor' ? 'text-[#efbf7f]' : 'text-sand-800'">{{ t('blog.readArticle') }} →</span>
      </div>
    </div>
  </NuxtLink>
</template>
