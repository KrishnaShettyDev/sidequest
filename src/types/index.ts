export * from './database'

// User with profile
export interface UserWithProfile {
  id: string
  email: string
  role: 'student' | 'employer'
  onboarding_completed: boolean
}

// Gig with employer info
export interface GigWithEmployer {
  id: string
  title: string
  description: string | null
  category: string
  area: string | null
  address: string | null
  pay_min: number | null
  pay_max: number | null
  pay_type: string
  schedule_type: string
  schedule_details: string | null
  duration: string | null
  required_skills: string[]
  perks: string[]
  is_active: boolean
  applications_count: number
  created_at: string
  employer: {
    id: string
    venue_name: string | null
    logo_url: string | null
    cover_photo_url: string | null
    area: string | null
    is_verified: boolean
  }
}

// Application with gig and student info
export interface ApplicationWithDetails {
  id: string
  status: string
  applied_at: string
  gig: {
    id: string
    title: string
    category: string
    employer: {
      venue_name: string | null
      logo_url: string | null
    }
  }
}

// Applicant card data
export interface ApplicantData {
  id: string
  status: string
  applied_at: string
  student: {
    id: string
    first_name: string | null
    last_name: string | null
    photo_url: string | null
    college: string | null
    year: string | null
    bio: string | null
    skills: {
      skill_name: string
      proficiency: string
    }[]
  }
}

// Conversation with latest message
export interface ConversationWithDetails {
  id: string
  last_message_at: string | null
  application_id: string
  other_party: {
    id: string
    name: string
    photo_url: string | null
    role: 'student' | 'employer'
  }
  latest_message?: {
    content: string
    sender_role: string
    is_read: boolean
  }
}

// Availability type
export interface Availability {
  monday?: ('morning' | 'afternoon' | 'evening')[]
  tuesday?: ('morning' | 'afternoon' | 'evening')[]
  wednesday?: ('morning' | 'afternoon' | 'evening')[]
  thursday?: ('morning' | 'afternoon' | 'evening')[]
  friday?: ('morning' | 'afternoon' | 'evening')[]
  saturday?: ('morning' | 'afternoon' | 'evening')[]
  sunday?: ('morning' | 'afternoon' | 'evening')[]
}

// Skill entry form data
export interface SkillFormData {
  skill_name: string
  proficiency: 'learning' | 'good' | 'expert'
  profession_type: 'professional' | 'hobby'
  years_experience: number
  description?: string
  portfolio_url?: string
  tools_software?: string
}

// Filter state for gigs
export interface GigFilters {
  category?: string
  area?: string
  schedule_type?: string
  min_pay?: number
  max_pay?: number
  search?: string
}
