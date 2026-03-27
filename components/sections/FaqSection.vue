<script setup lang="ts">
type FaqItem = {
  question: string
  answer: string
}

const props = withDefaults(defineProps<{
  eyebrow?: string
  title: string
  lead?: string
  items: FaqItem[]
  theme?: 'default' | 'tor'
  bordered?: boolean
}>(), {
  eyebrow: '',
  lead: '',
  theme: 'default',
  bordered: true,
})

const isTor = computed(() => props.theme === 'tor')

const sectionClass = computed(() => isTor.value ? 'container-shell py-14' : 'container-shell')
const itemClass = computed(() => isTor.value
  ? 'rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-5 py-4 shadow-[0_18px_45px_rgba(0,0,0,0.22)]'
  : 'rounded-[1.5rem] border border-sand-200 bg-white px-5 py-4 shadow-soft')
const questionClass = computed(() => isTor.value
  ? 'text-left text-base font-bold uppercase tracking-[0.03em] text-stone-100'
  : 'text-left text-base font-semibold text-sand-900')
const answerClass = computed(() => isTor.value
  ? 'pt-3 text-sm leading-7 text-stone-300'
  : 'pt-3 text-sm leading-7 text-[var(--muted)]')
const iconClass = computed(() => isTor.value ? 'text-[#c58a3a]' : 'text-sand-600')
</script>

<template>
  <section class="section-gap" :class="theme === 'tor' && bordered ? 'border-t border-white/10' : ''">
    <div :class="sectionClass">
      <div class="mb-8" :class="isTor ? 'max-w-4xl' : 'max-w-3xl'">
        <p v-if="eyebrow" class="text-xs font-semibold uppercase tracking-[0.22em]" :class="isTor ? 'text-[#c58a3a]' : 'text-sand-600'">
          {{ eyebrow }}
        </p>
        <h2 class="mt-3 text-3xl leading-tight sm:text-5xl" :class="isTor ? 'font-black uppercase tracking-[0.06em] text-stone-100' : ''">
          {{ title }}
        </h2>
        <p v-if="lead" class="mt-4" :class="isTor ? 'text-stone-300' : 'text-[var(--muted)]'">
          {{ lead }}
        </p>
      </div>

      <div class="grid gap-4">
        <details
          v-for="item in items"
          :key="item.question"
          class="group fade-in"
          :class="itemClass"
        >
          <summary class="flex cursor-pointer list-none items-start justify-between gap-4">
            <span :class="questionClass">{{ item.question }}</span>
            <span class="mt-0.5 shrink-0 text-xl leading-none transition group-open:rotate-45" :class="iconClass">+</span>
          </summary>
          <div :class="answerClass">
            <p>{{ item.answer }}</p>
          </div>
        </details>
      </div>
    </div>
  </section>
</template>
