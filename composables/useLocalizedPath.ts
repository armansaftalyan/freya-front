export const supportedLocales = ['ru', 'en', 'hy'] as const
export type SupportedLocale = typeof supportedLocales[number]
export const defaultLocale: SupportedLocale = 'hy'

export const normalizeLocale = (value: unknown): SupportedLocale => {
  return typeof value === 'string' && supportedLocales.includes(value as SupportedLocale)
    ? value as SupportedLocale
    : defaultLocale
}

export const extractLocaleFromPath = (path: string): SupportedLocale | null => {
  const match = path.match(/^\/(ru|en|hy)(?=\/|$)/)
  return match ? normalizeLocale(match[1]) : null
}

export const stripLocalePrefix = (path: string): string => {
  const stripped = path.replace(/^\/(ru|en|hy)(?=\/|$)/, '')
  return stripped === '' ? '/' : stripped
}

export const withLocalePath = (path: string, locale: SupportedLocale): string => {
  const normalizedPath = stripLocalePrefix(path || '/')
  return normalizedPath === '/' ? `/${locale}` : `/${locale}${normalizedPath}`
}

export const useLocalizedPath = () => {
  const config = useRuntimeConfig()
  const { locale } = useLocale()
  const nativeApp = config.public.nativeApp === true || config.public.nativeApp === 'true'

  const localePath = (
    target: string | { path?: string, query?: Record<string, any>, hash?: string },
    localeOverride?: SupportedLocale,
  ) => {
    const targetLocale = localeOverride || normalizeLocale(locale.value)

    if (typeof target === 'string') {
      if (/^(https?:)?\/\//.test(target) || target.startsWith('#')) {
        return target
      }

      if (nativeApp) {
        return stripLocalePrefix(target)
      }

      return withLocalePath(target, targetLocale)
    }

    const path = target.path || '/'

    if (nativeApp) {
      return {
        ...target,
        path: stripLocalePrefix(path),
      }
    }

    return {
      ...target,
      path: withLocalePath(path, targetLocale),
    }
  }

  return {
    localePath,
  }
}
