'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Categories } from '@/components/landing/Categories'
import { AuthModal } from '@/components/auth/AuthModal'
import { RoleSelector } from '@/components/auth/RoleSelector'
import { ArrowRight, Sparkles } from 'lucide-react'
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
      const { data: { session } } = await supabase.auth.getSession(); const user = session?.user
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

        {/* CTA Section */}
        <section className="relative py-24 md:py-36 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-primary/20 blur-[120px]" />
          </div>

          <div className="container">
            <div className="relative mx-auto max-w-4xl">
              {/* Card */}
              <div className="glass rounded-3xl p-8 md:p-16 text-center border border-primary/20">
                {/* Floating sparkle */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                </div>

                <h2 className="mb-4 text-3xl font-bold md:text-5xl">
                  Ready to start your{' '}
                  <span className="gradient-text font-display">side quest?</span>
                </h2>
                <p className="mb-10 text-lg text-muted-foreground max-w-xl mx-auto">
                  Join hundreds of students already working at amazing places across Hyderabad
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <button
                    onClick={handleGetStarted}
                    className="btn-gradient inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                  >
                    Get Started — It&apos;s Free
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
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
