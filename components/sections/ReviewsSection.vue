<template>
  <section class="section-gap">
    <div class="container-shell">
      <div class="mb-8 flex items-end justify-between gap-3">
        <h2 class="text-3xl sm:text-4xl">{{ t('homePage.reviews.title') }}</h2>
        <NuxtLink to="/booking"><BaseButton variant="ghost">{{ t('nav.bookNow') }}</BaseButton></NuxtLink>
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        <Card v-for="review in reviews" :key="review.name" class="fade-in">
          <p class="text-sm text-[var(--muted)]">“{{ review.text }}”</p>
          <p class="mt-4 text-sm font-semibold text-sand-800">{{ review.name }}</p>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Card from "~/components/base/Card.vue";

const { t } = useLocale()

const reviews = computed(() => [
  { name: 'Sofia M.', text: t('homePage.reviews.first') },
  { name: 'Anna R.', text: t('homePage.reviews.second') },
  { name: 'Kate W.', text: t('homePage.reviews.third') },
])
</script>
