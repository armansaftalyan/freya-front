<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Card from "~/components/base/Card.vue";

const { t, locale } = useLocale()
const { localePath } = useLocalizedPath()
const { isTor, brand, bookingPath, mastersPath } = useBrandContext()
const { masterAvatarSrc, onMasterAvatarError } = useMasterAvatar()
const mastersStore = useMastersStore()
const { masters } = storeToRefs(mastersStore)

await useAsyncData(() => `home-masters-${brand.value}-${locale.value}`, async () => {
  await mastersStore.fetchMasters(undefined, undefined, brand.value)

  return true
})

const ensureHomeMasters = async () => {
  const hasBrandMasters = masters.value.some((master) => {
    const masterServices = master.services || []

    if (!masterServices.length) {
      return true
    }

    return masterServices.some((service) => {
      if (brand.value === 'tor') {
        return service.category_name?.toLowerCase().includes('tor') || false
      }

      return !service.category_name?.toLowerCase().includes('tor')
    })
  })

  if (hasBrandMasters) {
    return
  }

  await mastersStore.fetchMasters(undefined, undefined, brand.value)
}

onMounted(() => {
  void ensureHomeMasters()
})

watch([() => brand.value, () => locale.value], () => {
  void ensureHomeMasters()
})

const filteredMasters = computed(() =>
  masters.value.filter((master) => {
    const services = master.services || []

    if (!services.length) return true

    return services.some(service => {
      if (brand.value === 'tor') {
        return service.category_name?.toLowerCase().includes('tor') || false
      }

      return !service.category_name?.toLowerCase().includes('tor')
    })
  }).slice(0, 6),
)
</script>

<template>
  <section class="section-gap">
    <div class="container-shell">
      <div class="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 class="text-3xl leading-tight sm:text-4xl">{{ t('homePage.masters.title') }}</h2>
        <NuxtLink :to="localePath(mastersPath)" class="inline-flex">
          <BaseButton variant="secondary" size="sm">
            {{ t('homePage.masters.all') }}
            <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </BaseButton>
        </NuxtLink>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          v-for="master in filteredMasters"
          :key="master.id"
          class="fade-in"
          :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.18)]' : ''"
        >
          <div class="flex items-center gap-4">
            <img
              :src="masterAvatarSrc(master.avatar, master.name)"
              :alt="`${master.name} – ${brand === 'tor' ? 'Tor master profile' : 'Freya beauty specialist'}`"
              class="h-16 w-16 rounded-2xl object-cover"
              width="64"
              height="64"
              loading="lazy"
              decoding="async"
              @error="onMasterAvatarError($event, master.name)"
            >
            <div>
              <p class="text-lg font-semibold">{{ master.name }}</p>
              <p class="line-clamp-2 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ master.bio || t('homePage.masters.fallbackBio') }}</p>
            </div>
          </div>
          <div class="mt-4 flex flex-wrap gap-2">
            <NuxtLink :to="localePath(`${mastersPath}/${master.slug || master.id}`)"><BaseButton size="sm" variant="secondary">{{ t('mastersPage.viewProfile') }}</BaseButton></NuxtLink>
            <NuxtLink :to="localePath(bookingPath)"><BaseButton size="sm">{{ t('nav.bookNow') }}</BaseButton></NuxtLink>
          </div>
        </Card>
      </div>
    </div>
  </section>
</template>
