export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'student' | 'employer'
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role: 'student' | 'employer'
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'student' | 'employer'
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      student_profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          email: string | null
          phone: string | null
          phone_verified: boolean
          birth_date: string | null
          gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          photo_url: string | null
          bio: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          address_line: string | null
          city: string | null
          state: string | null
          country: string
          pincode: string | null
          college: string | null
          year: '1st' | '2nd' | '3rd' | '4th' | 'Graduate' | null
          resume_url: string | null
          profile_completion_percent: number
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          phone_verified?: boolean
          birth_date?: string | null
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          photo_url?: string | null
          bio?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          address_line?: string | null
          city?: string | null
          state?: string | null
          country?: string
          pincode?: string | null
          college?: string | null
          year?: '1st' | '2nd' | '3rd' | '4th' | 'Graduate' | null
          resume_url?: string | null
          profile_completion_percent?: number
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          phone_verified?: boolean
          birth_date?: string | null
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          photo_url?: string | null
          bio?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          address_line?: string | null
          city?: string | null
          state?: string | null
          country?: string
          pincode?: string | null
          college?: string | null
          year?: '1st' | '2nd' | '3rd' | '4th' | 'Graduate' | null
          resume_url?: string | null
          profile_completion_percent?: number
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      student_skills: {
        Row: {
          id: string
          student_id: string
          skill_name: string
          proficiency: 'learning' | 'good' | 'expert'
          profession_type: 'professional' | 'hobby'
          years_experience: number
          description: string | null
          portfolio_url: string | null
          tools_software: string | null
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          skill_name: string
          proficiency: 'learning' | 'good' | 'expert'
          profession_type: 'professional' | 'hobby'
          years_experience?: number
          description?: string | null
          portfolio_url?: string | null
          tools_software?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          skill_name?: string
          proficiency?: 'learning' | 'good' | 'expert'
          profession_type?: 'professional' | 'hobby'
          years_experience?: number
          description?: string | null
          portfolio_url?: string | null
          tools_software?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      student_preferences: {
        Row: {
          id: string
          student_id: string
          availability: Json
          preferred_categories: string[]
          preferred_areas: string[]
          preferred_schedule_type: 'weekends' | 'evenings' | 'flexible' | 'any' | null
          min_pay_expectation: number | null
          max_commute_distance: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          availability?: Json
          preferred_categories?: string[]
          preferred_areas?: string[]
          preferred_schedule_type?: 'weekends' | 'evenings' | 'flexible' | 'any' | null
          min_pay_expectation?: number | null
          max_commute_distance?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          availability?: Json
          preferred_categories?: string[]
          preferred_areas?: string[]
          preferred_schedule_type?: 'weekends' | 'evenings' | 'flexible' | 'any' | null
          min_pay_expectation?: number | null
          max_commute_distance?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      employer_profiles: {
        Row: {
          id: string
          venue_name: string | null
          email: string | null
          phone: string | null
          category: 'cafe' | 'gym' | 'bookstore' | 'coworking' | 'retail' | 'events' | 'restaurant' | 'other' | null
          description: string | null
          logo_url: string | null
          cover_photo_url: string | null
          venue_photos: string[]
          address: string | null
          area: string | null
          city: string
          google_maps_url: string | null
          website_url: string | null
          instagram_url: string | null
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          venue_name?: string | null
          email?: string | null
          phone?: string | null
          category?: 'cafe' | 'gym' | 'bookstore' | 'coworking' | 'retail' | 'events' | 'restaurant' | 'other' | null
          description?: string | null
          logo_url?: string | null
          cover_photo_url?: string | null
          venue_photos?: string[]
          address?: string | null
          area?: string | null
          city?: string
          google_maps_url?: string | null
          website_url?: string | null
          instagram_url?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          venue_name?: string | null
          email?: string | null
          phone?: string | null
          category?: 'cafe' | 'gym' | 'bookstore' | 'coworking' | 'retail' | 'events' | 'restaurant' | 'other' | null
          description?: string | null
          logo_url?: string | null
          cover_photo_url?: string | null
          venue_photos?: string[]
          address?: string | null
          area?: string | null
          city?: string
          google_maps_url?: string | null
          website_url?: string | null
          instagram_url?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      gigs: {
        Row: {
          id: string
          employer_id: string
          title: string
          description: string | null
          category: 'cafe' | 'gym' | 'bookstore' | 'coworking' | 'retail' | 'events' | 'restaurant' | 'other'
          area: string | null
          address: string | null
          pay_min: number | null
          pay_max: number | null
          pay_type: 'hourly' | 'daily' | 'monthly' | 'stipend'
          schedule_type: 'weekends' | 'evenings' | 'flexible' | 'fullday'
          schedule_details: string | null
          duration: string | null
          required_skills: string[]
          requirements: string[]
          perks: string[]
          is_active: boolean
          applications_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employer_id: string
          title: string
          description?: string | null
          category: 'cafe' | 'gym' | 'bookstore' | 'coworking' | 'retail' | 'events' | 'restaurant' | 'other'
          area?: string | null
          address?: string | null
          pay_min?: number | null
          pay_max?: number | null
          pay_type?: 'hourly' | 'daily' | 'monthly' | 'stipend'
          schedule_type?: 'weekends' | 'evenings' | 'flexible' | 'fullday'
          schedule_details?: string | null
          duration?: string | null
          required_skills?: string[]
          requirements?: string[]
          perks?: string[]
          is_active?: boolean
          applications_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employer_id?: string
          title?: string
          description?: string | null
          category?: 'cafe' | 'gym' | 'bookstore' | 'coworking' | 'retail' | 'events' | 'restaurant' | 'other'
          area?: string | null
          address?: string | null
          pay_min?: number | null
          pay_max?: number | null
          pay_type?: 'hourly' | 'daily' | 'monthly' | 'stipend'
          schedule_type?: 'weekends' | 'evenings' | 'flexible' | 'fullday'
          schedule_details?: string | null
          duration?: string | null
          required_skills?: string[]
          requirements?: string[]
          perks?: string[]
          is_active?: boolean
          applications_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          gig_id: string
          student_id: string
          employer_id: string
          status: 'pending' | 'viewed' | 'shortlisted' | 'accepted' | 'rejected' | 'expired'
          employer_notes: string | null
          applied_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          gig_id: string
          student_id: string
          employer_id: string
          status?: 'pending' | 'viewed' | 'shortlisted' | 'accepted' | 'rejected' | 'expired'
          employer_notes?: string | null
          applied_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          gig_id?: string
          student_id?: string
          employer_id?: string
          status?: 'pending' | 'viewed' | 'shortlisted' | 'accepted' | 'rejected' | 'expired'
          employer_notes?: string | null
          applied_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          application_id: string
          student_id: string
          employer_id: string
          last_message_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          application_id: string
          student_id: string
          employer_id: string
          last_message_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          student_id?: string
          employer_id?: string
          last_message_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          sender_role: 'student' | 'employer'
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          sender_role: 'student' | 'employer'
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          sender_role?: 'student' | 'employer'
          content?: string
          is_read?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Convenience types
export type Profile = Tables<'profiles'>
export type StudentProfile = Tables<'student_profiles'>
export type StudentSkill = Tables<'student_skills'>
export type StudentPreferences = Tables<'student_preferences'>
export type EmployerProfile = Tables<'employer_profiles'>
export type Gig = Tables<'gigs'>
export type Application = Tables<'applications'>
export type Conversation = Tables<'conversations'>
export type Message = Tables<'messages'>
