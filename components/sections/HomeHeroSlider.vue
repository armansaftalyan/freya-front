<script setup lang="ts">
import type { HeroSlide } from '~/types/page-content'

const props = withDefaults(
  defineProps<{
    slides?: HeroSlide[]
    fallbackImage: string
    fallbackAlt: string
    theme?: 'default' | 'tor'
    compact?: boolean
  }>(),
  {
    slides: () => [],
    theme: 'default',
    compact: false,
  },
)

const activeIndex = ref(0)
const touchStartX = ref<number | null>(null)
const touchStartY = ref<number | null>(null)
let timer: ReturnType<typeof setInterval> | null = null

const visibleSlides = computed<HeroSlide[]>(() => {
  if (props.slides.length > 0) {
    return props.slides
  }

  return [
    {
      image: props.fallbackImage,
      alt: props.fallbackAlt,
    },
  ]
})

const hasMultipleSlides = computed(() => visibleSlides.value.length > 1)

const setActive = (index: number) => {
  activeIndex.value = index
}

const next = () => {
  activeIndex.value = (activeIndex.value + 1) % visibleSlides.value.length
}

const previous = () => {
  activeIndex.value = (activeIndex.value - 1 + visibleSlides.value.length) % visibleSlides.value.length
}

const onTouchStart = (event: TouchEvent) => {
  if (!hasMultipleSlides.value) {
    return
  }

  touchStartX.value = event.touches[0]?.clientX ?? null
  touchStartY.value = event.touches[0]?.clientY ?? null
  stopTimer()
}

const onTouchEnd = (event: TouchEvent) => {
  if (!hasMultipleSlides.value || touchStartX.value === null || touchStartY.value === null) {
    return
  }

  const touch = event.changedTouches[0]
  const deltaX = (touch?.clientX ?? touchStartX.value) - touchStartX.value
  const deltaY = (touch?.clientY ?? touchStartY.value) - touchStartY.value

  touchStartX.value = null
  touchStartY.value = null

  if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
    deltaX < 0 ? next() : previous()
  }

  startTimer()
}

const stopTimer = () => {
  if (!timer) {
    return
  }

  clearInterval(timer)
  timer = null
}

const startTimer = () => {
  stopTimer()

  if (!hasMultipleSlides.value) {
    return
  }

  timer = setInterval(next, 5200)
}

watch(visibleSlides, () => {
  activeIndex.value = 0
  startTimer()
})

onMounted(() => {
  startTimer()
})

onBeforeUnmount(() => {
  stopTimer()
})
</script>

<template>
  <div
    class="group relative touch-pan-y overflow-hidden shadow-soft"
    :class="[
      compact ? 'h-[265px] sm:h-[360px] lg:h-[430px] xl:h-[470px]' : 'h-[220px] sm:h-[340px] lg:h-[430px] xl:h-[470px]',
      theme === 'tor' ? 'rounded-2xl border border-white/10 bg-white/[0.03]' : 'rounded-[1.5rem] border border-sand-200 bg-white',
    ]"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <img
      v-for="(slide, index) in visibleSlides"
      :key="`${slide.image}-${index}`"
      :src="slide.image"
      :alt="slide.alt || fallbackAlt"
      class="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
      :class="index === activeIndex ? 'opacity-100' : 'opacity-0'"
      :loading="index === 0 ? 'eager' : 'lazy'"
      :fetchpriority="index === 0 ? 'high' : 'auto'"
      decoding="async"
    >

    <div
      v-if="theme === 'tor'"
      class="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent"
    />

    <template v-if="hasMultipleSlides">
      <button
        type="button"
        class="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-xl text-white opacity-0 transition hover:bg-black/55 group-hover:opacity-100 focus:opacity-100"
        aria-label="Previous slide"
        @click="previous"
      >
        ‹
      </button>
      <button
        type="button"
        class="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-xl text-white opacity-0 transition hover:bg-black/55 group-hover:opacity-100 focus:opacity-100"
        aria-label="Next slide"
        @click="next"
      >
        ›
      </button>
      <div class="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          v-for="(_slide, index) in visibleSlides"
          :key="index"
          type="button"
          class="h-2.5 rounded-full transition-all"
          :class="index === activeIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/55 hover:bg-white/80'"
          :aria-label="`Go to slide ${index + 1}`"
          @click="setActive(index)"
        />
      </div>
    </template>
  </div>
</template>
