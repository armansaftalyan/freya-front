export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const requestUrl = getRequestURL(event)
  const apiBase = String(config.public.apiBase || '').replace(/\/+$/, '')
  const siteUrl = String(config.public.siteUrl || requestUrl.origin || '').replace(/\/+$/, '')
  const rawPath = String(event.context.params?.path || '')

  if (!apiBase) {
    throw createError({ statusCode: 503, statusMessage: 'Content API is not configured' })
  }

  try {
    const body = await buildMarkdownPage(apiBase, siteUrl, rawPath)
    if (!body) {
      throw createError({ statusCode: 404, statusMessage: 'Markdown page not found' })
    }

    return markdownResponse(body)
  }
  catch (error: any) {
    if (error?.statusCode) throw error
    throw createError({ statusCode: error?.response?.status || 404, statusMessage: 'Markdown page not found' })
  }
})
