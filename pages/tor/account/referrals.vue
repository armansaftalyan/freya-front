<script setup lang="ts">
import ReferralDashboard from '~/components/account/ReferralDashboard.vue'

definePageMeta({ layout: 'tor', middleware: 'auth' })
</script>

<template>
  <ReferralDashboard />
</template>
