import type { ApiListResponse } from '~/types/api'
import type { Category } from '~/types/category'
import type { Service } from '~/types/service'

export const useServicesStore = defineStore('servicesStore', () => {
  const categories = ref<Category[]>([])
  const services = ref<Service[]>([])
  const loading = ref(false)
  const initialized = ref(false)
  const initializedKey = ref<string | null>(null)
  const pendingKey = ref<string | null>(null)
  let initPromise: Promise<void> | null = null

  const api = useApi()
  const { locale } = useLocale()
  const brandContext = useBrandContext()

  const currentBrand = () => brandContext.brand.value
  const currentKey = () => `${locale.value}:${currentBrand()}`

  const fetchCategories = async (brand = currentBrand()) => {
    const response = await api.get<ApiListResponse<Category>>('/categories', { brand })
    categories.value = response.data
  }

  const fetchServices = async (categoryId?: number, brand = currentBrand()) => {
    const response = await api.get<ApiListResponse<Service>>('/services', {
      ...(categoryId ? { category_id: categoryId } : {}),
      brand,
    })
    services.value = response.data
  }

  const init = async (force = false) => {
    const contextKey = currentKey()

    if (!force && initializedKey.value === contextKey && initialized.value) return
    if (!force && pendingKey.value === contextKey && initPromise) {
      await initPromise
      return
    }

    loading.value = true
    pendingKey.value = contextKey
    initPromise = (async () => {
      const brand = currentBrand()
      await Promise.all([fetchCategories(brand), fetchServices(undefined, brand)])
      initialized.value = true
      initializedKey.value = contextKey
    })()

    try {
      await initPromise
    } finally {
      pendingKey.value = null
      loading.value = false
      initPromise = null
    }
  }

  return {
    categories,
    services,
    loading,
    initialized,
    initializedKey,
    pendingKey,
    fetchCategories,
    fetchServices,
    init,
  }
})
