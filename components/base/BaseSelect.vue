<script setup lang="ts">
defineProps<{
  modelValue: string | number | null
  label?: string
  options: Array<{ label: string; value: string | number }>
  placeholder?: string
  error?: string
}>()

defineEmits<{ (e: 'update:modelValue', value: string): void }>()
</script>

<template>
  <label class="block space-y-2">
    <span v-if="label" class="text-sm font-medium text-sand-900">{{ label }}</span>
    <select
      class="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-sand-600"
      :class="error ? 'border-rose-300 focus:border-rose-500' : 'border-sand-200'"
      :value="modelValue ?? ''"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option value="">{{ placeholder || 'Select' }}</option>
      <option
        v-for="item in options"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </option>
    </select>
    <p v-if="error" class="text-xs text-rose-600">{{ error }}</p>
  </label>
</template>
