<script setup lang="ts">
const { t } = useLocale()
</script>

<template>
  <section class="section-gap">
    <div class="container-shell grid gap-8 lg:grid-cols-2 lg:items-center">
      <div class="space-y-6 fade-in">
        <p class="inline-flex rounded-full bg-sand-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sand-700">
          {{ t('homePage.hero.badge') }}
        </p>
        <h1 class="text-5xl leading-tight sm:text-6xl">{{ t('homePage.hero.title') }}</h1>
        <p class="max-w-xl text-base text-[var(--muted)] sm:text-lg">
          {{ t('homePage.hero.subtitle') }}
        </p>
        <div class="flex flex-wrap gap-3">
          <NuxtLink to="/booking">
            <BaseButton size="lg">{{ t('nav.bookNow') }}</BaseButton>
          </NuxtLink>
          <NuxtLink to="/services">
            <BaseButton size="lg" variant="secondary">{{ t('nav.services') }}</BaseButton>
          </NuxtLink>
        </div>
      </div>
      <div class="fade-in">
        <div class="overflow-hidden rounded-[2rem] border border-sand-200 shadow-soft">
          <img
            src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=80"
            alt="Beauty salon interior"
            class="h-[420px] w-full object-cover"
            loading="lazy"
          >
        </div>
      </div>
    </div>
  </section>
</template>
