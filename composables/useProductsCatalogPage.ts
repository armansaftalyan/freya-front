import type { ApiListResponse } from '~/types/api'
import type { Product, ProductCategory } from '~/types/product'
import type { SupportedLocale } from '~/composables/useLocalizedPath'

export const useProductsCatalogPage = async (options?: {
  brand?: 'freya' | 'tor'
  cacheKey?: string
}) => {
  const api = useApi()
  const route = useRoute()
  const { locale, t } = useLocale()
  const { siteUrl } = useSiteMeta()
  const { productsPath } = useBrandContext()

  const brandContext = useBrandContext()
  const brand = computed<'freya' | 'tor'>(() => options?.brand || brandContext.brand.value)
  const productsCollectionLabel = computed(() => {
    if (brand.value !== 'tor') {
      return t('nav.products')
    }

    if (locale.value === 'ru') return 'Товары Tor'
    if (locale.value === 'en') return 'Tor Products'
    return 'Tor ապրանքներ'
  })

  const { data } = await useAsyncData(options?.cacheKey || (() => `products-page-${brand.value}-${locale.value}`), async () => {
    const [categoriesResponse, productsResponse] = await Promise.all([
      api.get<ApiListResponse<ProductCategory>>('/product-categories', { brand: brand.value }, { skipErrorToast: true }),
      api.get<ApiListResponse<Product>>('/products', { brand: brand.value }, { skipErrorToast: true }),
    ])

    return {
      categories: categoriesResponse.data,
      products: productsResponse.data,
    }
  })

  const categories = computed(() => (data.value?.categories || []).filter(category => category.brand === brand.value))
  const products = computed(() => (data.value?.products || []).filter(product => product.brand === brand.value))
  const categoryById = computed(() => new Map(categories.value.map(category => [category.id, category])))
  const groupedProducts = computed(() =>
    categories.value
      .map(category => ({
        ...category,
        products: products.value.filter(product => product.category_id === category.id),
      }))
      .filter(category => category.products.length > 0),
  )

  const structuredData = computed(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        url: `${siteUrl.value}${route.path}`,
        name: productsCollectionLabel.value,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: products.value.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${siteUrl.value}${productsPath.value}/${localizedSlugFor(categoryById.value.get(product.category_id), locale.value as SupportedLocale) || 'catalog'}/${localizedSlugFor(product, locale.value as SupportedLocale)}`,
            name: product.name,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: t('nav.home'),
            item: siteUrl.value,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: productsCollectionLabel.value,
            item: `${siteUrl.value}${route.path}`,
          },
        ],
      },
    ],
  }))

  return {
    brand,
    categories,
    products,
    categoryById,
    groupedProducts,
    structuredData,
  }
}
