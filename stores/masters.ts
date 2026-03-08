import type { ApiItemResponse, ApiListResponse } from '~/types/api'
import type { Master } from '~/types/master'

export const useMastersStore = defineStore('mastersStore', () => {
  const masters = ref<Master[]>([])
  const master = ref<Master | null>(null)
  const loading = ref(false)
  const api = useApi()

  const fetchMasters = async (serviceId?: number, serviceIds?: number[]) => {
    loading.value = true
    try {
      const params = serviceIds?.length
        ? { service_ids: serviceIds }
        : serviceId
          ? { service_id: serviceId }
          : undefined
      const response = await api.get<ApiListResponse<Master>>('/masters', params)
      masters.value = response.data
    }
    finally {
      loading.value = false
    }
  }

  const fetchMaster = async (masterKey: string | number) => {
    loading.value = true
    try {
      const response = await api.get<ApiItemResponse<Master>>(`/masters/${masterKey}`)
      master.value = response.data
      return response.data
    }
    finally {
      loading.value = false
    }
  }

  return {
    masters,
    master,
    loading,
    fetchMasters,
    fetchMaster,
  }
})
