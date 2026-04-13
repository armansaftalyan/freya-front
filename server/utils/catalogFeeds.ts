type ApiListResponse<T> = {
  data: T[]
}

export type FeedLocale = 'hy' | 'ru' | 'en'

type FeedProductCategory = {
  id: number
  name: string
  slug: string
  is_active?: boolean
}

type FeedProduct = {
  id: number
  category_id: number
  name: string
  slug: string
  description: string | null
  brand: string | null
  sku: string | null
  image_url: string | null
  volume_label: string | null
  price: number
  compare_at_price: number | null
  stock_qty: number | null
  is_active?: boolean
}

export type FeedCatalogItem = {
  id: string
  numericId: number
  brandKey: 'freya' | 'tor'
  storeName: string
  title: string
  description: string
  categoryName: string
  categoryExternalId: string
  link: string
  imageLink: string | null
  price: number
  oldPrice: number | null
  salePrice: number | null
  currency: 'AMD'
  availability: 'in stock' | 'out of stock'
  yandexAvailable: boolean
  sku: string | null
  gtin: string | null
  mpn: string | null
  vendor: string | null
  customLabel0: string
  customLabel1: string
}

type FeedMeta = {
  locale: FeedLocale
  title: string
  description: string
  company: string
  storeName: string
  volumeLabel: string
}

const normalizeBase = (value: string) => String(value || '').replace(/\/+$/, '')

const xmlEscape = (value: string | number | boolean | null | undefined) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;')

const absoluteUrl = (siteUrl: string, path: string) => {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return `${normalizeBase(siteUrl)}${path.startsWith('/') ? path : `/${path}`}`
}

const stripHtml = (value: string | null | undefined) => String(value || '')
  .replace(/<[^>]*>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

const truncate = (value: string, max = 5000) => value.length > max ? `${value.slice(0, max - 1).trim()}…` : value

const buildProductUrl = (siteUrl: string, locale: FeedLocale, brand: 'freya' | 'tor', categorySlug: string, productSlug: string) => {
  const basePath = brand === 'tor' ? `/${locale}/tor/products` : `/${locale}/products`
  return `${normalizeBase(siteUrl)}${basePath}/${categorySlug}/${productSlug}`
}

const getStoreName = (brand: 'freya' | 'tor') => brand === 'tor' ? 'Tor Barbershop' : 'Freya Beauty Salon'

export const getFeedMeta = (locale: FeedLocale): FeedMeta => {
  if (locale === 'ru') {
    return {
      locale,
      title: 'Фид товаров Freya Beauty Salon и Tor Barbershop',
      description: 'Локализованный товарный фид для маркетплейсов и рекламных систем',
      company: 'Freya Beauty Salon',
      storeName: 'Freya Beauty Salon / Tor Barbershop',
      volumeLabel: 'Объем',
    }
  }

  if (locale === 'en') {
    return {
      locale,
      title: 'Freya Beauty Salon and Tor Barbershop Product Feed',
      description: 'Localized product feed for merchant platforms',
      company: 'Freya Beauty Salon',
      storeName: 'Freya Beauty Salon / Tor Barbershop',
      volumeLabel: 'Volume',
    }
  }

  return {
    locale,
    title: 'Freya Beauty Salon և Tor Barbershop ապրանքների ֆիդ',
    description: 'Տեղայնացված ապրանքային ֆիդ մարքեթփլեյսների և գովազդային համակարգերի համար',
    company: 'Freya Beauty Salon',
    storeName: 'Freya Beauty Salon / Tor Barbershop',
    volumeLabel: 'Ծավալ',
  }
}

const fetchBrandCatalog = async (
  apiBase: string,
  siteUrl: string,
  locale: FeedLocale,
  brand: 'freya' | 'tor',
): Promise<FeedCatalogItem[]> => {
  const feedMeta = getFeedMeta(locale)
  const [categoriesResponse, productsResponse] = await Promise.all([
    $fetch<ApiListResponse<FeedProductCategory>>(`${normalizeBase(apiBase)}/product-categories`, {
      query: { brand, lang: locale },
      headers: {
        'Accept-Language': locale,
        'X-Locale': locale,
      },
    }),
    $fetch<ApiListResponse<FeedProduct>>(`${normalizeBase(apiBase)}/products`, {
      query: { brand, lang: locale },
      headers: {
        'Accept-Language': locale,
        'X-Locale': locale,
      },
    }),
  ])

  const categories = (categoriesResponse.data || []).filter(category => category.is_active !== false)
  const categoryById = new Map(categories.map(category => [category.id, category]))

  return (productsResponse.data || [])
    .filter(product => product.is_active !== false)
    .map((product) => {
      const category = categoryById.get(product.category_id)
      if (!category) return null

      const vendor = product.brand?.trim() || getStoreName(brand)
      const inStock = product.stock_qty === null || product.stock_qty === undefined || product.stock_qty > 0
      const volume = product.volume_label?.trim()
      const descriptionParts = [
        stripHtml(product.description),
        volume ? `${feedMeta.volumeLabel}: ${volume}` : '',
      ].filter(Boolean)

      return {
        id: `${brand}-${product.id}`,
        numericId: product.id,
        brandKey: brand,
        storeName: getStoreName(brand),
        title: product.name,
        description: truncate(descriptionParts.join(' ')),
        categoryName: category.name,
        categoryExternalId: `${brand}-${category.id}`,
        link: buildProductUrl(siteUrl, locale, brand, category.slug, product.slug),
        imageLink: product.image_url ? absoluteUrl(siteUrl, product.image_url) : null,
        price: product.price,
        oldPrice: product.compare_at_price && product.compare_at_price > product.price ? product.compare_at_price : null,
        salePrice: product.compare_at_price && product.compare_at_price > product.price ? product.price : null,
        currency: 'AMD',
        availability: inStock ? 'in stock' : 'out of stock',
        yandexAvailable: inStock,
        sku: product.sku || null,
        gtin: null,
        mpn: product.sku || null,
        vendor,
        customLabel0: brand,
        customLabel1: category.name,
      } satisfies FeedCatalogItem
    })
    .filter((item): item is FeedCatalogItem => Boolean(item))
}

export const loadFeedCatalog = async (apiBase: string, siteUrl: string) => {
  const [freyaItems, torItems] = await Promise.all([
    fetchBrandCatalog(apiBase, siteUrl, 'hy', 'freya'),
    fetchBrandCatalog(apiBase, siteUrl, 'hy', 'tor'),
  ])

  return [...freyaItems, ...torItems]
}

export const loadFeedCatalogByLocale = async (apiBase: string, siteUrl: string, locale: FeedLocale) => {
  const [freyaItems, torItems] = await Promise.all([
    fetchBrandCatalog(apiBase, siteUrl, locale, 'freya'),
    fetchBrandCatalog(apiBase, siteUrl, locale, 'tor'),
  ])

  return [...freyaItems, ...torItems]
}

export const feedXml = {
  escape: xmlEscape,
}
