<script setup lang="ts">
import { format } from 'date-fns'
import { storeToRefs } from 'pinia'
import type { Appointment } from '~/types/appointment'
import type { Slot } from '~/types/slot'
import Card from "~/components/base/Card.vue";
import SkeletonBlock from "~/components/shared/SkeletonBlock.vue";
import SlotPicker from "~/components/booking/SlotPicker.vue";

useSeoMeta({
  title: 'Booking',
  description: 'Онлайн-запись: филиал, услуга, мастер, свободные слоты.',
  ogTitle: 'Aurum Booking',
  ogDescription: 'Запишитесь онлайн за пару шагов.',
})

const auth = useAuthStore()
const { t } = useLocale()
const branchesStore = useBranchesStore()
const servicesStore = useServicesStore()
const mastersStore = useMastersStore()
const bookingStore = useBookingStore()

const { branches } = storeToRefs(branchesStore)
const { categories, services } = storeToRefs(servicesStore)
const { masters } = storeToRefs(mastersStore)
const { state, slots, slotsLoading, step, canSubmit } = storeToRefs(bookingStore)
const toast = useToast()

const showAuthModal = ref(false)
const creating = ref(false)
const success = ref<Appointment | null>(null)

await useAsyncData('booking-bootstrap', async () => {
  bookingStore.restoreProgress()
  await Promise.all([branchesStore.fetchBranches(), servicesStore.init()])
  if (state.value.service?.id) {
    await mastersStore.fetchMasters(state.value.service.id)
  }
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
  if (!state.value.branch) return t('booking.errors.branch')
  if (!state.value.category) return t('booking.errors.category')
  if (!state.value.service) return t('booking.errors.service')
  if (!state.value.master) return t('booking.errors.master')
  if (!state.value.date) return t('booking.errors.date')
  if (!state.value.slot) return t('booking.errors.slot')
  if (state.value.comment && state.value.comment.length > 2000) {
    return t('booking.errors.comment')
  }

  return ''
}

const submit = async () => {
  const validationError = validateBooking()
  if (validationError) {
    toast.push({ type: 'error', title: t('common.requestFailed'), description: validationError })
    return
  }

  if (!auth.isAuth) {
    showAuthModal.value = true
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
    <div class="container-shell space-y-6">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-sand-600">Wizard</p>
          <h1 class="text-5xl">{{ t('booking.title') }}</h1>
        </div>
        <NuxtLink to="/account/appointments"><BaseButton variant="secondary">{{ t('nav.myAppointments') }}</BaseButton></NuxtLink>
      </div>

      <div v-if="success" class="rounded-3xl border border-emerald-200 bg-white p-6 shadow-soft">
        <p class="text-xs uppercase tracking-[0.16em] text-emerald-700">Success</p>
        <h2 class="mt-2 text-3xl">{{ t('booking.success') }}</h2>
        <p class="mt-3 text-sm text-[var(--muted)]">Номер: #{{ success.id }} · Статус: {{ success.status }}</p>
        <p class="mt-1 text-sm text-[var(--muted)]">Дата: {{ format(new Date(success.start_at), 'yyyy-MM-dd HH:mm') }}</p>
        <NuxtLink to="/account/appointments" class="mt-5 inline-block"><BaseButton>{{ t('nav.myAppointments') }}</BaseButton></NuxtLink>
      </div>

      <template v-else>
        <BookingBreadcrumbs :current="step" />

        <div class="grid gap-4 lg:grid-cols-2">
          <Card>
            <h2 class="text-2xl">1. {{ t('booking.branch') }}</h2>
            <div class="mt-4 grid gap-2">
              <button
                v-for="branch in branches"
                :key="branch.id"
                class="rounded-2xl border px-4 py-3 text-left transition"
                :class="state.branch?.id === branch.id ? 'border-sand-900 bg-sand-50' : 'border-sand-200 bg-white hover:border-sand-600'"
                @click="bookingStore.setBranch(branch)"
              >
                <p class="font-semibold">{{ branch.name }}</p>
                <p class="text-sm text-[var(--muted)]">{{ branch.address || 'Address TBD' }}</p>
              </button>
            </div>
          </Card>

          <Card>
            <h2 class="text-2xl">2. {{ t('booking.categoryService') }}</h2>
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
                :options="servicesByCategory.map((item) => ({ label: `${item.name} · ${item.duration_minutes} мин`, value: item.id }))"
                :placeholder="t('booking.chooseService')"
                @update:model-value="onSelectService"
              />
            </div>
          </Card>

          <Card>
            <h2 class="text-2xl">3. {{ t('booking.master') }}</h2>
            <div class="mt-4 grid gap-2">
              <button
                v-for="master in masters"
                :key="master.id"
                class="rounded-2xl border px-4 py-3 text-left transition"
                :disabled="!state.service"
                :class="state.master?.id === master.id ? 'border-sand-900 bg-sand-50' : 'border-sand-200 bg-white hover:border-sand-600'"
                @click="bookingStore.setMaster(master)"
              >
                <p class="font-semibold">{{ master.name }}</p>
                <p class="line-clamp-1 text-sm text-[var(--muted)]">{{ master.bio || 'Top beauty specialist' }}</p>
              </button>
            </div>
          </Card>

          <Card>
            <h2 class="text-2xl">4. {{ t('booking.dateSlot') }}</h2>
            <div class="mt-4 space-y-4">
              <BaseInput v-model="dateModel" type="date" :label="t('booking.date')" />
              <div v-if="slotsLoading" class="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <SkeletonBlock v-for="idx in 8" :key="idx" class="h-10" />
              </div>
              <SlotPicker v-else :slots="slots" :selected="state.slot" @pick="onPickSlot" />
            </div>
          </Card>
        </div>

        <Card>
          <h2 class="text-2xl">5. {{ t('booking.confirm') }}</h2>
          <div class="mt-4 grid gap-4 md:grid-cols-2">
            <div class="space-y-2 text-sm">
              <p><span class="text-[var(--muted)]">Филиал:</span> {{ state.branch?.name || '-' }}</p>
              <p><span class="text-[var(--muted)]">Услуга:</span> {{ state.service?.name || '-' }}</p>
              <p><span class="text-[var(--muted)]">Мастер:</span> {{ state.master?.name || '-' }}</p>
              <p><span class="text-[var(--muted)]">Слот:</span> {{ state.slot?.start_at ? format(new Date(state.slot.start_at), 'yyyy-MM-dd HH:mm') : '-' }}</p>
            </div>
            <BaseInput v-model="state.comment" label="Комментарий (опционально)" placeholder="Ваши пожелания" />
          </div>
          <div class="mt-5 flex flex-wrap gap-3">
            <BaseButton :disabled="!canSubmit || creating" @click="submit">{{ creating ? t('booking.creating') : t('booking.create') }}</BaseButton>
            <BaseButton variant="secondary" @click="bookingStore.reset">{{ t('booking.reset') }}</BaseButton>
          </div>
        </Card>
      </template>
    </div>

    <BaseModal v-model="showAuthModal" :title="`${t('auth.login')} / ${t('auth.register')}`">
      <p class="text-sm text-[var(--muted)]">{{ t('booking.loginNeed') }}</p>
      <div class="mt-5 flex gap-2">
        <NuxtLink to="/account/login"><BaseButton>{{ t('auth.login') }}</BaseButton></NuxtLink>
        <NuxtLink to="/account/register"><BaseButton variant="secondary">{{ t('auth.register') }}</BaseButton></NuxtLink>
      </div>
    </BaseModal>
  </section>
</template>
