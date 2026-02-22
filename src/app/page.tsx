'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Categories } from '@/components/landing/Categories'
import { FAQ } from '@/components/landing/FAQ'
import { AuthModal } from '@/components/auth/AuthModal'
import { RoleSelector } from '@/components/auth/RoleSelector'
import { ArrowRight } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

function HomeContent() {
  const searchParams = useSearchParams()
  const [user, setUser] = useState<User | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup')
  const [showRoleSelector, setShowRoleSelector] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    // Check for query params
    const login = searchParams.get('login')
    const signup = searchParams.get('signup')
    const newUser = searchParams.get('new_user')

    if (login === 'true' || login === 'required') {
      setAuthMode('signin')
      setShowAuthModal(true)
    } else if (signup === 'true') {
      setAuthMode('signup')
      setShowAuthModal(true)
    }

    // Get current user
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user || null
      setUser(user)

      // Show role selector for new users
      if (user && newUser === 'true') {
        setShowRoleSelector(true)
      }
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null)
      }
    )

    return () => subscription.unsubscribe()
  }, [searchParams, supabase])

  const handleGetStarted = () => {
    if (user) {
      // User is logged in, redirect to gigs
      window.location.href = '/gigs'
    } else {
      setAuthMode('signup')
      setShowAuthModal(true)
    }
  }

  return (
    <>
      <Navbar user={user} />

      <main className="flex-1">
        <Hero onGetStarted={handleGetStarted} />
        <HowItWorks />
        <Categories />
        <FAQ />

        {/* CTA Section */}
        <section className="section-spacing-sm">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-title mb-6">
                Ready to start your <span className="highlight italic">side quest</span>?
              </h2>
              <p className="text-body-lg text-muted-foreground mb-10 max-w-xl mx-auto">
                Join hundreds of students already working at amazing places across Hyderabad
              </p>
              <button
                onClick={handleGetStarted}
                className="btn-primary"
              >
                Get Started — It&apos;s Free
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />

      {/* Role Selector Modal */}
      {user && (
        <RoleSelector
          isOpen={showRoleSelector}
          onClose={() => setShowRoleSelector(false)}
          userId={user.id}
          userEmail={user.email || ''}
          userName={user.user_metadata?.full_name}
        />
      )}
    </>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <HomeContent />
    </Suspense>
  )
}
