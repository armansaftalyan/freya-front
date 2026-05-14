import { defaultLocale, stripLocalePrefix, supportedLocales, withLocalePath, type SupportedLocale } from '~/composables/useLocalizedPath'

type LocalizedPathMap = Partial<Record<SupportedLocale, string>>
type LocalizedSeoPath = string | LocalizedPathMap

const resolveLocalizedSeoPath = (path: LocalizedSeoPath, targetLocale: SupportedLocale) => {
  if (typeof path === 'string') {
    return path
  }

  return path[targetLocale] || path[defaultLocale] || '/'
}

export const useLocalizedSeo = (path?: MaybeRefOrGetter<LocalizedSeoPath>) => {
  const route = useRoute()
  const { locale } = useLocale()
  const { siteUrl } = useSiteMeta()

  const canonicalLocale = computed(() => locale.value || defaultLocale)
  const rawPath = computed<LocalizedSeoPath>(() => path ? toValue(path) : route.path)
  const normalizedPath = computed(() => stripLocalePrefix(resolveLocalizedSeoPath(rawPath.value, canonicalLocale.value as SupportedLocale) || '/'))
  const canonicalUrl = computed(() => `${siteUrl.value}${withLocalePath(normalizedPath.value, canonicalLocale.value as SupportedLocale)}`)
  const alternates = computed(() =>
    supportedLocales.map((targetLocale) => ({
      locale: targetLocale,
      href: `${siteUrl.value}${withLocalePath(stripLocalePrefix(resolveLocalizedSeoPath(rawPath.value, targetLocale) || '/'), targetLocale)}`,
    })),
  )

  useHead(() => ({
    link: [
      {
        rel: 'canonical',
        href: canonicalUrl.value,
      },
      ...alternates.value.map((item) => ({
        rel: 'alternate',
        hreflang: item.locale,
        href: item.href,
      })),
      {
        rel: 'alternate',
        hreflang: 'x-default',
        href: `${siteUrl.value}${withLocalePath(stripLocalePrefix(resolveLocalizedSeoPath(rawPath.value, defaultLocale as SupportedLocale) || '/'), defaultLocale as SupportedLocale)}`,
      },
    ],
  }))

  return {
    canonicalUrl,
    alternates,
  }
}
