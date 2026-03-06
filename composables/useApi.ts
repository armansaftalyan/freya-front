import { useApiError } from '~/composables/useApiError'

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

type ApiRequestOptions = {
  headers?: Record<string, string>
  query?: Record<string, any>
  body?: Record<string, any>
  credentials?: 'omit' | 'same-origin' | 'include'
  mode?: 'cors' | 'no-cors' | 'same-origin'
  method?: HttpMethod
  skipErrorToast?: boolean
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('auth_token', {
    sameSite: 'lax',
    secure: false,
  })
  const { locale, t } = useLocale()
  const toast = useToast()
  const baseURL = config.public.apiBase

  const request = async <T>(path: string, options: ApiRequestOptions = {}): Promise<T> => {
    const { skipErrorToast = false, ...fetchOptions } = options

    try {
      const response = await $fetch<T>(path, {
        baseURL,
        ...fetchOptions,
        headers: {
          ...(fetchOptions.headers || {}),
          'Accept-Language': locale.value || 'hy',
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
