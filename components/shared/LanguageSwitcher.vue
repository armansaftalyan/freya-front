<script setup lang="ts">
const props = withDefaults(defineProps<{
  theme?: 'light' | 'dark'
}>(), {
  theme: 'light',
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
      class="rounded-full px-2 py-1 text-xs font-semibold transition"
      :class="locale === item.code
        ? (props.theme === 'dark' ? 'bg-[#d79a49] text-black' : 'bg-sand-900 text-white')
        : (props.theme === 'dark' ? 'text-stone-200 hover:bg-[#d79a49]/10 hover:text-[#d79a49]' : 'text-sand-700 hover:bg-sand-100')"
    >
      {{ item.label }}
    </NuxtLink>
  </div>
</template>
