export type ClientBalanceTransactionType = 'appointment_reward' | 'appointment_payment' | 'manual_credit' | 'manual_debit'

export interface ClientBalanceTransaction {
  id: number
  type: ClientBalanceTransactionType
  amount: number
  balance_after: number
  appointment_id: number | null
  comment: string | null
  created_at: string
}
