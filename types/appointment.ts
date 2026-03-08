import type { Master } from './master'
import type { Service } from './service'
import type { User } from './user'

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'done'

export interface Appointment {
  id: number
  status: AppointmentStatus
  source: string
  comment: string | null
  start_at: string
  end_at: string
  service: Service
  services?: Array<{
    id: number
    category_id: number
    name: string
    duration_minutes: number
    price: number
    sort_order: number
  }>
  master: Master
  client?: User
  created_at: string
}
