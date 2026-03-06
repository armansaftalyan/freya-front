<script setup lang="ts">
import { format } from 'date-fns'
import { storeToRefs } from 'pinia'
import type { Appointment } from '~/types/appointment'
import type { Slot } from '~/types/slot'
import Card from "~/components/base/Card.vue";
import SkeletonBlock from "~/components/shared/SkeletonBlock.vue";
import SlotPicker from "~/components/booking/SlotPicker.vue";

const { t } = useLocale()

useSeoMeta({
  title: () => `Freya - ${t('nav.booking')}`,
  description: () => t('booking.seoDescription'),
  ogTitle: () => `Freya - ${t('nav.booking')}`,
  ogDescription: () => t('booking.seoOgDescription'),
})

const auth = useAuthStore()
const route = useRoute()
const branchesStore = useBranchesStore()
const servicesStore = useServicesStore()
const mastersStore = useMastersStore()
const bookingStore = useBookingStore()

const { branches } = storeToRefs(branchesStore)
const { categories, services } = storeToRefs(servicesStore)
const { masters } = storeToRefs(mastersStore)
const { state, slots, slotsLoading, step, canSubmit } = storeToRefs(bookingStore)
const toast = useToast()

const creating = ref(false)
const success = ref<Appointment | null>(null)
const isEmbedded = computed(() => route.query.embed === '1')

const resolveSourceFromQuery = () => {
  const direct = typeof route.query.source === 'string' ? route.query.source : ''
  if (direct) return direct

  const utm = typeof route.query.utm_source === 'string' ? route.query.utm_source.toLowerCase() : ''
  if (utm === 'yandex' || utm === 'yandex_maps' || utm === 'yandex_business') {
    return 'yandex_maps'
  }

  return ''
}

await useAsyncData('booking-bootstrap', async () => {
  bookingStore.restoreProgress()
  const sourceFromQuery = resolveSourceFromQuery()
  if (sourceFromQuery) {
    bookingStore.setSource(sourceFromQuery)
  }
  await Promise.all([branchesStore.fetchBranches(), servicesStore.init()])
  if (!state.value.branch && branches.value.length > 0) {
    bookingStore.setBranch(branches.value[0])
  }
  if (state.value.service?.id) {
    await mastersStore.fetchMasters(state.value.service.id)
  }

  return true
})

const servicesByCategory = computed(() => {
  if (!state.value.category) return []
  return services.value.filter((item) => item.category_id === state.value.category?.id)
})

watch(
  () => state.value.service?.id,
  async (serviceId) => {
    if (!serviceId) return
    await mastersStore.fetchMasters(serviceId)
  },
)

watch(
  () => [state.value.branch?.id, state.value.service?.id, state.value.master?.id, state.value.date],
  async () => {
    if (!state.value.date) return
    await bookingStore.fetchSlots()
  },
  { immediate: true },
)

const dateModel = computed({
  get: () => state.value.date,
  set: (value: string) => bookingStore.setDate(value),
})

const onSelectCategory = (value: string) => {
  const selected = categories.value.find((item) => item.id === Number(value))
  if (selected) {
    bookingStore.setCategory(selected)
  }
}

const onSelectService = (value: string) => {
  const selected = servicesByCategory.value.find((item) => item.id === Number(value))
  if (selected) {
    bookingStore.setService(selected)
  }
}

const onPickSlot = (slot: Slot) => {
  bookingStore.setSlot(slot)
}

const validateBooking = () => {
  if (!state.value.branch) return t('common.unexpectedError')
  if (!state.value.category) return t('booking.errors.category')
  if (!state.value.service) return t('booking.errors.service')
  if (!state.value.master) return t('booking.errors.master')
  if (!state.value.date) return t('booking.errors.date')
  if (!state.value.slot) return t('booking.errors.slot')
  if (state.value.comment && state.value.comment.length > 2000) {
    return t('booking.errors.comment')
  }
  if (!auth.isAuth && !state.value.guestName.trim()) {
    return t('booking.errors.guestName')
  }
  if (!auth.isAuth && !state.value.guestPhone.trim()) {
    return t('booking.errors.guestPhone')
  }

  return ''
}

const submit = async () => {
  const validationError = validateBooking()
  if (validationError) {
    toast.push({ type: 'error', title: t('common.requestFailed'), description: validationError })
    return
  }

  creating.value = true
  try {
    success.value = await bookingStore.createAppointment()
    bookingStore.reset()
    useToast().push({ type: 'success', title: t('common.appointmentCreated') })
  }
  catch (error: any) {
    const parsed = useApiError(error)
    toast.push({ type: 'error', title: t('common.requestFailed'), description: parsed.message || t('common.unexpectedError') })
  }
  finally {
    creating.value = false
  }
}
</script>

<template>
  <section class="section-gap">
    <div class="container-shell mx-auto max-w-6xl space-y-6">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-sand-600">{{ t('booking.wizard') }}</p>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl">{{ t('booking.title') }}</h1>
        </div>
        <NuxtLink v-if="!isEmbedded" to="/account/appointments"><BaseButton variant="secondary">{{ t('nav.myAppointments') }}</BaseButton></NuxtLink>
      </div>

      <div v-if="success" class="rounded-3xl border border-emerald-200 bg-white p-6 shadow-soft">
        <p class="text-xs uppercase tracking-[0.16em] text-emerald-700">{{ t('booking.successLabel') }}</p>
        <h2 class="mt-2 text-3xl">{{ t('booking.success') }}</h2>
        <p class="mt-3 text-sm text-[var(--muted)]">{{ t('booking.successNumber') }}: #{{ success.id }} · {{ t('booking.successStatus') }}: {{ success.status }}</p>
        <p class="mt-1 text-sm text-[var(--muted)]">{{ t('booking.successDate') }}: {{ format(new Date(success.start_at), 'yyyy-MM-dd HH:mm') }}</p>
        <NuxtLink to="/account/appointments" class="mt-5 inline-block"><BaseButton>{{ t('nav.myAppointments') }}</BaseButton></NuxtLink>
      </div>

      <template v-else>
        <BookingBreadcrumbs v-if="!isEmbedded" :current="step" />

        <div class="grid gap-5 xl:grid-cols-2">
          <Card>
            <h2 class="text-2xl sm:text-3xl">1. {{ t('booking.categoryService') }}</h2>
            <div class="mt-4 space-y-4">
              <BaseSelect
                :model-value="state.category?.id || ''"
                :label="t('booking.category')"
                :options="categories.map((item) => ({ label: item.name, value: item.id }))"
                :placeholder="t('booking.chooseCategory')"
                @update:model-value="onSelectCategory"
              />

              <BaseSelect
                :model-value="state.service?.id || ''"
                :label="t('booking.service')"
                :options="servicesByCategory.map((item) => ({ label: `${item.name} · ${item.duration_minutes} ${t('booking.minutesUnit')}`, value: item.id }))"
                :placeholder="t('booking.chooseService')"
                @update:model-value="onSelectService"
              />
            </div>
          </Card>

          <Card>
            <h2 class="text-2xl sm:text-3xl">2. {{ t('booking.master') }}</h2>
            <div class="mt-4 grid gap-2">
              <button
                v-for="master in masters"
                :key="master.id"
                class="w-full rounded-2xl border px-4 py-3 text-left transition"
                :disabled="!state.service"
                :class="state.master?.id === master.id ? 'border-sand-900 bg-sand-50' : 'border-sand-200 bg-white hover:border-sand-600'"
                @click="bookingStore.setMaster(master)"
              >
                <p class="font-semibold">{{ master.name }}</p>
                <p class="line-clamp-1 text-sm text-[var(--muted)]">{{ master.bio || t('booking.masterFallbackBio') }}</p>
              </button>
            </div>
          </Card>

          <Card class="xl:col-span-2">
            <h2 class="text-2xl sm:text-3xl">3. {{ t('booking.dateSlot') }}</h2>
            <div class="mt-4 space-y-4">
              <BaseInput v-model="dateModel" type="date" :label="t('booking.date')" />
              <div v-if="slotsLoading" class="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <SkeletonBlock v-for="idx in 8" :key="idx" class="h-10" />
              </div>
              <div class="rounded-2xl border border-sand-200 p-3">
                <SlotPicker v-if="slots.length" :slots="slots" :selected="state.slot" @pick="onPickSlot" />
                <p v-else class="text-sm text-[var(--muted)]">{{ t('booking.noSlots') }}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <h2 class="text-2xl sm:text-3xl">4. {{ t('booking.confirm') }}</h2>
          <div class="mt-4 grid gap-6 lg:grid-cols-2">
            <div class="space-y-3 rounded-2xl border border-sand-200 bg-sand-50/50 p-4 text-sm">
              <p><span class="text-[var(--muted)]">{{ t('booking.summary.service') }}:</span> <span class="font-semibold">{{ state.service?.name || '-' }}</span></p>
              <p><span class="text-[var(--muted)]">{{ t('booking.summary.master') }}:</span> <span class="font-semibold">{{ state.master?.name || '-' }}</span></p>
              <p><span class="text-[var(--muted)]">{{ t('booking.summary.slot') }}:</span> <span class="font-semibold">{{ state.slot?.start_at ? format(new Date(state.slot.start_at), 'yyyy-MM-dd HH:mm') : '-' }}</span></p>
            </div>
            <div class="space-y-3">
              <p v-if="!auth.isAuth" class="text-sm text-[var(--muted)]">{{ t('booking.guestHint') }}</p>
              <BaseInput v-if="!auth.isAuth" v-model="state.guestName" :label="t('booking.guestName')" :placeholder="t('booking.guestNamePlaceholder')" />
              <BaseInput v-if="!auth.isAuth" v-model="state.guestPhone" :label="t('booking.guestPhone')" :placeholder="t('booking.guestPhonePlaceholder')" />
              <BaseInput v-model="state.comment" :label="t('booking.commentLabel')" :placeholder="t('booking.commentPlaceholder')" />
            </div>
          </div>
          <div class="mt-6 flex flex-wrap gap-3">
            <BaseButton :disabled="!canSubmit || creating" @click="submit">{{ creating ? t('booking.creating') : t('booking.create') }}</BaseButton>
            <BaseButton variant="secondary" @click="bookingStore.reset">{{ t('booking.reset') }}</BaseButton>
          </div>
        </Card>
      </template>
    </div>
  </section>
</template>
