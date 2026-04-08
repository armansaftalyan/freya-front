<script setup lang="ts">
const { toasts, remove } = useToast()
const { isTor } = useBrandContext()

const toastClass = (type: 'success' | 'error' | 'info') => {
  if (isTor.value) {
    if (type === 'error') {
      return 'border-[#7a3b32] bg-[#181210] text-stone-100 shadow-[0_18px_45px_rgba(0,0,0,0.35)]'
    }

    if (type === 'success') {
      return 'border-[#5b4b2a] bg-[#141311] text-stone-100 shadow-[0_18px_45px_rgba(0,0,0,0.35)]'
    }

    return 'border-white/10 bg-[#171717] text-stone-100 shadow-[0_18px_45px_rgba(0,0,0,0.35)]'
  }

  return 'border-sand-200 bg-white text-sand-900 shadow-soft'
}

const titleClass = (type: 'success' | 'error' | 'info') => {
  if (isTor.value) {
    if (type === 'error') return 'text-[#f0b4aa]'
    if (type === 'success') return 'text-[#d79a49]'
    return 'text-stone-100'
  }

  return 'text-sand-900'
}

const descriptionClass = () => isTor.value ? 'text-stone-300' : 'text-sand-700'
const closeClass = () => isTor.value ? 'text-stone-400 hover:text-white' : 'text-sand-500 hover:text-sand-700'
</script>

<template>
  <div class="pointer-events-none fixed right-4 top-4 z-[60] flex w-[min(92vw,380px)] flex-col gap-3">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto rounded-2xl border p-4 backdrop-blur"
        :class="toastClass(toast.type)"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-semibold" :class="titleClass(toast.type)">{{ toast.title }}</p>
            <p v-if="toast.description" class="mt-1 text-xs" :class="descriptionClass()">{{ toast.description }}</p>
          </div>
          <button class="text-sm transition" :class="closeClass()" @click="remove(toast.id)">✕</button>
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
