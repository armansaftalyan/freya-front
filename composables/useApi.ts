import type { FetchOptions } from 'ofetch'
import { useApiError } from '~/composables/useApiError'

type ApiRequestOptions = FetchOptions<'json'> & {
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
    try {
      return await $fetch<T>(path, {
        baseURL,
        ...options,
        headers: {
          ...(options.headers || {}),
          'Accept-Language': locale.value || 'hy',
          ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
        },
      })
    }
    catch (error: any) {
      const parsed = useApiError(error)

      if (!options.skipErrorToast) {
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
