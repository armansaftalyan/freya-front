import type { ApiItemResponse } from '~/types/api'

export interface FaqItem {
  question: string
  answer: string
}

export interface PageContent {
  brand: string
  page_key: string
  faq_eyebrow: string | null
  faq_title: string | null
  faq_lead: string | null
  faq_items: FaqItem[]
}

export type PageContentResponse = ApiItemResponse<PageContent>
