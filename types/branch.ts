export type WorkingHours = Record<string, Array<{ start: string; end: string }>>

export interface Branch {
  id: number
  name: string
  address: string | null
  phone: string | null
  geo_lat: number | null
  geo_lng: number | null
  working_hours: WorkingHours | null
  is_active: boolean
}
