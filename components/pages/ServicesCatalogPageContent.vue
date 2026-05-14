<script setup lang="ts">
import type { Category } from '~/types/category'
import type { Service } from '~/types/service'
import type { SupportedLocale } from '~/composables/useLocalizedPath'
import ServiceCatalogCard from '~/components/catalog/ServiceCatalogCard.vue'
import FaqSection from '~/components/sections/FaqSection.vue'
import SkeletonBlock from '~/components/shared/SkeletonBlock.vue'

const props = withDefaults(defineProps<{
  theme?: 'default' | 'tor'
  title: string
  eyebrow?: string
  lead?: string
  backLabel?: string
  backTo?: string
  categoryCta: string
  actionLabel: string
  grouped: Array<{ category: Pick<Category, 'id' | 'name' | 'slug' | 'slug_i18n'>; items: Service[] }>
  loading?: boolean
  bookingPath: string
  servicesPath: string
  faqCopy: {
    eyebrow: string
    title: string
    lead: string
    items: Array<{ question: string; answer: string }>
  }
  borderedSeo?: boolean
  defaultDescription?: string
  durationLabel: string
}>(), {
  theme: 'default',
  eyebrow: '',
  lead: '',
  backLabel: '',
  backTo: '',
  loading: false,
  borderedSeo: true,
  defaultDescription: '',
})

const { localePath } = useLocalizedPath()
const { locale } = useLocale()
const { formatPriceLabel } = useServicePricing()
const { isVisible: isPromoVisible, promoCopy, promoPricingFor } = useFirstBookingPromo()
const isTor = computed(() => props.theme === 'tor')

const detailPathFor = (category: Pick<Category, 'slug' | 'slug_i18n'>, service: Service) =>
  localePath(`${props.servicesPath}/${localizedSlugFor(category, locale.value as SupportedLocale)}/${localizedSlugFor(service, locale.value as SupportedLocale)}`) as string
</script>

<template>
  <section
    :class="isTor ? 'container-shell py-14 text-stone-100' : 'section-gap'"
  >
    <div :class="isTor ? '' : 'container-shell space-y-8'">
      <NuxtLink
        v-if="backLabel && backTo"
        :to="localePath(backTo)"
        class="inline-flex text-sm font-semibold uppercase tracking-[0.16em]"
        :class="isTor ? 'text-[#c58a3a]' : 'text-sand-700'"
      >
        ← {{ backLabel }}
      </NuxtLink>

      <div
        :class="isTor
          ? 'mt-6 max-w-3xl'
          : 'flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4'"
      >
        <div>
          <p
            class="text-xs uppercase tracking-[0.2em]"
            :class="isTor ? 'text-[#c58a3a]' : 'text-sand-700'"
          >
            {{ eyebrow }}
          </p>
          <h1
            :class="isTor
              ? 'mt-2 text-4xl font-black uppercase tracking-[0.06em] sm:text-6xl'
              : 'text-3xl leading-tight sm:text-5xl'"
          >
            {{ title }}
          </h1>
          <p
            v-if="lead"
            class="mt-4"
            :class="isTor ? 'text-stone-300' : 'text-sm text-[var(--muted)]'"
          >
            {{ lead }}
          </p>
        </div>

        <NuxtLink v-if="!isTor" :to="localePath(bookingPath)">
          <BaseButton size="lg">{{ actionLabel }}</BaseButton>
        </NuxtLink>
      </div>

      <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonBlock v-for="idx in 6" :key="idx" class="h-48" />
      </div>

      <div :class="isTor ? 'mt-10 space-y-10' : 'space-y-8'">
        <div v-for="entry in grouped" :key="entry.category.id" class="space-y-4">
          <div class="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 :class="isTor ? 'text-[1.9rem] leading-tight text-stone-100 sm:text-[2.1rem]' : 'text-[1.9rem] leading-tight text-sand-950 sm:text-[2.1rem]'">
              {{ entry.category.name }}
            </h2>
            <NuxtLink
              :to="localePath(`${servicesPath}/${localizedSlugFor(entry.category, locale)}`)"
              class="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition"
              :class="isTor
                ? 'border border-white/10 bg-white/[0.03] text-[#d8a15a] hover:border-[#c58a3a]/40 hover:text-[#efbf7f]'
                : 'border border-sand-300 text-sand-800 hover:border-sand-500 hover:text-sand-950'"
            >
              {{ categoryCta }}
            </NuxtLink>
          </div>

          <div :class="isTor ? 'grid gap-4 md:grid-cols-2 xl:grid-cols-3' : 'grid gap-4 md:grid-cols-3'">
            <ServiceCatalogCard
              v-for="service in entry.items"
              :key="service.id"
              class="fade-in"
              :theme="theme"
              :name="service.name"
              :description="service.description || defaultDescription"
              :duration-minutes="service.duration_minutes"
              :duration-label="durationLabel"
              :price-label="formatPriceLabel(service)"
              :promo-price-label="isPromoVisible ? promoPricingFor(service).promoLabel : ''"
              :promo-badge="isPromoVisible ? promoCopy.badge : ''"
              :promo-disclaimer="isPromoVisible ? promoCopy.disclaimer : ''"
              :action-label="actionLabel"
              :action-to="localePath({ path: bookingPath, query: { category_id: String(service.category_id), service_id: String(service.id) } }) as string"
              :card-to="detailPathFor(entry.category, service)"
            />
          </div>
        </div>
      </div>

      <FaqSection
        :theme="theme"
        :bordered="borderedSeo"
        :eyebrow="faqCopy.eyebrow"
        :title="faqCopy.title"
        :lead="faqCopy.lead"
        :items="faqCopy.items"
      />
    </div>
  </section>
</template>
