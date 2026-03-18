<script setup lang="ts">
const props = withDefaults(defineProps<{
  theme?: 'light' | 'dark'
}>(), {
  theme: 'light',
})

const { locale, setLocale, locales } = useLocale()
const switching = ref(false)

const onChangeLocale = async (code: 'ru' | 'en' | 'hy') => {
  if (switching.value) return
  switching.value = true
  try {
    await setLocale(code)
  }
  finally {
    switching.value = false
  }
}
</script>

<template>
  <div
    class="inline-flex rounded-full p-1"
    :class="props.theme === 'dark'
      ? 'border border-white/10 bg-white/[0.06]'
      : 'border border-sand-200 bg-white'"
  >
    <button
      v-for="item in locales"
      :key="item.code"
      class="rounded-full px-2 py-1 text-xs font-semibold transition"
      :disabled="switching"
      :class="locale === item.code
        ? (props.theme === 'dark' ? 'bg-[#d79a49] text-black' : 'bg-sand-900 text-white')
        : (props.theme === 'dark' ? 'text-stone-200 hover:bg-[#d79a49]/10 hover:text-[#d79a49]' : 'text-sand-700 hover:bg-sand-100')"
      @click="onChangeLocale(item.code)"
    >
      {{ item.label }}
    </button>
  </div>
</template>
