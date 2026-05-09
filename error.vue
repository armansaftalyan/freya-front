<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const route = useRoute()
const { locale } = useLocale()
const currentPath = computed(() => {
  const errorPath = typeof (props.error as NuxtError & { url?: unknown })?.url === 'string'
    ? (props.error as NuxtError & { url?: string }).url
    : ''

  return errorPath || route.path || '/'
})
const isTor = computed(() => /(^|\/)tor(\/|$)/.test(currentPath.value))
const errorLocale = computed(() => extractLocaleFromPath(currentPath.value) || normalizeLocale(locale.value))
const basePath = computed(() => (isTor.value ? '/tor' : '/'))
const homePath = computed(() => withLocalePath(basePath.value, errorLocale.value))
const servicesPath = computed(() => withLocalePath(isTor.value ? '/tor/services' : '/services', errorLocale.value))
const layoutName = computed(() => (isTor.value ? 'tor' : 'default'))

const statusCode = computed(() => Number(props.error?.statusCode || 500))
const title = computed(() => {
  if (statusCode.value === 404) {
    return isTor.value ? '404 | Tor Barbershop' : '404 | Freya Beauty Salon'
  }

  return isTor.value ? `${statusCode.value} | Tor Barbershop` : `${statusCode.value} | Freya Beauty Salon`
})

const description = computed(() => {
  if (statusCode.value === 404) {
    return copy.value.description
  }

  return copy.value.errorDescription
})

const copy = computed(() => {
  if (errorLocale.value === 'ru') {
    return {
      eyebrow: statusCode.value === 404 ? 'Страница не найдена' : 'Ошибка',
      heading404: isTor.value ? 'Эта страница Tor не найдена' : 'Эта страница Freya не найдена',
      headingError: 'Что-то пошло не так',
      description: 'Адрес мог измениться, услуга могла быть удалена или ссылка устарела.',
      errorDescription: 'Страница временно недоступна. Попробуйте перейти в каталог или на главную.',
      services: 'Все услуги',
      home: 'На главную',
    }
  }

  if (errorLocale.value === 'en') {
    return {
      eyebrow: statusCode.value === 404 ? 'Page not found' : 'Error',
      heading404: isTor.value ? 'This Tor page was not found' : 'This Freya page was not found',
      headingError: 'Something went wrong',
      description: 'The address may have changed, the service may have been removed, or the link is outdated.',
      errorDescription: 'The page is temporarily unavailable. Try the catalog or go back home.',
      services: 'All services',
      home: 'Home',
    }
  }

  return {
    eyebrow: statusCode.value === 404 ? 'Էջը չի գտնվել' : 'Սխալ',
    heading404: isTor.value ? 'Tor-ի այս էջը չի գտնվել' : 'Freya-ի այս էջը չի գտնվել',
    headingError: 'Ինչ-որ բան սխալ է',
    description: 'Հասցեն կարող էր փոխվել, ծառայությունը կարող էր հեռացվել կամ հղումը հնացած է։',
    errorDescription: 'Էջը ժամանակավորապես հասանելի չէ։ Փորձեք բացել կատալոգը կամ վերադառնալ գլխավոր էջ։',
    services: 'Բոլոր ծառայությունները',
    home: 'Գլխավոր',
  }
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
const goServices = () => clearError({ redirect: servicesPath.value })
</script>

<template>
  <NuxtLayout :name="layoutName">
    <section class="px-6 py-16 sm:py-24" :class="isTor ? 'text-stone-100' : 'bg-[#f6efe6] text-sand-950'">
      <div
        class="mx-auto max-w-2xl rounded-[2rem] border p-8 shadow-soft sm:p-10"
        :class="isTor ? 'border-white/10 bg-white/[0.03] shadow-[0_18px_45px_rgba(0,0,0,0.28)]' : 'border-sand-200 bg-white'"
      >
        <p class="text-sm font-semibold uppercase tracking-[0.22em]" :class="isTor ? 'text-[#d79a49]' : 'text-sand-700'">
          {{ statusCode }} · {{ copy.eyebrow }}
        </p>
        <h1 class="mt-3 text-3xl leading-tight sm:text-5xl" :class="isTor ? 'font-black uppercase tracking-[0.05em]' : ''">
          {{ statusCode === 404 ? copy.heading404 : copy.headingError }}
        </h1>
        <p class="mt-4 text-sm leading-7 sm:text-base" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">
          {{ statusCode === 404 ? copy.description : copy.errorDescription }}
        </p>

        <div class="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            class="inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold transition"
            :class="isTor ? 'bg-[#d79a49] text-black hover:bg-[#e2a85c]' : 'bg-sand-900 text-white hover:bg-sand-700'"
            @click="goServices"
          >
            {{ copy.services }}
          </button>
          <button
            type="button"
            class="inline-flex items-center rounded-full border px-5 py-3 text-sm font-semibold transition"
            :class="isTor ? 'border-white/10 text-stone-200 hover:border-[#d79a49]/50 hover:text-[#d79a49]' : 'border-sand-300 text-sand-900 hover:border-sand-500'"
            @click="goHome"
          >
            {{ copy.home }}
          </button>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>
