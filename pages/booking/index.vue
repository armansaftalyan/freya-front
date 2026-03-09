<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { ApiItemResponse, ApiListResponse } from '~/types/api'
import type { Appointment } from '~/types/appointment'
import type { Category } from '~/types/category'
import type { Master } from '~/types/master'
import type { Service } from '~/types/service'
import type { Slot } from '~/types/slot'
import Card from '~/components/base/Card.vue'
import SkeletonBlock from '~/components/shared/SkeletonBlock.vue'
import SlotPicker from '~/components/booking/SlotPicker.vue'

interface BookingLine {
  id: number
  categoryId: number | null
  serviceIds: number[]
  masterId: number | null
  date: string
  slot: Slot | null
  masters: Master[]
  mastersLoading: boolean
  slots: Slot[]
  slotsLoading: boolean
}

const { t } = useLocale()
const { formatAmd } = useCurrency()
const { formatYerevanDateTime, todayYerevanDate } = useDateTime()

useSeoMeta({
  title: () => `Freya - ${t('nav.booking')}`,
  description: () => t('booking.seoDescription'),
  ogTitle: () => `Freya - ${t('nav.booking')}`,
  ogDescription: () => t('booking.seoOgDescription'),
})

const auth = useAuthStore()
const route = useRoute()
const servicesStore = useServicesStore()
const api = useApi()
const toast = useToast()

const { categories, services } = storeToRefs(servicesStore)

const lines = ref<BookingLine[]>([])
const nextLineId = ref(1)
const creating = ref(false)
const successCount = ref(0)
const createdAppointments = ref<Appointment[]>([])

const comment = ref('')
const guestName = ref('')
const guestPhone = ref('')
const source = ref<'site' | 'phone' | 'instagram' | 'yandex_maps'>('site')
const mastersDebounceTimers = new Map<number, ReturnType<typeof setTimeout>>()
const slotsDebounceTimers = new Map<number, ReturnType<typeof setTimeout>>()
const mastersAbortControllers = new Map<number, AbortController>()
const slotsAbortControllers = new Map<number, AbortController>()

const minBookingDate = computed(() => todayYerevanDate())

const normalizePhone = (value: string) => {
  const digits = (value || '').replace(/\D+/g, '')
  return digits ? `+${digits}` : ''
}

const isPhoneValid = (value: string) => /^\+[1-9]\d{7,14}$/.test(value)

const resolveSourceFromQuery = () => {
  const direct = typeof route.query.source === 'string' ? route.query.source : ''
  if (direct === 'site' || direct === 'phone' || direct === 'instagram' || direct === 'yandex_maps') return direct

  const utm = typeof route.query.utm_source === 'string' ? route.query.utm_source.toLowerCase() : ''
  if (utm === 'yandex' || utm === 'yandex_maps' || utm === 'yandex_business') {
    return 'yandex_maps'
  }

  return 'site'
}

const parsePositiveInt = (value: unknown): number | null => {
  if (typeof value !== 'string') return null
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

const isAbortError = (error: any): boolean => {
  return error?.name === 'AbortError' || error?.message?.toLowerCase?.().includes('aborted')
}

const categoryById = computed<Map<number, Category>>(() => new Map(categories.value.map(category => [category.id, category])))

const bookingGroupForCategory = (category?: Category | null): string | null => {
  if (!category) return null
  return category.booking_group || category.slug || null
}

const lineBookingGroup = (line: BookingLine): string | null => {
  return bookingGroupForCategory(line.categoryId ? categoryById.value.get(line.categoryId) : null)
}

const lineActiveBookingGroup = (line: BookingLine): string | null => {
  const firstSelectedService = selectedServices(line)[0]
  if (firstSelectedService) {
    return bookingGroupForCategory(categoryById.value.get(firstSelectedService.category_id))
  }

  return lineBookingGroup(line)
}

const selectedBookingGroups = computed(() => lines.value
  .map(line => lineActiveBookingGroup(line))
  .filter((group): group is string => Boolean(group)))

const totalBookingGroups = computed(() => new Set(
  categories.value
    .map(category => bookingGroupForCategory(category))
    .filter((group): group is string => Boolean(group)),
).size)

const createEmptyLine = (preset: Partial<Pick<BookingLine, 'categoryId' | 'masterId'>> & { serviceId?: number } = {}): BookingLine => ({
  id: nextLineId.value++,
  categoryId: preset.categoryId ?? null,
  serviceIds: preset.serviceId ? [preset.serviceId] : [],
  masterId: preset.masterId ?? null,
  date: '',
  slot: null,
  masters: [],
  mastersLoading: false,
  slots: [],
  slotsLoading: false,
})

const ensureAtLeastOneLine = () => {
  if (!lines.value.length) {
    lines.value = [createEmptyLine()]
  }
}

const selectedService = (line: BookingLine): Service | undefined => {
  return services.value.find(item => item.id === line.serviceIds[0])
}

const selectedServices = (line: BookingLine): Service[] => {
  if (!line.serviceIds.length) return []
  return services.value.filter(item => line.serviceIds.includes(item.id))
}

const selectedServicesLabel = (line: BookingLine): string => {
  const names = selectedServices(line).map(item => item.name)
  return names.length ? names.join(', ') : '-'
}

const selectedMaster = (line: BookingLine): Master | undefined => {
  return line.masters.find(item => item.id === line.masterId)
}

const servicesForLine = (line: BookingLine) => {
  if (!line.categoryId) return []
  return services.value.filter(item => item.category_id === line.categoryId)
}

const bookingGroupForService = (service: Service): string | null => {
  return bookingGroupForCategory(categoryById.value.get(service.category_id))
}

const isServiceDisabledForLine = (line: BookingLine, service: Service) => {
  if (line.serviceIds.includes(service.id)) return false

  const group = bookingGroupForService(service)
  if (!group) return true

  const selectedGroups = new Set(
    selectedServices(line)
      .map(item => bookingGroupForService(item))
      .filter((value): value is string => Boolean(value)),
  )

  if (selectedGroups.size && !selectedGroups.has(group)) {
    return true
  }

  return lines.value.some((item) => {
    if (item.id === line.id) return false
    return lineActiveBookingGroup(item) === group
  })
}

const toggleServiceForLine = (line: BookingLine, service: Service) => {
  if (isServiceDisabledForLine(line, service)) return
  line.serviceIds = line.serviceIds.includes(service.id)
    ? line.serviceIds.filter(id => id !== service.id)
    : [...line.serviceIds, service.id]
  fetchMastersForLine(line)
}

const setLineCategory = async (line: BookingLine, categoryId: number) => {
  line.categoryId = categoryId

  // If no services are selected yet, category switch invalidates downstream selections.
  if (!line.serviceIds.length) {
    line.serviceIds = []
    line.masterId = null
    line.slot = null
    line.masters = []
    line.slots = []
  }
}

const clearLineNetworkState = (lineId: number) => {
  const mastersTimer = mastersDebounceTimers.get(lineId)
  if (mastersTimer) {
    clearTimeout(mastersTimer)
    mastersDebounceTimers.delete(lineId)
  }

  const slotsTimer = slotsDebounceTimers.get(lineId)
  if (slotsTimer) {
    clearTimeout(slotsTimer)
    slotsDebounceTimers.delete(lineId)
  }

  mastersAbortControllers.get(lineId)?.abort()
  slotsAbortControllers.get(lineId)?.abort()
  mastersAbortControllers.delete(lineId)
  slotsAbortControllers.delete(lineId)
}

const fetchMastersForLineNow = async (line: BookingLine) => {
  line.masters = []
  line.masterId = null
  line.slot = null
  line.slots = []

  if (!line.serviceIds.length) return

  mastersAbortControllers.get(line.id)?.abort()
  const abortController = new AbortController()
  mastersAbortControllers.set(line.id, abortController)

  line.mastersLoading = true
  try {
    const response = await api.get<ApiListResponse<Master>>(
      '/masters',
      { service_ids: line.serviceIds },
      { signal: abortController.signal, skipErrorToast: true },
    )
    line.masters = response?.data || []
    if (line.masterId && !line.masters.some(master => master.id === line.masterId)) {
      line.masterId = null
    }
  }
  catch (error: any) {
    if (isAbortError(error)) return
    toast.push({ type: 'error', title: t('common.requestFailed'), description: t('common.unexpectedError') })
  }
  finally {
    if (mastersAbortControllers.get(line.id) === abortController) {
      mastersAbortControllers.delete(line.id)
    }
    line.mastersLoading = false
  }
}

const fetchMastersForLine = (line: BookingLine, immediate = false) => {
  const previousTimer = mastersDebounceTimers.get(line.id)
  if (previousTimer) {
    clearTimeout(previousTimer)
    mastersDebounceTimers.delete(line.id)
  }

  if (immediate) {
    return fetchMastersForLineNow(line)
  }

  const timer = setTimeout(() => {
    mastersDebounceTimers.delete(line.id)
    fetchMastersForLineNow(line)
  }, 180)
  mastersDebounceTimers.set(line.id, timer)
}

const fetchSlotsForLineNow = async (line: BookingLine) => {
  line.slot = null
  line.slots = []

  if (!line.serviceIds.length || !line.date) return
  if (line.date < minBookingDate.value) return

  slotsAbortControllers.get(line.id)?.abort()
  const abortController = new AbortController()
  slotsAbortControllers.set(line.id, abortController)

  line.slotsLoading = true
  try {
    const response = line.masterId
      ? await api.get<ApiItemResponse<Slot[]> | ApiListResponse<Slot> | any>('/slots', {
          service_ids: line.serviceIds,
          master_id: line.masterId,
          date: line.date,
        }, { signal: abortController.signal, skipErrorToast: true })
      : await api.post<ApiItemResponse<Slot[]> | ApiListResponse<Slot> | any>('/slots/combo', {
          items: line.serviceIds.map(serviceId => ({
            service_id: serviceId,
          })),
          date: line.date,
        }, { signal: abortController.signal, skipErrorToast: true })

    const rawSlots = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : []

    line.slots = rawSlots
      .map((item: any) => ({
        start_at: String(item?.start_at ?? item?.startAt ?? ''),
        end_at: String(item?.end_at ?? item?.endAt ?? ''),
      }))
      .filter((item: Slot) => Boolean(item.start_at))
  }
  catch (error: any) {
    if (isAbortError(error)) return
    toast.push({ type: 'error', title: t('common.requestFailed'), description: t('common.unexpectedError') })
  }
  finally {
    if (slotsAbortControllers.get(line.id) === abortController) {
      slotsAbortControllers.delete(line.id)
    }
    line.slotsLoading = false
  }
}

const fetchSlotsForLine = (line: BookingLine, immediate = false) => {
  const previousTimer = slotsDebounceTimers.get(line.id)
  if (previousTimer) {
    clearTimeout(previousTimer)
    slotsDebounceTimers.delete(line.id)
  }

  if (immediate) {
    return fetchSlotsForLineNow(line)
  }

  const timer = setTimeout(() => {
    slotsDebounceTimers.delete(line.id)
    fetchSlotsForLineNow(line)
  }, 220)
  slotsDebounceTimers.set(line.id, timer)
}

const addLine = () => {
  if (new Set(selectedBookingGroups.value).size >= totalBookingGroups.value) {
    toast.push({ type: 'error', title: t('common.requestFailed'), description: t('booking.oneCategoryPerLine') })
    return
  }

  lines.value.push(createEmptyLine())
}

const removeLine = (lineId: number) => {
  clearLineNetworkState(lineId)
  lines.value = lines.value.filter(line => line.id !== lineId)
  if (!lines.value.length) {
    lines.value = [createEmptyLine()]
  }
}

const onSelectSlot = (line: BookingLine, slot: Slot) => {
  line.slot = slot
}

const validate = () => {
  if (!lines.value.length) return t('booking.errors.service')

  for (const [index, line] of lines.value.entries()) {
    const prefix = `${t('booking.lineTitle')} #${index + 1}: `
    if (!line.categoryId) return `${prefix}${t('booking.errors.category')}`
    if (!line.serviceIds.length) return `${prefix}${t('booking.errors.service')}`
    if (!line.date) return `${prefix}${t('booking.errors.date')}`
    if (line.date < minBookingDate.value) return `${prefix}${t('booking.errors.pastSlot')}`
    if (!line.slot) return `${prefix}${t('booking.errors.slot')}`
    if (new Date(line.slot.start_at).getTime() <= Date.now()) return `${prefix}${t('booking.errors.pastSlot')}`
  }

  if (comment.value && comment.value.length > 2000) return t('booking.errors.comment')
  if (!auth.isAuth && !guestName.value.trim()) return t('booking.errors.guestName')
  if (!auth.isAuth && !guestPhone.value.trim()) return t('booking.errors.guestPhone')
  if (!auth.isAuth && !isPhoneValid(normalizePhone(guestPhone.value))) return t('common.phoneInvalid')

  return ''
}

const submit = async () => {
  const validationError = validate()
  if (validationError) {
    toast.push({ type: 'error', title: t('common.requestFailed'), description: validationError })
    return
  }

  creating.value = true
  successCount.value = 0
  createdAppointments.value = []

  try {
    const response = await api.post<any>(
      '/appointments',
      {
        lines: lines.value.map(line => ({
          start_at: line.slot?.start_at,
          items: line.serviceIds.map(serviceId => ({
            service_id: serviceId,
            master_id: line.masterId ?? undefined,
          })),
        })),
        source: source.value,
        comment: comment.value || undefined,
        guest_name: guestName.value.trim() || undefined,
        guest_phone: normalizePhone(guestPhone.value) || undefined,
      },
      { skipErrorToast: true },
    )

    const apiAppointments = Array.isArray(response?.appointments?.data)
      ? response.appointments.data
      : []
    createdAppointments.value = apiAppointments
    successCount.value = createdAppointments.value.length
    toast.push({ type: 'success', title: t('common.appointmentCreated') })

    lines.value = [createEmptyLine()]
    comment.value = ''
    guestName.value = ''
    guestPhone.value = ''
  }
  catch (error: any) {
    const parsed = useApiError(error)
    const partial = createdAppointments.value.length
      ? ` (${t('booking.successCount')}: ${createdAppointments.value.length})`
      : ''
    toast.push({ type: 'error', title: t('common.requestFailed'), description: `${parsed.message}${partial}` })
  }
  finally {
    creating.value = false
  }
}

ensureAtLeastOneLine()

await useAsyncData('booking-bootstrap', async () => {
  source.value = resolveSourceFromQuery() as any

  try {
    await servicesStore.init()
  }
  catch {
    ensureAtLeastOneLine()
    return true
  }

  const categoryId = parsePositiveInt(route.query.category_id)
  const serviceId = parsePositiveInt(route.query.service_id)
  const masterId = parsePositiveInt(route.query.master_id)

  const line = createEmptyLine({ categoryId: categoryId ?? undefined, serviceId: serviceId ?? undefined, masterId: masterId ?? undefined })
  lines.value = [line]

  if (line.serviceIds.length) {
    await fetchMastersForLine(line, true)
    if (line.masterId && !line.masters.some(master => master.id === line.masterId)) {
      line.masterId = null
    }
  }

  return true
})

onBeforeUnmount(() => {
  for (const line of lines.value) {
    clearLineNetworkState(line.id)
  }
})
</script>

<template>
  <section class="section-gap">
    <div class="container-shell mx-auto max-w-6xl space-y-6">
      <div class="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-sand-600">{{ t('booking.wizard') }}</p>
          <h1 class="text-3xl leading-tight sm:text-4xl lg:text-5xl">{{ t('booking.title') }}</h1>
        </div>
        <NuxtLink to="/account/appointments"><BaseButton variant="secondary">{{ t('nav.myAppointments') }}</BaseButton></NuxtLink>
      </div>

      <div v-if="successCount" class="rounded-3xl border border-emerald-200 bg-white p-6 shadow-soft">
        <p class="text-xs uppercase tracking-[0.16em] text-emerald-700">{{ t('booking.successLabel') }}</p>
        <h2 class="mt-2 text-3xl">{{ t('booking.success') }}</h2>
        <p class="mt-3 text-sm text-[var(--muted)]">{{ t('booking.successCount') }}: {{ successCount }}</p>
        <div class="mt-2 text-sm text-[var(--muted)]">
          <p v-for="item in createdAppointments" :key="item.id">#{{ item.id }} · {{ formatYerevanDateTime(item.start_at) }}</p>
        </div>
      </div>

      <p class="rounded-xl border border-sand-200 bg-sand-50 px-3 py-2 text-xs text-sand-700">{{ t('booking.oneCategoryPerLine') }}</p>

      <div class="space-y-4">
        <Card v-for="(line, index) in lines" :key="line.id">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h2 class="text-2xl sm:text-3xl">{{ t('booking.lineTitle') }} #{{ index + 1 }}</h2>
            <BaseButton v-if="lines.length > 1" size="sm" variant="secondary" @click="removeLine(line.id)">{{ t('booking.removeLine') }}</BaseButton>
          </div>

          <div class="mt-4 grid gap-5 xl:grid-cols-2">
            <div class="space-y-4">
              <div class="space-y-2">
                <p class="text-sm text-[var(--muted)]">{{ t('booking.chooseCategory') }}</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="category in categories"
                    :key="`${line.id}-${category.id}`"
                    type="button"
                    class="rounded-full border px-3 py-1.5 text-sm transition"
                    :class="line.categoryId === category.id
                      ? 'border-sand-900 bg-sand-900 text-white'
                      : 'border-sand-200 bg-white text-sand-900 hover:border-sand-600'"
                    @click="setLineCategory(line, category.id)"
                  >
                    {{ category.name }}
                  </button>
                </div>
              </div>

              <div class="space-y-2">
                <p class="text-sm text-[var(--muted)]">{{ t('booking.service') }}</p>
                <div class="grid gap-2">
                  <button
                    v-for="item in servicesForLine(line)"
                    :key="`${line.id}-service-${item.id}`"
                    type="button"
                    class="w-full rounded-2xl border px-4 py-3 text-left transition"
                    :disabled="isServiceDisabledForLine(line, item)"
                    :class="isServiceDisabledForLine(line, item)
                      ? 'cursor-not-allowed border-sand-200 bg-sand-100 text-sand-400'
                      : line.serviceIds.includes(item.id)
                        ? 'border-sand-900 bg-sand-50'
                        : 'border-sand-200 bg-white hover:border-sand-600'"
                    @click="toggleServiceForLine(line, item)"
                  >
                    <div class="flex items-start justify-between gap-3">
                      <div>
                        <p class="font-semibold">{{ item.name }}</p>
                        <p class="text-sm text-[var(--muted)]">{{ item.duration_minutes }} {{ t('booking.minutesUnit') }} · {{ formatAmd(item.price_from) }}</p>
                      </div>
                      <span
                        class="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full border text-base font-bold leading-none"
                        :class="line.serviceIds.includes(item.id) ? 'border-sand-900 bg-sand-900 text-white' : 'border-sand-300 text-sand-500'"
                      >
                        {{ line.serviceIds.includes(item.id) ? '✓' : '+' }}
                      </span>
                    </div>
                  </button>
                </div>
                <div v-if="line.serviceIds.length" class="space-y-2">
                  <p class="text-sm text-[var(--muted)]"><span class="font-semibold">{{ t('booking.service') }}:</span> {{ selectedServicesLabel(line) }}</p>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="item in selectedServices(line)"
                      :key="`selected-${line.id}-${item.id}`"
                      type="button"
                      class="inline-flex items-center gap-1 rounded-full border border-sand-300 bg-white px-3 py-1 text-sm text-sand-800 hover:border-sand-600"
                      @click="line.serviceIds = line.serviceIds.filter(id => id !== item.id); fetchMastersForLine(line)"
                    >
                      <span>{{ item.name }}</span>
                      <span class="text-base font-bold leading-none">×</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <p class="text-sm text-[var(--muted)]">{{ t('booking.master') }}</p>
              <div v-if="line.mastersLoading" class="grid gap-2">
                <SkeletonBlock v-for="idx in 3" :key="`masters-${line.id}-${idx}`" class="h-12" />
              </div>
              <div v-else class="grid gap-2">
                <button
                  type="button"
                  class="w-full rounded-xl border px-3 py-2 text-left transition"
                  :class="line.masterId === null ? 'border-sand-900 bg-sand-50' : 'border-sand-200 bg-white hover:border-sand-600'"
                  @click="line.masterId = null; fetchSlotsForLine(line)"
                >
                  <p class="font-semibold">{{ t('booking.anyMaster') }}</p>
                </button>
                <button
                  v-for="master in line.masters"
                  :key="`${line.id}-master-${master.id}`"
                  type="button"
                  class="w-full rounded-xl border px-3 py-2 text-left transition"
                  :class="line.masterId === master.id ? 'border-sand-900 bg-sand-50' : 'border-sand-200 bg-white hover:border-sand-600'"
                  @click="line.masterId = master.id; fetchSlotsForLine(line)"
                >
                  <p class="font-semibold">{{ master.name }}</p>
                  <p class="line-clamp-1 text-xs text-[var(--muted)]">{{ master.bio || t('booking.masterFallbackBio') }}</p>
                </button>
                <p v-if="line.serviceIds.length && !line.masters.length" class="text-xs text-amber-700">{{ t('booking.noMastersForSelection') }}</p>
              </div>
            </div>
          </div>

          <div class="mt-5 space-y-4">
            <BaseInput v-model="line.date" type="date" :label="t('booking.date')" :min="minBookingDate" @update:model-value="fetchSlotsForLine(line)" />
            <div v-if="line.slotsLoading" class="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <SkeletonBlock v-for="idx in 8" :key="`slots-${line.id}-${idx}`" class="h-10" />
            </div>
            <div class="rounded-2xl border border-sand-200 p-3">
              <SlotPicker v-if="line.slots.length" :slots="line.slots" :selected="line.slot" @pick="onSelectSlot(line, $event)" />
              <p v-else class="text-sm text-[var(--muted)]">{{ t('booking.noSlots') }}</p>
            </div>
          </div>
        </Card>
      </div>

      <div class="flex gap-3">
        <BaseButton variant="secondary" @click="addLine">{{ t('booking.addLine') }}</BaseButton>
      </div>

      <Card>
        <h2 class="text-2xl sm:text-3xl">{{ t('booking.confirm') }}</h2>
        <div class="mt-4 grid gap-6 lg:grid-cols-2">
          <div class="space-y-3 rounded-2xl border border-sand-200 bg-sand-50/50 p-4 text-sm">
            <div v-for="(line, index) in lines" :key="`summary-${line.id}`" class="rounded-xl border border-sand-200 bg-white p-3">
              <p class="font-semibold">{{ t('booking.lineTitle') }} #{{ index + 1 }}</p>
              <p><span class="text-[var(--muted)]">{{ t('booking.summary.service') }}:</span> <span class="font-semibold">{{ selectedServicesLabel(line) }}</span></p>
              <p><span class="text-[var(--muted)]">{{ t('booking.master') }}:</span> <span class="font-semibold">{{ selectedMaster(line)?.name || t('booking.anyMaster') }}</span></p>
              <p><span class="text-[var(--muted)]">{{ t('booking.summary.slot') }}:</span> <span class="font-semibold">{{ formatYerevanDateTime(line.slot?.start_at) }}</span></p>
            </div>
          </div>
          <div class="space-y-3">
            <p v-if="!auth.isAuth" class="text-sm text-[var(--muted)]">{{ t('booking.guestHint') }}</p>
            <BaseInput v-if="!auth.isAuth" v-model="guestName" :label="t('booking.guestName')" :placeholder="t('booking.guestNamePlaceholder')" />
            <BaseInput v-if="!auth.isAuth" v-model="guestPhone" type="tel" :label="t('booking.guestPhone')" :placeholder="t('booking.guestPhonePlaceholder')" />
            <BaseInput v-model="comment" :label="t('booking.commentLabel')" :placeholder="t('booking.commentPlaceholder')" />
          </div>
        </div>
        <div class="mt-6 flex flex-wrap gap-3">
          <BaseButton :disabled="creating" @click="submit">{{ creating ? t('booking.creating') : t('booking.create') }}</BaseButton>
        </div>
      </Card>
    </div>
  </section>
</template>
