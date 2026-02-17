import type { ApiListResponse } from '~/types/api'
import type { Category } from '~/types/category'
import type { Service } from '~/types/service'

export const useServicesStore = defineStore('servicesStore', () => {
  const categories = ref<Category[]>([])
  const services = ref<Service[]>([])
  const loading = ref(false)

  const api = useApi()

  const fetchCategories = async () => {
    const response = await api.get<ApiListResponse<Category>>('/categories')
    categories.value = response.data
  }

  const fetchServices = async (categoryId?: number) => {
    const response = await api.get<ApiListResponse<Service>>('/services', categoryId ? { category_id: categoryId } : undefined)
    services.value = response.data
  }

  const init = async () => {
    loading.value = true
    try {
      await Promise.all([fetchCategories(), fetchServices()])
    }
    finally {
      loading.value = false
    }
  }

  return {
    categories,
    services,
    loading,
    fetchCategories,
    fetchServices,
    init,
  }
})
