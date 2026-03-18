<template>
  <section class="section-gap">
    <div class="container-shell">
      <div class="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 class="text-3xl leading-tight sm:text-4xl">{{ t('homePage.reviews.title') }}</h2>
        <NuxtLink :to="localePath(bookingPath)" class="inline-flex">
          <BaseButton variant="secondary" size="sm">
            {{ t('nav.bookNow') }}
            <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </BaseButton>
        </NuxtLink>
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
const { localePath } = useLocalizedPath()
const { bookingPath } = useBrandContext()

const reviews = computed(() => [
  { name: 'Sofia M.', text: t('homePage.reviews.first') },
  { name: 'Anna R.', text: t('homePage.reviews.second') },
  { name: 'Kate W.', text: t('homePage.reviews.third') },
])
</script>
