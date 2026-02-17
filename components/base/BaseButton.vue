<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    block?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'primary',
    size: 'md',
    block: false,
    disabled: false,
    type: 'button',
  },
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
    :class="[
      {
        'w-full': block,
        'px-4 py-2 text-sm': size === 'sm',
        'px-6 py-3 text-sm': size === 'md',
        'px-8 py-4 text-base': size === 'lg',
        'bg-sand-700 text-white hover:bg-sand-900': variant === 'primary',
        'bg-white/70 text-sand-900 ring-1 ring-sand-200 hover:bg-white': variant === 'secondary',
        'text-sand-900 hover:bg-sand-100': variant === 'ghost',
      },
    ]"
  >
    <slot />
  </button>
</template>
