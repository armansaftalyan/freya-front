<script setup lang="ts">
import ReferralDashboard from '~/components/account/ReferralDashboard.vue'

definePageMeta({ middleware: 'auth' })
</script>

<template>
  <ReferralDashboard />
</template>
