-- Fix RLS policies for SideQuest
-- This migration addresses security vulnerabilities in the existing policies

-- ============================================
-- FIX MESSAGES UPDATE POLICY
-- Allow conversation participants to mark messages as read
-- ============================================
DROP POLICY IF EXISTS "Users can update their own messages" ON public.messages;

-- Allow conversation participants to update messages (for marking as read)
CREATE POLICY "Conversation participants can update messages" ON public.messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.student_id = auth.uid() OR conversations.employer_id = auth.uid())
    )
  );

-- ============================================
-- ADD CONVERSATIONS UPDATE POLICY
-- Allow participants to update last_message_at
-- ============================================
CREATE POLICY "Participants can update their conversations" ON public.conversations
  FOR UPDATE USING (auth.uid() = student_id OR auth.uid() = employer_id);

-- ============================================
-- ADD STUDENT PROFILES DELETE POLICY
-- Students should be able to delete their own profile
-- ============================================
CREATE POLICY "Students can delete their own profile" ON public.student_profiles
  FOR DELETE USING (auth.uid() = id);

-- ============================================
-- ADD EMPLOYER PROFILES DELETE POLICY
-- Already covered by "Employers can manage their own profile" (FOR ALL)
-- ============================================

-- ============================================
-- ADD APPLICATIONS DELETE POLICY
-- Students can withdraw their applications
-- ============================================
CREATE POLICY "Students can delete their own applications" ON public.applications
  FOR DELETE USING (auth.uid() = student_id);

-- ============================================
-- TIGHTEN GIGS SELECT POLICY
-- Ensure inactive gigs are only visible to their owner
-- ============================================
-- The existing policies already handle this:
-- "Anyone can view active gigs" - is_active = true
-- "Employers can view their own gigs" - auth.uid() = employer_id

-- ============================================
-- ADD PROFILE ROLE VERIFICATION
-- Ensure students can't access employer-only tables and vice versa
-- ============================================

-- Add policy to ensure only students can have student_profiles
-- (This is enforced at insert time)
DROP POLICY IF EXISTS "Students can insert their own profile" ON public.student_profiles;
CREATE POLICY "Only students can create student profiles" ON public.student_profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'student'
    )
  );

-- Ensure only employers can insert gigs
DROP POLICY IF EXISTS "Employers can insert their own gigs" ON public.gigs;
CREATE POLICY "Only employers can create gigs" ON public.gigs
  FOR INSERT WITH CHECK (
    auth.uid() = employer_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'employer'
    )
  );

-- Ensure only students can create applications
DROP POLICY IF EXISTS "Students can create applications" ON public.applications;
CREATE POLICY "Only students can create applications" ON public.applications
  FOR INSERT WITH CHECK (
    auth.uid() = student_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'student'
    )
  );
