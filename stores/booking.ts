import type { ApiItemResponse, ApiListResponse } from '~/types/api'
import type { Appointment } from '~/types/appointment'
import type { Category } from '~/types/category'
import type { Master } from '~/types/master'
import type { Service } from '~/types/service'
import type { Slot } from '~/types/slot'

interface BookingState {
  category: Category | null
  services: Service[]
  categoryMasters: Record<number, Master | null>
  date: string
  slot: Slot | null
  comment: string
  guestName: string
  guestPhone: string
  source: 'site' | 'phone' | 'instagram' | 'yandex_maps'
}

const initialState = (): BookingState => ({
  category: null,
  services: [],
  categoryMasters: {},
  date: '',
  slot: null,
  comment: '',
  guestName: '',
  guestPhone: '',
  source: 'site',
})

export const useBookingStore = defineStore('bookingStore', () => {
  const api = useApi()
  const state = ref<BookingState>(initialState())
  const slots = ref<Slot[]>([])
  const slotsLoading = ref(false)

  const hasSelectedServices = computed(() => state.value.services.length > 0)
  const step = computed(() => {
    if (!hasSelectedServices.value) return 1
    if (!state.value.slot) return 3
    return 4
  })

  const canSubmit = computed(() => Boolean(state.value.slot))

  const setCategory = (category: Category) => {
    state.value.category = category
  }

  const setService = (service: Service) => {
    state.value.services = [service]
    state.value.slot = null
  }

  const toggleService = (service: Service) => {
    const exists = state.value.services.some((item) => item.id === service.id)
    if (exists) {
      state.value.services = state.value.services.filter((item) => item.id !== service.id)
    }
    else {
      state.value.services = [...state.value.services, service]
    }

    const activeCategoryIds = new Set(state.value.services.map((item) => item.category_id))
    state.value.categoryMasters = Object.fromEntries(
      Object.entries(state.value.categoryMasters).filter(([categoryId]) => activeCategoryIds.has(Number(categoryId))),
    )

    state.value.slot = null
  }

  const setCategoryMaster = (categoryId: number, master: Master | null) => {
    state.value.categoryMasters = {
      ...state.value.categoryMasters,
      [categoryId]: master,
    }
    state.value.slot = null
  }

  const setDate = (date: string) => {
    state.value.date = date
    state.value.slot = null
  }

  const setSlot = (slot: Slot) => {
    state.value.slot = slot
  }

  const setSource = (source: string) => {
    const allowedSources = new Set(['site', 'phone', 'instagram', 'yandex_maps'])
    state.value.source = allowedSources.has(source) ? (source as BookingState['source']) : 'site'
  }

  const saveProgress = () => {
    if (!import.meta.client) return
    localStorage.setItem('booking-progress', JSON.stringify(state.value))
  }

  const restoreProgress = () => {
    if (!import.meta.client) return

    const raw = localStorage.getItem('booking-progress')
    if (!raw) return

    try {
      const parsed = JSON.parse(raw)
      state.value = { ...initialState(), ...parsed }
      if (!Array.isArray(state.value.services)) {
        state.value.services = parsed?.service ? [parsed.service as Service] : []
      }
      if (!state.value.categoryMasters || typeof state.value.categoryMasters !== 'object') {
        state.value.categoryMasters = {}
      }
    }
    catch {
      state.value = initialState()
    }
  }

  const reset = () => {
    state.value = initialState()
    slots.value = []
    if (import.meta.client) {
      localStorage.removeItem('booking-progress')
    }
  }

  const fetchSlots = async () => {
    if (!state.value.services.length || !state.value.date) {
      slots.value = []
      return
    }

    slotsLoading.value = true
    try {
      const items = state.value.services.map((service) => ({
        service_id: service.id,
        master_id: state.value.categoryMasters[service.category_id]?.id ?? undefined,
      }))

      const response = await api.post<ApiItemResponse<Slot[]> | ApiListResponse<Slot> | any>('/slots/combo', {
        items,
        date: state.value.date,
      })

      const rawSlots = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.data)
            ? response.data.data
            : []

      slots.value = rawSlots
        .map((item: any) => ({
          start_at: String(item?.start_at ?? item?.startAt ?? ''),
          end_at: String(item?.end_at ?? item?.endAt ?? ''),
        }))
        .filter((item: Slot) => Boolean(item.start_at))
    }
    finally {
      slotsLoading.value = false
    }
  }

  const createAppointment = async () => {
    if (!canSubmit.value || !state.value.slot) {
      throw new Error('Booking is incomplete')
    }

    const items = state.value.services.map((service) => ({
      service_id: service.id,
      master_id: state.value.categoryMasters[service.category_id]?.id ?? undefined,
    }))

    const response = await api.post<ApiItemResponse<Appointment>>(
      '/appointments',
      {
        items,
        start_at: state.value.slot.start_at,
        source: state.value.source,
        comment: state.value.comment || undefined,
        guest_name: state.value.guestName.trim() || undefined,
        guest_phone: state.value.guestPhone.trim() || undefined,
      },
      { skipErrorToast: true },
    )

    return response.data
  }

  watch(
    () => state.value,
    () => saveProgress(),
    { deep: true },
  )

  return {
    state,
    slots,
    slotsLoading,
    step,
    canSubmit,
    setCategory,
    setService,
    toggleService,
    setCategoryMaster,
    setDate,
    setSlot,
    setSource,
    fetchSlots,
    createAppointment,
    restoreProgress,
    reset,
  }
})
