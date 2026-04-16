type ApiListResponse<T> = {
  data: T[]
}

type SitemapCategory = {
  id: number
  slug: string
  is_active?: boolean
}

type SitemapService = {
  slug: string
  category_id: number
  is_active?: boolean
}

type SitemapProductCategory = {
  id: number
  slug: string
  is_active?: boolean
}

type SitemapProduct = {
  slug: string
  category_id: number
  is_active?: boolean
}

type SitemapMaster = {
  slug: string | null
  id: number
  is_active?: boolean
}

type SitemapBlogArticle = {
  slug: string
  is_published?: boolean
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = String(config.public.siteUrl || '').replace(/\/+$/, '')
  const apiBase = String(config.public.apiBase || '').replace(/\/+$/, '')
  const locales = ['hy', 'ru', 'en'] as const

  const staticRoutes = [
    '/',
    '/all-pages',
    '/tor/all-pages',
    '/blog',
    '/tor/blog',
    '/services',
    '/products',
    '/masters',
    '/booking',
    '/contacts',
    '/legal',
    '/privacy-policy',
    '/gift-cards/buy',
    '/tor',
    '/tor/services',
    '/tor/products',
    '/tor/masters',
    '/tor/booking',
    '/tor/contacts',
    '/tor/legal',
    '/tor/privacy-policy',
    '/tor/gift-cards/buy',
  ]

  const routes = new Set<string>()

  const addLocalizedRoute = (route: string) => {
    for (const locale of locales) {
      routes.add(route === '/' ? `/${locale}` : `/${locale}${route}`)
    }
  }

  for (const route of staticRoutes) {
    addLocalizedRoute(route)
  }

  if (apiBase) {
    try {
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
        $fetch<ApiListResponse<SitemapCategory>>(`${apiBase}/categories`, { query: { brand: 'freya' } }),
        $fetch<ApiListResponse<SitemapBlogArticle>>(`${apiBase}/blog`, { query: { brand: 'freya', limit: 100 } }),
        $fetch<ApiListResponse<SitemapService>>(`${apiBase}/services`, { query: { brand: 'freya' } }),
        $fetch<ApiListResponse<SitemapMaster>>(`${apiBase}/masters`, { query: { brand: 'freya' } }),
        $fetch<ApiListResponse<SitemapProductCategory>>(`${apiBase}/product-categories`, { query: { brand: 'freya' } }),
        $fetch<ApiListResponse<SitemapProduct>>(`${apiBase}/products`, { query: { brand: 'freya' } }),
        $fetch<ApiListResponse<SitemapCategory>>(`${apiBase}/categories`, { query: { brand: 'tor' } }),
        $fetch<ApiListResponse<SitemapBlogArticle>>(`${apiBase}/blog`, { query: { brand: 'tor', limit: 100 } }),
        $fetch<ApiListResponse<SitemapService>>(`${apiBase}/services`, { query: { brand: 'tor' } }),
        $fetch<ApiListResponse<SitemapMaster>>(`${apiBase}/masters`, { query: { brand: 'tor' } }),
        $fetch<ApiListResponse<SitemapProductCategory>>(`${apiBase}/product-categories`, { query: { brand: 'tor' } }),
        $fetch<ApiListResponse<SitemapProduct>>(`${apiBase}/products`, { query: { brand: 'tor' } }),
      ])

      const addServiceRoutes = (
        categoriesResponse: ApiListResponse<SitemapCategory>,
        servicesResponse: ApiListResponse<SitemapService>,
        basePath: '/services' | '/tor/services',
      ) => {
        const activeCategories = (categoriesResponse.data || []).filter(category => category.is_active !== false)
        const categorySlugById = new Map<number, string>()

        for (const category of activeCategories) {
          categorySlugById.set(category.id, category.slug)
          addLocalizedRoute(`${basePath}/${category.slug}`)
        }

        for (const service of (servicesResponse.data || []).filter(service => service.is_active !== false)) {
          const categorySlug = categorySlugById.get(service.category_id)
          if (!categorySlug) continue
          addLocalizedRoute(`${basePath}/${categorySlug}/${service.slug}`)
        }
      }

      addServiceRoutes(freyaCategoriesResponse, freyaServicesResponse, '/services')
      addServiceRoutes(torCategoriesResponse, torServicesResponse, '/tor/services')

      for (const article of (freyaBlogArticlesResponse.data || []).filter(article => article.is_published !== false)) {
        addLocalizedRoute(`/blog/${article.slug}`)
      }

      for (const article of (torBlogArticlesResponse.data || []).filter(article => article.is_published !== false)) {
        addLocalizedRoute(`/tor/blog/${article.slug}`)
      }

      for (const master of (freyaMastersResponse.data || []).filter(master => master.is_active !== false && master.slug)) {
        addLocalizedRoute(`/masters/${master.slug}`)
      }

      for (const master of (torMastersResponse.data || []).filter(master => master.is_active !== false && master.slug)) {
        addLocalizedRoute(`/tor/masters/${master.slug}`)
      }

      const addProductRoutes = (
        categoriesResponse: ApiListResponse<SitemapProductCategory>,
        productsResponse: ApiListResponse<SitemapProduct>,
        basePath: '/products' | '/tor/products',
      ) => {
        const activeProductCategories = (categoriesResponse.data || []).filter(category => category.is_active !== false)
        const productCategorySlugById = new Map<number, string>()

        for (const category of activeProductCategories) {
          productCategorySlugById.set(category.id, category.slug)
          addLocalizedRoute(`${basePath}/${category.slug}`)
        }

        for (const product of (productsResponse.data || []).filter(product => product.is_active !== false)) {
          const categorySlug = productCategorySlugById.get(product.category_id)
          if (!categorySlug) continue
          addLocalizedRoute(`${basePath}/${categorySlug}/${product.slug}`)
        }
      }

      addProductRoutes(freyaProductCategoriesResponse, freyaProductsResponse, '/products')
      addProductRoutes(torProductCategoriesResponse, torProductsResponse, '/tor/products')
    }
    catch (error) {
      console.error('Failed to build dynamic sitemap URLs', error)
    }
  }

  const now = new Date().toISOString()
  const stripLocale = (path: string) => path.replace(/^\/(hy|ru|en)(?=\/|$)/, '') || '/'
  const urls = Array.from(routes)
    .sort()
    .map((route) => {
      const priority = /\/(services|masters)\//.test(route) ? '0.9' : route.endsWith('/contacts') || route.endsWith('/privacy-policy') ? '0.7' : '0.8'
      const basePath = stripLocale(route)
      const alternates = locales
        .map(locale => basePath === '/' ? `/${locale}` : `/${locale}${basePath}`)
        .filter(path => routes.has(path))
        .map(path => `\n    <xhtml:link rel="alternate" hreflang="${path.split('/')[1]}" href="${siteUrl}${path}" />`)
        .join('')

      return `\n  <url>\n    <loc>${siteUrl}${route}</loc>${alternates}\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}\n</urlset>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
