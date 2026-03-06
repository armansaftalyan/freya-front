<template>
  <section class="section-gap">
    <div class="container-shell">
      <div class="mb-8 flex items-end justify-between gap-4">
        <h2 class="text-3xl sm:text-4xl">{{ t('homePage.howToBook.title') }}</h2>
        <NuxtLink to="/booking"><BaseButton>{{ t('nav.bookNow') }}</BaseButton></NuxtLink>
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        <Card v-for="(step, idx) in steps" :key="step.title" class="fade-in">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-sand-600">{{ t('homePage.howToBook.step') }} {{ idx + 1 }}</p>
          <h3 class="mt-3 text-2xl">{{ step.title }}</h3>
          <p class="mt-3 text-sm text-[var(--muted)]">{{ step.text }}</p>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Card from "~/components/base/Card.vue";

const { t } = useLocale()

const steps = computed(() => [
  { title: t('homePage.howToBook.firstTitle'), text: t('homePage.howToBook.firstText') },
  { title: t('homePage.howToBook.secondTitle'), text: t('homePage.howToBook.secondText') },
  { title: t('homePage.howToBook.thirdTitle'), text: t('homePage.howToBook.thirdText') },
])
</script>
