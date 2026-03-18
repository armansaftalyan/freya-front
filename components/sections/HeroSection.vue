<script setup lang="ts">
const { t, locale } = useLocale()
const { localePath } = useLocalizedPath()
const bookingCta = computed(() => locale.value === 'hy' ? 'Ամրագրել' : t('nav.bookNow'))
</script>

<template>
  <section class="section-gap">
    <div class="container-shell grid gap-10 lg:grid-cols-[1.02fr,0.98fr] lg:items-center">
      <div class="space-y-7 fade-in">
        <p class="inline-flex rounded-full bg-sand-100 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-sand-700 sm:text-xs">
          {{ t('homePage.hero.badge') }}
        </p>
        <h1 class="max-w-3xl text-5xl leading-[1.02] tracking-[-0.03em] text-sand-950 sm:text-6xl xl:text-7xl">
          {{ t('homePage.hero.title') }}
        </h1>
        <p class="max-w-2xl text-lg leading-8 text-[var(--muted)] xl:text-[1.35rem]">
          {{ t('homePage.hero.subtitle') }}
        </p>
        <div class="flex flex-wrap gap-3">
          <NuxtLink :to="localePath('/booking')">
            <BaseButton size="lg">{{ bookingCta }}</BaseButton>
          </NuxtLink>
          <NuxtLink :to="localePath('/services')">
            <BaseButton size="lg" variant="secondary">{{ t('nav.services') }}</BaseButton>
          </NuxtLink>
        </div>
      </div>
      <div class="fade-in">
        <div class="overflow-hidden rounded-[2rem] border border-sand-200 shadow-soft">
          <img
            src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=80"
            alt="Beauty salon interior"
            class="h-[430px] w-full object-cover xl:h-[470px]"
            loading="lazy"
          >
        </div>
      </div>
    </div>
  </section>
</template>
