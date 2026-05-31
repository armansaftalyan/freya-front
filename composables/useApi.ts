import { useApiError } from '~/composables/useApiError'

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

type ApiRequestOptions = {
  headers?: Record<string, string>
  query?: Record<string, any>
  body?: BodyInit | Record<string, any>
  signal?: AbortSignal
  credentials?: 'omit' | 'same-origin' | 'include'
  mode?: 'cors' | 'no-cors' | 'same-origin'
  method?: HttpMethod
  skipErrorToast?: boolean
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useState<string | null>('auth_token_state', () => null)
  const tokenCookie = useCookie<string | null>('auth_token', { sameSite: 'lax' })
  const { locale, t } = useLocale()
  const toast = useToast()
  const baseURL = config.public.apiBase

  const request = async <T>(path: string, options: ApiRequestOptions = {}): Promise<T> => {
    const { skipErrorToast = false, ...fetchOptions } = options
    const normalizedQuery = fetchOptions.query
      ? Object.entries(fetchOptions.query).reduce<Record<string, any>>((acc, [key, value]) => {
        if (Array.isArray(value)) {
          acc[`${key}[]`] = value
        }
        else if (value !== undefined) {
          acc[key] = value
        }
        return acc
      }, {})
      : undefined

    const requestQuery = {
      ...(normalizedQuery || {}),
      lang: locale.value || 'hy',
    }

    try {
      if (import.meta.client && !token.value) {
        token.value = tokenCookie.value || window.localStorage.getItem('auth_token')
      }
      else if (!import.meta.client && !token.value) {
        token.value = tokenCookie.value
      }

      const isFormData = typeof FormData !== 'undefined' && fetchOptions.body instanceof FormData
      const response = await $fetch<T>(path, {
        baseURL,
        ...fetchOptions,
        query: requestQuery,
        headers: {
          ...(fetchOptions.headers || {}),
          Accept: 'application/json',
          'Accept-Language': locale.value || 'hy',
          'X-Locale': locale.value || 'hy',
          ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
          ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
        },
      } as any)

      return response as T
    }
    catch (error: any) {
      const parsed = useApiError(error)

      if (!skipErrorToast) {
        toast.push({
          type: 'error',  
          title: t('common.requestFailed'),
          description: parsed.message,
        })
      }

      throw error
    }
  }

  return {
    get: <T>(path: string, params?: Record<string, any>, options: ApiRequestOptions = {}) =>
      request<T>(path, { ...options, method: 'GET', query: params }),
    post: <T>(path: string, body?: Record<string, any>, options: ApiRequestOptions = {}) =>
      request<T>(path, { ...options, method: 'POST', body }),
    patch: <T>(path: string, body?: Record<string, any>, options: ApiRequestOptions = {}) =>
      request<T>(path, { ...options, method: 'PATCH', body }),
    del: <T>(path: string, options: ApiRequestOptions = {}) => request<T>(path, { ...options, method: 'DELETE' }),
  }
}
