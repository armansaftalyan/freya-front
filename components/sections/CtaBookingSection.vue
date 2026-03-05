<script setup lang="ts">
const { t } = useLocale()
</script>

<template>
  <section class="section-gap">
    <div class="container-shell">
      <div class="rounded-[2.5rem] bg-sand-900 px-8 py-12 text-white sm:px-12">
        <p class="text-xs uppercase tracking-[0.2em] text-sand-200">{{ t('homePage.cta.badge') }}</p>
        <h2 class="mt-3 text-4xl sm:text-5xl">{{ t('homePage.cta.title') }}</h2>
        <p class="mt-4 max-w-xl text-sand-100">{{ t('homePage.cta.subtitle') }}</p>
        <div class="mt-8">
          <NuxtLink to="/booking">
            <BaseButton variant="secondary" size="lg">{{ t('nav.bookNow') }}</BaseButton>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
