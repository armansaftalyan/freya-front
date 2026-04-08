<script setup lang="ts">
const props = withDefaults(defineProps<{
  dark?: boolean
}>(), {
  dark: false,
})
</script>

<template>
  <div class="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-5 sm:gap-y-3">
    <img
      src="/payments/visa.svg"
      alt="Visa"
      width="120"
      height="39"
      class="block h-8 w-auto shrink-0 object-contain sm:h-10"
    >
    <img
      src="/payments/mastercard.svg"
      alt="Mastercard"
      width="63"
      height="40"
      class="block h-8 w-auto shrink-0 object-contain sm:h-10"
    >
    <img
      src="/payments/arca.svg"
      alt="ArCa"
      width="139"
      height="35"
      class="block h-8 w-auto shrink-0 object-contain sm:h-10"
    >
    <img
      :src="props.dark ? '/payments/idram.svg' : '/payments/idram-light.svg'"
      alt="Idram"
      width="133"
      height="40"
      class="block h-7 w-auto shrink-0 object-contain sm:h-8"
    >
  </div>
</template>
