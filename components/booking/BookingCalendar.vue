<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string
  min: string
  availableDates: string[]
  loading?: boolean
  theme?: 'light' | 'dark'
}>(), {
  loading: false,
  theme: 'light',
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'monthChange', range: { from: string, to: string }): void
}>()

const { locale } = useLocale()
const displayedMonth = ref((props.modelValue || props.min).slice(0, 7))
const availableSet = computed(() => new Set(props.availableDates))

const parseDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

const formatDate = (date: Date) => date.toISOString().slice(0, 10)
const monthStart = computed(() => parseDate(`${displayedMonth.value}-01`))
const monthEnd = computed(() => new Date(Date.UTC(monthStart.value.getUTCFullYear(), monthStart.value.getUTCMonth() + 1, 0)))
const monthLabel = computed(() => new Intl.DateTimeFormat(locale.value, {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
}).format(monthStart.value))
const weekdayLabels = computed(() => {
  const formatter = new Intl.DateTimeFormat(locale.value, { weekday: 'short', timeZone: 'UTC' })
  const monday = new Date(Date.UTC(2026, 0, 5))
  return Array.from({ length: 7 }, (_, index) => formatter.format(new Date(monday.getTime() + index * 86400000)))
})
const calendarDays = computed(() => {
  const leadingDays = (monthStart.value.getUTCDay() + 6) % 7
  const gridStart = new Date(monthStart.value.getTime() - leadingDays * 86400000)

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart.getTime() + index * 86400000)
    const value = formatDate(date)

    return {
      value,
      day: date.getUTCDate(),
      currentMonth: date.getUTCMonth() === monthStart.value.getUTCMonth(),
      available: availableSet.value.has(value),
      past: value < props.min,
    }
  })
})
const canGoPrevious = computed(() => displayedMonth.value > props.min.slice(0, 7))

watch(() => props.modelValue, (value) => {
  if (value) {
    displayedMonth.value = value.slice(0, 7)
  }
})

const emitMonthRange = () => {
  emit('monthChange', {
    from: formatDate(monthStart.value),
    to: formatDate(monthEnd.value),
  })
}

const changeMonth = (offset: number) => {
  const next = new Date(Date.UTC(monthStart.value.getUTCFullYear(), monthStart.value.getUTCMonth() + offset, 1))
  displayedMonth.value = formatDate(next).slice(0, 7)
  emitMonthRange()
}

const selectDate = (value: string, available: boolean, past: boolean) => {
  if (!available || past) return
  emit('update:modelValue', value)
}

onMounted(emitMonthRange)
</script>

<template>
  <div
    class="mx-auto w-full max-w-xl rounded-[1.5rem] border p-3"
    :class="theme === 'dark' ? 'border-white/10 bg-white/[0.03]' : 'border-sand-200 bg-white'"
  >
    <div class="flex items-center justify-between gap-3">
      <button
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-full border disabled:opacity-30"
        :class="theme === 'dark' ? 'border-white/10' : 'border-sand-200'"
        :disabled="!canGoPrevious"
        @click="changeMonth(-1)"
      >
        ‹
      </button>
      <p class="font-semibold capitalize">{{ monthLabel }}</p>
      <button
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-full border"
        :class="theme === 'dark' ? 'border-white/10' : 'border-sand-200'"
        @click="changeMonth(1)"
      >
        ›
      </button>
    </div>

    <div class="mt-3 grid grid-cols-7 gap-1 text-center sm:gap-1.5">
      <span
        v-for="label in weekdayLabels"
        :key="label"
        class="py-1 text-[11px] uppercase"
        :class="theme === 'dark' ? 'text-stone-500' : 'text-sand-500'"
      >
        {{ label }}
      </span>
      <button
        v-for="day in calendarDays"
        :key="day.value"
        type="button"
        class="h-10 rounded-xl text-sm font-medium transition sm:h-12"
        :disabled="day.past || !day.available || loading"
        :class="[
          !day.currentMonth ? 'opacity-25' : '',
          modelValue === day.value && day.available
            ? (theme === 'dark' ? 'bg-[#d79a49] text-black' : 'bg-sand-900 text-white')
            : day.available
              ? (theme === 'dark' ? 'border border-[#d79a49]/60 bg-[#d79a49]/10 text-stone-100' : 'border border-emerald-300 bg-emerald-50 text-emerald-900')
              : (theme === 'dark' ? 'text-stone-600' : 'text-sand-300'),
        ]"
        @click="selectDate(day.value, day.available, day.past)"
      >
        {{ day.day }}
      </button>
    </div>
  </div>
</template>
