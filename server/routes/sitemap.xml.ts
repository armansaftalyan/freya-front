type ApiListResponse<T> = {
  data: T[]
}

type SitemapCategory = {
  id: number
  slug: string
  is_active?: boolean
  updated_at?: string | null
}

type SitemapService = {
  slug: string
  category_id: number
  is_active?: boolean
  updated_at?: string | null
}

type SitemapProductCategory = {
  id: number
  slug: string
  is_active?: boolean
  updated_at?: string | null
}

type SitemapProduct = {
  slug: string
  category_id: number
  is_active?: boolean
  updated_at?: string | null
}

type SitemapMaster = {
  slug: string | null
  id: number
  is_active?: boolean
  updated_at?: string | null
}

type SitemapBlogArticle = {
  slug: string
  is_published?: boolean
  updated_at?: string | null
  published_at?: string | null
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const requestUrl = getRequestURL(event)
  const siteUrl = String(config.public.siteUrl || requestUrl.origin || '').replace(/\/+$/, '')
  const apiBase = String(config.public.apiBase || '').replace(/\/+$/, '')
  const locales = ['hy', 'ru', 'en'] as const
  const xmlEscape = (value: string) => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
  const routeLastmod = new Map<string, string>()
  const now = new Date()
  const homepageLastmod = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString()
  const weeklyLastmod = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - now.getUTCDay())).toISOString()
  const normalizeLastmod = (...values: Array<string | null | undefined>) => {
    for (const value of values) {
      if (!value) continue
      const parsed = new Date(value)
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.toISOString()
      }
    }

    return ''
  }
  const isValidSlug = (value: string | null | undefined) =>
    typeof value === 'string' && value.trim() === value && value !== '' && !/[\s/]/.test(value)

  const staticRoutes = [
    '/',
    '/blog',
    '/tor/blog',
    '/services',
    '/yerevan-beauty-salon',
    '/products',
    '/masters',
    '/booking',
    '/contacts',
    '/legal',
    '/privacy-policy',
    '/gift-cards/buy',
    '/tor',
    '/tor/services',
    '/tor/yerevan-barbershop',
    '/tor/products',
    '/tor/masters',
    '/tor/booking',
    '/tor/contacts',
    '/tor/legal',
    '/tor/privacy-policy',
    '/tor/gift-cards/buy',
  ]

  const routes = new Set<string>()

  const addRoute = (route: string, locale: typeof locales[number], lastmod?: string) => {
    const localizedRoute = route === '/' ? `/${locale}` : `/${locale}${route}`
    routes.add(localizedRoute)
    routeLastmod.set(localizedRoute, lastmod || (route === '/' ? homepageLastmod : weeklyLastmod))
  }

  const addLocalizedRoute = (route: string) => {
    for (const locale of locales) {
      addRoute(route, locale)
    }
  }

  for (const route of staticRoutes) {
    addLocalizedRoute(route)
  }

  if (apiBase) {
    try {
      const fetchLocalized = <T>(path: string, locale: typeof locales[number], query: Record<string, string | number>) =>
        $fetch<ApiListResponse<T>>(`${apiBase}${path}`, {
          query: { ...query, lang: locale },
          headers: {
            'Accept-Language': locale,
            'X-Locale': locale,
          },
        })

      const addServiceRoutes = (
        categoriesResponse: ApiListResponse<SitemapCategory>,
        servicesResponse: ApiListResponse<SitemapService>,
        basePath: '/services' | '/tor/services',
        locale: typeof locales[number],
      ) => {
        const activeCategories = (categoriesResponse.data || []).filter(category => category.is_active !== false && isValidSlug(category.slug))
        const categorySlugById = new Map<number, string>()

        for (const category of activeCategories) {
          categorySlugById.set(category.id, category.slug)
          addRoute(`${basePath}/${category.slug}`, locale)
        }

        for (const service of (servicesResponse.data || []).filter(service => service.is_active !== false && isValidSlug(service.slug))) {
          const categorySlug = categorySlugById.get(service.category_id)
          if (!categorySlug) continue
          const route = `${basePath}/${categorySlug}/${service.slug}`
          const lastmod = normalizeLastmod(service.updated_at)
          addRoute(route, locale, lastmod || undefined)
        }
      }

      const addProductRoutes = (
        categoriesResponse: ApiListResponse<SitemapProductCategory>,
        productsResponse: ApiListResponse<SitemapProduct>,
        basePath: '/products' | '/tor/products',
        locale: typeof locales[number],
      ) => {
        const activeProducts = (productsResponse.data || []).filter(product => product.is_active !== false && isValidSlug(product.slug))
        const productCountByCategoryId = activeProducts.reduce((counts, product) => {
          counts.set(product.category_id, (counts.get(product.category_id) || 0) + 1)
          return counts
        }, new Map<number, number>())
        const activeProductCategories = (categoriesResponse.data || [])
          .filter(category => category.is_active !== false && isValidSlug(category.slug) && (productCountByCategoryId.get(category.id) || 0) > 0)
        const productCategorySlugById = new Map<number, string>()

        for (const category of activeProductCategories) {
          productCategorySlugById.set(category.id, category.slug)
          addRoute(`${basePath}/${category.slug}`, locale)
        }

        for (const product of activeProducts) {
          const categorySlug = productCategorySlugById.get(product.category_id)
          if (!categorySlug) continue
          const route = `${basePath}/${categorySlug}/${product.slug}`
          const lastmod = normalizeLastmod(product.updated_at)
          addRoute(route, locale, lastmod || undefined)
        }
      }

      for (const locale of locales) {
        const [
          freyaCategoriesResponse,
          freyaBlogArticlesResponse,
          freyaServicesResponse,
          freyaMastersResponse,
          freyaProductCategoriesResponse,
          freyaProductsResponse,
          torCategoriesResponse,
          torBlogArticlesResponse,
          torServicesResponse,
          torMastersResponse,
          torProductCategoriesResponse,
          torProductsResponse,
        ] = await Promise.all([
          fetchLocalized<SitemapCategory>('/categories', locale, { brand: 'freya' }),
          fetchLocalized<SitemapBlogArticle>('/blog', locale, { brand: 'freya', limit: 100 }),
          fetchLocalized<SitemapService>('/services', locale, { brand: 'freya' }),
          fetchLocalized<SitemapMaster>('/masters', locale, { brand: 'freya' }),
          fetchLocalized<SitemapProductCategory>('/product-categories', locale, { brand: 'freya' }),
          fetchLocalized<SitemapProduct>('/products', locale, { brand: 'freya' }),
          fetchLocalized<SitemapCategory>('/categories', locale, { brand: 'tor' }),
          fetchLocalized<SitemapBlogArticle>('/blog', locale, { brand: 'tor', limit: 100 }),
          fetchLocalized<SitemapService>('/services', locale, { brand: 'tor' }),
          fetchLocalized<SitemapMaster>('/masters', locale, { brand: 'tor' }),
          fetchLocalized<SitemapProductCategory>('/product-categories', locale, { brand: 'tor' }),
          fetchLocalized<SitemapProduct>('/products', locale, { brand: 'tor' }),
        ])

        addServiceRoutes(freyaCategoriesResponse, freyaServicesResponse, '/services', locale)
        addServiceRoutes(torCategoriesResponse, torServicesResponse, '/tor/services', locale)

        for (const article of (freyaBlogArticlesResponse.data || []).filter(article => article.is_published !== false && isValidSlug(article.slug))) {
          const route = `/blog/${article.slug}`
          const lastmod = normalizeLastmod(article.updated_at, article.published_at)
          addRoute(route, locale, lastmod || undefined)
        }

        for (const article of (torBlogArticlesResponse.data || []).filter(article => article.is_published !== false && isValidSlug(article.slug))) {
          const route = `/tor/blog/${article.slug}`
          const lastmod = normalizeLastmod(article.updated_at, article.published_at)
          addRoute(route, locale, lastmod || undefined)
        }

        for (const master of (freyaMastersResponse.data || []).filter(master => master.is_active !== false && isValidSlug(master.slug))) {
          const route = `/masters/${master.slug}`
          const lastmod = normalizeLastmod(master.updated_at)
          addRoute(route, locale, lastmod || undefined)
        }

        for (const master of (torMastersResponse.data || []).filter(master => master.is_active !== false && isValidSlug(master.slug))) {
          const route = `/tor/masters/${master.slug}`
          const lastmod = normalizeLastmod(master.updated_at)
          addRoute(route, locale, lastmod || undefined)
        }

        addProductRoutes(freyaProductCategoriesResponse, freyaProductsResponse, '/products', locale)
        addProductRoutes(torProductCategoriesResponse, torProductsResponse, '/tor/products', locale)
      }
    }
    catch (error) {
      console.error('Failed to build dynamic sitemap URLs', error)
    }
  }

  const urls = Array.from(routes)
    .sort()
    .map((route) => {
      const normalizedRoute = route.replace(/^\/(hy|ru|en)(?=\/|$)/, '') || '/'
      const lastmod = routeLastmod.get(route) || weeklyLastmod
      const priority = normalizedRoute === '/'
        ? '1.0'
        : normalizedRoute === '/services' || normalizedRoute === '/tor/services'
          ? '0.9'
          : /^\/(services|tor\/services)\/[^/]+$/.test(normalizedRoute)
            ? '0.8'
            : normalizedRoute === '/masters' || normalizedRoute === '/tor/masters'
              ? '0.7'
              : normalizedRoute === '/blog' || normalizedRoute === '/tor/blog'
                ? '0.6'
                : normalizedRoute === '/products' || normalizedRoute === '/tor/products'
                  ? '0.5'
                  : normalizedRoute === '/legal' || normalizedRoute === '/privacy-policy' || normalizedRoute === '/tor/legal' || normalizedRoute === '/tor/privacy-policy'
                    ? '0.3'
                    : /\/(services|tor\/services)\//.test(normalizedRoute)
                      ? '0.8'
                      : '0.7'
      return `\n  <url>\n    <loc>${xmlEscape(`${siteUrl}${route}`)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}\n</urlset>`

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=900, s-maxage=3600',
    },
  })
})
