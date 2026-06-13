import type { ApiItemResponse, ApiListResponse } from '~/types/api'
import type { BlogArticle } from '~/types/blog'
import type { Category } from '~/types/category'
import type { Product, ProductCategory } from '~/types/product'
import type { Service } from '~/types/service'
import { supportedLocales, type SupportedLocale } from '~/composables/useLocalizedPath'

type LocalizedPathMap = Partial<Record<SupportedLocale, string>>

const localizedPathsFor = (
  root: string,
  entities: Array<{ slug: string, slug_i18n?: Partial<Record<SupportedLocale, string | null>> | null }>,
): LocalizedPathMap => Object.fromEntries(
  supportedLocales.map((locale) => [
    locale,
    `${root}/${entities.map(entity => localizedSlugFor(entity, locale)).join('/')}`,
  ]),
) as LocalizedPathMap

export default defineNuxtRouteMiddleware(async (to) => {
  const localizedRoutePaths = useState<LocalizedPathMap | null>('localized-route-paths', () => null)
  localizedRoutePaths.value = null

  const normalizedPath = stripLocalePrefix(to.path)
  const segments = normalizedPath.split('/').filter(Boolean)
  const isTor = segments[0] === 'tor'
  const brand = isTor ? 'tor' : 'freya'
  const rootOffset = isTor ? 1 : 0
  const section = segments[rootOffset]
  const sectionRoot = `${isTor ? '/tor' : ''}/${section || ''}`
  const firstSlug = segments[rootOffset + 1]
  const secondSlug = segments[rootOffset + 2]

  if (!firstSlug || !['products', 'services', 'blog'].includes(section)) {
    return
  }

  const api = useApi()

  try {
    if (section === 'products') {
      const [categoriesResponse, productsResponse] = await Promise.all([
        api.get<ApiListResponse<ProductCategory>>('/product-categories', { brand }, { skipErrorToast: true }),
        secondSlug
          ? api.get<ApiListResponse<Product>>('/products', { brand }, { skipErrorToast: true })
          : Promise.resolve(null),
      ])
      const category = categoriesResponse.data.find(item => slugMatches(item, firstSlug))

      if (!category) return

      if (!secondSlug) {
        localizedRoutePaths.value = localizedPathsFor(sectionRoot, [category])
        return
      }

      const product = productsResponse?.data.find(item =>
        item.category_id === category.id && slugMatches(item, secondSlug),
      )

      if (product) {
        localizedRoutePaths.value = localizedPathsFor(sectionRoot, [category, product])
      }
      return
    }

    if (section === 'services') {
      const [categoriesResponse, servicesResponse] = await Promise.all([
        api.get<ApiListResponse<Category>>('/categories', { brand }, { skipErrorToast: true }),
        secondSlug
          ? api.get<ApiListResponse<Service>>('/services', { brand }, { skipErrorToast: true })
          : Promise.resolve(null),
      ])
      const category = categoriesResponse.data.find(item => slugMatches(item, firstSlug))

      if (!category) return

      if (!secondSlug) {
        localizedRoutePaths.value = localizedPathsFor(sectionRoot, [category])
        return
      }

      const service = servicesResponse?.data.find(item =>
        item.category_id === category.id && slugMatches(item, secondSlug),
      )

      if (service) {
        localizedRoutePaths.value = localizedPathsFor(sectionRoot, [category, service])
      }
      return
    }

    const articleResponse = await api.get<ApiItemResponse<BlogArticle>>(
      `/blog/${firstSlug}`,
      { brand },
      { skipErrorToast: true },
    )
    localizedRoutePaths.value = localizedPathsFor(sectionRoot, [articleResponse.data])
  }
  catch {
    localizedRoutePaths.value = null
  }
})
