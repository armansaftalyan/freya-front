<script setup lang="ts">
const { locale, setLocale, locales } = useLocale()
</script>

<template>
  <div class="inline-flex rounded-full border border-sand-200 bg-white p-1">
    <button
      v-for="item in locales"
      :key="item.code"
      class="rounded-full px-2 py-1 text-xs font-semibold transition"
      :class="locale === item.code ? 'bg-sand-900 text-white' : 'text-sand-700 hover:bg-sand-100'"
      @click="setLocale(item.code)"
    >
      {{ item.label }}
    </button>
  </div>
</template>
