<script setup lang="ts">
const props = withDefaults(defineProps<{
  current: number
  theme?: 'light' | 'dark'
}>(), {
  theme: 'light',
})

const { t } = useLocale()
const labels = computed(() => [t('booking.service'), t('booking.master'), t('booking.dateSlot'), t('booking.confirm')])
</script>

<template>
  <div
    class="grid grid-cols-2 gap-2 rounded-2xl p-3 sm:grid-cols-4"
    :class="props.theme === 'dark'
      ? 'border border-white/10 bg-white/[0.04]'
      : 'bg-white shadow-soft'"
  >
    <div
      v-for="(label, idx) in labels"
      :key="label"
      class="rounded-xl px-3 py-2 text-center text-xs font-medium"
      :class="idx + 1 <= current
        ? (props.theme === 'dark' ? 'bg-[#d79a49] text-black' : 'bg-sand-900 text-white')
        : (props.theme === 'dark' ? 'bg-white/[0.05] text-stone-300' : 'bg-sand-100 text-sand-700')"
    >
      {{ idx + 1 }}. {{ label }}
    </div>
  </div>
</template>
