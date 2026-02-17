import type { ApiItemResponse, ApiListResponse } from '~/types/api'
import type { Appointment } from '~/types/appointment'

export const useAppointmentsStore = defineStore('appointmentsStore', () => {
  const api = useApi()
  const { t } = useLocale()
  const appointments = ref<Appointment[]>([])
  const loading = ref(false)

  const fetchMine = async () => {
    loading.value = true
    try {
      const response = await api.get<ApiListResponse<Appointment>>('/appointments/my')
      appointments.value = response.data
    }
    finally {
      loading.value = false
    }
  }

  const cancel = async (id: number) => {
    const response = await api.patch<ApiItemResponse<Appointment>>(`/appointments/${id}/cancel`)
    const idx = appointments.value.findIndex((item) => item.id === id)
    if (idx >= 0) {
      appointments.value[idx] = response.data
    }
    useToast().push({ type: 'info', title: t('common.appointmentCancelled') })
  }

  return {
    appointments,
    loading,
    fetchMine,
    cancel,
  }
})
