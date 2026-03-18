import type { ApiItemResponse } from '~/types/api'
import type { AuthResponse, LoginPayload, RegisterPayload } from '~/types/auth'
import type { User } from '~/types/user'

export const useAuthStore = defineStore('authStore', () => {
  const token = useCookie<string | null>('auth_token', { sameSite: 'lax', secure: false })
  const user = ref<User | null>(null)
  const loading = ref(false)
  let fetchMePromise: Promise<void> | null = null

  const isAuth = computed(() => Boolean(token.value && user.value))

  const setAuth = (payload: AuthResponse) => {
    token.value = payload.token
    user.value = payload.user
  }

  const clearAuth = () => {
    token.value = null
    user.value = null
  }

  const api = useApi()
  const { t } = useLocale()
  const { localePath } = useLocalizedPath()
  const { authLoginPath } = useBrandContext()

  const login = async (payload: LoginPayload) => {
    loading.value = true
    try {
      const response = await api.post<AuthResponse>('/auth/login', payload, { skipErrorToast: true })
      if (!response?.token || !response?.user) {
        throw new Error(t('common.unexpectedError'))
      }
      setAuth(response)
      useToast().push({ type: 'success', title: t('common.welcomeBack') })
    }
    finally {
      loading.value = false
    }
  }

  const register = async (payload: RegisterPayload) => {
    loading.value = true
    try {
      const response = await api.post<AuthResponse>('/auth/register', payload, { skipErrorToast: true })
      if (!response?.token || !response?.user) {
        throw new Error(t('common.unexpectedError'))
      }
      setAuth(response)
      useToast().push({ type: 'success', title: t('common.accountCreated') })
    }
    finally {
      loading.value = false
    }
  }

  const fetchMe = async (force = false) => {
    if (!token.value) return
    if (!force && user.value) return
    if (fetchMePromise) {
      await fetchMePromise
      return
    }

    fetchMePromise = (async () => {
      try {
        const response = await api.get<ApiItemResponse<User>>('/auth/me')
        user.value = response.data
      }
      catch {
        clearAuth()
      }
    })()

    try {
      await fetchMePromise
    } finally {
      fetchMePromise = null
    }
  }

  const logout = async () => {
    if (token.value) {
      try {
        await api.post<{ message: string }>('/auth/logout')
      }
      catch {
        // noop
      }
    }

    clearAuth()
    useToast().push({ type: 'info', title: t('common.signedOut') })
    await navigateTo(localePath(authLoginPath.value))
  }

  return {
    user,
    token,
    loading,
    isAuth,
    login,
    register,
    fetchMe,
    logout,
    clearAuth,
  }
})
