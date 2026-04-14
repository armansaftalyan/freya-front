<script setup lang="ts">
const props = defineProps<{
  modelValue: string | number | null
  label?: string
  options: Array<{ label: string; value: string | number }>
  placeholder?: string
  theme?: 'light' | 'dark'
  error?: string
}>()

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const proxyValue = computed({
  get: () => String(props.modelValue ?? ''),
  set: (value: string) => emit('update:modelValue', value),
})
</script>

<template>
  <label class="block space-y-2">
    <span v-if="label" class="text-sm font-medium" :class="theme === 'dark' ? 'text-stone-300' : 'text-sand-900'">{{ label }}</span>
    <div class="relative">
      <select
        v-model="proxyValue"
        class="w-full appearance-none rounded-2xl border bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-sand-600"
        :class="[
          theme === 'dark' ? 'border-white/10 bg-white/[0.04] text-white focus:border-[#d79a49]' : '',
          error ? 'border-rose-300 focus:border-rose-500' : theme === 'dark' ? 'border-white/10' : 'border-sand-200',
        ]"
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
      <span
        class="pointer-events-none absolute inset-y-0 right-4 flex items-center"
        :class="theme === 'dark' ? 'text-stone-400' : 'text-sand-600'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
        </svg>
      </span>
    </div>
    <p v-if="error" class="text-xs text-rose-600">{{ error }}</p>
  </label>
</template>

<style scoped>
select option {
  color: #111827;
}
</style>
