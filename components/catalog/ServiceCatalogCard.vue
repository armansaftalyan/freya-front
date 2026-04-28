<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

const props = withDefaults(defineProps<{
  name: string
  description?: string
  durationMinutes: number
  durationLabel: string
  priceLabel: string
  actionLabel: string
  actionTo: RouteLocationRaw
  theme?: 'default' | 'tor'
  eyebrow?: string
  cardTo?: RouteLocationRaw
}>(), {
  description: '',
  theme: 'default',
  eyebrow: '',
  cardTo: '',
})

const isTor = computed(() => props.theme === 'tor')
const { localePath } = useLocalizedPath()

const openCard = () => {
  if (!props.cardTo) {
    return
  }

  navigateTo(localePath(props.cardTo))
}
</script>

<template>
  <article
    class="flex h-full flex-col rounded-3xl border p-4 transition-all duration-200 sm:p-5"
    :class="[
      props.cardTo ? 'cursor-pointer' : '',
      isTor
        ? 'border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.02))] shadow-[0_12px_28px_rgba(0,0,0,0.16)] hover:-translate-y-0.5 hover:border-[#c58a3a]/28 hover:shadow-[0_16px_34px_rgba(0,0,0,0.22)]'
        : 'border-sand-200 bg-[var(--card)] shadow-soft hover:border-sand-300 hover:shadow-md',
    ]"
    @click="openCard"
  >
    <p
      v-if="eyebrow"
      class="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em]"
      :class="isTor ? 'text-[#c58a3a]' : 'text-sand-600'"
    >
      {{ eyebrow }}
    </p>

    <div class="flex items-start justify-between gap-3">
      <p
        class="min-h-[3rem] flex-1 leading-tight"
        :class="isTor ? 'text-lg font-semibold text-stone-100 sm:text-xl' : 'text-xl text-sand-950 sm:text-2xl'"
      >
        {{ name }}
      </p>
      <span
        class="shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
        :class="isTor ? 'border-[#c58a3a]/50 text-[#d8a15a]' : 'border-sand-300 text-sand-700'"
      >
        {{ durationMinutes }} {{ durationLabel }}
      </span>
    </div>

    <p
      class="mt-3 min-h-[3rem] text-sm leading-6"
      :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'"
    >
      {{ description }}
    </p>

    <div class="mt-auto flex items-end justify-between gap-3 pt-4">
      <p class="text-base font-semibold" :class="isTor ? 'text-stone-100' : 'text-sand-700'">
        {{ priceLabel }}
      </p>
      <NuxtLink :to="actionTo" class="inline-block shrink-0" @click.stop>
        <BaseButton size="sm" :theme="isTor ? 'tor' : 'default'">{{ actionLabel }}</BaseButton>
      </NuxtLink>
    </div>
  </article>
</template>
