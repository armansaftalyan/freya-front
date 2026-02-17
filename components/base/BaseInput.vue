<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  type?: string
  required?: boolean
  error?: string
}>()

defineEmits<{ (e: 'update:modelValue', value: string): void }>()
</script>

<template>
  <label class="block space-y-2">
    <span v-if="label" class="text-sm font-medium text-sand-900">{{ label }}</span>
    <input
      :value="modelValue"
      :type="type || 'text'"
      :placeholder="placeholder"
      :required="required"
      class="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-sand-600"
      :class="error ? 'border-rose-300 focus:border-rose-500' : 'border-sand-200'"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
    <p v-if="error" class="text-xs text-rose-600">{{ error }}</p>
  </label>
</template>
