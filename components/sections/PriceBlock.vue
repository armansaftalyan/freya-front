<script setup lang="ts">
import Card from "~/components/base/Card.vue";

const { t } = useLocale()
const { localePath } = useLocalizedPath()
const { formatAmd } = useCurrency()

const plans = computed(() => [
  { title: 'Express', desc: t('homePage.price.expressDesc'), price: 15000 },
  { title: 'Signature', desc: t('homePage.price.signatureDesc'), price: 35000 },
  { title: 'Luxury', desc: t('homePage.price.luxuryDesc'), price: 62000 },
])
</script>

<template>
  <section class="section-gap">
    <div class="container-shell">
      <div class="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 class="text-3xl leading-tight sm:text-4xl">{{ t('homePage.price.title') }}</h2>
        <NuxtLink :to="localePath('/booking')" class="inline-flex">
          <BaseButton variant="secondary" size="sm">
            {{ t('nav.bookNow') }}
            <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </BaseButton>
        </NuxtLink>
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        <Card v-for="plan in plans" :key="plan.title" class="fade-in">
          <h3 class="text-2xl">{{ plan.title }}</h3>
          <p class="mt-2 text-sm text-[var(--muted)]">{{ plan.desc }}</p>
          <p class="mt-5 text-2xl font-semibold text-sand-700">{{ formatAmd(plan.price) }}+</p>
        </Card>
      </div>
    </div>
  </section>
</template>
