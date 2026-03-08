<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  type?: string
  required?: boolean
  min?: string
  max?: string
  error?: string
}>()

defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const inputRef = ref<HTMLInputElement | null>(null)
const shouldAutoOpenPicker = computed(() => ['date', 'time', 'datetime-local'].includes(props.type || 'text'))

const openPicker = () => {
  if (!shouldAutoOpenPicker.value) return
  inputRef.value?.showPicker?.()
}
</script>

<template>
  <label class="block space-y-2">
    <span v-if="label" class="text-sm font-medium text-sand-900">{{ label }}</span>
    <input
      ref="inputRef"
      :value="modelValue"
      :type="type || 'text'"
      :placeholder="placeholder"
      :required="required"
      :min="min"
      :max="max"
      class="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-sand-600"
      :class="error ? 'border-rose-300 focus:border-rose-500' : 'border-sand-200'"
      @click="openPicker"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
    <p v-if="error" class="text-xs text-rose-600">{{ error }}</p>
  </label>
</template>
