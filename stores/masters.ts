import type { ApiListResponse } from '~/types/api'
import type { Master } from '~/types/master'

export const useMastersStore = defineStore('mastersStore', () => {
  const masters = ref<Master[]>([])
  const loading = ref(false)
  const api = useApi()

  const fetchMasters = async (serviceId?: number) => {
    loading.value = true
    try {
      const response = await api.get<ApiListResponse<Master>>('/masters', serviceId ? { service_id: serviceId } : undefined)
      masters.value = response.data
    }
    finally {
      loading.value = false
    }
  }

  return {
    masters,
    loading,
    fetchMasters,
  }
})
