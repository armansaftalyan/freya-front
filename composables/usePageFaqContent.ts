export const usePageFaqContent = async (brand: 'freya' | 'tor', pageKey: 'home' | 'contacts' | 'masters' | 'privacy-policy' | 'services' | 'booking') => {
  const fallbackFaqCopy = useBrandFaqFallback(brand, pageKey)
  const { pageContent } = await usePageContent(brand, pageKey)

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
    pageContent,
    faqCopy,
  }
}
