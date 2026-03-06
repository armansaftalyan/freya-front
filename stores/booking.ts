import type { ApiItemResponse, ApiListResponse } from '~/types/api'
import type { Appointment } from '~/types/appointment'
import type { Branch } from '~/types/branch'
import type { Category } from '~/types/category'
import type { Master } from '~/types/master'
import type { Service } from '~/types/service'
import type { Slot } from '~/types/slot'

interface BookingState {
  branch: Branch | null
  category: Category | null
  service: Service | null
  master: Master | null
  date: string
  slot: Slot | null
  comment: string
  guestName: string
  guestPhone: string
  source: 'site' | 'phone' | 'instagram' | 'yandex_maps'
}

const initialState = (): BookingState => ({
  branch: null,
  category: null,
  service: null,
  master: null,
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

  const step = computed(() => {
    if (!state.value.service) return 1
    if (!state.value.master) return 2
    if (!state.value.slot) return 3
    return 4
  })

  const canSubmit = computed(() => Boolean(state.value.branch && state.value.service && state.value.master && state.value.slot))

  const setBranch = (branch: Branch) => {
    state.value.branch = branch
    state.value.slot = null
  }

  const setCategory = (category: Category) => {
    state.value.category = category
    state.value.service = null
    state.value.master = null
    state.value.slot = null
  }

  const setService = (service: Service) => {
    state.value.service = service
    state.value.master = null
    state.value.slot = null
  }

  const setMaster = (master: Master) => {
    state.value.master = master
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
      state.value = { ...initialState(), ...JSON.parse(raw) }
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
    if (!state.value.branch || !state.value.service || !state.value.master || !state.value.date) {
      slots.value = []
      return
    }

    slotsLoading.value = true
    try {
      const response = await api.get<ApiItemResponse<Slot[]> | ApiListResponse<Slot> | any>('/slots', {
        branch_id: state.value.branch.id,
        service_id: state.value.service.id,
        master_id: state.value.master.id,
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

    const response = await api.post<ApiItemResponse<Appointment>>(
      '/appointments',
      {
        branch_id: state.value.branch?.id,
        service_id: state.value.service?.id,
        master_id: state.value.master?.id,
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
    setBranch,
    setCategory,
    setService,
    setMaster,
    setDate,
    setSlot,
    setSource,
    fetchSlots,
    createAppointment,
    restoreProgress,
    reset,
  }
})
