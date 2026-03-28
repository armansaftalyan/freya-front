<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const route = useRoute()
const currentPath = computed(() => {
  const errorPath = typeof (props.error as NuxtError & { url?: unknown })?.url === 'string'
    ? (props.error as NuxtError & { url?: string }).url
    : ''

  return errorPath || route.path || '/'
})
const isTor = computed(() => /(^|\/)tor(\/|$)/.test(currentPath.value))
const homePath = computed(() => (isTor.value ? '/tor' : '/'))

const statusCode = computed(() => Number(props.error?.statusCode || 500))
const title = computed(() => {
  if (statusCode.value === 404) {
    return isTor.value ? '404 | Tor Barbershop' : '404 | Freya Beauty Salon'
  }

  return isTor.value ? `${statusCode.value} | Tor Barbershop` : `${statusCode.value} | Freya Beauty Salon`
})

const description = computed(() => {
  if (statusCode.value === 404) {
    return 'Requested page was not found.'
  }

  return 'Temporary application error page.'
})

useSeoMeta({
  title: () => title.value,
  description: () => description.value,
  robots: 'noindex, nofollow',
})

useHead(() => ({
  meta: [
    {
      key: 'error-robots',
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
}))

const goHome = () => clearError({ redirect: homePath.value })
</script>

<template>
  <main class="min-h-screen px-6 py-16" :class="isTor ? 'bg-[#0f0f10] text-stone-100' : 'bg-[#f6efe6] text-sand-950'">
    <div class="mx-auto max-w-2xl rounded-3xl border p-8 sm:p-10" :class="isTor ? 'border-white/10 bg-white/[0.03]' : 'border-sand-200 bg-white'">
      <p class="text-sm uppercase tracking-[0.22em]" :class="isTor ? 'text-[#d79a49]' : 'text-sand-700'">
        {{ statusCode }}
      </p>
      <h1 class="mt-3 text-3xl sm:text-4xl">
        {{ statusCode === 404 ? 'Page not found' : 'Something went wrong' }}
      </h1>
      <p class="mt-4 text-sm leading-7" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">
        {{ statusCode === 404
          ? 'This page does not exist or is no longer available.'
          : 'The page is temporarily unavailable. Please try again later.' }}
      </p>

      <div class="mt-6 flex flex-wrap gap-3">
        <NuxtLink :to="homePath" class="inline-flex items-center rounded-full px-5 py-3 text-sm font-medium transition"
          :class="isTor ? 'bg-[#d79a49] text-black hover:bg-[#e2a85c]' : 'bg-sand-900 text-white hover:bg-sand-700'">
          Go to home
        </NuxtLink>
        <button type="button" class="inline-flex items-center rounded-full border px-5 py-3 text-sm font-medium transition"
          :class="isTor ? 'border-white/10 text-stone-200 hover:border-[#d79a49]/50' : 'border-sand-300 text-sand-900 hover:border-sand-500'"
          @click="goHome">
          Continue
        </button>
      </div>
    </div>
  </main>
</template>
