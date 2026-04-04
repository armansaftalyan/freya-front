import { storeToRefs } from 'pinia'
import type { ApiListResponse } from '~/types/api'
import type { Category } from '~/types/category'
import type { Service } from '~/types/service'

export const useServicesCatalogPage = async (options?: {
  mode?: 'store' | 'api'
  brand?: 'freya' | 'tor'
  cacheKey?: string
}) => {
  const api = useApi()
  const route = useRoute()
  const { locale } = useLocale()
  const { siteUrl } = useSiteMeta()
  const brandContext = useBrandContext()

  const brand = computed<'freya' | 'tor'>(() => options?.brand || brandContext.brand.value)
  const mode = options?.mode || 'store'
  const servicesStore = useServicesStore()
  const { categories: storeCategories, services: storeServices, loading } = storeToRefs(servicesStore)

  const data = mode === 'api'
    ? await useAsyncData(options?.cacheKey || (() => `${brand.value}-services-page-${locale.value}`), async () => {
        const [categoriesResponse, servicesResponse] = await Promise.all([
          api.get<ApiListResponse<Category>>('/categories', { brand: brand.value }, { skipErrorToast: true }),
          api.get<ApiListResponse<Service>>('/services', { brand: brand.value }, { skipErrorToast: true }),
        ])

        return {
          categories: categoriesResponse.data,
          services: servicesResponse.data,
        }
      })
    : null

  if (mode === 'store') {
    await useAsyncData(options?.cacheKey || (() => `services-page-${brand.value}-${locale.value}`), async () => {
      await servicesStore.init()
      return true
    })
  }

  const categories = computed(() => {
    const items = mode === 'api'
      ? data?.data.value?.categories || []
      : storeCategories.value

    return items.filter(category => category.brand === brand.value)
  })

  const services = computed(() => {
    const items = mode === 'api'
      ? data?.data.value?.services || []
      : storeServices.value

    return items.filter(service => service.brand === brand.value)
  })

  const categoryById = computed(() => new Map(categories.value.map(category => [category.id, category])))
  const grouped = computed(() =>
    categories.value
      .map((category) => ({
        category,
        items: services.value.filter(service => service.category_id === category.id),
      }))
      .filter(entry => entry.items.length > 0),
  )

  const structuredData = computed(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        url: `${siteUrl.value}${route.path}`,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: services.value.map((service, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${siteUrl.value}${brandContext.servicesPath.value}/${categoryById.value.get(service.category_id)?.slug || 'category'}/${service.slug}`,
            name: service.name,
          })),
        },
      },
    ],
  }))

  return {
    brand,
    categories,
    services,
    grouped,
    categoryById,
    loading,
    structuredData,
  }
}
