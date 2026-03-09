import type { ApiListResponse } from '~/types/api'
import type { Category } from '~/types/category'
import type { Service } from '~/types/service'

export const useServicesStore = defineStore('servicesStore', () => {
  const categories = ref<Category[]>([])
  const services = ref<Service[]>([])
  const loading = ref(false)
  const initialized = ref(false)
  let initPromise: Promise<void> | null = null

  const api = useApi()

  const fetchCategories = async () => {
    const response = await api.get<ApiListResponse<Category>>('/categories')
    categories.value = response.data
  }

  const fetchServices = async (categoryId?: number) => {
    const response = await api.get<ApiListResponse<Service>>('/services', categoryId ? { category_id: categoryId } : undefined)
    services.value = response.data
  }

  const init = async (force = false) => {
    if (!force && initialized.value) return
    if (!force && initPromise) {
      await initPromise
      return
    }

    loading.value = true
    initPromise = (async () => {
      await Promise.all([fetchCategories(), fetchServices()])
      initialized.value = true
    })()

    try {
      await initPromise
    } finally {
      loading.value = false
      initPromise = null
    }
  }

  return {
    categories,
    services,
    loading,
    initialized,
    fetchCategories,
    fetchServices,
    init,
  }
})
