import type { Branch } from './branch'
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
  master: Master
  branch: Branch
  client?: User
  created_at: string
}
