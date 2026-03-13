export type GiftCardStatus = 'pending' | 'active' | 'redeemed' | 'expired' | 'blocked' | 'cancelled'

export type GiftCardTransactionType = 'issue' | 'redeem' | 'refund' | 'adjust' | 'expire'

export interface GiftCardTransaction {
  id: number
  type: GiftCardTransactionType
  amount: number
  balance_after: number
  performed_by_user_id: number | null
  booking_order_id: number | null
  appointment_id: number | null
  meta: Record<string, any> | null
  created_at: string
}

export interface GiftCard {
  id: number
  code: string
  qr_token: string
  image_url: string
  owner_user_id: number | null
  gift_card_order_id: number | null
  initial_amount: number
  balance: number
  currency: string
  status: GiftCardStatus
  expires_at: string | null
  activated_at: string | null
  last_used_at: string | null
  meta: Record<string, any> | null
  transactions?: GiftCardTransaction[]
  created_at: string
}
