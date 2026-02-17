export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  roles?: string[]
  created_at?: string
}
