<script setup lang="ts">
const props = withDefaults(defineProps<{
  theme?: 'default' | 'tor'
  block?: boolean
}>(), {
  theme: 'default',
  block: false,
})

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const { locale } = useLocale()
const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
const isStandalone = ref(false)
const isIos = ref(false)
const isAndroid = ref(false)
const showInstallHelp = ref(false)

const copy = computed(() => {
  if (locale.value === 'ru') {
    return {
      label: 'Установить',
      title: 'Установка приложения',
      iosText: 'На iPhone откройте сайт в Safari, нажмите кнопку “Поделиться” и выберите “На экран Домой”.',
      androidText: 'На Android откройте меню Chrome ⋮ и выберите “Добавить на главный экран” или “Установить приложение”.',
      close: 'Понятно',
    }
  }

  if (locale.value === 'en') {
    return {
      label: 'Install',
      title: 'Install app',
      iosText: 'On iPhone, open the site in Safari, tap Share, then choose Add to Home Screen.',
      androidText: 'On Android, open the Chrome menu ⋮ and choose Add to Home screen or Install app.',
      close: 'Got it',
    }
  }

  return {
    label: 'Տեղադրել',
    title: 'Տեղադրել հավելվածը',
    iosText: 'iPhone-ում բացեք կայքը Safari-ով, սեղմեք Share և ընտրեք Add to Home Screen։',
    androidText: 'Android-ում բացեք Chrome-ի ⋮ մենյուն և ընտրեք Add to Home screen կամ Install app։',
    close: 'Հասկացա',
  }
})

const helpText = computed(() => isIos.value ? copy.value.iosText : copy.value.androidText)
const canShow = computed(() => !isStandalone.value && (deferredPrompt.value || isIos.value || isAndroid.value))

const buttonClass = computed(() => [
  'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition',
  props.block ? 'w-full' : '',
  props.theme === 'tor'
    ? 'border border-white/10 bg-white/[0.06] text-stone-100 hover:bg-white/[0.1]'
    : 'border border-sand-200 bg-white text-sand-900 shadow-sm hover:border-sand-300',
])

const install = async () => {
  if (deferredPrompt.value) {
    const promptEvent = deferredPrompt.value
    deferredPrompt.value = null
    await promptEvent.prompt()
    await promptEvent.userChoice
    return
  }

  if (isIos.value || isAndroid.value) {
    showInstallHelp.value = true
  }
}

onMounted(() => {
  isStandalone.value = window.matchMedia('(display-mode: standalone)').matches
    || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)

  isIos.value = /iphone|ipad|ipod/i.test(window.navigator.userAgent)
  isAndroid.value = /android/i.test(window.navigator.userAgent)

  const handleBeforeInstallPrompt = (event: Event) => {
    event.preventDefault()
    deferredPrompt.value = event as BeforeInstallPromptEvent
  }

  const handleAppInstalled = () => {
    deferredPrompt.value = null
    isStandalone.value = true
  }

  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.addEventListener('appinstalled', handleAppInstalled)

  onBeforeUnmount(() => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.removeEventListener('appinstalled', handleAppInstalled)
  })
})
</script>

<template>
  <button
    v-if="canShow"
    type="button"
    :class="buttonClass"
    @click="install"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
    <span>{{ copy.label }}</span>
  </button>

  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="showInstallHelp"
        class="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4"
        @click="showInstallHelp = false"
      >
        <div
          class="w-full max-w-sm rounded-3xl p-5 shadow-soft"
          :class="theme === 'tor' ? 'border border-white/10 bg-[#111] text-stone-100' : 'bg-white text-sand-900'"
          @click.stop
        >
          <div class="flex items-start justify-between gap-4">
            <h3 class="text-xl font-semibold">{{ copy.title }}</h3>
            <button type="button" class="text-2xl leading-none opacity-70" @click="showInstallHelp = false">×</button>
          </div>
          <p class="mt-3 text-sm leading-6" :class="theme === 'tor' ? 'text-stone-300' : 'text-sand-700'">{{ helpText }}</p>
          <button
            type="button"
            class="mt-5 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold"
            :class="theme === 'tor' ? 'bg-[#d79a49] text-black' : 'bg-sand-900 text-white'"
            @click="showInstallHelp = false"
          >
            {{ copy.close }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
