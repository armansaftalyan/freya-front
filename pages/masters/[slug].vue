<script setup lang="ts">
import type { ApiItemResponse } from '~/types/api'
import type { Master } from '~/types/master'
import Card from "~/components/base/Card.vue";

const { t, locale } = useLocale()
const { formatAmd } = useCurrency()
const api = useApi()
const route = useRoute()
const { siteUrl, defaultImageUrl } = useSiteMeta()
const { localePath } = useLocalizedPath()
const { isTor, brand, bookingPath, mastersPath } = useBrandContext()
const loadingLabel = computed(() => t('common.loading'))
const closeLabel = computed(() => t('common.close'))
const previousLabel = computed(() => t('common.previous'))
const nextLabel = computed(() => t('common.next'))

const masterKey = computed(() => String(route.params.slug || '').trim())
const master = ref<Master | null>(null)
const loadError = ref(false)
const certificateLightboxIndex = ref<number | null>(null)
const portfolioLightboxIndex = ref<number | null>(null)
const loading = ref(true)

if (!masterKey.value) {
  loadError.value = true
}
else {
  const { data } = await useAsyncData(() => `master-profile-${brand.value}-${masterKey.value}-${locale.value}`, async () => {
    try {
      const response = await api.get<ApiItemResponse<Master>>(`/masters/${masterKey.value}`, { brand: brand.value }, { skipErrorToast: true })
      return response.data
    }
    catch {
      loadError.value = true
      return null
    }
  })

  master.value = data.value || null
  if (!master.value && !loadError.value) {
    loadError.value = true
  }
}

loading.value = false

const certificates = computed(() =>
  (master.value?.certificates || []).filter((certificate) =>
    Boolean(certificate.image || certificate.title || certificate.issuer || certificate.year),
  ),
)
const portfolioImages = computed(() => master.value?.portfolio || [])
const seoTitle = computed(() =>
  master.value ? `${master.value.name} - ${brand.value === 'tor' ? 'Tor' : 'Freya'}` : `${brand.value === 'tor' ? 'Tor' : 'Freya'} - ${t('nav.masters')}`,
)
const seoDescription = computed(() => master.value?.bio || t('mastersPage.profileSeoDescription'))
const seoImage = computed(() =>
  master.value?.avatar
  || certificates.value.find((certificate) => certificate.image)?.image
  || defaultImageUrl.value,
)
const canonicalUrl = computed(() => `${siteUrl.value}${route.path}`)

useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  ogImage: () => seoImage.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => seoTitle.value,
  twitterDescription: () => seoDescription.value,
  twitterImage: () => seoImage.value,
})

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl.value,
    },
  ],
}))

useStructuredData(() => {
  if (!master.value) {
    return null
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        name: master.value.name,
        description: seoDescription.value,
        image: seoImage.value || undefined,
        url: canonicalUrl.value,
        sameAs: master.value.instagram ? [`https://instagram.com/${master.value.instagram.replace(/^@/, '')}`] : undefined,
        knowsLanguage: master.value.languages.length ? master.value.languages : undefined,
        hasOccupation: {
          '@type': 'Occupation',
          name: 'Beauty Master',
        },
        worksFor: {
          '@id': `${siteUrl.value}#salon`,
        },
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
            name: t('nav.masters'),
            item: `${siteUrl.value}${mastersPath.value}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: master.value.name,
            item: canonicalUrl.value,
          },
        ],
      },
    ],
  }
})
const activeCertificate = computed(() => {
  if (certificateLightboxIndex.value === null) return null
  return certificates.value[certificateLightboxIndex.value] || null
})
const activePortfolioImage = computed(() => {
  if (portfolioLightboxIndex.value === null) return null
  return portfolioImages.value[portfolioLightboxIndex.value] || null
})

const openCertificateLightbox = (idx: number) => {
  certificateLightboxIndex.value = idx
}

const openPortfolioLightbox = (idx: number) => {
  portfolioLightboxIndex.value = idx
}

const closeCertificateLightbox = () => {
  certificateLightboxIndex.value = null
}

const closePortfolioLightbox = () => {
  portfolioLightboxIndex.value = null
}

const showPrevCertificate = () => {
  if (certificateLightboxIndex.value === null || certificates.value.length < 2) return
  certificateLightboxIndex.value = (certificateLightboxIndex.value - 1 + certificates.value.length) % certificates.value.length
}

const showNextCertificate = () => {
  if (certificateLightboxIndex.value === null || certificates.value.length < 2) return
  certificateLightboxIndex.value = (certificateLightboxIndex.value + 1) % certificates.value.length
}

const showPrevPortfolio = () => {
  if (portfolioLightboxIndex.value === null || portfolioImages.value.length < 2) return
  portfolioLightboxIndex.value = (portfolioLightboxIndex.value - 1 + portfolioImages.value.length) % portfolioImages.value.length
}

const showNextPortfolio = () => {
  if (portfolioLightboxIndex.value === null || portfolioImages.value.length < 2) return
  portfolioLightboxIndex.value = (portfolioLightboxIndex.value + 1) % portfolioImages.value.length
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeCertificateLightbox()
    closePortfolioLightbox()
  }

  if (certificateLightboxIndex.value !== null) {
    if (event.key === 'ArrowLeft') showPrevCertificate()
    if (event.key === 'ArrowRight') showNextCertificate()
  }

  if (portfolioLightboxIndex.value !== null) {
    if (event.key === 'ArrowLeft') showPrevPortfolio()
    if (event.key === 'ArrowRight') showNextPortfolio()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <section class="section-gap">
    <div class="container-shell space-y-8">
      <NuxtLink :to="localePath(mastersPath)" class="inline-flex items-center text-sm" :class="isTor ? 'text-stone-300 hover:text-white' : 'text-sand-700 hover:text-sand-900'">
        ← {{ t('nav.masters') }}
      </NuxtLink>

      <Card v-if="loading" class="max-w-xl" :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100' : ''">
        <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ loadingLabel }}</p>
      </Card>

      <Card v-else-if="loadError" class="max-w-xl" :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100' : ''">
        <h1 class="text-3xl">{{ t('common.backend.notFound') }}</h1>
        <p class="mt-3 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('mastersPage.profileSeoDescription') }}</p>
        <NuxtLink :to="localePath(mastersPath)" class="mt-5 inline-block">
          <BaseButton variant="secondary" :theme="isTor ? 'tor' : 'default'">{{ t('nav.masters') }}</BaseButton>
        </NuxtLink>
      </Card>

      <div v-else-if="master" class="grid gap-6 lg:grid-cols-[360px,1fr]">
        <Card class="h-fit" :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.18)]' : ''">
          <img
            :src="master.avatar || 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=80'"
            :alt="master.name"
            class="h-80 w-full rounded-2xl object-cover"
            loading="lazy"
          >
          <h1 class="mt-4 text-3xl sm:text-4xl">{{ master.name }}</h1>
          <p class="mt-3 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ master.bio || t('mastersPage.fallbackBio') }}</p>

          <div class="mt-5 grid gap-2 text-sm">
            <p v-if="master.experience_duration_years !== null && master.experience_duration_years !== undefined">
              <span :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('mastersPage.experience') }}:</span>
              <span class="font-semibold"> {{ master.experience_duration_years }} {{ t('mastersPage.years') }}</span>
            </p>
            <p v-if="master.instagram">
              <span :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">Instagram:</span>
              <span class="font-semibold"> {{ master.instagram }}</span>
            </p>
          </div>

          <NuxtLink :to="localePath(bookingPath)" class="mt-6 inline-block">
            <BaseButton :theme="isTor ? 'tor' : 'default'">{{ t('mastersPage.bookWithMaster') }}</BaseButton>
          </NuxtLink>
        </Card>

        <div class="space-y-6">
          <Card v-if="master.specialties.length" :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100' : ''">
            <h2 class="text-2xl">{{ t('mastersPage.specialties') }}</h2>
            <div class="mt-4 flex flex-wrap gap-2">
              <span
                v-for="item in master.specialties"
                :key="item"
                class="rounded-full px-3 py-1 text-sm"
                :class="isTor ? 'bg-white/[0.08] text-stone-100 ring-1 ring-white/10' : 'bg-sand-100 text-sand-800'"
              >
                {{ item }}
              </span>
            </div>
          </Card>

          <Card v-if="master.languages.length" :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100' : ''">
            <h2 class="text-2xl">{{ t('mastersPage.languages') }}</h2>
            <div class="mt-4 flex flex-wrap gap-2">
              <span
                v-for="item in master.languages"
                :key="item"
                class="rounded-full px-3 py-1 text-sm"
                :class="isTor ? 'bg-white/[0.08] text-stone-100 ring-1 ring-white/10' : 'bg-white text-sand-800 ring-1 ring-sand-200'"
              >
                {{ item }}
              </span>
            </div>
          </Card>

          <Card :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100' : ''">
            <h2 class="text-2xl">{{ t('mastersPage.servicesTitle') }}</h2>
            <div class="mt-4 grid gap-3">
              <NuxtLink
                v-for="service in master.services || []"
                :key="service.id"
                :to="localePath({
                  path: bookingPath,
                  query: {
                    master_id: String(master.id),
                    service_id: String(service.id),
                    category_id: String(service.category_id),
                  },
                })"
                class="block rounded-2xl p-4 transition-all"
                :class="isTor
                  ? 'border border-white/10 bg-white/[0.04] hover:border-[#c58a3a]/50 hover:bg-white/[0.06]'
                  : 'border border-sand-200 bg-white hover:border-sand-400 hover:shadow-soft'"
              >
                <div class="flex items-start justify-between gap-3">
                  <p class="font-semibold">{{ service.name }}</p>
                  <span class="inline-flex h-7 w-7 items-center justify-center rounded-full" :class="isTor ? 'bg-white/[0.08] text-[#c58a3a]' : 'bg-sand-100 text-sand-700'">→</span>
                </div>
                <p class="mt-1 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ service.duration_minutes }} {{ t('servicesPage.minutes') }}</p>
                <p class="mt-1 text-sm font-semibold" :class="isTor ? 'text-[#d79a49]' : 'text-sand-700'">
                  {{ formatAmd(service.price_from) }}
                  <span v-if="service.price_to && service.price_to !== service.price_from" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">- {{ formatAmd(service.price_to) }}</span>
                </p>
              </NuxtLink>
            </div>
          </Card>

          <component
            :is="isTor ? 'article' : Card"
            v-if="portfolioImages.length"
            class="rounded-3xl p-5 sm:p-6"
            :class="isTor
              ? 'border border-white/10 !bg-[#121212] text-stone-100 shadow-[0_22px_60px_rgba(0,0,0,0.34)]'
              : 'bg-[linear-gradient(180deg,#fffdf9_0%,#fff7ef_100%)]'"
            :style="isTor ? { background: '#121212' } : undefined"
          >
            <div class="flex items-end justify-between gap-4">
              <div>
                <p v-if="isTor" class="text-[11px] uppercase tracking-[0.22em] text-[#d79a49]">{{ master.name }}</p>
                <h2 class="text-2xl" :class="isTor ? 'text-white' : ''">{{ t('mastersPage.portfolioTitle') }}</h2>
                <p class="mt-1 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ master.name }}</p>
              </div>
              <span
                class="rounded-full px-3 py-1 text-xs uppercase tracking-[0.24em]"
                :class="isTor ? 'border border-[#d79a49]/30 bg-[#171717] text-[#d79a49]' : 'bg-sand-100 text-sand-700'"
              >
                {{ portfolioImages.length }}
              </span>
            </div>

            <div
              class="mt-5 grid gap-4"
              :class="isTor ? 'sm:grid-cols-2 xl:grid-cols-3' : 'sm:grid-cols-2 xl:grid-cols-3'"
            >
              <article
                v-for="(image, index) in portfolioImages"
                :key="`${image}-${index}`"
                class="group overflow-hidden"
                :class="isTor ? 'rounded-[26px] border border-white/10 bg-[#181818] shadow-[0_18px_45px_rgba(0,0,0,0.3)]' : 'rounded-[26px] border border-sand-200 bg-white shadow-[0_16px_40px_rgba(98,73,42,0.08)]'"
              >
                <button
                  type="button"
                  class="block w-full overflow-hidden text-left"
                  :class="isTor ? 'aspect-[5/6]' : 'aspect-[5/6]'"
                  @click="openPortfolioLightbox(index)"
                >
                  <img
                    :src="image"
                    :alt="`${master.name} portfolio ${index + 1}`"
                    class="h-full w-full cursor-zoom-in object-cover transition duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  >
                </button>
                <div
                  class="flex items-center justify-between px-4 py-3 text-sm"
                  :class="isTor ? 'border-t border-white/10 bg-[#141414] text-stone-300' : 'text-sand-700'"
                >
                  <div>
                    <span class="block">{{ master.name }}</span>
                    <span v-if="isTor" class="mt-1 block text-[11px] uppercase tracking-[0.18em] text-[#d79a49]">{{ t('mastersPage.portfolioTitle') }}</span>
                  </div>
                  <span :class="isTor ? 'text-[#d79a49]' : 'text-sand-500'">0{{ index + 1 }}</span>
                </div>
              </article>
            </div>
          </component>

          <Card v-if="master.certificates.length" :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100' : ''">
            <h2 class="text-2xl">{{ t('mastersPage.certificatesTitle') }}</h2>
            <div class="mt-4 grid gap-4 sm:grid-cols-2">
              <article
                v-for="(certificate, idx) in master.certificates"
                :key="`${certificate.title}-${certificate.year}`"
                class="overflow-hidden rounded-2xl"
                :class="isTor ? 'border border-white/10 bg-white/[0.04]' : 'border border-sand-200 bg-white'"
              >
                <img
                  v-if="certificate.image"
                  :src="certificate.image"
                  :alt="certificate.title"
                  class="h-40 w-full cursor-zoom-in object-cover"
                  loading="lazy"
                  @click="openCertificateLightbox(idx)"
                >
                <div class="p-4">
                  <p class="font-semibold">{{ certificate.title }}</p>
                  <p class="mt-1 text-sm text-[var(--muted)]">{{ certificate.issuer }} · {{ certificate.year }}</p>
                </div>
              </article>
            </div>
          </Card>
        </div>
      </div>

      <Teleport to="body">
        <div
          v-if="activeCertificate"
          class="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4"
          @click.self="closeCertificateLightbox"
        >
          <button
            type="button"
            class="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white"
            :aria-label="closeLabel"
            @click="closeCertificateLightbox"
          >
            ✕
          </button>

          <button
            v-if="certificates.length > 1"
            type="button"
            class="absolute left-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white"
            :aria-label="previousLabel"
            @click="showPrevCertificate"
          >
            ‹
          </button>

          <figure class="max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl bg-white">
            <img
              v-if="activeCertificate.image"
              :src="activeCertificate.image"
              :alt="activeCertificate.title"
              class="max-h-[75vh] w-full object-contain"
            >
            <figcaption class="p-4">
              <p class="font-semibold text-sand-900">{{ activeCertificate.title }}</p>
              <p class="text-sm text-[var(--muted)]">{{ activeCertificate.issuer }} · {{ activeCertificate.year }}</p>
            </figcaption>
          </figure>

          <button
            v-if="certificates.length > 1"
            type="button"
            class="absolute right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white"
            :aria-label="nextLabel"
            @click="showNextCertificate"
          >
            ›
          </button>
        </div>

        <div
          v-if="activePortfolioImage"
          class="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4"
          @click.self="closePortfolioLightbox"
        >
          <button
            type="button"
            class="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white"
            :aria-label="closeLabel"
            @click="closePortfolioLightbox"
          >
            ✕
          </button>

          <button
            v-if="portfolioImages.length > 1"
            type="button"
            class="absolute left-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white"
            :aria-label="previousLabel"
            @click="showPrevPortfolio"
          >
            ‹
          </button>

          <figure
            class="max-h-[90vh] w-full overflow-hidden rounded-[28px]"
            :class="isTor ? 'max-w-6xl border border-white/10 bg-[#111111]' : 'max-w-5xl bg-white'"
          >
            <img
              :src="activePortfolioImage"
              :alt="`${master?.name} portfolio ${portfolioLightboxIndex !== null ? portfolioLightboxIndex + 1 : ''}`"
              class="max-h-[78vh] w-full object-contain"
            >
            <figcaption
              class="flex items-center justify-between gap-3 p-4"
              :class="isTor ? 'border-t border-white/10 text-stone-300' : ''"
            >
              <div>
                <p class="font-semibold" :class="isTor ? 'text-white' : 'text-sand-900'">{{ master?.name }}</p>
                <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('mastersPage.portfolioTitle') }}</p>
              </div>
              <span :class="isTor ? 'text-[#d79a49]' : 'text-sand-500'">
                {{ portfolioLightboxIndex !== null ? String(portfolioLightboxIndex + 1).padStart(2, '0') : '' }}
              </span>
            </figcaption>
          </figure>

          <button
            v-if="portfolioImages.length > 1"
            type="button"
            class="absolute right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white"
            :aria-label="nextLabel"
            @click="showNextPortfolio"
          >
            ›
          </button>
        </div>
      </Teleport>
    </div>
  </section>
</template>
