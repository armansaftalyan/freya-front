<script setup lang="ts">
const { t } = useLocale()

useSeoMeta({
  title: 'Freya Beauty Salon',
  description: () => t('homePage.seoDescription'),
  ogTitle: 'Freya Beauty Salon',
  ogDescription: () => t('homePage.ogDescription'),
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
