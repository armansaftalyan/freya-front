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

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = String(config.public.siteUrl || '').replace(/\/+$/, '')
  const apiBase = String(config.public.apiBase || '').replace(/\/+$/, '')

  const staticRoutes = [
    '/',
    '/tor',
    '/tor/services',
    '/tor/products',
    '/services',
    '/products',
    '/masters',
    '/booking',
    '/contacts',
    '/gift-cards/buy',
    '/legal',
  ]

  const routes = new Set(staticRoutes)

  if (apiBase) {
    try {
      const [categoriesResponse, servicesResponse, mastersResponse, productCategoriesResponse, productsResponse] = await Promise.all([
        $fetch<ApiListResponse<SitemapCategory>>(`${apiBase}/categories`),
        $fetch<ApiListResponse<SitemapService>>(`${apiBase}/services`),
        $fetch<ApiListResponse<SitemapMaster>>(`${apiBase}/masters`),
        $fetch<ApiListResponse<SitemapProductCategory>>(`${apiBase}/product-categories`),
        $fetch<ApiListResponse<SitemapProduct>>(`${apiBase}/products`),
      ])

      const activeCategories = (categoriesResponse.data || []).filter(category => category.is_active !== false)

      for (const category of activeCategories) {
        routes.add(`/services/${category.slug}`)
      }

      const categorySlugById = new Map<number, string>()
      for (const category of activeCategories) {
        categorySlugById.set(category.id, category.slug)
      }

      for (const service of (servicesResponse.data || []).filter(service => service.is_active !== false)) {
        const categorySlug = categorySlugById.get(service.category_id)
        if (!categorySlug) continue
        routes.add(`/services/${categorySlug}/${service.slug}`)
      }

      for (const master of (mastersResponse.data || []).filter(master => master.is_active !== false && master.slug)) {
        routes.add(`/masters/${master.slug}`)
      }

      const activeProductCategories = (productCategoriesResponse.data || []).filter(category => category.is_active !== false)
      const productCategorySlugById = new Map<number, string>()

      for (const category of activeProductCategories) {
        productCategorySlugById.set(category.id, category.slug)
        routes.add(`/products/${category.slug}`)
      }

      for (const product of (productsResponse.data || []).filter(product => product.is_active !== false)) {
        const categorySlug = productCategorySlugById.get(product.category_id)
        if (!categorySlug) continue
        routes.add(`/products/${categorySlug}/${product.slug}`)
      }
    }
    catch (error) {
      console.error('Failed to build dynamic sitemap URLs', error)
    }
  }

  const now = new Date().toISOString()
  const urls = Array.from(routes)
    .sort()
    .map((route) => {
      const priority = route === '/' ? '1.0' : route.startsWith('/services/') || route.startsWith('/masters/') ? '0.9' : '0.8'
      return `\n  <url>\n    <loc>${siteUrl}${route}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}\n</urlset>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
