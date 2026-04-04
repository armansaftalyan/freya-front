<script setup lang="ts">
import BookingFlow from '~/components/booking/BookingFlow.vue'
import SeoIntentSection from '~/components/sections/SeoIntentSection.vue'

const { isTor } = useBrandContext()
</script>

<template>
  <div>
    <BookingFlow />
    <SeoIntentSection section="booking" :theme="isTor ? 'tor' : 'default'" />
  </div>
</template>
