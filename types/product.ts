export interface ProductCategory {
  id: number
  name: string
  slug: string
  slug_i18n?: Partial<Record<'ru' | 'en' | 'hy', string | null>>
  description: string | null
  seo_title: string | null
  seo_description: string | null
  brand: 'freya' | 'tor'
  sort: number
  is_active: boolean
}

export interface Product {
  id: number
  category_id: number
  category?: {
    id: number
    name: string
    slug: string
    slug_i18n?: Partial<Record<'ru' | 'en' | 'hy', string | null>>
  }
  name: string
  slug: string
  slug_i18n?: Partial<Record<'ru' | 'en' | 'hy', string | null>>
  description: string | null
  seo_title: string | null
  seo_description: string | null
  brand: string | null
  line_brand: string | null
  sku: string | null
  image_url: string | null
  gallery: any[]
  volume_label: string | null
  ingredients: string | null
  usage: string | null
  price: number
  compare_at_price: number | null
  stock_qty: number | null
  is_active: boolean
}

export interface ProductOrder {
  id: number
  status: string
  customer_user_id: number | null
  customer_name: string
  customer_first_name?: string
  customer_last_name?: string
  customer_phone: string
  customer_email: string | null
  delivery_type: 'pickup' | 'courier'
  payment_provider: 'idram' | 'bank_card'
  provider_payment_id: string | null
  city: string | null
  address_line: string | null
  comment: string | null
  items_count: number
  subtotal_price: number
  delivery_fee: number
  total_price: number
  referral_base?: number
  referral_percent?: number
  referral_payout?: number
  paid_at: string | null
  payment_token?: string | null
  items?: ProductOrderItem[]
  created_at: string
}

export interface ProductOrderPayment {
  status: 'pending' | 'redirect' | 'failed' | 'paid'
  message: string
  payload?: {
    action: string
    method?: 'GET' | 'POST'
    fields: Record<string, string | number | null | undefined>
  } | null
}

export interface ProductOrderQuote {
  items_count: number
  subtotal_price: number
  delivery_fee: number
  total_price: number
}

export interface ProductOrderItem {
  id: number
  product_id: number
  quantity: number
  unit_price: number
  total_price: number
  product?: Product
}

export interface CartItem {
  product: Product
  quantity: number
}
