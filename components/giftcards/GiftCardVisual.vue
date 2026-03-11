<script setup lang="ts">
const props = withDefaults(defineProps<{
  amount: number
  currency?: string
  label?: string
  hint?: string
  compact?: boolean
  theme?: 'gold' | 'black' | 'rose'
}>(), {
  currency: 'AMD',
  label: 'Freya Beauty Gift Card',
  hint: 'Use in salon with QR scan',
  compact: false,
  theme: 'gold',
})

const formatMoney = (value: number, currency: string) => {
  try {
    return new Intl.NumberFormat('hy-AM', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value)
  }
  catch {
    return `${value.toFixed(2)} ${currency}`
  }
}

const themeClass = computed(() => {
  if (props.theme === 'black') {
    return {
      bg: 'linear-gradient(145deg, #0b0b0b 0%, #1a1a1a 36%, #313131 100%)',
      border: 'border-[#606060]/45',
      glowLeft: 'bg-white/10',
      glowRight: 'bg-zinc-300/15',
    }
  }

  if (props.theme === 'rose') {
    return {
      bg: 'linear-gradient(145deg, #2b1119 0%, #6b2338 42%, #d77a9a 100%)',
      border: 'border-[#f2bdcf]/40',
      glowLeft: 'bg-rose-100/20',
      glowRight: 'bg-pink-200/25',
    }
  }

  return {
    bg: 'linear-gradient(140deg, #121212 0%, #2b2217 32%, #7e5925 68%, #d7a24b 100%)',
    border: 'border-[#f3e2c4]/35',
    glowLeft: 'bg-white/18',
    glowRight: 'bg-amber-200/25',
  }
})
</script>

<template>
  <div
    class="relative w-full overflow-hidden rounded-3xl border text-white shadow-[0_20px_50px_-25px_rgba(10,10,10,0.8)]"
    :class="[themeClass.border, compact ? 'max-w-[310px] p-4' : 'max-w-[360px] p-5']"
    :style="{ aspectRatio: '1.586 / 1', background: themeClass.bg }"
  >
    <div class="pointer-events-none absolute -left-12 -top-14 h-44 w-44 rounded-full blur-3xl" :class="themeClass.glowLeft" />
    <div class="pointer-events-none absolute -right-10 bottom-[-65px] h-44 w-44 rounded-full blur-3xl" :class="themeClass.glowRight" />
    <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_38%,rgba(255,255,255,0.18)_50%,transparent_62%)] opacity-60" />
    <div class="pointer-events-none absolute left-4 right-4 h-px bg-white/25" :class="compact ? 'top-16' : 'top-20'" />

    <div class="relative flex h-full flex-col">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-[10px] uppercase tracking-[0.22em] text-sand-100/85">{{ label }}</p>
          <p class="mt-2 font-semibold leading-none" :class="compact ? 'text-2xl' : 'text-3xl'">
            {{ formatMoney(amount, currency) }}
          </p>
        </div>
        <div class="rounded-2xl border border-white/45 bg-white/90 p-2 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.7)]">
          <img src="/logo.svg" alt="Freya" :class="compact ? 'h-8 w-8' : 'h-9 w-9'" class="rounded-md object-contain">
        </div>
      </div>

      <div class="mt-auto flex items-end justify-between gap-3">
        <div>
          <p class="text-[10px] uppercase tracking-[0.16em] text-sand-100/75">Freya</p>
          <p class="mt-1 text-sand-100/90" :class="compact ? 'text-xs' : 'text-sm'">{{ hint }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
