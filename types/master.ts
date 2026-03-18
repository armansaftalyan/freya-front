export interface MasterService {
  id: number
  category_id: number
  category_name: string | null
  name: string
  duration_minutes: number
  price: number
}

export interface MasterCertificate {
  title: string
  issuer: string
  year: number
  image: string | null
}

export interface Master {
  id: number
  user_id: number
  name: string
  slug: string | null
  bio: string | null
  avatar: string | null
  experience_years: number | null
  specialties: string[]
  languages: string[]
  certificates: MasterCertificate[]
  portfolio: string[]
  instagram: string | null
  services?: MasterService[]
  is_active: boolean
  sort: number
}
