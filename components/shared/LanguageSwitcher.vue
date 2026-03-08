<script setup lang="ts">
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
  <div class="inline-flex rounded-full border border-sand-200 bg-white p-1">
    <button
      v-for="item in locales"
      :key="item.code"
      class="rounded-full px-2 py-1 text-xs font-semibold transition"
      :disabled="switching"
      :class="locale === item.code ? 'bg-sand-900 text-white' : 'text-sand-700 hover:bg-sand-100'"
      @click="onChangeLocale(item.code)"
    >
      {{ item.label }}
    </button>
  </div>
</template>
