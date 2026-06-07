export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const requestUrl = getRequestURL(event)
  const siteUrl = String(config.public.siteUrl || requestUrl.origin || '').replace(/\/+$/, '')
  const sitemap = await $fetch<string>(`${requestUrl.origin}/sitemap.xml`)
  const urls = Array.from(sitemap.matchAll(/<loc>(.*?)<\/loc>/g), match => match[1])
  const markdownUrls = urls
    .filter(url => !/\/(?:booking|gift-cards\/buy)(?:\/|$)/.test(new URL(url).pathname))
    .filter((url) => {
      const pathname = new URL(url).pathname
      return /^\/(?:hy|ru|en)(?:\/tor)?(?:\/(?:services|products|masters|blog)(?:\/.*)?)?$/.test(pathname)
    })
    .map(url => `- ${siteUrl}/md${new URL(url).pathname.replace(/\/$/, '')}`)

  return markdownResponse([
    '# Freya Beauty Salon and Tor Barbershop: Full AI Index',
    '',
    'Each URL below is a compact Markdown representation of a public canonical page.',
    '',
    ...markdownUrls,
  ].join('\n'))
})
