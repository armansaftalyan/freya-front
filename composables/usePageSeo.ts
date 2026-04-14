type SeoInput = {
  title: string | (() => string)
  description: string | (() => string)
  ogTitle?: string | (() => string)
  ogDescription?: string | (() => string)
  twitterTitle?: string | (() => string)
  twitterDescription?: string | (() => string)
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
  const title = computed(() => typeof input.title === 'function' ? input.title() : input.title)
  const description = computed(() => typeof input.description === 'function' ? input.description() : input.description)
  const ogTitle = computed(() => input.ogTitle
    ? (typeof input.ogTitle === 'function' ? input.ogTitle() : input.ogTitle)
    : title.value)
  const ogDescription = computed(() => input.ogDescription
    ? (typeof input.ogDescription === 'function' ? input.ogDescription() : input.ogDescription)
    : description.value)
  const twitterTitle = computed(() => input.twitterTitle
    ? (typeof input.twitterTitle === 'function' ? input.twitterTitle() : input.twitterTitle)
    : ogTitle.value)
  const twitterDescription = computed(() => input.twitterDescription
    ? (typeof input.twitterDescription === 'function' ? input.twitterDescription() : input.twitterDescription)
    : ogDescription.value)

  useSeoMeta({
    title: () => title.value,
    description: () => description.value,
    ogTitle: () => ogTitle.value,
    ogDescription: () => ogDescription.value,
    ogType: 'website',
    ogUrl: () => canonicalUrl.value,
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
