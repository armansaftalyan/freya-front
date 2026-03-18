<script setup lang="ts">
import AppointmentsPage from '~/pages/account/appointments.vue'

definePageMeta({
  layout: 'tor',
  middleware: 'auth',
})
</script>

<template>
  <AppointmentsPage />
</template>
