<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  maxWidthClass?: string
  theme?: 'default' | 'tor'
}>(), {
  maxWidthClass: 'max-w-md',
  theme: 'default',
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
          role="dialog"
          aria-modal="true"
          class="w-full rounded-3xl p-6 shadow-soft"
          :class="[
            maxWidthClass,
            theme === 'tor'
              ? 'border border-white/10 bg-[#171717] text-stone-100 shadow-[0_30px_90px_rgba(0,0,0,0.55)]'
              : 'bg-white',
          ]"
          @click.stop
        >
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-2xl">{{ title }}</h3>
            <button
              type="button"
              class="text-xl"
              :class="theme === 'tor' ? 'text-stone-400 hover:text-white' : 'text-sand-600 hover:text-sand-900'"
              :aria-label="title"
              @click="$emit('update:modelValue', false)"
            >
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
