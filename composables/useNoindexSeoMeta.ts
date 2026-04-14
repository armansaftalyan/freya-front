type NoindexSeoInput = {
  title: string | (() => string)
  description: string | (() => string)
  image?: string | (() => string | undefined)
}

export const useNoindexSeoMeta = (input: NoindexSeoInput) => {
  const route = useRoute()
  const { canonicalUrl } = useLocalizedSeo(() => route.path)
  const { defaultImageUrl } = useSiteMeta()

  const title = computed(() => typeof input.title === 'function' ? input.title() : input.title)
  const description = computed(() => typeof input.description === 'function' ? input.description() : input.description)
  const image = computed(() => {
    const value = typeof input.image === 'function' ? input.image() : input.image
    return value || defaultImageUrl.value
  })

  useSeoMeta({
    title: () => title.value,
    description: () => description.value,
    ogTitle: () => title.value,
    ogDescription: () => description.value,
    ogType: 'website',
    ogUrl: () => canonicalUrl.value,
    ogImage: () => image.value,
    twitterCard: 'summary_large_image',
    twitterTitle: () => title.value,
    twitterDescription: () => description.value,
    twitterImage: () => image.value,
    robots: 'noindex, nofollow',
  })
}
