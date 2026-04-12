<script setup lang="ts">
const props = withDefaults(defineProps<{
  theme?: 'light' | 'dark'
  compact?: boolean
}>(), {
  theme: 'light',
  compact: false,
})

const route = useRoute()
const { locale, locales } = useLocale()
const { localePath } = useLocalizedPath()
</script>

<template>
  <div
    class="inline-flex rounded-full p-1"
    :class="props.theme === 'dark'
      ? 'border border-white/10 bg-white/[0.06]'
      : 'border border-sand-200 bg-white'"
  >
    <NuxtLink
      v-for="item in locales"
      :key="item.code"
      :to="localePath(route.fullPath, item.code)"
      class="inline-flex items-center justify-center rounded-full font-semibold uppercase leading-none whitespace-nowrap transition"
      :class="[
        props.compact ? 'min-w-[2.15rem] px-0 py-2 text-[0.68rem] tracking-[0.18em]' : 'px-2.5 py-1.5 text-xs tracking-[0.14em]',
        locale === item.code
          ? (props.theme === 'dark' ? 'bg-[#d79a49] text-black' : 'bg-sand-900 text-white')
          : (props.theme === 'dark' ? 'text-stone-200 hover:bg-[#d79a49]/10 hover:text-[#d79a49]' : 'text-sand-700 hover:bg-sand-100'),
      ]"
    >
      {{ props.compact ? item.code : item.label }}
    </NuxtLink>
  </div>
</template>
