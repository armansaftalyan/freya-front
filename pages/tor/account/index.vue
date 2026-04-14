<script setup lang="ts">
import AccountProfilePage from '~/pages/account/index.vue'

definePageMeta({
  layout: 'tor',
  middleware: 'auth',
})
</script>

<template>
  <AccountProfilePage />
</template>
