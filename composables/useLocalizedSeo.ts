import { defaultLocale, stripLocalePrefix, supportedLocales, withLocalePath, type SupportedLocale } from '~/composables/useLocalizedPath'

export const useLocalizedSeo = (path?: MaybeRefOrGetter<string>) => {
  const route = useRoute()
  const { locale } = useLocale()
  const { siteUrl } = useSiteMeta()

  const normalizedPath = computed(() => {
    const rawPath = path ? toValue(path) : route.path
    return stripLocalePrefix(rawPath || '/')
  })

  const canonicalLocale = computed(() => locale.value || defaultLocale)
  const canonicalUrl = computed(() => `${siteUrl.value}${withLocalePath(normalizedPath.value, canonicalLocale.value as SupportedLocale)}`)
  const alternates = computed(() =>
    supportedLocales.map((locale) => ({
      locale,
      href: `${siteUrl.value}${withLocalePath(normalizedPath.value, locale)}`,
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
        href: `${siteUrl.value}${withLocalePath(normalizedPath.value, defaultLocale as SupportedLocale)}`,
      },
    ],
  }))

  return {
    canonicalUrl,
    alternates,
  }
}
