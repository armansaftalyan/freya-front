<script setup lang="ts">
import type { HeroSlide } from '~/types/page-content'
import HomeHeroSlider from "~/components/sections/HomeHeroSlider.vue";

defineProps<{
  slides?: HeroSlide[]
}>()

const { t, locale } = useLocale()
const { localePath } = useLocalizedPath()
const { bookingPath, rootPath } = useBrandContext()
const bookingCta = computed(() => locale.value === 'hy' ? 'Ամրագրել' : t('nav.bookNow'))
const fallbackHeroImage = 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=80&fm=webp'
</script>

<template>
  <section class="section-gap">
    <div class="container-shell grid gap-7 lg:grid-cols-[1.02fr,0.98fr] lg:items-center lg:gap-10">
      <div class="space-y-7 fade-in">
        <p class="inline-flex rounded-full bg-sand-100 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-sand-700 sm:text-xs">
          {{ t('homePage.hero.badge') }}
        </p>
        <h1 class="max-w-3xl text-[2.55rem] leading-[1.02] tracking-[-0.03em] text-sand-950 sm:text-6xl xl:text-7xl">
          {{ t('homePage.hero.title') }}
        </h1>
        <h2 class="mt-4 max-w-2xl text-xl text-sand-700 sm:text-2xl">
          {{ t('homePage.hero.seoHeading') }}
        </h2>
        <p class="max-w-2xl text-lg leading-8 text-[var(--muted)] xl:text-[1.35rem]">
          {{ t('homePage.hero.subtitle') }}
        </p>
        <p class="max-w-2xl text-sm leading-7 text-sand-700 sm:text-base">
          {{ t('homePage.hero.searchLead') }}
        </p>
        <div class="grid gap-3 sm:flex sm:flex-wrap">
          <NuxtLink :to="localePath(bookingPath)">
            <BaseButton size="lg" block>{{ bookingCta }}</BaseButton>
          </NuxtLink>
          <NuxtLink :to="localePath(`${rootPath}/services`)">
            <BaseButton size="lg" variant="secondary" block>{{ t('nav.services') }}</BaseButton>
          </NuxtLink>
        </div>
        <div class="pt-2 lg:hidden">
          <HomeHeroSlider
            :slides="slides"
            :fallback-image="fallbackHeroImage"
            fallback-alt="Freya Beauty Salon interior in Yerevan"
            compact
          />
        </div>
      </div>
      <div class="hidden fade-in lg:block">
        <HomeHeroSlider
          :slides="slides"
          :fallback-image="fallbackHeroImage"
          fallback-alt="Freya Beauty Salon interior in Yerevan"
        />
      </div>
    </div>
  </section>
</template>
