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
import BaseModal from "~/components/base/BaseModal.vue";

const { t } = useLocale()
const showGiftPromo = ref(false)
const giftPromoStorageKey = 'freya_gift_promo_seen_session_v1'

onMounted(() => {
  try {
    const alreadySeen = sessionStorage.getItem(giftPromoStorageKey) === '1'
    if (!alreadySeen) {
      showGiftPromo.value = true
      sessionStorage.setItem(giftPromoStorageKey, '1')
    }
  }
  catch {
    showGiftPromo.value = false
  }
})

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
    <BaseModal v-model="showGiftPromo" :title="t('homePage.giftPromo.title')" max-width-class="max-w-3xl">
      <div class="space-y-4">
        <div class="rounded-3xl bg-[radial-gradient(circle_at_top_left,#f9d57c_0%,#f0ba57_36%,#111827_100%)] p-5 text-white">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sand-100/90">{{ t('homePage.giftPromo.badge') }}</p>
            <p class="mt-3 text-lg font-semibold leading-tight sm:text-2xl">{{ t('homePage.giftPromo.title') }}</p>
            <p class="mt-2 text-sm text-sand-100/90">{{ t('homePage.giftPromo.subtitle') }}</p>
          </div>
        </div>
        <div class="grid gap-2 sm:grid-cols-2">
          <NuxtLink to="/gift-cards/buy" class="inline-flex items-center justify-center rounded-2xl bg-sand-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black" @click="showGiftPromo = false">
            {{ t('homePage.giftPromo.primary') }}
          </NuxtLink>
          <NuxtLink to="/booking" class="inline-flex items-center justify-center rounded-2xl border border-sand-300 bg-white px-4 py-3 text-sm font-semibold text-sand-900 transition hover:border-sand-600" @click="showGiftPromo = false">
            {{ t('homePage.giftPromo.secondary') }}
          </NuxtLink>
        </div>
      </div>
    </BaseModal>
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
