export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = config.public.siteUrl

  const routes = [
    '/',
    '/services',
    '/masters',
    '/booking',
    '/contacts',
    '/account/login',
    '/account/register',
    '/account/appointments',
  ]

  const now = new Date().toISOString()
  const urls = routes
    .map(
      (route) => `\n  <url>\n    <loc>${siteUrl}${route}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>${route === '/' ? '1.0' : '0.8'}</priority>\n  </url>`,
    )
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}\n</urlset>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
