<script setup lang="ts">
import type { ApiListResponse } from '~/types/api'
import type { Category } from '~/types/category'
import type { Service } from '~/types/service'

definePageMeta({
  layout: 'tor',
})

const api = useApi()
const route = useRoute()
const { locale, t } = useLocale()
const { localePath } = useLocalizedPath()
const { formatAmd } = useCurrency()
const { siteUrl } = useSiteMeta()
const { bookingPath } = useBrandContext()

const copy = computed(() => {
  if (locale.value === 'ru') {
    return {
      title: 'Услуги Tor',
      lead: 'Мужские стрижки, окантовка, борода и мужской уход в отдельной подаче Tor.',
      back: 'Назад в Tor',
      cta: 'Записаться',
    }
  }

  if (locale.value === 'en') {
    return {
      title: 'Tor Services',
      lead: 'Cuts, beard shaping, line-ups and focused grooming under the Tor direction.',
      back: 'Back to Tor',
      cta: 'Book now',
    }
  }

  return {
    title: 'Tor ծառայություններ',
    lead: 'Տղամարդկանց սանրվածք, մորուք, եզրագծում և տղամարդկանց խնամք Tor ուղղությամբ։',
    back: 'Վերադառնալ Tor',
    cta: 'Ամրագրել',
  }
})

const { data } = await useAsyncData(() => `tor-services-page-${locale.value}`, async () => {
  const [categoriesResponse, servicesResponse] = await Promise.all([
    api.get<ApiListResponse<Category>>('/categories', { brand: 'tor' }, { skipErrorToast: true }),
    api.get<ApiListResponse<Service>>('/services', { brand: 'tor' }, { skipErrorToast: true }),
  ])

  return {
    categories: categoriesResponse.data,
    services: servicesResponse.data,
  }
})

const categories = computed(() => data.value?.categories || [])
const services = computed(() => data.value?.services || [])
const menCategory = computed(() => categories.value.find(item => item.slug === 'men-hair') || null)
const menServices = computed(() => {
  if (!menCategory.value) return []
  return services.value.filter(item => item.category_id === menCategory.value?.id)
})

usePageSeo({
  title: () => copy.value.title,
  description: () => copy.value.lead,
})

useStructuredData(() => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: copy.value.title,
  description: copy.value.lead,
  url: `${siteUrl.value}${route.path}`,
}))
</script>

<template>
  <section class="container-shell py-14 text-stone-100">
    <NuxtLink :to="localePath('/tor')" class="inline-flex text-sm font-semibold uppercase tracking-[0.16em] text-[#c58a3a]">
      ← {{ copy.back }}
    </NuxtLink>

    <div class="mt-6 max-w-3xl">
      <h1 class="text-4xl font-black uppercase tracking-[0.06em] sm:text-6xl">{{ copy.title }}</h1>
      <p class="mt-4 text-stone-300">{{ copy.lead }}</p>
    </div>

    <div class="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="service in menServices"
        :key="service.id"
        class="tor-panel flex h-full min-h-[17rem] flex-col fade-in"
      >
        <div class="flex items-start justify-between gap-3">
          <h2 class="min-h-[3.5rem] flex-1 text-xl font-bold uppercase leading-tight tracking-[0.03em]">{{ service.name }}</h2>
          <span class="shrink-0 whitespace-nowrap rounded-full border border-[#c58a3a]/50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#d8a15a]">
            {{ service.duration_minutes }} {{ t('servicesPage.minutes') }}
          </span>
        </div>
        <p class="mt-3 min-h-[4.5rem] text-sm leading-6 text-stone-400">{{ service.description }}</p>
        <div class="mt-auto flex items-end justify-between gap-3 pt-5">
          <p class="text-lg font-semibold text-white">
            {{ formatAmd(service.price_from) }}
            <span v-if="service.price_to && service.price_to !== service.price_from" class="text-stone-400">- {{ formatAmd(service.price_to) }}</span>
          </p>
          <NuxtLink :to="localePath({ path: bookingPath, query: { category_id: String(service.category_id), service_id: String(service.id) } })" class="inline-block shrink-0">
            <BaseButton size="sm" theme="tor">{{ copy.cta }}</BaseButton>
          </NuxtLink>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.tor-panel {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.02));
  border-radius: 1.5rem;
  padding: 1.25rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.22);
}
</style>
