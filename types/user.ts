export interface User {
  id: number
  name: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  gender?: 'female' | 'male' | null
  birth_date?: string | null
  client_balance?: number
  roles?: string[]
  created_at?: string
}
