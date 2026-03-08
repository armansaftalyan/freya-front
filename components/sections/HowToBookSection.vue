<template>
  <section class="section-gap">
    <div class="container-shell">
      <div class="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 class="text-3xl leading-tight sm:text-4xl">{{ t('homePage.howToBook.title') }}</h2>
        <NuxtLink to="/booking" class="inline-flex">
          <BaseButton variant="secondary" size="sm">
            {{ t('nav.bookNow') }}
            <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </BaseButton>
        </NuxtLink>
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
