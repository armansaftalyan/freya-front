<script setup lang="ts">
useSeoMeta({
  title: 'Premium Beauty Salon',
  description: 'Онлайн-запись в премиальный салон: услуги, мастера, свободные слоты.',
  ogTitle: 'Aurum Beauty Salon',
  ogDescription: 'Book now: services, masters, and instant online appointments.',
  ogType: 'website',
})
</script>

<template>
  <div>
    <HeroSection />
    <ServicesGrid />
    <MastersGrid />
    <HowToBookSection />
    <PriceBlock />
    <ReviewsSection />
    <InstagramStrip />
    <ContactsSection />
    <CtaBookingSection />
  </div>
</template>
