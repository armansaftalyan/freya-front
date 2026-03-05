<script setup lang="ts">
const { t } = useLocale()

const plans = computed(() => [
  { title: 'Express', desc: t('homePage.price.expressDesc'), price: '$40+' },
  { title: 'Signature', desc: t('homePage.price.signatureDesc'), price: '$90+' },
  { title: 'Luxury', desc: t('homePage.price.luxuryDesc'), price: '$160+' },
])
</script>

<template>
  <section class="section-gap">
    <div class="container-shell">
      <div class="mb-8 flex items-end justify-between gap-3">
        <h2 class="text-3xl sm:text-4xl">{{ t('homePage.price.title') }}</h2>
        <NuxtLink to="/booking"><BaseButton>{{ t('nav.bookNow') }}</BaseButton></NuxtLink>
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        <Card v-for="plan in plans" :key="plan.title" class="fade-in">
          <h3 class="text-2xl">{{ plan.title }}</h3>
          <p class="mt-2 text-sm text-[var(--muted)]">{{ plan.desc }}</p>
          <p class="mt-5 text-2xl font-semibold text-sand-700">{{ plan.price }}</p>
        </Card>
      </div>
    </div>
  </section>
</template>
