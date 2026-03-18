<script setup lang="ts">
import type { Slot } from '~/types/slot'
const { t } = useLocale()
const { formatYerevanTime } = useDateTime()

const props = defineProps<{
  slots: Slot[]
  selected: Slot | null
  theme?: 'light' | 'dark'
}>()

const emit = defineEmits<{ (e: 'pick', value: Slot): void }>()

const formatTime = (raw: string) => formatYerevanTime(raw)
</script>

<template>
  <div>
    <div
      v-if="!props.slots.length"
      class="rounded-2xl border border-dashed p-5 text-sm"
      :class="props.theme === 'dark'
        ? 'border-white/10 bg-white/[0.03] text-stone-300'
        : 'border-sand-300 bg-white text-sand-700'"
    >
      {{ t('booking.noSlots') }}
    </div>
    <div v-else class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      <button
        v-for="slot in props.slots"
        :key="slot.start_at"
        type="button"
        class="rounded-xl border px-3 py-2 text-sm font-medium transition"
        :class="props.selected?.start_at === slot.start_at
          ? (props.theme === 'dark' ? 'border-[#d79a49] bg-[#d79a49] text-black' : 'border-sand-900 bg-sand-900 text-white')
          : (props.theme === 'dark' ? 'border-white/10 bg-white/[0.04] text-stone-200 hover:border-[#d79a49]/50' : 'border-sand-200 bg-white hover:border-sand-600')"
        @click="emit('pick', slot)"
      >
        {{ formatTime(slot.start_at) }}
      </button>
    </div>
  </div>
</template>
