export interface ProductCategory {
  id: number
  name: string
  slug: string
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
  }
  name: string
  slug: string
  description: string | null
  seo_title: string | null
  seo_description: string | null
  brand: string | null
  sku: string | null
  image_url: string | null
  gallery: any[]
  volume_label: string | null
  price: number
  compare_at_price: number | null
  stock_qty: number | null
  is_active: boolean
}

export interface ProductOrder {
  id: number
  status: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  delivery_type: 'pickup' | 'courier'
  city: string | null
  address_line: string | null
  comment: string | null
  items_count: number
  subtotal_price: number
  delivery_fee: number
  total_price: number
  items?: ProductOrderItem[]
  created_at: string
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
