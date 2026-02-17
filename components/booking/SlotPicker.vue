<script setup lang="ts">
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import type { Slot } from '~/types/slot'
const { t } = useLocale()

const props = defineProps<{
  slots: Slot[]
  selected: Slot | null
}>()

const emit = defineEmits<{ (e: 'pick', value: Slot): void }>()

const formatTime = (raw: string) => {
  const date = new Date(raw)
  if (!Number.isNaN(date.getTime())) {
    return format(date, 'HH:mm', { locale: ru })
  }

  const timeMatch = String(raw).match(/(\d{2}:\d{2})/)
  return timeMatch?.[1] || raw
}
</script>

<template>
  <div>
    <div v-if="!props.slots.length" class="rounded-2xl border border-dashed border-sand-300 bg-white p-5 text-sm text-sand-700">
      {{ t('booking.noSlots') }}
    </div>
    <div v-else class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      <button
        v-for="slot in props.slots"
        :key="slot.start_at"
        type="button"
        class="rounded-xl border px-3 py-2 text-sm font-medium transition"
        :class="props.selected?.start_at === slot.start_at ? 'border-sand-900 bg-sand-900 text-white' : 'border-sand-200 bg-white hover:border-sand-600'"
        @click="emit('pick', slot)"
      >
        {{ formatTime(slot.start_at) }}
      </button>
    </div>
  </div>
</template>
