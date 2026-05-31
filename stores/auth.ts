import type { ApiItemResponse } from '~/types/api'
import type { AuthResponse, LoginPayload, RegisterPayload } from '~/types/auth'
import type { User } from '~/types/user'

export const useAuthStore = defineStore('authStore', () => {
  const token = useState<string | null>('auth_token_state', () => null)
  const user = ref<User | null>(null)
  const loading = ref(false)
  let fetchMePromise: Promise<void> | null = null
  const storageKey = 'auth_token'
  const tokenCookie = useCookie<string | null>('auth_token', {
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  })

  const persistToken = (value: string | null) => {
    tokenCookie.value = value

    if (!import.meta.client) return
    if (value) {
      window.localStorage.setItem(storageKey, value)
    }
    else {
      window.localStorage.removeItem(storageKey)
    }
  }

  const migrateLegacyCookieToken = () => {
    if (!import.meta.client || token.value) return

    if (!tokenCookie.value) return

    token.value = tokenCookie.value
    persistToken(tokenCookie.value)
  }

  const hydrateToken = () => {
    if (token.value) return

    if (tokenCookie.value) {
      token.value = tokenCookie.value
      if (import.meta.client) {
        persistToken(tokenCookie.value)
      }
      return
    }

    if (!import.meta.client) return

    const storedToken = window.localStorage.getItem(storageKey)
    if (storedToken) {
      token.value = storedToken
      persistToken(storedToken)
      return
    }

    migrateLegacyCookieToken()
  }

  const isAuth = computed(() => Boolean(token.value && user.value))

  const normalizeBirthDate = (value?: string | null) => {
    if (!value) return null
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value

    const match = String(value).match(/^(\d{4}-\d{2}-\d{2})/)
    return match ? match[1] : value
  }

  const normalizeUser = (payload: User): User => ({
    ...payload,
    name: payload.name || `${payload.first_name || ''} ${payload.last_name || ''}`.trim(),
    birth_date: normalizeBirthDate(payload.birth_date),
  })

  const setAuth = (payload: AuthResponse) => {
    token.value = payload.token
    persistToken(payload.token)
    user.value = normalizeUser(payload.user)
  }

  const setUser = (payload: User) => {
    user.value = normalizeUser(payload)
  }

  const clearAuth = () => {
    token.value = null
    persistToken(null)
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
    hydrateToken()
    if (!token.value) return
    if (!force && user.value) return
    if (fetchMePromise) {
      await fetchMePromise
      return
    }

    fetchMePromise = (async () => {
      try {
        const response = await api.get<ApiItemResponse<User>>('/auth/me')
        user.value = normalizeUser(response.data)
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
    hydrateToken,
    login,
    register,
    fetchMe,
    logout,
    setUser,
    clearAuth,
  }
})
