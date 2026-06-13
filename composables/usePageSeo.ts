import type { SupportedLocale } from '~/composables/useLocalizedPath'

type SeoInput = {
  title: string | (() => string)
  description: string | (() => string)
  ogTitle?: string | (() => string)
  ogDescription?: string | (() => string)
  twitterTitle?: string | (() => string)
  twitterDescription?: string | (() => string)
  image?: string | (() => string | undefined)
  noindex?: boolean | (() => boolean)
  ogType?: 'website' | 'article' | 'profile'
  localizedPaths?: () => Partial<Record<SupportedLocale, string>>
}

const ogLocaleMap: Record<string, string> = {
  ru: 'ru_RU',
  en: 'en_US',
  hy: 'hy_AM',
}

const normalizeSeoText = (value: string, maxLength: number) => {
  const normalized = value.replace(/\s+/g, ' ').trim()

  if (normalized.length <= maxLength) {
    return normalized
  }

  const sliced = normalized.slice(0, maxLength + 1)
  const lastSpace = sliced.lastIndexOf(' ')

  return (lastSpace > Math.floor(maxLength * 0.6) ? sliced.slice(0, lastSpace) : normalized.slice(0, maxLength)).trim()
}

export const usePageSeo = (input: SeoInput) => {
  const { defaultImageUrl } = useSiteMeta()
  const route = useRoute()
  const { locale } = useLocale()
  const { canonicalUrl } = useLocalizedSeo(() => input.localizedPaths ? input.localizedPaths() : route.path)

  const imageUrl = computed(() => {
    const value = typeof input.image === 'function' ? input.image() : input.image
    return value || defaultImageUrl.value
  })
  const noindex = computed(() => typeof input.noindex === 'function' ? input.noindex() : Boolean(input.noindex))
  const ogType = computed(() => input.ogType || 'website')
  const title = computed(() => normalizeSeoText(typeof input.title === 'function' ? input.title() : input.title, 60))
  const description = computed(() => normalizeSeoText(typeof input.description === 'function' ? input.description() : input.description, 160))
  const ogTitle = computed(() => input.ogTitle
    ? normalizeSeoText(typeof input.ogTitle === 'function' ? input.ogTitle() : input.ogTitle, 60)
    : title.value)
  const ogDescription = computed(() => input.ogDescription
    ? normalizeSeoText(typeof input.ogDescription === 'function' ? input.ogDescription() : input.ogDescription, 160)
    : description.value)
  const twitterTitle = computed(() => input.twitterTitle
    ? normalizeSeoText(typeof input.twitterTitle === 'function' ? input.twitterTitle() : input.twitterTitle, 60)
    : ogTitle.value)
  const twitterDescription = computed(() => input.twitterDescription
    ? normalizeSeoText(typeof input.twitterDescription === 'function' ? input.twitterDescription() : input.twitterDescription, 160)
    : ogDescription.value)
  const ogLocale = computed(() => ogLocaleMap[locale.value] || ogLocaleMap.hy)
  const ogLocaleAlternate = computed(() => Object.values(ogLocaleMap).filter(value => value !== ogLocale.value))

  useSeoMeta({
    title: () => title.value,
    description: () => description.value,
    ogTitle: () => ogTitle.value,
    ogDescription: () => ogDescription.value,
    ogType: () => ogType.value,
    ogUrl: () => canonicalUrl.value,
    ogLocale: () => ogLocale.value,
    ogLocaleAlternate: () => ogLocaleAlternate.value,
    ogImage: () => imageUrl.value,
    twitterCard: 'summary_large_image',
    twitterTitle: () => twitterTitle.value,
    twitterDescription: () => twitterDescription.value,
    twitterImage: () => imageUrl.value,
    robots: () => noindex.value
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  })
}
