import type { PageContentResponse } from '~/types/page-content'

export const usePageContent = async (brand: 'freya' | 'tor', pageKey: 'home' | 'contacts' | 'masters' | 'privacy-policy' | 'services' | 'booking') => {
  const api = useApi()
  const { locale } = useLocale()

  const { data: pageContent } = await useAsyncData<PageContentResponse | false>(() => `${brand}-${pageKey}-content-${locale.value}`, async () => {
    try {
      const response = await api.get<PageContentResponse>(`/page-content/${pageKey}`, { brand }, { skipErrorToast: true })
      return response.data
    }
    catch {
      return false
    }
  })

  return {
    pageContent,
  }
}
