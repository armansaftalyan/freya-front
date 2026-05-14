import { supportedLocales, type SupportedLocale } from '~/composables/useLocalizedPath'

export type LocalizedSlugMap = Partial<Record<SupportedLocale, string | null>>

export type LocalizedSlugEntity = {
  slug: string
  slug_i18n?: LocalizedSlugMap | null
}

const urlSafeSlug = (value: string) => value.trim().replace(/\s+/g, '-')

export const localizedSlugFor = (entity: LocalizedSlugEntity | null | undefined, locale: SupportedLocale): string => {
  if (!entity) {
    return ''
  }

  const localized = entity.slug_i18n?.[locale]
  return urlSafeSlug(typeof localized === 'string' && localized.trim() !== '' ? localized : entity.slug)
}

export const slugMatches = (entity: LocalizedSlugEntity, slug: string): boolean => {
  const normalizedSlug = slug.trim()

  if (entity.slug === normalizedSlug || urlSafeSlug(entity.slug) === normalizedSlug) {
    return true
  }

  return supportedLocales.some((locale) => {
    const localized = entity.slug_i18n?.[locale]
    const rawSlug = typeof localized === 'string' && localized.trim() !== '' ? localized.trim() : entity.slug

    return rawSlug === normalizedSlug || urlSafeSlug(rawSlug) === normalizedSlug
  })
}
