<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  maxWidthClass?: string
}>(), {
  maxWidthClass: 'max-w-md',
})
defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        @click="$emit('update:modelValue', false)"
      >
        <div
          class="w-full rounded-3xl bg-white p-6 shadow-soft"
          :class="maxWidthClass"
          @click.stop
        >
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-2xl">{{ title }}</h3>
            <button class="text-xl text-sand-600" @click="$emit('update:modelValue', false)">
              ×
            </button>
          </div>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
