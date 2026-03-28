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
import FaqSection from '~/components/sections/FaqSection.vue'

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

const { t, locale } = useLocale()
const { formatAmd } = useCurrency()
const { formatYerevanDateTime, todayYerevanDate } = useDateTime()
const { siteUrl } = useSiteMeta()
const { isTor, brand, authAppointmentsPath } = useBrandContext()
const { faqCopy } = usePageFaqContent(isTor.value ? 'tor' : 'freya', 'booking')

const bookingBrandName = computed(() => (isTor.value ? 'Tor' : 'Freya'))
const bookingSeoCopy = computed(() => {
  if (isTor.value) {
    if (locale.value === 'ru') {
      return {
        title: 'Онлайн-запись в Tor Barbershop в Ереване',
        description: 'Запись в Tor Barbershop онлайн: мужская стрижка, beard trim, fade, мужской маникюр, педикюр и массаж в Ереване с выбором барбера и свободного времени.',
        ogDescription: 'Выберите барбера, мужскую услугу и свободный слот в Tor Barbershop.',
        eyebrow: 'Barbershop Booking',
        lead: 'Онлайн-запись в Tor помогает быстро выбрать мужскую стрижку, beard trim, fade, мужской маникюр, педикюр и другие grooming-услуги в Ереване.',
        bullets: ['Выбор барбера или любого свободного мастера', 'Свободные слоты по дате и времени', 'Запись на мужские услуги без лишних шагов'],
      }
    }

    if (locale.value === 'en') {
      return {
        title: 'Online Booking at Tor Barbershop in Yerevan',
        description: 'Book Tor Barbershop online for men’s haircuts, beard trims, fades, men manicure, pedicure, and massage in Yerevan with barber selection and available time slots.',
        ogDescription: 'Choose a barber, men’s service, and available slot at Tor Barbershop.',
        eyebrow: 'Barbershop Booking',
        lead: 'Tor online booking helps users quickly reserve men’s haircuts, beard work, fades, men manicure, pedicure, and other grooming services in Yerevan.',
        bullets: ['Choose a barber or any available specialist', 'See open slots by date and time', 'Book men’s grooming services in a few steps'],
      }
    }

    return {
      title: 'Tor Barbershop օնլայն ամրագրում Երևանում',
      description: 'Tor Barbershop օնլայն ամրագրում Երևանում՝ տղամարդկանց սանրվածք, beard trim, fade, տղամարդկանց manicure, pedicure և massage՝ բարբերի և ազատ ժամի ընտրությամբ։',
      ogDescription: 'Ընտրեք բարբերին, տղամարդկանց ծառայությունը և ազատ ժամը Tor Barbershop-ում։',
      eyebrow: 'Barbershop Booking',
      lead: 'Tor-ի օնլայն ամրագրումը թույլ է տալիս արագ ընտրել տղամարդկանց սանրվածք, beard trim, fade, տղամարդկանց manicure, pedicure և այլ grooming ծառայություններ Երևանում։',
      bullets: ['Կոնկրետ բարբերի կամ ցանկացած ազատ մասնագետի ընտրություն', 'Ազատ ժամեր ըստ ամսաթվի և ժամի', 'Տղամարդկանց ծառայությունների արագ օնլայն ամրագրում'],
    }
  }

  if (locale.value === 'ru') {
    return {
      title: 'Онлайн-запись в Freya Beauty Salon в Ереване',
      description: 'Онлайн-запись в Freya Beauty Salon: маникюр, педикюр, волосы, косметология, массаж и beauty-услуги в Ереване с выбором мастера и свободного времени.',
      ogDescription: 'Выберите beauty-услугу, мастера и свободный слот в Freya Beauty Salon.',
      eyebrow: 'Beauty Booking',
      lead: 'Страница онлайн-записи Freya закрывает коммерческий интент на manicure, pedicure, hair, cosmetology, massage и другие beauty-услуги в Ереване.',
      bullets: ['Выбор категории, услуги и мастера', 'Свободные слоты по дате и времени', 'Запись без регистрации с подтверждением по телефону'],
    }
  }

  if (locale.value === 'en') {
    return {
      title: 'Online Booking at Freya Beauty Salon in Yerevan',
      description: 'Book Freya Beauty Salon online for manicure, pedicure, hair, cosmetology, massage, and beauty services in Yerevan with specialist selection and available time slots.',
      ogDescription: 'Choose a beauty service, specialist, and available slot at Freya Beauty Salon.',
      eyebrow: 'Beauty Booking',
      lead: 'Freya online booking is designed for high-intent beauty searches covering manicure, pedicure, hair, cosmetology, massage, and related services in Yerevan.',
      bullets: ['Choose category, service, and specialist', 'See available slots by date and time', 'Book without registration with phone confirmation'],
    }
  }

  return {
    title: 'Freya Beauty Salon օնլայն ամրագրում Երևանում',
    description: 'Freya Beauty Salon օնլայն ամրագրում Երևանում՝ manicure, pedicure, hair, cosmetology, massage և beauty ծառայություններ՝ մասնագետի և ազատ ժամի ընտրությամբ։',
    ogDescription: 'Ընտրեք beauty ծառայությունը, մասնագետին և ազատ ժամը Freya Beauty Salon-ում։',
    eyebrow: 'Beauty Booking',
    lead: 'Freya-ի օնլայն ամրագրումը նախատեսված է բարձր intent ունեցող beauty որոնումների համար՝ manicure, pedicure, hair, cosmetology, massage և այլ ծառայություններով Երևանում։',
    bullets: ['Կատեգորիայի, ծառայության և մասնագետի ընտրություն', 'Ազատ ժամեր ըստ ամսաթվի և ժամի', 'Ամրագրում նաև առանց գրանցման՝ հեռախոսով հաստատմամբ'],
  }
})

useSeoMeta({
  title: () => bookingSeoCopy.value.title,
  description: () => bookingSeoCopy.value.description,
  ogTitle: () => bookingSeoCopy.value.title,
  ogDescription: () => bookingSeoCopy.value.ogDescription,
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
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

const defaultCategoryId = computed<number | null>(() => {
  if (!categories.value.length) return null
  if (isTor.value) return categories.value[0]?.id ?? null
  if (categories.value.length === 1) return categories.value[0]?.id ?? null
  return null
})

const createEmptyLine = (preset: Partial<Pick<BookingLine, 'categoryId' | 'masterId'>> & { serviceId?: number } = {}): BookingLine => ({
  id: nextLineId.value++,
  categoryId: preset.categoryId ?? defaultCategoryId.value,
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

useStructuredData(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      url: `${siteUrl.value}${route.path}`,
      name: bookingSeoCopy.value.title,
      description: bookingSeoCopy.value.description,
      isPartOf: {
        '@id': `${siteUrl.value}#website`,
      },
      about: {
        '@id': `${siteUrl.value}#salon`,
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqCopy.value.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
    {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl.value}${route.path}`,
        inLanguage: locale.value,
      },
      result: {
        '@type': 'Reservation',
        name: bookingSeoCopy.value.title,
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: t('nav.home'),
          item: siteUrl.value,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: t('nav.booking'),
          item: `${siteUrl.value}${route.path}`,
        },
      ],
    },
  ],
}))

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
  const previousMasterId = line.masterId
  line.masters = []
  line.slot = null
  line.slots = []

  if (!line.serviceIds.length) {
    line.masterId = null
    return
  }

  mastersAbortControllers.get(line.id)?.abort()
  const abortController = new AbortController()
  mastersAbortControllers.set(line.id, abortController)

  line.mastersLoading = true
  try {
    const response = await api.get<ApiListResponse<Master>>(
      '/masters',
      { service_ids: line.serviceIds, brand: brand.value },
      { signal: abortController.signal, skipErrorToast: true },
    )
    line.masters = response?.data || []
    line.masterId = previousMasterId

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

const bootstrapBookingFlow = async () => {
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

  const line = createEmptyLine({ categoryId: categoryId ?? defaultCategoryId.value ?? undefined, serviceId: serviceId ?? undefined, masterId: masterId ?? undefined })
  lines.value = [line]

  if (line.serviceIds.length) {
    await fetchMastersForLine(line, true)
    if (line.masterId && !line.masters.some(master => master.id === line.masterId)) {
      line.masterId = null
    }
  }
}

await bootstrapBookingFlow()

onBeforeUnmount(() => {
  for (const line of lines.value) {
    clearLineNetworkState(line.id)
  }
})
</script>

<template>
  <section class="section-gap" :class="isTor ? 'text-stone-100' : ''">
    <div class="container-shell mx-auto max-w-6xl space-y-6">
      <div class="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.2em]" :class="isTor ? 'text-[#d79a49]' : 'text-sand-600'">{{ bookingSeoCopy.eyebrow }}</p>
          <h1 class="text-3xl leading-tight sm:text-4xl lg:text-5xl">{{ t('booking.title') }}</h1>
          <p class="mt-3 max-w-3xl text-sm leading-7 sm:text-base" :class="isTor ? 'text-stone-300' : 'text-[var(--muted)]'">{{ bookingSeoCopy.lead }}</p>
        </div>
        <NuxtLink :to="authAppointmentsPath"><BaseButton variant="secondary" :theme="isTor ? 'tor' : 'default'">{{ t('nav.myAppointments') }}</BaseButton></NuxtLink>
      </div>

      <div class="grid gap-3 md:grid-cols-3">
        <div
          v-for="item in bookingSeoCopy.bullets"
          :key="item"
          class="rounded-2xl px-4 py-3 text-sm"
          :class="isTor ? 'border border-white/10 bg-white/[0.03] text-stone-300' : 'border border-sand-200 bg-white text-sand-800 shadow-soft'"
        >
          {{ item }}
        </div>
      </div>

      <div v-if="successCount" class="rounded-3xl p-6" :class="isTor ? 'border border-emerald-500/30 bg-white/[0.03] shadow-[0_20px_50px_rgba(0,0,0,0.22)]' : 'border border-emerald-200 bg-white shadow-soft'">
        <p class="text-xs uppercase tracking-[0.16em] text-emerald-700">{{ t('booking.successLabel') }}</p>
        <h2 class="mt-2 text-3xl">{{ t('booking.success') }}</h2>
        <p class="mt-3 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.successCount') }}: {{ successCount }}</p>
        <div class="mt-2 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">
          <p v-for="item in createdAppointments" :key="item.id">#{{ item.id }} · {{ formatYerevanDateTime(item.start_at) }}</p>
        </div>
      </div>

      <p
        class="rounded-xl px-3 py-2 text-xs"
        :class="isTor
          ? 'border border-white/10 bg-white/[0.03] text-stone-300'
          : 'border border-sand-200 bg-sand-50 text-sand-700'"
      >
        {{ t('booking.oneCategoryPerLine') }}
      </p>

      <div class="space-y-4">
        <Card
          v-for="(line, index) in lines"
          :key="line.id"
          :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.18)]' : ''"
        >
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h2 class="text-2xl sm:text-3xl">{{ t('booking.lineTitle') }} #{{ index + 1 }}</h2>
            <BaseButton v-if="lines.length > 1" size="sm" variant="secondary" :theme="isTor ? 'tor' : 'default'" @click="removeLine(line.id)">{{ t('booking.removeLine') }}</BaseButton>
          </div>

          <div class="mt-4 grid gap-5 xl:grid-cols-2">
            <div class="space-y-4">
              <div class="space-y-2">
                <p class="text-sm" :class="isTor ? 'text-stone-300' : 'text-[var(--muted)]'">{{ t('booking.chooseCategory') }}</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="category in categories"
                    :key="`${line.id}-${category.id}`"
                    type="button"
                    class="rounded-full border px-3 py-1.5 text-sm transition"
                    :class="line.categoryId === category.id
                      ? (isTor ? 'border-[#d79a49] bg-[#d79a49] text-black' : 'border-sand-900 bg-sand-900 text-white')
                      : (isTor ? 'border-white/10 bg-white/[0.04] text-stone-200 hover:border-[#d79a49]/50' : 'border-sand-200 bg-white text-sand-900 hover:border-sand-600')"
                    @click="setLineCategory(line, category.id)"
                  >
                    {{ category.name }}
                  </button>
                </div>
              </div>

              <div class="space-y-2">
                <p class="text-sm" :class="isTor ? 'text-stone-300' : 'text-[var(--muted)]'">{{ t('booking.service') }}</p>
                <div class="grid gap-2">
                  <button
                    v-for="item in servicesForLine(line)"
                    :key="`${line.id}-service-${item.id}`"
                    type="button"
                    class="w-full rounded-2xl border px-4 py-3 text-left transition"
                    :disabled="isServiceDisabledForLine(line, item)"
                      :class="isServiceDisabledForLine(line, item)
                        ? (isTor ? 'cursor-not-allowed border-white/10 bg-white/[0.02] text-stone-500' : 'cursor-not-allowed border-sand-200 bg-sand-100 text-sand-400')
                        : line.serviceIds.includes(item.id)
                        ? (isTor ? 'border-[#d79a49] bg-white/[0.05]' : 'border-sand-900 bg-sand-50')
                        : (isTor ? 'border-white/10 bg-white/[0.03] hover:border-[#d79a49]/50' : 'border-sand-200 bg-white hover:border-sand-600')"
                    @click="toggleServiceForLine(line, item)"
                  >
                    <div class="flex items-start justify-between gap-3">
                      <div>
                        <p class="font-semibold">{{ item.name }}</p>
                        <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ item.duration_minutes }} {{ t('booking.minutesUnit') }} · {{ formatAmd(item.price_from) }}</p>
                      </div>
                      <span
                        class="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full border text-base font-bold leading-none"
                        :class="line.serviceIds.includes(item.id)
                          ? (isTor ? 'border-[#d79a49] bg-[#d79a49] text-black' : 'border-sand-900 bg-sand-900 text-white')
                          : (isTor ? 'border-white/15 text-stone-400' : 'border-sand-300 text-sand-500')"
                      >
                        {{ line.serviceIds.includes(item.id) ? '✓' : '+' }}
                      </span>
                    </div>
                  </button>
                </div>
                <div v-if="line.serviceIds.length" class="space-y-2">
                  <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'"><span class="font-semibold">{{ t('booking.service') }}:</span> {{ selectedServicesLabel(line) }}</p>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="item in selectedServices(line)"
                      :key="`selected-${line.id}-${item.id}`"
                      type="button"
                      class="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm"
                      :class="isTor
                        ? 'border-white/10 bg-white/[0.04] text-stone-100 hover:border-[#d79a49]/50'
                        : 'border-sand-300 bg-white text-sand-800 hover:border-sand-600'"
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
              <p class="text-sm" :class="isTor ? 'text-stone-300' : 'text-[var(--muted)]'">{{ t('booking.master') }}</p>
              <div v-if="line.mastersLoading" class="grid gap-2">
                <SkeletonBlock v-for="idx in 3" :key="`masters-${line.id}-${idx}`" :theme="isTor ? 'dark' : 'light'" class="h-12" />
              </div>
              <div v-else class="grid gap-2">
                <button
                  type="button"
                  class="w-full rounded-xl border px-3 py-2 text-left transition"
                  :class="line.masterId === null
                    ? (isTor ? 'border-[#d79a49] bg-white/[0.05]' : 'border-sand-900 bg-sand-50')
                    : (isTor ? 'border-white/10 bg-white/[0.03] hover:border-[#d79a49]/50' : 'border-sand-200 bg-white hover:border-sand-600')"
                  @click="line.masterId = null; fetchSlotsForLine(line)"
                >
                  <p class="font-semibold">{{ t('booking.anyMaster') }}</p>
                </button>
                <button
                  v-for="master in line.masters"
                  :key="`${line.id}-master-${master.id}`"
                  type="button"
                  class="w-full rounded-xl border px-3 py-2 text-left transition"
                  :class="line.masterId === master.id
                    ? (isTor ? 'border-[#d79a49] bg-white/[0.05]' : 'border-sand-900 bg-sand-50')
                    : (isTor ? 'border-white/10 bg-white/[0.03] hover:border-[#d79a49]/50' : 'border-sand-200 bg-white hover:border-sand-600')"
                  @click="line.masterId = master.id; fetchSlotsForLine(line)"
                >
                  <p class="font-semibold">{{ master.name }}</p>
                  <p class="line-clamp-1 text-xs" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ master.bio || t('booking.masterFallbackBio') }}</p>
                </button>
                <p v-if="line.serviceIds.length && !line.masters.length" class="text-xs text-amber-700">{{ t('booking.noMastersForSelection') }}</p>
              </div>
            </div>
          </div>

          <div class="mt-5 space-y-4">
            <BaseInput v-model="line.date" type="date" :theme="isTor ? 'dark' : 'light'" :label="t('booking.date')" :min="minBookingDate" @update:model-value="fetchSlotsForLine(line)" />
            <div v-if="line.slotsLoading" class="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <SkeletonBlock v-for="idx in 8" :key="`slots-${line.id}-${idx}`" :theme="isTor ? 'dark' : 'light'" class="h-10" />
            </div>
            <div class="rounded-2xl p-3" :class="isTor ? 'border border-white/10 bg-white/[0.03]' : 'border border-sand-200'">
              <SlotPicker v-if="line.slots.length" :slots="line.slots" :selected="line.slot" :theme="isTor ? 'dark' : 'light'" @pick="onSelectSlot(line, $event)" />
              <p v-else class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.noSlots') }}</p>
            </div>
          </div>
        </Card>
      </div>

      <div class="flex gap-3">
        <BaseButton variant="secondary" :theme="isTor ? 'tor' : 'default'" @click="addLine">{{ t('booking.addLine') }}</BaseButton>
      </div>

      <Card :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.18)]' : ''">
        <h2 class="text-2xl sm:text-3xl">{{ t('booking.confirm') }}</h2>
        <div class="mt-4 grid gap-6 lg:grid-cols-2">
          <div class="space-y-3 rounded-2xl p-4 text-sm" :class="isTor ? 'border border-white/10 bg-white/[0.03]' : 'border border-sand-200 bg-sand-50/50'">
            <div v-for="(line, index) in lines" :key="`summary-${line.id}`" class="rounded-xl p-3" :class="isTor ? 'border border-white/10 bg-white/[0.04]' : 'border border-sand-200 bg-white'">
              <p class="font-semibold">{{ t('booking.lineTitle') }} #{{ index + 1 }}</p>
              <p><span :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.summary.service') }}:</span> <span class="font-semibold">{{ selectedServicesLabel(line) }}</span></p>
              <p><span :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.master') }}:</span> <span class="font-semibold">{{ selectedMaster(line)?.name || t('booking.anyMaster') }}</span></p>
              <p><span :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.summary.slot') }}:</span> <span class="font-semibold">{{ formatYerevanDateTime(line.slot?.start_at) }}</span></p>
            </div>
          </div>
          <div class="space-y-3">
            <p v-if="!auth.isAuth" class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.guestHint') }}</p>
            <BaseInput v-if="!auth.isAuth" v-model="guestName" :theme="isTor ? 'dark' : 'light'" :label="t('booking.guestName')" :placeholder="t('booking.guestNamePlaceholder')" />
            <BaseInput v-if="!auth.isAuth" v-model="guestPhone" :theme="isTor ? 'dark' : 'light'" type="tel" :label="t('booking.guestPhone')" :placeholder="t('booking.guestPhonePlaceholder')" />
            <BaseInput v-model="comment" :theme="isTor ? 'dark' : 'light'" :label="t('booking.commentLabel')" :placeholder="t('booking.commentPlaceholder')" />
          </div>
        </div>
        <div class="mt-6 flex flex-wrap gap-3">
          <BaseButton :theme="isTor ? 'tor' : 'default'" :disabled="creating" @click="submit">{{ creating ? t('booking.creating') : t('booking.create') }}</BaseButton>
        </div>
      </Card>

      <FaqSection
        :theme="isTor ? 'tor' : 'default'"
        :bordered="false"
        :eyebrow="faqCopy.eyebrow"
        :title="faqCopy.title"
        :lead="faqCopy.lead"
        :items="faqCopy.items"
      />
    </div>
  </section>
</template>
