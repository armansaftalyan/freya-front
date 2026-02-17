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
}

const initialState = (): BookingState => ({
  branch: null,
  category: null,
  service: null,
  master: null,
  date: '',
  slot: null,
  comment: '',
})

export const useBookingStore = defineStore('bookingStore', () => {
  const api = useApi()
  const state = ref<BookingState>(initialState())
  const slots = ref<Slot[]>([])
  const slotsLoading = ref(false)

  const step = computed(() => {
    if (!state.value.branch) return 1
    if (!state.value.service) return 2
    if (!state.value.master) return 3
    if (!state.value.slot) return 4
    return 5
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
      const response = await api.get<ApiItemResponse<Slot[]> | ApiListResponse<Slot>>('/slots', {
        branch_id: state.value.branch.id,
        service_id: state.value.service.id,
        master_id: state.value.master.id,
        date: state.value.date,
      })

      slots.value = Array.isArray((response as ApiItemResponse<Slot[]>).data)
        ? (response as ApiItemResponse<Slot[]>).data
        : (response as ApiListResponse<Slot>).data
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
        source: 'site',
        comment: state.value.comment || undefined,
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
    fetchSlots,
    createAppointment,
    restoreProgress,
    reset,
  }
})
