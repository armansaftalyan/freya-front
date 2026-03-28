import type { PageContentResponse } from '~/types/page-content'

export const usePageFaqContent = (brand: 'freya' | 'tor', pageKey: 'home' | 'contacts' | 'masters' | 'privacy-policy' | 'services' | 'booking') => {
  const api = useApi()
  const { locale } = useLocale()
  const fallbackFaqCopy = useBrandFaqFallback(brand, pageKey)

  const { data: pageContent } = useAsyncData(() => `${brand}-${pageKey}-faq-${locale.value}`, async () => {
    try {
      const response = await api.get<PageContentResponse>(`/page-content/${pageKey}`, { brand }, { skipErrorToast: true })
      return response.data
    }
    catch {
      return null
    }
  })

  const faqCopy = computed(() => {
    const fallback = fallbackFaqCopy.value
    const content = pageContent.value

    if (!content || content.faq_items.length === 0) {
      return fallback
    }

    return {
      eyebrow: content.faq_eyebrow || fallback.eyebrow,
      title: content.faq_title || fallback.title,
      lead: content.faq_lead || fallback.lead,
      items: content.faq_items,
    }
  })

  return {
    faqCopy,
  }
}
