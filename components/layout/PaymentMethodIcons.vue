<script setup lang="ts">
const props = withDefaults(defineProps<{
  dark?: boolean
}>(), {
  dark: false,
})

const iconClass = computed(() => props.dark
  ? 'h-8 w-auto rounded-lg border border-white/10 bg-white/[0.06] p-1'
  : 'h-8 w-auto rounded-lg border border-sand-200 bg-white p-1')
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <img src="/payments/visa.svg" alt="Visa" :class="iconClass">
    <img src="/payments/mastercard.svg" alt="Mastercard" :class="iconClass">
    <img src="/payments/arca.svg" alt="ArCa" :class="iconClass">
    <img src="/payments/idram.svg" alt="Idram" :class="iconClass">
  </div>
</template>
