<script setup lang="ts">
import Card from "~/components/base/Card.vue";

const { t, locale } = useLocale()
const { localePath } = useLocalizedPath()
const fixedAddress = computed(() => {
  if (locale.value === 'ru') return 'Азатутян 21, Ереван'
  if (locale.value === 'en') return '21 Azatutyan, Yerevan'
  return 'Ազատության 21, Երևան'
})
const fixedPhone = '+374 44 733773'
const fixedSchedule = computed(() => {
  if (locale.value === 'ru') return 'Ежедневно, 10:00-19:00'
  if (locale.value === 'en') return 'Daily, 10:00-19:00'
  return 'Ամեն օր, 10:00-19:00'
})
</script>

<template>
  <section class="section-gap">
    <div class="container-shell">
      <div class="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 class="text-3xl leading-tight sm:text-4xl">{{ t('homePage.contacts.title') }}</h2>
        <NuxtLink :to="localePath('/contacts')" class="inline-flex">
          <BaseButton variant="secondary" size="sm">
            {{ t('homePage.contacts.all') }}
            <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </BaseButton>
        </NuxtLink>
      </div>
      <div class="grid gap-4">
        <Card class="fade-in">
          <p class="mt-2 break-words text-sm text-[var(--muted)]">{{ fixedAddress }}</p>
          <p class="mt-2 break-all text-sm text-[var(--muted)]">{{ fixedPhone }}</p>
          <p class="mt-2 text-sm text-[var(--muted)]">{{ fixedSchedule }}</p>
          <NuxtLink :to="localePath('/booking')" class="mt-5 inline-block">
            <BaseButton size="sm">{{ t('nav.bookNow') }}</BaseButton>
          </NuxtLink>
        </Card>
      </div>
    </div>
  </section>
</template>
