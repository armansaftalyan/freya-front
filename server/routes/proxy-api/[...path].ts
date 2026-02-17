import { getQuery, getRequestHeaders, getRouterParam, proxyRequest } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const path = getRouterParam(event, 'path') || ''
  const apiBase = String(config.public.apiBase || '').replace(/\/$/, '')
  const queryParams = new URLSearchParams()
  const query = getQuery(event)

  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      value.forEach((item) => queryParams.append(key, String(item)))
      continue
    }

    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value))
    }
  }

  const target = `${apiBase}/${path}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const headers = { ...getRequestHeaders(event) }
  delete headers.host

  return proxyRequest(event, target, {
    headers,
  })
})
