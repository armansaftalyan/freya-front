export interface BlogArticleServiceLink {
  id: number
  name: string
  slug: string
  slug_i18n?: Partial<Record<'ru' | 'en' | 'hy', string | null>>
  category_slug: string
  category_slug_i18n?: Partial<Record<'ru' | 'en' | 'hy', string | null>>
  category_name: string
  price_from: number
  price_to: number | null
  duration_minutes: number
}

export interface BlogArticleCategory {
  id: number
  name: string
  slug: string
  slug_i18n?: Partial<Record<'ru' | 'en' | 'hy', string | null>>
}

export interface BlogArticleCard {
  id: number
  brand: 'freya' | 'tor'
  title: string
  slug: string
  slug_i18n?: Partial<Record<'ru' | 'en' | 'hy', string | null>>
  excerpt: string | null
  seo_title: string | null
  seo_description: string | null
  cover_image_url?: string | null
  reading_minutes: number
  published_at: string | null
  category?: BlogArticleCategory | null
  related_services: BlogArticleServiceLink[]
}

export interface BlogArticle extends BlogArticleCard {
  body_html: string | null
  faq_items: Array<{ question: string, answer: string }>
}
