-- SideQuest Database Schema
-- Run this in your Supabase SQL Editor

-- Use gen_random_uuid() which is built into PostgreSQL 13+

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('student', 'employer')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STUDENT PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  phone_verified BOOLEAN DEFAULT FALSE,
  birth_date DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  photo_url TEXT,
  bio TEXT,
  -- Emergency Contact
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  -- Permanent Address
  address_line TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  pincode TEXT,
  -- Education
  college TEXT,
  year TEXT CHECK (year IN ('1st', '2nd', '3rd', '4th', 'Graduate')),
  resume_url TEXT,
  -- Metadata
  profile_completion_percent INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STUDENT SKILLS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.student_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  proficiency TEXT NOT NULL CHECK (proficiency IN ('learning', 'good', 'expert')),
  profession_type TEXT NOT NULL CHECK (profession_type IN ('professional', 'hobby')),
  years_experience INTEGER DEFAULT 0,
  description TEXT,
  portfolio_url TEXT,
  tools_software TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STUDENT PREFERENCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.student_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE UNIQUE,
  availability JSONB DEFAULT '{}',
  preferred_categories TEXT[] DEFAULT '{}',
  preferred_areas TEXT[] DEFAULT '{}',
  preferred_schedule_type TEXT CHECK (preferred_schedule_type IN ('weekends', 'evenings', 'flexible', 'any')),
  min_pay_expectation INTEGER,
  max_commute_distance INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EMPLOYER PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.employer_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  venue_name TEXT,
  email TEXT,
  phone TEXT,
  category TEXT CHECK (category IN ('cafe', 'gym', 'bookstore', 'coworking', 'retail', 'events', 'restaurant', 'other')),
  description TEXT,
  logo_url TEXT,
  cover_photo_url TEXT,
  venue_photos TEXT[] DEFAULT '{}',
  address TEXT,
  area TEXT,
  city TEXT DEFAULT 'Hyderabad',
  google_maps_url TEXT,
  website_url TEXT,
  instagram_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- GIGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.gigs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES public.employer_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('cafe', 'gym', 'bookstore', 'coworking', 'retail', 'events', 'restaurant', 'other')),
  area TEXT,
  address TEXT,
  pay_min INTEGER,
  pay_max INTEGER,
  pay_type TEXT DEFAULT 'hourly' CHECK (pay_type IN ('hourly', 'daily', 'monthly', 'stipend')),
  schedule_type TEXT DEFAULT 'flexible' CHECK (schedule_type IN ('weekends', 'evenings', 'flexible', 'fullday')),
  schedule_details TEXT,
  duration TEXT,
  required_skills TEXT[] DEFAULT '{}',
  requirements TEXT[] DEFAULT '{}',
  perks TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  applications_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id UUID NOT NULL REFERENCES public.gigs(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  employer_id UUID NOT NULL REFERENCES public.employer_profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'shortlisted', 'accepted', 'rejected', 'expired')),
  employer_notes TEXT,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Prevent duplicate applications
  UNIQUE(gig_id, student_id)
);

-- ============================================
-- CONVERSATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE UNIQUE,
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  employer_id UUID NOT NULL REFERENCES public.employer_profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('student', 'employer')),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_student_profiles_college ON public.student_profiles(college);
CREATE INDEX IF NOT EXISTS idx_student_skills_student_id ON public.student_skills(student_id);
CREATE INDEX IF NOT EXISTS idx_student_preferences_student_id ON public.student_preferences(student_id);
CREATE INDEX IF NOT EXISTS idx_employer_profiles_category ON public.employer_profiles(category);
CREATE INDEX IF NOT EXISTS idx_employer_profiles_area ON public.employer_profiles(area);
CREATE INDEX IF NOT EXISTS idx_gigs_employer_id ON public.gigs(employer_id);
CREATE INDEX IF NOT EXISTS idx_gigs_category ON public.gigs(category);
CREATE INDEX IF NOT EXISTS idx_gigs_area ON public.gigs(area);
CREATE INDEX IF NOT EXISTS idx_gigs_is_active ON public.gigs(is_active);
CREATE INDEX IF NOT EXISTS idx_applications_gig_id ON public.applications(gig_id);
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON public.applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_employer_id ON public.applications(employer_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_conversations_student_id ON public.conversations(student_id);
CREATE INDEX IF NOT EXISTS idx_conversations_employer_id ON public.conversations(employer_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);

-- ============================================
-- TRIGGERS FOR updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_skills_updated_at BEFORE UPDATE ON public.student_skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_preferences_updated_at BEFORE UPDATE ON public.student_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employer_profiles_updated_at BEFORE UPDATE ON public.employer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gigs_updated_at BEFORE UPDATE ON public.gigs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION: Increment application count
-- ============================================
CREATE OR REPLACE FUNCTION increment_applications_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.gigs
  SET applications_count = applications_count + 1
  WHERE id = NEW.gig_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_application_created
  AFTER INSERT ON public.applications
  FOR EACH ROW EXECUTE FUNCTION increment_applications_count();

-- ============================================
-- FUNCTION: Create conversation on application
-- ============================================
CREATE OR REPLACE FUNCTION create_conversation_on_application()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.conversations (application_id, student_id, employer_id)
  VALUES (NEW.id, NEW.student_id, NEW.employer_id);
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_application_create_conversation
  AFTER INSERT ON public.applications
  FOR EACH ROW EXECUTE FUNCTION create_conversation_on_application();

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- STUDENT PROFILES POLICIES
CREATE POLICY "Students can view their own profile" ON public.student_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students can update their own profile" ON public.student_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Students can insert their own profile" ON public.student_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Employers can view student profiles (for applicants)" ON public.student_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'employer'
    )
  );

-- STUDENT SKILLS POLICIES
CREATE POLICY "Students can manage their own skills" ON public.student_skills
  FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Employers can view student skills" ON public.student_skills
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'employer'
    )
  );

-- STUDENT PREFERENCES POLICIES
CREATE POLICY "Students can manage their own preferences" ON public.student_preferences
  FOR ALL USING (auth.uid() = student_id);

-- EMPLOYER PROFILES POLICIES
CREATE POLICY "Employers can manage their own profile" ON public.employer_profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Anyone can view employer profiles" ON public.employer_profiles
  FOR SELECT USING (true);

-- GIGS POLICIES
CREATE POLICY "Anyone can view active gigs" ON public.gigs
  FOR SELECT USING (is_active = true);

CREATE POLICY "Employers can view their own gigs" ON public.gigs
  FOR SELECT USING (auth.uid() = employer_id);

CREATE POLICY "Employers can insert their own gigs" ON public.gigs
  FOR INSERT WITH CHECK (auth.uid() = employer_id);

CREATE POLICY "Employers can update their own gigs" ON public.gigs
  FOR UPDATE USING (auth.uid() = employer_id);

CREATE POLICY "Employers can delete their own gigs" ON public.gigs
  FOR DELETE USING (auth.uid() = employer_id);

-- APPLICATIONS POLICIES
CREATE POLICY "Students can view their own applications" ON public.applications
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can create applications" ON public.applications
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Employers can view applications for their gigs" ON public.applications
  FOR SELECT USING (auth.uid() = employer_id);

CREATE POLICY "Employers can update applications for their gigs" ON public.applications
  FOR UPDATE USING (auth.uid() = employer_id);

-- CONVERSATIONS POLICIES
CREATE POLICY "Users can view their own conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = student_id OR auth.uid() = employer_id);

-- MESSAGES POLICIES
CREATE POLICY "Users can view messages in their conversations" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.student_id = auth.uid() OR conversations.employer_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert messages in their conversations" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = conversation_id
      AND (conversations.student_id = auth.uid() OR conversations.employer_id = auth.uid())
    )
    AND sender_id = auth.uid()
  );

CREATE POLICY "Users can update their own messages" ON public.messages
  FOR UPDATE USING (sender_id = auth.uid());

-- ============================================
-- STORAGE BUCKETS (run separately)
-- ============================================
-- Create buckets for:
-- 1. profile-photos (student profile pictures)
-- 2. resumes (student resumes)
-- 3. venue-photos (employer venue photos)
-- 4. logos (employer logos)

-- Example (run in Storage settings):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('profile-photos', 'profile-photos', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('venue-photos', 'venue-photos', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true);
