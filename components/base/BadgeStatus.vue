<script setup lang="ts">
const props = defineProps<{ status: string }>()

const cls = computed(() => {
  if (props.status === 'confirmed') return 'bg-emerald-100 text-emerald-700'
  if (props.status === 'cancelled') return 'bg-rose-100 text-rose-700'
  if (props.status === 'done') return 'bg-sky-100 text-sky-700'
  return 'bg-amber-100 text-amber-700'
})
</script>

<template>
  <span class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide" :class="cls">
    {{ status }}
  </span>
</template>
