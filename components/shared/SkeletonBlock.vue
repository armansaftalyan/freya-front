<script setup lang="ts">
withDefaults(defineProps<{
  theme?: 'light' | 'dark'
}>(), {
  theme: 'light',
})
</script>

<template>
  <div
    class="animate-pulse rounded-2xl"
    :class="theme === 'dark' ? 'bg-white/[0.08]' : 'bg-sand-100'"
  />
</template>
