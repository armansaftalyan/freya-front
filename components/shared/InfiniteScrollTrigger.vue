<script setup lang="ts">
const props = withDefaults(defineProps<{
  loading?: boolean
  disabled?: boolean
}>(), {
  loading: false,
  disabled: false,
})

const emit = defineEmits<{
  load: []
}>()

const trigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    if (entries.some(entry => entry.isIntersecting) && !props.loading && !props.disabled) {
      emit('load')
    }
  }, { rootMargin: '320px 0px' })

  if (trigger.value) observer.observe(trigger.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <div ref="trigger" class="flex min-h-12 items-center justify-center py-3" aria-live="polite">
    <slot v-if="loading" />
  </div>
</template>
