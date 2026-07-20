export interface User {
  id: number
  name: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  avatar?: string | null
  gender?: 'female' | 'male' | null
  birth_date?: string | null
  client_balance?: number
  roles?: string[]
  referral_code?: string | null
  referral_commission_percent?: number
  referral_balance?: number
  product_referral_percent?: number
  gift_card_referral_percent?: number
  referral_expires_at?: string | null
  created_at?: string
}
