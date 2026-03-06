<script setup lang="ts">
import HeroSection from "~/components/sections/HeroSection.vue";
import ServicesGrid from "~/components/sections/ServicesGrid.vue";
import MastersGrid from "~/components/sections/MastersGrid.vue";
import HowToBookSection from "~/components/sections/HowToBookSection.vue";
import PriceBlock from "~/components/sections/PriceBlock.vue";
import ReviewsSection from "~/components/sections/ReviewsSection.vue";
import InstagramStrip from "~/components/sections/InstagramStrip.vue";
import ContactsSection from "~/components/sections/ContactsSection.vue";
import CtaBookingSection from "~/components/sections/CtaBookingSection.vue";

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
