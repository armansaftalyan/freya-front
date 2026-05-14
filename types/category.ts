export interface Category {
  id: number
  name: string
  slug: string
  slug_i18n?: Partial<Record<'ru' | 'en' | 'hy', string | null>>
  description: string | null
  seo_title: string | null
  seo_description: string | null
  booking_group: string
  brand: 'freya' | 'tor'
  sort: number
  is_active: boolean
}
