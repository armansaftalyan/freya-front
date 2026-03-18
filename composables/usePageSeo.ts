type SeoInput = {
  title: string | (() => string)
  description: string | (() => string)
  image?: string | (() => string | undefined)
  noindex?: boolean | (() => boolean)
}

export const usePageSeo = (input: SeoInput) => {
  const { defaultImageUrl } = useSiteMeta()
  const route = useRoute()
  const { canonicalUrl } = useLocalizedSeo(() => route.path)

  const imageUrl = computed(() => {
    const value = typeof input.image === 'function' ? input.image() : input.image
    return value || defaultImageUrl.value
  })
  const noindex = computed(() => typeof input.noindex === 'function' ? input.noindex() : Boolean(input.noindex))

  useSeoMeta({
    title: () => typeof input.title === 'function' ? input.title() : input.title,
    description: () => typeof input.description === 'function' ? input.description() : input.description,
    ogTitle: () => typeof input.title === 'function' ? input.title() : input.title,
    ogDescription: () => typeof input.description === 'function' ? input.description() : input.description,
    ogType: 'website',
    ogUrl: () => canonicalUrl.value,
    ogImage: () => imageUrl.value,
    twitterCard: 'summary_large_image',
    twitterTitle: () => typeof input.title === 'function' ? input.title() : input.title,
    twitterDescription: () => typeof input.description === 'function' ? input.description() : input.description,
    twitterImage: () => imageUrl.value,
    robots: () => noindex.value
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  })
}
