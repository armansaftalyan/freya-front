<script setup lang="ts">
import BookingFlow from '~/components/booking/BookingFlow.vue'
import SeoIntentSection from '~/components/sections/SeoIntentSection.vue'

definePageMeta({
  layout: 'tor',
})
</script>

<template>
  <div>
    <BookingFlow />
    <SeoIntentSection section="booking" theme="tor" />
  </div>
</template>
