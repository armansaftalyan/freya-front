<script setup lang="ts">
defineProps<{ current: number }>()

const { t } = useLocale()
const labels = computed(() => [t('booking.service'), t('booking.master'), t('booking.dateSlot'), t('booking.confirm')])
</script>

<template>
  <div class="grid grid-cols-2 gap-2 rounded-2xl bg-white p-3 shadow-soft sm:grid-cols-4">
    <div
      v-for="(label, idx) in labels"
      :key="label"
      class="rounded-xl px-3 py-2 text-center text-xs font-medium"
      :class="idx + 1 <= current ? 'bg-sand-900 text-white' : 'bg-sand-100 text-sand-700'"
    >
      {{ idx + 1 }}. {{ label }}
    </div>
  </div>
</template>
