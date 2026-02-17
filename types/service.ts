export interface Service {
  id: number
  category_id: number
  name: string
  slug: string
  description: string | null
  duration_minutes: number
  price_from: number
  price_to: number | null
  is_active: boolean
}
