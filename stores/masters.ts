import type { ApiItemResponse, ApiListResponse } from '~/types/api'
import type { Master } from '~/types/master'

export const useMastersStore = defineStore('mastersStore', () => {
  const masters = ref<Master[]>([])
  const master = ref<Master | null>(null)
  const loading = ref(false)
  const initializedKey = ref<string | null>(null)
  const pendingKey = ref<string | null>(null)
  let initPromise: Promise<void> | null = null
  const api = useApi()
  const { locale } = useLocale()

  const mastersKey = (serviceId?: number, serviceIds?: number[], brand?: 'freya' | 'tor') =>
    [
      locale.value,
      brand || 'all',
      serviceId || 'none',
      serviceIds?.length ? [...serviceIds].sort((a, b) => a - b).join(',') : 'none',
    ].join(':')

  const fetchMasters = async (serviceId?: number, serviceIds?: number[], brand?: 'freya' | 'tor') => {
    const contextKey = mastersKey(serviceId, serviceIds, brand)

    if (initializedKey.value === contextKey) return
    if (pendingKey.value === contextKey && initPromise) {
      await initPromise
      return
    }

    loading.value = true
    pendingKey.value = contextKey
    try {
      initPromise = (async () => {
        const params = serviceIds?.length
          ? { service_ids: serviceIds, ...(brand ? { brand } : {}) }
          : serviceId
            ? { service_id: serviceId, ...(brand ? { brand } : {}) }
            : brand
              ? { brand }
              : undefined
        const response = await api.get<ApiListResponse<Master>>('/masters', params)
        masters.value = response.data
        initializedKey.value = contextKey
      })()

      await initPromise
    }
    finally {
      pendingKey.value = null
      initPromise = null
      loading.value = false
    }
  }

  const fetchMaster = async (masterKey: string | number, brand?: 'freya' | 'tor') => {
    loading.value = true
    try {
      const response = await api.get<ApiItemResponse<Master>>(`/masters/${masterKey}`, brand ? { brand } : undefined)
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
    initializedKey,
    pendingKey,
    fetchMasters,
    fetchMaster,
  }
})
