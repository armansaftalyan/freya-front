<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { ApiItemResponse, ApiListResponse } from '~/types/api'
import type { Appointment } from '~/types/appointment'
import type { Category } from '~/types/category'
import type { Master } from '~/types/master'
import type { Service } from '~/types/service'
import type { Slot } from '~/types/slot'
import type { User } from '~/types/user'
import Card from '~/components/base/Card.vue'
import SkeletonBlock from '~/components/shared/SkeletonBlock.vue'
import BookingBreadcrumbs from '~/components/booking/BookingBreadcrumbs.vue'
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
  mastersResolved: boolean
  slots: Slot[]
  slotsLoading: boolean
}

const { t, locale } = useLocale()
const { formatAmd } = useCurrency()
const { formatPriceLabel } = useServicePricing()
const { formatYerevanDateTime, formatYerevanDate, todayYerevanDate } = useDateTime()
const { isVisible: isPromoVisible, promoCopy, promoPricingFor } = useFirstBookingPromo()
const { siteUrl } = useSiteMeta()
const { isTor, brand, authAppointmentsPath } = useBrandContext()
const route = useRoute()
const { canonicalUrl } = useLocalizedSeo(() => route.path)
const { faqCopy } = await usePageFaqContent(isTor.value ? 'tor' : 'freya', 'booking')
const hasQueryParams = computed(() => Object.keys(route.query).length > 0)

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

usePageSeo({
  title: () => bookingSeoCopy.value.title,
  description: () => bookingSeoCopy.value.description,
  ogTitle: () => bookingSeoCopy.value.title,
  ogDescription: () => bookingSeoCopy.value.ogDescription,
  noindex: () => hasQueryParams.value,
})

const auth = useAuthStore()
const servicesStore = useServicesStore()
const api = useApi()
const toast = useToast()

const { categories, services } = storeToRefs(servicesStore)

const lines = ref<BookingLine[]>([])
const nextLineId = ref(1)
const creating = ref(false)
const successCount = ref(0)
const createdAppointments = ref<Appointment[]>([])
const currentMasterProfile = ref<Master | null>(null)
const mobileStepCardRef = ref<HTMLElement | null>(null)
const mobileStepsStickyRef = ref<HTMLElement | null>(null)
const mobileStepsStickyHeight = ref(0)
const mobileStepsStickyTopOffset = ref(0)
const clientLookupLoading = ref(false)
const matchedClient = ref<User | null>(null)
let clientLookupTimer: ReturnType<typeof setTimeout> | null = null
let mobileStepsStickyObserver: ResizeObserver | null = null

const comment = ref('')
const guestFirstName = ref('')
const guestLastName = ref('')
const guestPhone = ref('')
const source = ref<'site' | 'phone' | 'instagram' | 'yandex_maps'>('site')
const bookingForClient = ref(false)
const mastersDebounceTimers = new Map<number, ReturnType<typeof setTimeout>>()
const slotsDebounceTimers = new Map<number, ReturnType<typeof setTimeout>>()
const mastersAbortControllers = new Map<number, AbortController>()
const slotsAbortControllers = new Map<number, AbortController>()

const minBookingDate = computed(() => todayYerevanDate())
const defaultBookingDate = () => {
  const nowLabel = formatYerevanDateTime(new Date(), `${todayYerevanDate()} 00:00`)
  const currentHour = Number(nowLabel.split(' ')[1]?.split(':')[0] || '0')

  if (currentHour >= 15) {
    return formatYerevanDate(new Date(Date.now() + 24 * 60 * 60 * 1000)) || todayYerevanDate()
  }

  return todayYerevanDate()
}

const bookingContact = computed(() => ({
  firstName: auth.user?.first_name?.trim?.() || '',
  lastName: auth.user?.last_name?.trim?.() || '',
  phone: auth.user?.phone || '',
}))

const canBookForClient = computed(() => {
  const roles = auth.user?.roles || []
  return roles.includes('master') || roles.includes('admin') || roles.includes('manager')
})

const isMasterUser = computed(() => {
  const roles = auth.user?.roles || []
  return roles.includes('master')
})

const shouldUseGuestContact = computed(() => !auth.isAuth || bookingForClient.value)
const allowedMasterServiceIds = computed(() => new Set((currentMasterProfile.value?.services || []).map(item => item.id)))
const isRestrictedToMasterServices = computed(() => isMasterUser.value && allowedMasterServiceIds.value.size > 0)

const normalizePhone = (value: string) => {
  const digits = (value || '').replace(/\D+/g, '')
  if (!digits) return ''
  if (digits.startsWith('374')) return `+${digits}`
  if (digits.startsWith('0') && digits.length <= 9) return `+374${digits.slice(1)}`
  if (!digits.startsWith('0') && digits.length === 8) return `+374${digits}`
  return `+${digits}`
}

const phoneDigitsCount = (value: string) => (value || '').replace(/\D+/g, '').length

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
const visibleCategories = computed(() => {
  if (!isRestrictedToMasterServices.value) return categories.value

  const allowedCategoryIds = new Set(
    services.value
      .filter(service => allowedMasterServiceIds.value.has(service.id))
      .map(service => service.category_id),
  )

  return categories.value.filter(category => allowedCategoryIds.has(category.id))
})

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

const defaultCategoryId = computed<number | null>(() => {
  if (!visibleCategories.value.length) return null
  return visibleCategories.value[0]?.id ?? null
})

const createEmptyLine = (preset: Partial<Pick<BookingLine, 'categoryId' | 'masterId'>> & { serviceId?: number } = {}): BookingLine => ({
  id: nextLineId.value++,
  categoryId: preset.categoryId ?? defaultCategoryId.value,
  serviceIds: preset.serviceId ? [preset.serviceId] : [],
  masterId: preset.masterId ?? currentMasterProfile.value?.id ?? null,
  date: defaultBookingDate(),
  slot: null,
  masters: currentMasterProfile.value ? [currentMasterProfile.value] : [],
  mastersLoading: false,
  mastersResolved: false,
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
    || (isMasterUser.value && currentMasterProfile.value?.id === line.masterId ? currentMasterProfile.value : undefined)
}

const selectedMasterServiceIds = (line: BookingLine): Set<number> | null => {
  const master = selectedMaster(line)
  if (!line.masterId || !master?.services?.length) return null

  return new Set(master.services.map(item => item.id))
}

const scrollMobileStepCardIntoView = async () => {
  if (!import.meta.client) return

  await nextTick()

  const targetTop = mobileStepCardRef.value
    ? mobileStepCardRef.value.getBoundingClientRect().top + window.scrollY - mobileStepsStickyHeight.value - mobileStepsStickyTopOffset.value - 12
    : 0

  window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' })
}

const updateMobileStepsStickyHeight = () => {
  if (!import.meta.client) return
  mobileStepsStickyHeight.value = mobileStepsStickyRef.value?.offsetHeight || 0
  if (mobileStepsStickyRef.value) {
    mobileStepsStickyTopOffset.value = Number.parseFloat(window.getComputedStyle(mobileStepsStickyRef.value).top || '0') || 0
  }
}

const mobileStep = ref(1)
const activeLineIndex = ref(0)

const activeLine = computed(() => lines.value[activeLineIndex.value] || null)

const lineHasCategoryAndServices = (line: BookingLine | null) => Boolean(line?.categoryId && line.serviceIds.length)
const lineHasDateAndSlot = (line: BookingLine | null) => Boolean(line?.date && line?.slot)

const canOpenMobileStep = (step: number, line: BookingLine | null) => {
  if (!line) return false
  if (step <= 1) return true
  if (step === 2) return lineHasCategoryAndServices(line)
  if (step === 3) return lineHasCategoryAndServices(line)
  if (step === 4) return lineHasCategoryAndServices(line) && lineHasDateAndSlot(line)
  return false
}

const setMobileStep = (step: number) => {
  if (!activeLine.value || !canOpenMobileStep(step, activeLine.value)) {
    return
  }

  mobileStep.value = step
}

const goToNextMobileStep = () => {
  if (!activeLine.value) return

  if (mobileStep.value === 1 && !lineHasCategoryAndServices(activeLine.value)) {
    toast.push({ type: 'error', title: t('common.requestFailed'), description: t('booking.errors.service') })
    return
  }

  if (mobileStep.value === 3 && !lineHasDateAndSlot(activeLine.value)) {
    toast.push({ type: 'error', title: t('common.requestFailed'), description: !activeLine.value.date ? t('booking.errors.date') : t('booking.errors.slot') })
    return
  }

  mobileStep.value = mobileStep.value === 1 && activeLine.value.masterId
    ? 3
    : Math.min(4, mobileStep.value + 1)
  void scrollMobileStepCardIntoView()
}

const goToPreviousMobileStep = () => {
  mobileStep.value = Math.max(1, mobileStep.value - 1)
  void scrollMobileStepCardIntoView()
}

const selectLineForMobile = (index: number) => {
  activeLineIndex.value = index
  if (activeLine.value && !canOpenMobileStep(mobileStep.value, activeLine.value)) {
    if (lineHasCategoryAndServices(activeLine.value) && lineHasDateAndSlot(activeLine.value)) {
      mobileStep.value = 4
    }
    else if (lineHasCategoryAndServices(activeLine.value)) {
      mobileStep.value = 3
    }
    else {
      mobileStep.value = 1
    }
  }

  void scrollMobileStepCardIntoView()
}

const servicePriceLabelForLine = (line: BookingLine, service: Service) => {
  return formatPriceLabel(service, selectedMaster(line))
}

const promoPriceLabelForLine = (line: BookingLine, service: Service) => {
  return promoPricingFor(service, selectedMaster(line)).promoLabel
}

const lineOriginalTotal = (line: BookingLine) => {
  return selectedServices(line).reduce((total, service) => {
    return total + promoPricingFor(service, selectedMaster(line)).priceFrom
  }, 0)
}

const linePromoTotal = (line: BookingLine) => {
  return selectedServices(line).reduce((total, service) => {
    return total + promoPricingFor(service, selectedMaster(line)).promoFrom
  }, 0)
}

const bookingOriginalTotal = computed(() => lines.value.reduce((total, line) => total + lineOriginalTotal(line), 0))
const bookingPromoTotal = computed(() => lines.value.reduce((total, line) => total + linePromoTotal(line), 0))

const hydrateMasterForLine = async (line: BookingLine, masterId: number, force = false) => {
  const existing = line.masters.find(master => master.id === masterId)
  if (existing?.services?.length && !force) {
    return existing
  }

  try {
    const response = await api.get<ApiItemResponse<Master>>(`/masters/${masterId}`, { brand: brand.value }, { skipErrorToast: true })
    const fullMaster = response.data
    const index = line.masters.findIndex(master => master.id === masterId)
    if (index >= 0) {
      line.masters.splice(index, 1, fullMaster)
    }
    else {
      line.masters.push(fullMaster)
    }

    return fullMaster
  }
  catch {
    return existing
  }
}

const selectMasterForLine = async (line: BookingLine, masterId: number | null) => {
  line.masterId = masterId

  if (masterId) {
    await hydrateMasterForLine(line, masterId, true)
  }

  fetchSlotsForLine(line)
}

const servicesForLine = (line: BookingLine) => {
  const masterServiceIds = selectedMasterServiceIds(line)

  if (!line.categoryId) return []
  return services.value.filter((item) => {
    if (item.category_id !== line.categoryId) return false
    if (isRestrictedToMasterServices.value && !allowedMasterServiceIds.value.has(item.id)) return false
    if (masterServiceIds && !masterServiceIds.has(item.id)) return false
    return true
  })
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
      url: canonicalUrl.value,
      name: bookingSeoCopy.value.title,
      description: bookingSeoCopy.value.description,
      isPartOf: {
        '@id': `${siteUrl.value}${isTor.value ? '/tor' : ''}#website`,
      },
      about: {
        '@id': `${siteUrl.value}${isTor.value ? '/tor#barbershop' : '#salon'}`,
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
        urlTemplate: canonicalUrl.value,
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
          item: canonicalUrl.value,
        },
      ],
    },
  ],
}))

const setLineCategory = async (line: BookingLine, categoryId: number) => {
  if (!visibleCategories.value.some(category => category.id === categoryId)) return
  line.categoryId = categoryId

  // If no services are selected yet, category switch invalidates downstream selections.
  if (!line.serviceIds.length) {
    line.serviceIds = []
    line.masterId = line.masterId ?? currentMasterProfile.value?.id ?? null
    line.slot = null
    line.masters = []
    line.mastersResolved = false
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

const refreshLineAfterServicesChanged = async (line: BookingLine) => {
  line.slot = null
  line.slots = []

  if (!line.masterId) {
    fetchMastersForLine(line)
    return
  }

  await hydrateMasterForLine(line, line.masterId)
  fetchSlotsForLine(line)
}

const toggleServiceForLine = (line: BookingLine, service: Service) => {
  if (isServiceDisabledForLine(line, service)) return
  const hadServices = line.serviceIds.length > 0
  line.serviceIds = line.serviceIds.includes(service.id)
    ? line.serviceIds.filter(id => id !== service.id)
    : [...line.serviceIds, service.id]

  if (line.id === activeLine.value?.id && mobileStep.value === 1 && line.masterId && !hadServices && line.serviceIds.length) {
    mobileStep.value = 3
    void scrollMobileStepCardIntoView()
  }

  void refreshLineAfterServicesChanged(line)
}

const fetchMastersForLineNow = async (line: BookingLine) => {
  const previousMasterId = line.masterId
  line.masters = []
  line.mastersResolved = false
  line.slot = null
  line.slots = []

  if (!line.serviceIds.length) {
    line.masterId = currentMasterProfile.value?.id ?? null
    line.masters = currentMasterProfile.value ? [currentMasterProfile.value] : []
    line.mastersResolved = Boolean(currentMasterProfile.value)
    return
  }

  if (isMasterUser.value && currentMasterProfile.value) {
    line.masters = [currentMasterProfile.value]
    line.mastersResolved = true
    line.masterId = currentMasterProfile.value.id
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
    line.mastersResolved = true
    line.masterId = previousMasterId

    if (line.masterId && !line.masters.some(master => master.id === line.masterId)) {
      line.masterId = null
    }
    else if (line.masterId) {
      await hydrateMasterForLine(line, line.masterId, true)
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

const removeLine = (lineId: number) => {
  clearLineNetworkState(lineId)
  const removedIndex = lines.value.findIndex(line => line.id === lineId)
  lines.value = lines.value.filter(line => line.id !== lineId)
  if (!lines.value.length) {
    lines.value = [createEmptyLine()]
  }

  if (removedIndex >= 0 && activeLineIndex.value >= lines.value.length) {
    activeLineIndex.value = Math.max(0, lines.value.length - 1)
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
    if (isRestrictedToMasterServices.value && line.serviceIds.some(serviceId => !allowedMasterServiceIds.value.has(serviceId))) {
      return `${prefix}${t('booking.errors.service')}`
    }
    if (!line.date) return `${prefix}${t('booking.errors.date')}`
    if (line.date < minBookingDate.value) return `${prefix}${t('booking.errors.pastSlot')}`
    if (!line.slot) return `${prefix}${t('booking.errors.slot')}`
    if (new Date(line.slot.start_at).getTime() <= Date.now()) return `${prefix}${t('booking.errors.pastSlot')}`
  }

  if (comment.value && comment.value.length > 2000) return t('booking.errors.comment')
  if (shouldUseGuestContact.value && !guestFirstName.value.trim()) return t('booking.errors.guestFirstName')
  if (shouldUseGuestContact.value && !guestLastName.value.trim()) return t('booking.errors.guestLastName')
  if (shouldUseGuestContact.value && !guestPhone.value.trim()) return t('booking.errors.guestPhone')
  if (shouldUseGuestContact.value && !isPhoneValid(normalizePhone(guestPhone.value))) return t('common.phoneInvalid')

  return ''
}

const submit = async () => {
  if (auth.token && !auth.user) {
    try {
      await auth.fetchMe()
    }
    catch {
      // Continue with guest fallback payload below.
    }
  }

  const validationError = validate()
  if (validationError) {
    toast.push({ type: 'error', title: t('common.requestFailed'), description: validationError })
    return
  }

  creating.value = true
  successCount.value = 0
  createdAppointments.value = []

  try {
    const fallbackFirstName = !shouldUseGuestContact.value ? (bookingContact.value.firstName || undefined) : undefined
    const fallbackLastName = !shouldUseGuestContact.value ? (bookingContact.value.lastName || undefined) : undefined
    const fallbackPhone = !shouldUseGuestContact.value && bookingContact.value.phone
      ? normalizePhone(bookingContact.value.phone)
      : undefined

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
        source: bookingForClient.value ? 'phone' : source.value,
        comment: comment.value || undefined,
        guest_first_name: guestFirstName.value.trim() || fallbackFirstName,
        guest_last_name: guestLastName.value.trim() || fallbackLastName,
        guest_phone: normalizePhone(guestPhone.value) || fallbackPhone,
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
    activeLineIndex.value = 0
    mobileStep.value = 1
    comment.value = ''
    guestFirstName.value = ''
    guestLastName.value = ''
    guestPhone.value = ''
    bookingForClient.value = isMasterUser.value ? true : false
    void scrollMobileStepCardIntoView()
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

  if (isMasterUser.value) {
    try {
      const response = await api.get<ApiItemResponse<Master>>('/master/profile', undefined, { skipErrorToast: true })
      currentMasterProfile.value = response.data
    }
    catch {
      currentMasterProfile.value = null
    }
  }

  const categoryId = parsePositiveInt(route.query.category_id)
  const requestedServiceId = parsePositiveInt(route.query.service_id)
  const serviceId = requestedServiceId && (!isRestrictedToMasterServices.value || allowedMasterServiceIds.value.has(requestedServiceId))
    ? requestedServiceId
    : null
  const masterId = isMasterUser.value
    ? currentMasterProfile.value?.id ?? null
    : parsePositiveInt(route.query.master_id)

  const line = createEmptyLine({ categoryId: categoryId ?? defaultCategoryId.value ?? undefined, serviceId: serviceId ?? undefined, masterId: masterId ?? undefined })
  lines.value = [line]

  if (line.masterId) {
    await hydrateMasterForLine(line, line.masterId, true)
    line.mastersResolved = true
  }

  if (line.serviceIds.length && line.masterId) {
    await fetchSlotsForLine(line, true)
    mobileStep.value = 3
  }
  else if (line.serviceIds.length) {
    await fetchMastersForLine(line, true)
    if (line.masterId && !line.masters.some(master => master.id === line.masterId)) {
      line.masterId = null
    }
    await fetchSlotsForLine(line, true)
    mobileStep.value = line.masterId ? 3 : 2
  }
}

await bootstrapBookingFlow()

watch(
  () => lines.value.length,
  () => {
    if (activeLineIndex.value >= lines.value.length) {
      activeLineIndex.value = Math.max(0, lines.value.length - 1)
    }
  },
)

const extractMatchedUser = (payload: any): User | null => {
  if (!payload) return null
  if (Array.isArray(payload?.data)) return payload.data[0] || null
  if (Array.isArray(payload)) return payload[0] || null
  if (payload?.data && typeof payload.data === 'object') return payload.data as User
  return null
}

const lookupClientByPhone = async (phone: string) => {
  const normalizedPhone = normalizePhone(phone)
  if (!normalizedPhone || !isPhoneValid(normalizedPhone)) {
    matchedClient.value = null
    return
  }

  clientLookupLoading.value = true
  matchedClient.value = null

  try {
    const response = await api.get('/clients/search', { phone: normalizedPhone }, { skipErrorToast: true })
    const user = extractMatchedUser(response)
    if (user) {
      matchedClient.value = user
      guestFirstName.value = user.first_name || guestFirstName.value
      guestLastName.value = user.last_name || guestLastName.value
    }
  }
  catch (error: any) {
    matchedClient.value = null
  }

  clientLookupLoading.value = false
}

watch(
  () => canBookForClient.value,
  (enabled) => {
    if (!enabled) {
      bookingForClient.value = false
      return
    }

    if (isMasterUser.value) {
      bookingForClient.value = true
    }
  },
  { immediate: true },
)

watch(
  () => bookingForClient.value,
  (enabled) => {
    if (!enabled) {
      matchedClient.value = null
      clientLookupLoading.value = false
    }
  },
)

watch(
  () => shouldUseGuestContact.value ? normalizePhone(guestPhone.value) : '',
  (phone) => {
    if (!(auth.isAuth && bookingForClient.value && canBookForClient.value)) return
    if (clientLookupTimer) {
      clearTimeout(clientLookupTimer)
      clientLookupTimer = null
    }
    if (phoneDigitsCount(guestPhone.value) < 8) {
      matchedClient.value = null
      clientLookupLoading.value = false
      return
    }
    clientLookupTimer = setTimeout(() => {
      lookupClientByPhone(phone)
    }, 350)
  },
)

onBeforeUnmount(() => {
  if (clientLookupTimer) {
    clearTimeout(clientLookupTimer)
    clientLookupTimer = null
  }
  mobileStepsStickyObserver?.disconnect()
  mobileStepsStickyObserver = null
  for (const line of lines.value) {
    clearLineNetworkState(line.id)
  }
})

onMounted(() => {
  updateMobileStepsStickyHeight()

  if (!import.meta.client || typeof ResizeObserver === 'undefined' || !mobileStepsStickyRef.value) {
    return
  }

  mobileStepsStickyObserver = new ResizeObserver(() => {
    updateMobileStepsStickyHeight()
  })

  mobileStepsStickyObserver.observe(mobileStepsStickyRef.value)
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

      <div
        v-if="isPromoVisible"
        class="rounded-[1.75rem] p-5"
        :class="isTor
          ? 'border border-[#c58a3a]/30 bg-[linear-gradient(180deg,rgba(197,138,58,0.14),rgba(255,255,255,0.03))]'
          : 'border border-rose-200 bg-[linear-gradient(180deg,rgba(255,241,242,0.95),rgba(255,255,255,0.98))] shadow-soft'"
      >
        <p class="text-xs font-semibold uppercase tracking-[0.16em]" :class="isTor ? 'text-[#d79a49]' : 'text-rose-700'">{{ promoCopy.badge }}</p>
        <h2 class="mt-2 text-2xl">{{ promoCopy.title }}</h2>
        <p class="mt-2 max-w-3xl text-sm leading-6" :class="isTor ? 'text-stone-300' : 'text-sand-800'">{{ promoCopy.description }}</p>
      </div>

      <div v-if="successCount" class="rounded-3xl p-6" :class="isTor ? 'border border-emerald-500/30 bg-white/[0.03] shadow-[0_20px_50px_rgba(0,0,0,0.22)]' : 'border border-emerald-200 bg-white shadow-soft'">
        <p class="text-xs uppercase tracking-[0.16em] text-emerald-700">{{ t('booking.successLabel') }}</p>
        <h2 class="mt-2 text-3xl">{{ t('booking.success') }}</h2>
        <p class="mt-3 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.successCount') }}: {{ successCount }}</p>
        <div class="mt-2 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">
          <p v-for="item in createdAppointments" :key="item.id">#{{ item.id }} · {{ formatYerevanDateTime(item.start_at) }}</p>
        </div>
      </div>

      <div class="lg:hidden">
        <p
          class="rounded-xl px-3 py-2 text-xs"
          :class="isTor
            ? 'border border-white/10 bg-white/[0.03] text-stone-300'
            : 'border border-sand-200 bg-sand-50 text-sand-700'"
        >
          {{ t('booking.oneCategoryPerLine') }}
        </p>

        <div
          ref="mobileStepsStickyRef"
          class="sticky top-16 z-20 mt-4 rounded-[1.5rem] p-2"
          :class="isTor
            ? 'border border-white/10 bg-[#0f0f10]/96 shadow-[0_18px_40px_rgba(0,0,0,0.38)] backdrop-blur'
            : 'bg-[rgba(248,244,237,0.96)] shadow-soft backdrop-blur'"
        >
          <BookingBreadcrumbs :current="mobileStep" :theme="isTor ? 'dark' : 'light'" />
        </div>

        <div
          class="mt-3 rounded-[1.75rem] px-4 py-3"
          :class="isTor ? 'border border-white/10 bg-[#161616]' : 'border border-sand-200/80 bg-white shadow-soft'"
        >
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-[11px] uppercase tracking-[0.18em]" :class="isTor ? 'text-[#d79a49]' : 'text-sand-600'">{{ bookingBrandName }}</p>
              <p class="text-lg font-semibold">{{ t('booking.wizard') }}</p>
            </div>
          </div>
          <div v-if="lines.length > 1" class="mt-3 flex gap-2 overflow-x-auto pb-1">
            <button
              v-for="(line, index) in lines"
              :key="`mobile-line-${line.id}`"
              type="button"
              class="shrink-0 rounded-full border px-3 py-1.5 text-sm transition"
              :class="activeLineIndex === index
                ? (isTor ? 'border-[#d79a49] bg-[#d79a49] text-black' : 'border-sand-900 bg-sand-900 text-white')
                : (isTor ? 'border-white/10 bg-white/[0.04] text-stone-200' : 'border-sand-200 bg-white text-sand-800')"
              @click="selectLineForMobile(index)"
            >
              {{ t('booking.lineTitle') }} #{{ index + 1 }}
            </button>
          </div>
        </div>

        <div v-if="activeLine" ref="mobileStepCardRef" class="mt-4">
        <Card class="overflow-hidden" :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100 shadow-[0_24px_60px_rgba(0,0,0,0.22)]' : ''">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-[11px] uppercase tracking-[0.18em]" :class="isTor ? 'text-[#d79a49]' : 'text-sand-600'">{{ t('booking.lineTitle') }} #{{ activeLineIndex + 1 }}</p>
              <h2 class="mt-1 text-2xl leading-tight">
                {{ mobileStep === 1 ? t('booking.categoryService') : mobileStep === 2 ? t('booking.master') : mobileStep === 3 ? t('booking.dateSlot') : t('booking.confirm') }}
              </h2>
            </div>
            <BaseButton v-if="lines.length > 1" size="sm" variant="secondary" :theme="isTor ? 'tor' : 'default'" @click="removeLine(activeLine.id)">{{ t('booking.removeLine') }}</BaseButton>
          </div>

          <div v-if="mobileStep === 1" class="mt-5 space-y-5">
            <div class="space-y-2">
              <p class="text-sm" :class="isTor ? 'text-stone-300' : 'text-[var(--muted)]'">{{ t('booking.chooseCategory') }}</p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="category in visibleCategories"
                  :key="`${activeLine.id}-${category.id}`"
                  type="button"
                  class="rounded-full border px-3 py-2 text-sm transition"
                  :class="activeLine.categoryId === category.id
                    ? (isTor ? 'border-[#d79a49] bg-[#d79a49] text-black' : 'border-sand-900 bg-sand-900 text-white')
                    : (isTor ? 'border-white/10 bg-white/[0.04] text-stone-200' : 'border-sand-200 bg-white text-sand-900')"
                  @click="setLineCategory(activeLine, category.id)"
                >
                  {{ category.name }}
                </button>
              </div>
            </div>

            <div class="space-y-3">
              <p class="text-sm" :class="isTor ? 'text-stone-300' : 'text-[var(--muted)]'">{{ t('booking.service') }}</p>
              <div class="grid gap-3">
                <button
                  v-for="item in servicesForLine(activeLine)"
                  :key="`${activeLine.id}-service-${item.id}`"
                  type="button"
                  class="w-full rounded-[1.5rem] border px-4 py-4 text-left transition"
                  :disabled="isServiceDisabledForLine(activeLine, item)"
                  :class="isServiceDisabledForLine(activeLine, item)
                    ? (isTor ? 'cursor-not-allowed border-white/10 bg-white/[0.02] text-stone-500' : 'cursor-not-allowed border-sand-200 bg-sand-100 text-sand-400')
                    : activeLine.serviceIds.includes(item.id)
                    ? (isTor ? 'border-[#d79a49] bg-white/[0.06]' : 'border-sand-900 bg-sand-50')
                    : (isTor ? 'border-white/10 bg-white/[0.03]' : 'border-sand-200 bg-white')"
                  @click="toggleServiceForLine(activeLine, item)"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0 flex-1">
                      <p class="font-semibold">{{ item.name }}</p>
                      <p class="mt-1 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ item.duration_minutes }} {{ t('booking.minutesUnit') }}</p>
                      <div v-if="isPromoVisible" class="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span
                          class="inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
                          :class="isTor ? 'border-[#c58a3a]/45 text-[#d8a15a]' : 'border-rose-200 bg-rose-50 text-rose-700'"
                        >
                          {{ promoCopy.shortBadge }}
                        </span>
                        <span class="text-sm font-semibold" :class="isTor ? 'text-stone-100' : 'text-sand-800'">{{ promoPriceLabelForLine(activeLine, item) }}</span>
                        <span class="text-xs line-through" :class="isTor ? 'text-stone-500' : 'text-sand-500'">{{ servicePriceLabelForLine(activeLine, item) }}</span>
                      </div>
                      <p v-else class="mt-1 text-sm font-semibold" :class="isTor ? 'text-stone-300' : 'text-sand-800'">{{ servicePriceLabelForLine(activeLine, item) }}</p>
                    </div>
                    <span
                      class="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-base font-bold"
                      :class="activeLine.serviceIds.includes(item.id)
                        ? (isTor ? 'border-[#d79a49] bg-[#d79a49] text-black' : 'border-sand-900 bg-sand-900 text-white')
                        : (isTor ? 'border-white/15 text-stone-400' : 'border-sand-300 text-sand-500')"
                    >
                      {{ activeLine.serviceIds.includes(item.id) ? '✓' : '+' }}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            <div v-if="activeLine.serviceIds.length" class="rounded-[1.5rem] p-4" :class="isTor ? 'border border-white/10 bg-white/[0.04]' : 'border border-sand-200 bg-sand-50/70'">
              <p class="text-sm font-semibold">{{ t('booking.service') }}</p>
              <p class="mt-1 text-sm" :class="isTor ? 'text-stone-300' : 'text-sand-800'">{{ selectedServicesLabel(activeLine) }}</p>
            </div>
          </div>

          <div v-else-if="mobileStep === 2" class="mt-5 space-y-3">
            <div class="rounded-[1.5rem] p-4" :class="isTor ? 'border border-white/10 bg-white/[0.04]' : 'border border-sand-200 bg-sand-50/70'">
              <p class="text-xs uppercase tracking-[0.16em]" :class="isTor ? 'text-[#d79a49]' : 'text-sand-600'">{{ t('booking.service') }}</p>
              <p class="mt-2 font-semibold">{{ selectedServicesLabel(activeLine) }}</p>
            </div>

            <div v-if="activeLine.mastersLoading" class="grid gap-2">
              <SkeletonBlock v-for="idx in 3" :key="`mobile-masters-${activeLine.id}-${idx}`" :theme="isTor ? 'dark' : 'light'" class="h-16" />
            </div>
            <div v-else class="grid gap-3">
              <button
                v-if="!isMasterUser"
                type="button"
                class="w-full rounded-[1.5rem] border px-4 py-4 text-left transition"
                :class="activeLine.masterId === null
                  ? (isTor ? 'border-[#d79a49] bg-white/[0.05]' : 'border-sand-900 bg-sand-50')
                  : (isTor ? 'border-white/10 bg-white/[0.03]' : 'border-sand-200 bg-white')"
                @click="selectMasterForLine(activeLine, null)"
              >
                <p class="font-semibold">{{ t('booking.anyMaster') }}</p>
              </button>
              <button
                v-for="master in activeLine.masters"
                :key="`${activeLine.id}-master-${master.id}`"
                type="button"
                class="w-full rounded-[1.5rem] border px-4 py-4 text-left transition"
                :class="activeLine.masterId === master.id
                  ? (isTor ? 'border-[#d79a49] bg-white/[0.05]' : 'border-sand-900 bg-sand-50')
                  : (isTor ? 'border-white/10 bg-white/[0.03]' : 'border-sand-200 bg-white')"
                @click="selectMasterForLine(activeLine, master.id)"
              >
                <p class="font-semibold">{{ master.name }}</p>
                <p class="mt-1 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ master.bio || t('booking.masterFallbackBio') }}</p>
              </button>
              <p v-if="activeLine.serviceIds.length && activeLine.mastersResolved && !activeLine.mastersLoading && !activeLine.masters.length" class="text-xs text-amber-700">{{ t('booking.noMastersForSelection') }}</p>
            </div>
          </div>

          <div v-else-if="mobileStep === 3" class="mt-5 space-y-4">
            <div class="rounded-[1.5rem] p-4" :class="isTor ? 'border border-white/10 bg-white/[0.04]' : 'border border-sand-200 bg-sand-50/70'">
              <p class="font-semibold">{{ selectedServicesLabel(activeLine) }}</p>
              <p class="mt-1 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ selectedMaster(activeLine)?.name || t('booking.anyMaster') }}</p>
            </div>
            <BaseInput v-model="activeLine.date" type="date" :theme="isTor ? 'dark' : 'light'" :label="t('booking.date')" :min="minBookingDate" @update:model-value="fetchSlotsForLine(activeLine)" />
            <div v-if="activeLine.slotsLoading" class="grid grid-cols-2 gap-2">
              <SkeletonBlock v-for="idx in 8" :key="`mobile-slots-${activeLine.id}-${idx}`" :theme="isTor ? 'dark' : 'light'" class="h-11" />
            </div>
            <div class="rounded-[1.5rem] p-3" :class="isTor ? 'border border-white/10 bg-white/[0.03]' : 'border border-sand-200 bg-white'">
              <SlotPicker v-if="activeLine.slots.length" :slots="activeLine.slots" :selected="activeLine.slot" :theme="isTor ? 'dark' : 'light'" @pick="onSelectSlot(activeLine, $event)" />
              <p v-else class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.noSlots') }}</p>
            </div>
          </div>

          <div v-else class="mt-5 space-y-4">
            <div class="space-y-3 rounded-[1.5rem] p-4 text-sm" :class="isTor ? 'border border-white/10 bg-white/[0.04]' : 'border border-sand-200 bg-sand-50/50'">
              <div v-for="(line, index) in lines" :key="`mobile-summary-${line.id}`" class="rounded-xl p-3" :class="isTor ? 'border border-white/10 bg-white/[0.04]' : 'border border-sand-200 bg-white'">
                <p class="font-semibold">{{ t('booking.lineTitle') }} #{{ index + 1 }}</p>
                <p><span :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.summary.service') }}:</span> <span class="font-semibold">{{ selectedServicesLabel(line) }}</span></p>
                <p><span :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.master') }}:</span> <span class="font-semibold">{{ selectedMaster(line)?.name || t('booking.anyMaster') }}</span></p>
                <p><span :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.summary.slot') }}:</span> <span class="font-semibold">{{ formatYerevanDateTime(line.slot?.start_at) }}</span></p>
                <p v-if="isPromoVisible"><span :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ promoCopy.summary }}:</span> <span class="ml-1 text-xs line-through" :class="isTor ? 'text-stone-500' : 'text-sand-500'">{{ formatAmd(lineOriginalTotal(line)) }}</span> <span class="font-semibold">{{ formatAmd(linePromoTotal(line)) }}</span></p>
              </div>
            </div>

            <div class="space-y-3">
              <div v-if="canBookForClient && !isMasterUser" class="space-y-3 rounded-[1.5rem] p-4" :class="isTor ? 'border border-white/10 bg-white/[0.03]' : 'border border-sand-200 bg-sand-50/50'">
                <p class="text-sm font-semibold">{{ t('booking.contactModeTitle') }}</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    type="button"
                    class="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition"
                    :class="!bookingForClient
                      ? (isTor ? 'bg-[#d79a49] text-black' : 'bg-sand-900 text-white')
                      : (isTor ? 'border border-white/10 bg-white/[0.03] text-stone-200' : 'border border-sand-200 bg-white text-sand-800')"
                    @click="bookingForClient = false"
                  >
                    {{ t('booking.bookForSelf') }}
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition"
                    :class="bookingForClient
                      ? (isTor ? 'bg-[#d79a49] text-black' : 'bg-sand-900 text-white')
                      : (isTor ? 'border border-white/10 bg-white/[0.03] text-stone-200' : 'border border-sand-200 bg-white text-sand-800')"
                    @click="bookingForClient = true"
                  >
                    {{ t('booking.bookForClient') }}
                  </button>
                </div>
                <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ bookingForClient ? t('booking.clientBookingHint') : t('booking.selfBookingHint') }}</p>
              </div>
              <p v-else-if="!auth.isAuth" class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.guestHint') }}</p>
              <div
                v-if="auth.isAuth && !bookingForClient && !isMasterUser"
                class="space-y-2 rounded-[1.5rem] p-4 text-sm"
                :class="isTor ? 'border border-white/10 bg-white/[0.03]' : 'border border-sand-200 bg-sand-50/50'"
              >
                <p class="font-semibold">{{ t('nav.myProfile') }}</p>
                <p><span :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.guestFirstName') }}:</span> <span class="font-semibold">{{ bookingContact.firstName || '—' }}</span></p>
                <p><span :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.guestLastName') }}:</span> <span class="font-semibold">{{ bookingContact.lastName || '—' }}</span></p>
                <p><span :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.guestPhone') }}:</span> <span class="font-semibold">{{ bookingContact.phone || '—' }}</span></p>
              </div>
              <BaseInput v-if="shouldUseGuestContact" v-model="guestFirstName" :theme="isTor ? 'dark' : 'light'" :label="t('booking.guestFirstName')" :placeholder="t('booking.guestFirstNamePlaceholder')" />
              <BaseInput v-if="shouldUseGuestContact" v-model="guestLastName" :theme="isTor ? 'dark' : 'light'" :label="t('booking.guestLastName')" :placeholder="t('booking.guestLastNamePlaceholder')" />
              <BaseInput v-if="shouldUseGuestContact" v-model="guestPhone" :theme="isTor ? 'dark' : 'light'" type="tel" :label="t('booking.guestPhone')" :placeholder="t('booking.guestPhonePlaceholder')" />
              <p v-if="bookingForClient && clientLookupLoading" class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.clientLookupLoading') }}</p>
              <p v-else-if="bookingForClient && matchedClient" class="text-sm" :class="isTor ? 'text-emerald-300' : 'text-emerald-700'">{{ t('booking.clientFound') }}: {{ matchedClient.first_name }} {{ matchedClient.last_name }}</p>
              <p v-else-if="bookingForClient && normalizePhone(guestPhone)" class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.clientNotFound') }}</p>
              <p v-if="isMasterUser && currentMasterProfile" class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.masterOnlyServicesHint') }}</p>
              <BaseInput v-model="comment" :theme="isTor ? 'dark' : 'light'" :label="t('booking.commentLabel')" :placeholder="t('booking.commentPlaceholder')" />
            </div>
          </div>
        </Card>
        </div>

        <div class="sticky bottom-3 z-20 mt-4 rounded-[1.75rem] p-3 backdrop-blur" :class="isTor ? 'border border-white/10 bg-[#161616]/92' : 'border border-sand-200/80 bg-white/95 shadow-soft'">
          <div class="flex gap-3">
            <BaseButton v-if="mobileStep > 1" variant="secondary" :theme="isTor ? 'tor' : 'default'" class="flex-1" @click="goToPreviousMobileStep">{{ t('common.previous') }}</BaseButton>
            <BaseButton
              v-if="mobileStep < 4"
              :theme="isTor ? 'tor' : 'default'"
              class="flex-1"
              @click="goToNextMobileStep"
            >
              {{ t('common.next') }}
            </BaseButton>
            <BaseButton
              v-else
              :theme="isTor ? 'tor' : 'default'"
              class="flex-1"
              :disabled="creating"
              @click="submit"
            >
              {{ creating ? t('booking.creating') : t('booking.create') }}
            </BaseButton>
          </div>
        </div>
      </div>

      <div class="hidden lg:block">
        <p
          class="rounded-xl px-3 py-2 text-xs"
          :class="isTor
            ? 'border border-white/10 bg-white/[0.03] text-stone-300'
            : 'border border-sand-200 bg-sand-50 text-sand-700'"
        >
          {{ t('booking.oneCategoryPerLine') }}
        </p>

        <div class="mt-4 space-y-4">
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
                      v-for="category in visibleCategories"
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
                        <div class="min-w-0 flex-1">
                          <p class="font-semibold">{{ item.name }}</p>
                          <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ item.duration_minutes }} {{ t('booking.minutesUnit') }}</p>
                          <div v-if="isPromoVisible" class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span
                              class="inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
                              :class="isTor ? 'border-[#c58a3a]/45 text-[#d8a15a]' : 'border-rose-200 bg-rose-50 text-rose-700'"
                            >
                              {{ promoCopy.shortBadge }}
                            </span>
                            <span class="text-sm font-semibold" :class="isTor ? 'text-stone-100' : 'text-sand-800'">{{ promoPriceLabelForLine(line, item) }}</span>
                            <span class="text-xs line-through" :class="isTor ? 'text-stone-500' : 'text-sand-500'">{{ servicePriceLabelForLine(line, item) }}</span>
                          </div>
                          <p v-else class="text-sm font-semibold" :class="isTor ? 'text-stone-300' : 'text-sand-800'">{{ servicePriceLabelForLine(line, item) }}</p>
                        </div>
                        <span
                          class="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-base font-bold leading-none"
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
                        @click="line.serviceIds = line.serviceIds.filter(id => id !== item.id); refreshLineAfterServicesChanged(line)"
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
                    v-if="!isMasterUser"
                    type="button"
                    class="w-full rounded-xl border px-3 py-2 text-left transition"
                    :class="line.masterId === null
                      ? (isTor ? 'border-[#d79a49] bg-white/[0.05]' : 'border-sand-900 bg-sand-50')
                      : (isTor ? 'border-white/10 bg-white/[0.03] hover:border-[#d79a49]/50' : 'border-sand-200 bg-white hover:border-sand-600')"
                    @click="selectMasterForLine(line, null)"
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
                    @click="selectMasterForLine(line, master.id)"
                  >
                    <p class="font-semibold">{{ master.name }}</p>
                    <p class="line-clamp-1 text-xs" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ master.bio || t('booking.masterFallbackBio') }}</p>
                  </button>
                  <p v-if="line.serviceIds.length && line.mastersResolved && !line.mastersLoading && !line.masters.length" class="text-xs text-amber-700">{{ t('booking.noMastersForSelection') }}</p>
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

        <Card class="mt-4" :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.18)]' : ''">
          <h2 class="text-2xl sm:text-3xl">{{ t('booking.confirm') }}</h2>
          <div class="mt-4 grid gap-6 lg:grid-cols-2">
            <div class="space-y-3 rounded-2xl p-4 text-sm" :class="isTor ? 'border border-white/10 bg-white/[0.03]' : 'border border-sand-200 bg-sand-50/50'">
              <div v-for="(line, index) in lines" :key="`summary-${line.id}`" class="rounded-xl p-3" :class="isTor ? 'border border-white/10 bg-white/[0.04]' : 'border border-sand-200 bg-white'">
                <p class="font-semibold">{{ t('booking.lineTitle') }} #{{ index + 1 }}</p>
                <p><span :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.summary.service') }}:</span> <span class="font-semibold">{{ selectedServicesLabel(line) }}</span></p>
                <p><span :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.master') }}:</span> <span class="font-semibold">{{ selectedMaster(line)?.name || t('booking.anyMaster') }}</span></p>
                <p><span :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.summary.slot') }}:</span> <span class="font-semibold">{{ formatYerevanDateTime(line.slot?.start_at) }}</span></p>
                <p v-if="isPromoVisible"><span :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ promoCopy.summary }}:</span> <span class="ml-1 text-xs line-through" :class="isTor ? 'text-stone-500' : 'text-sand-500'">{{ formatAmd(lineOriginalTotal(line)) }}</span> <span class="font-semibold">{{ formatAmd(linePromoTotal(line)) }}</span></p>
              </div>
            </div>
            <div class="space-y-3">
              <div
                v-if="isPromoVisible"
                class="rounded-2xl p-4 text-sm"
                :class="isTor ? 'border border-[#c58a3a]/25 bg-white/[0.03]' : 'border border-rose-200 bg-rose-50/70'"
              >
                <p class="font-semibold">{{ promoCopy.title }}</p>
                <p class="mt-2">
                  <span :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('servicesPage.priceLabel') }}:</span>
                  <span class="ml-1 text-xs line-through" :class="isTor ? 'text-stone-500' : 'text-sand-500'">{{ formatAmd(bookingOriginalTotal) }}</span>
                  <span class="ml-2 text-lg font-semibold">{{ formatAmd(bookingPromoTotal) }}</span>
                </p>
                <p class="mt-2 text-xs leading-5" :class="isTor ? 'text-stone-500' : 'text-[var(--muted)]'">{{ promoCopy.disclaimer }}</p>
              </div>
              <div v-if="canBookForClient && !isMasterUser" class="space-y-3 rounded-2xl p-4" :class="isTor ? 'border border-white/10 bg-white/[0.03]' : 'border border-sand-200 bg-sand-50/50'">
                <p class="text-sm font-semibold">{{ t('booking.contactModeTitle') }}</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    type="button"
                    class="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition"
                    :class="!bookingForClient
                      ? (isTor ? 'bg-[#d79a49] text-black' : 'bg-sand-900 text-white')
                      : (isTor ? 'border border-white/10 bg-white/[0.03] text-stone-200' : 'border border-sand-200 bg-white text-sand-800')"
                    @click="bookingForClient = false"
                  >
                    {{ t('booking.bookForSelf') }}
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition"
                    :class="bookingForClient
                      ? (isTor ? 'bg-[#d79a49] text-black' : 'bg-sand-900 text-white')
                      : (isTor ? 'border border-white/10 bg-white/[0.03] text-stone-200' : 'border border-sand-200 bg-white text-sand-800')"
                    @click="bookingForClient = true"
                  >
                    {{ t('booking.bookForClient') }}
                  </button>
                </div>
                <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ bookingForClient ? t('booking.clientBookingHint') : t('booking.selfBookingHint') }}</p>
              </div>
              <p v-else-if="!auth.isAuth" class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.guestHint') }}</p>
              <div
                v-if="auth.isAuth && !bookingForClient && !isMasterUser"
                class="space-y-2 rounded-2xl p-4 text-sm"
                :class="isTor ? 'border border-white/10 bg-white/[0.03]' : 'border border-sand-200 bg-sand-50/50'"
              >
                <p class="font-semibold">{{ t('nav.myProfile') }}</p>
                <p><span :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.guestFirstName') }}:</span> <span class="font-semibold">{{ bookingContact.firstName || '—' }}</span></p>
                <p><span :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.guestLastName') }}:</span> <span class="font-semibold">{{ bookingContact.lastName || '—' }}</span></p>
                <p><span :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.guestPhone') }}:</span> <span class="font-semibold">{{ bookingContact.phone || '—' }}</span></p>
              </div>
              <BaseInput v-if="shouldUseGuestContact" v-model="guestFirstName" :theme="isTor ? 'dark' : 'light'" :label="t('booking.guestFirstName')" :placeholder="t('booking.guestFirstNamePlaceholder')" />
              <BaseInput v-if="shouldUseGuestContact" v-model="guestLastName" :theme="isTor ? 'dark' : 'light'" :label="t('booking.guestLastName')" :placeholder="t('booking.guestLastNamePlaceholder')" />
              <BaseInput v-if="shouldUseGuestContact" v-model="guestPhone" :theme="isTor ? 'dark' : 'light'" type="tel" :label="t('booking.guestPhone')" :placeholder="t('booking.guestPhonePlaceholder')" />
              <p v-if="bookingForClient && clientLookupLoading" class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.clientLookupLoading') }}</p>
              <p v-else-if="bookingForClient && matchedClient" class="text-sm" :class="isTor ? 'text-emerald-300' : 'text-emerald-700'">{{ t('booking.clientFound') }}: {{ matchedClient.first_name }} {{ matchedClient.last_name }}</p>
              <p v-else-if="bookingForClient && normalizePhone(guestPhone)" class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.clientNotFound') }}</p>
              <p v-if="isMasterUser && currentMasterProfile" class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ t('booking.masterOnlyServicesHint') }}</p>
              <BaseInput v-model="comment" :theme="isTor ? 'dark' : 'light'" :label="t('booking.commentLabel')" :placeholder="t('booking.commentPlaceholder')" />
            </div>
          </div>
          <div class="mt-6 flex flex-wrap gap-3">
            <BaseButton :theme="isTor ? 'tor' : 'default'" :disabled="creating" @click="submit">{{ creating ? t('booking.creating') : t('booking.create') }}</BaseButton>
          </div>
        </Card>
      </div>

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
