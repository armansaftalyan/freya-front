<script setup lang="ts">
import type { ApiItemResponse } from '~/types/api'
import type { Master } from '~/types/master'
import Card from "~/components/base/Card.vue";

const { t } = useLocale()
const { formatAmd } = useCurrency()
const api = useApi()
const route = useRoute()

const masterKey = computed(() => String(route.params.slug || '').trim())
const master = ref<Master | null>(null)
const loadError = ref(false)
const lightboxIndex = ref<number | null>(null)
const loading = ref(true)

if (!masterKey.value) {
  loadError.value = true
}
else {
  const { data } = await useAsyncData(`master-profile-${masterKey.value}`, async () => {
    try {
      const response = await api.get<ApiItemResponse<Master>>(`/masters/${masterKey.value}`, undefined, { skipErrorToast: true })
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

useSeoMeta({
  title: () => master.value ? `${master.value.name} - Freya` : `Freya - ${t('nav.masters')}`,
  description: () => master.value?.bio || t('mastersPage.profileSeoDescription'),
  ogTitle: () => master.value ? `${master.value.name} - Freya` : `Freya - ${t('nav.masters')}`,
  ogDescription: () => master.value?.bio || t('mastersPage.profileSeoDescription'),
})

const certificates = computed(() => master.value?.certificates || [])
const activeCertificate = computed(() => {
  if (lightboxIndex.value === null) return null
  return certificates.value[lightboxIndex.value] || null
})

const openLightbox = (idx: number) => {
  lightboxIndex.value = idx
}

const closeLightbox = () => {
  lightboxIndex.value = null
}

const showPrev = () => {
  if (lightboxIndex.value === null || certificates.value.length < 2) return
  lightboxIndex.value = (lightboxIndex.value - 1 + certificates.value.length) % certificates.value.length
}

const showNext = () => {
  if (lightboxIndex.value === null || certificates.value.length < 2) return
  lightboxIndex.value = (lightboxIndex.value + 1) % certificates.value.length
}

const onKeydown = (event: KeyboardEvent) => {
  if (lightboxIndex.value === null) return
  if (event.key === 'Escape') closeLightbox()
  if (event.key === 'ArrowLeft') showPrev()
  if (event.key === 'ArrowRight') showNext()
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
      <NuxtLink to="/masters" class="inline-flex items-center text-sm text-sand-700 hover:text-sand-900">
        ← {{ t('nav.masters') }}
      </NuxtLink>

      <Card v-if="loading" class="max-w-xl">
        <p class="text-sm text-[var(--muted)]">Loading...</p>
      </Card>

      <Card v-else-if="loadError" class="max-w-xl">
        <h1 class="text-3xl">{{ t('common.backend.notFound') }}</h1>
        <p class="mt-3 text-sm text-[var(--muted)]">{{ t('mastersPage.profileSeoDescription') }}</p>
        <NuxtLink to="/masters" class="mt-5 inline-block">
          <BaseButton variant="secondary">{{ t('nav.masters') }}</BaseButton>
        </NuxtLink>
      </Card>

      <div v-else-if="master" class="grid gap-6 lg:grid-cols-[360px,1fr]">
        <Card class="h-fit">
          <img
            :src="master.avatar || 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=80'"
            :alt="master.name"
            class="h-80 w-full rounded-2xl object-cover"
            loading="lazy"
          >
          <h1 class="mt-4 text-3xl sm:text-4xl">{{ master.name }}</h1>
          <p class="mt-3 text-sm text-[var(--muted)]">{{ master.bio || t('mastersPage.fallbackBio') }}</p>

          <div class="mt-5 grid gap-2 text-sm">
            <p v-if="master.experience_years !== null">
              <span class="text-[var(--muted)]">{{ t('mastersPage.experience') }}:</span>
              <span class="font-semibold"> {{ master.experience_years }} {{ t('mastersPage.years') }}</span>
            </p>
            <p v-if="master.instagram">
              <span class="text-[var(--muted)]">Instagram:</span>
              <span class="font-semibold"> {{ master.instagram }}</span>
            </p>
          </div>

          <NuxtLink to="/booking" class="mt-6 inline-block">
            <BaseButton>{{ t('mastersPage.bookWithMaster') }}</BaseButton>
          </NuxtLink>
        </Card>

        <div class="space-y-6">
          <Card v-if="master.specialties.length">
            <h2 class="text-2xl">{{ t('mastersPage.specialties') }}</h2>
            <div class="mt-4 flex flex-wrap gap-2">
              <span
                v-for="item in master.specialties"
                :key="item"
                class="rounded-full bg-sand-100 px-3 py-1 text-sm text-sand-800"
              >
                {{ item }}
              </span>
            </div>
          </Card>

          <Card v-if="master.languages.length">
            <h2 class="text-2xl">{{ t('mastersPage.languages') }}</h2>
            <div class="mt-4 flex flex-wrap gap-2">
              <span
                v-for="item in master.languages"
                :key="item"
                class="rounded-full bg-white px-3 py-1 text-sm text-sand-800 ring-1 ring-sand-200"
              >
                {{ item }}
              </span>
            </div>
          </Card>

          <Card>
            <h2 class="text-2xl">{{ t('mastersPage.servicesTitle') }}</h2>
            <div class="mt-4 grid gap-3">
              <NuxtLink
                v-for="service in master.services || []"
                :key="service.id"
                :to="{
                  path: '/booking',
                  query: {
                    master_id: String(master.id),
                    service_id: String(service.id),
                    category_id: String(service.category_id),
                  },
                }"
                class="block rounded-2xl border border-sand-200 bg-white p-4 transition-all hover:border-sand-400 hover:shadow-soft"
              >
                <div class="flex items-start justify-between gap-3">
                  <p class="font-semibold">{{ service.name }}</p>
                  <span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sand-100 text-sand-700">→</span>
                </div>
                <p class="mt-1 text-sm text-[var(--muted)]">{{ service.duration_minutes }} {{ t('servicesPage.minutes') }}</p>
                <p class="mt-1 text-sm font-semibold text-sand-700">{{ formatAmd(service.price) }}</p>
              </NuxtLink>
            </div>
          </Card>

          <Card v-if="master.certificates.length">
            <h2 class="text-2xl">{{ t('mastersPage.certificatesTitle') }}</h2>
            <div class="mt-4 grid gap-4 sm:grid-cols-2">
              <article
                v-for="(certificate, idx) in master.certificates"
                :key="`${certificate.title}-${certificate.year}`"
                class="overflow-hidden rounded-2xl border border-sand-200 bg-white"
              >
                <img
                  v-if="certificate.image"
                  :src="certificate.image"
                  :alt="certificate.title"
                  class="h-40 w-full cursor-zoom-in object-cover"
                  loading="lazy"
                  @click="openLightbox(idx)"
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
          @click.self="closeLightbox"
        >
          <button
            type="button"
            class="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white"
            aria-label="Close"
            @click="closeLightbox"
          >
            ✕
          </button>

          <button
            v-if="certificates.length > 1"
            type="button"
            class="absolute left-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white"
            aria-label="Previous"
            @click="showPrev"
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
            aria-label="Next"
            @click="showNext"
          >
            ›
          </button>
        </div>
      </Teleport>
    </div>
  </section>
</template>
