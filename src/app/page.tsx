'use client'

import { useState, useEffect, Suspense, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Categories } from '@/components/landing/Categories'
import { FAQ } from '@/components/landing/FAQ'
import { AuthModal } from '@/components/auth/AuthModal'
import { RoleSelector } from '@/components/auth/RoleSelector'
import { ArrowRight } from 'lucide-react'

function HomeContent() {
  const searchParams = useSearchParams()
  const { user, isAuthenticated, isLoading } = useAuth()

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup')
  const [showRoleSelector, setShowRoleSelector] = useState(false)

  // Handle URL params for auth modals
  useEffect(() => {
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

    // Show role selector for new users who just signed up
    if (isAuthenticated && user && newUser === 'true') {
      setShowRoleSelector(true)
    }
  }, [searchParams, isAuthenticated, user])

  // Close auth modal when user signs in
  useEffect(() => {
    if (isAuthenticated && showAuthModal) {
      setShowAuthModal(false)
    }
  }, [isAuthenticated, showAuthModal])

  const handleGetStarted = useCallback(() => {
    if (isAuthenticated) {
      window.location.href = '/gigs'
    } else {
      setAuthMode('signup')
      setShowAuthModal(true)
    }
  }, [isAuthenticated])

  const handleCloseAuthModal = useCallback(() => {
    setShowAuthModal(false)
  }, [])

  const handleCloseRoleSelector = useCallback(() => {
    setShowRoleSelector(false)
  }, [])

  return (
    <>
      <Navbar />

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
                disabled={isLoading}
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
        onClose={handleCloseAuthModal}
        mode={authMode}
      />

      {/* Role Selector Modal */}
      {user && (
        <RoleSelector
          isOpen={showRoleSelector}
          onClose={handleCloseRoleSelector}
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
