<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  description?: string | null
  theme?: 'default' | 'tor'
  actionLabel?: string
  actionTo?: string
}>(), {
  theme: 'default',
  description: null,
  actionLabel: undefined,
  actionTo: undefined,
})

const { t } = useLocale()
</script>

<template>
  <section
    class="p-6"
    :class="props.theme === 'tor'
      ? ''
      : 'rounded-[2rem] border border-sand-200/80 bg-white/70 shadow-[0_20px_50px_rgba(186,150,104,0.12)] backdrop-blur-sm'"
  >
    <div
      class="mb-6 flex flex-wrap items-end justify-between gap-4 pb-4"
      :class="props.theme === 'tor' ? 'border-b border-white/10' : 'border-b border-sand-200'"
    >
      <div :class="props.theme === 'tor' ? '' : 'max-w-2xl'">
        <p
          class="text-xs uppercase tracking-[0.2em]"
          :class="props.theme === 'tor' ? 'font-semibold text-[#c58a3a]' : 'text-sand-600'"
        >
          {{ t('productsPage.catalog') }}
        </p>
        <h2
          class="mt-2"
          :class="props.theme === 'tor'
            ? 'text-2xl font-black uppercase tracking-[0.05em] text-white sm:text-3xl'
            : 'text-2xl leading-tight text-sand-900 sm:text-3xl'"
        >
          {{ props.title }}
        </h2>
        <p
          v-if="props.description"
          class="mt-2 text-sm leading-6"
          :class="props.theme === 'tor' ? 'max-w-2xl text-stone-400' : 'text-[var(--muted)]'"
        >
          {{ props.description }}
        </p>
      </div>

      <NuxtLink
        v-if="props.actionLabel && props.actionTo"
        :to="props.actionTo"
        :class="props.theme === 'tor'
          ? 'text-xs font-semibold uppercase tracking-[0.18em] text-[#c58a3a] transition hover:text-[#d79a49]'
          : ''"
      >
        <BaseButton v-if="props.theme === 'default'" variant="secondary" size="sm">{{ props.actionLabel }}</BaseButton>
        <template v-else>{{ props.actionLabel }}</template>
      </NuxtLink>
    </div>

    <slot />
  </section>
</template>
