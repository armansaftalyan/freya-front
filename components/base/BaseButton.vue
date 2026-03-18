<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost'
    theme?: 'default' | 'tor'
    size?: 'sm' | 'md' | 'lg'
    block?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'primary',
    theme: 'default',
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
    class="inline-flex items-center justify-center whitespace-nowrap rounded-full text-center font-semibold leading-tight transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
    :class="[
      {
        'w-full': block,
        'min-h-11 px-4 text-sm': size === 'sm',
        'min-h-12 px-6 text-sm': size === 'md',
        'min-h-14 px-8 text-base': size === 'lg',
        'bg-sand-700 text-white shadow-sm hover:-translate-y-0.5 hover:bg-sand-900 hover:shadow-md': variant === 'primary' && theme === 'default',
        'bg-[#d79a49] text-black hover:bg-[#e6a85a]': variant === 'primary' && theme === 'tor',
        'bg-white/70 text-sand-900 ring-1 ring-sand-200 shadow-sm hover:-translate-y-0.5 hover:bg-white hover:shadow-md': variant === 'secondary' && theme === 'default',
        'border border-white/10 bg-white/[0.06] text-stone-100 hover:border-[#d79a49]/50 hover:bg-white/[0.12]': variant === 'secondary' && theme === 'tor',
        'text-sand-900 hover:-translate-y-0.5 hover:bg-sand-100': variant === 'ghost',
      },
    ]"
  >
    <slot />
  </button>
</template>
