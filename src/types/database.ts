import type { CategoryKey } from '@/content/categories'

export type Visibility = 'private' | 'public'
export type IdentificationStatus = 'pending' | 'suggested' | 'confirmed'

export interface Profile {
  id: string
  username: string
  full_name: string
  avatar_url: string | null
  bio: string | null
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface ObservationSummary {
  id: string
  title: string
  category: CategoryKey
  species_guess: string | null
  observation_date: string | null
  visibility: Visibility
  is_draft: boolean
  identification_status: IdentificationStatus
  created_at: string
  updated_at: string
  species: { common_name: string; scientific_name: string } | null
}

export interface MyStats {
  observations: number
  species: number
  photos: number
  drafts: number
}
