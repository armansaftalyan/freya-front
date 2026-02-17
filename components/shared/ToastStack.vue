<script setup lang="ts">
const { toasts, remove } = useToast()
</script>

<template>
  <div class="pointer-events-none fixed right-4 top-4 z-[60] flex w-[min(92vw,380px)] flex-col gap-3">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto rounded-2xl border border-sand-200 bg-white p-4 shadow-soft"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-semibold text-sand-900">{{ toast.title }}</p>
            <p v-if="toast.description" class="mt-1 text-xs text-sand-700">{{ toast.description }}</p>
          </div>
          <button class="text-sm text-sand-500" @click="remove(toast.id)">✕</button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
