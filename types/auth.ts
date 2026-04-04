import type { User } from './user'

export interface LoginPayload {
  login: string
  password: string
}

export interface RegisterPayload {
  first_name: string
  last_name: string
  email: string
  phone?: string
  gender?: 'female' | 'male'
  birth_date?: string
  password: string
  password_confirmation: string
}

export interface AuthResponse {
  token: string
  user: User
}
