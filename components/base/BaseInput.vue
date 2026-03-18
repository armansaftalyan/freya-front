<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  type?: string
  theme?: 'light' | 'dark'
  required?: boolean
  min?: string
  max?: string
  error?: string
}>()

defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const inputRef = ref<HTMLInputElement | null>(null)
const shouldAutoOpenPicker = computed(() => ['date', 'time', 'datetime-local'].includes(props.type || 'text'))
const isDateLike = computed(() => ['date', 'time', 'datetime-local'].includes(props.type || 'text'))

const openPicker = () => {
  if (!shouldAutoOpenPicker.value) return
  inputRef.value?.showPicker?.()
}
</script>

<template>
  <label class="block space-y-2">
    <span v-if="label" class="text-sm font-medium" :class="props.theme === 'dark' ? 'text-stone-300' : 'text-sand-900'">{{ label }}</span>
    <input
      ref="inputRef"
      :value="modelValue"
      :type="type || 'text'"
      :placeholder="placeholder"
      :required="required"
      :min="min"
      :max="max"
      class="w-full min-w-0 rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-sand-600"
      :class="[
        props.theme === 'dark'
          ? 'border-white/10 bg-white/[0.04] text-white placeholder:text-stone-500 focus:border-[#d79a49]'
          : '',
        error ? 'border-rose-300 focus:border-rose-500' : props.theme === 'dark' ? 'border-white/10' : 'border-sand-200',
        isDateLike ? 'date-safe-input' : '',
      ]"
      @click="openPicker"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
    <p v-if="error" class="text-xs text-rose-600">{{ error }}</p>
  </label>
</template>

<style scoped>
.date-safe-input {
  -webkit-appearance: none;
  appearance: none;
  min-height: 48px;
  line-height: 1.25rem;
}

@supports (-webkit-touch-callout: none) {
  .date-safe-input {
    font-size: 16px;
  }
}
</style>
