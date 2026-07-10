type IpAccessResponse = {
  blocked: boolean
}

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  if (
    path.startsWith('/_nuxt/')
    || path === '/favicon.ico'
    || path === '/admin'
    || path.startsWith('/admin/')
  ) {
    return
  }

  const ipAddress = getRequestIP(event, { xForwardedFor: true })

  if (!ipAddress) {
    return
  }

  const config = useRuntimeConfig(event)
  const apiBase = String(config.public.apiBase || '').replace(/\/+$/, '')

  if (!apiBase) {
    return
  }

  let response: IpAccessResponse

  try {
    response = await $fetch<IpAccessResponse>(`${apiBase}/ip-access/check`, {
      method: 'POST',
      body: { ip: ipAddress },
      timeout: 2000,
    })
  }
  catch {
    // A temporary API failure must not make the public website unavailable.
    return
  }

  if (response.blocked) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied',
      message: 'Доступ с этого IP-адреса заблокирован.',
    })
  }
})
