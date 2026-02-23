'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js'

interface Profile {
  role: 'student' | 'employer' | null
  onboarding_completed: boolean
}

interface AuthState {
  user: User | null
  session: Session | null
  profile: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
  error: Error | null
}

interface AuthContextValue extends AuthState {
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// Singleton Supabase client for the entire app
let supabaseInstance: ReturnType<typeof createClient> | null = null

function getSupabaseClient(): ReturnType<typeof createClient> | null {
  if (typeof window === 'undefined') {
    // Server-side: don't cache, return null to skip auth
    return null
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient()
  }
  return supabaseInstance
}

// For external use - always returns a client (throws if unavailable)
function getSupabaseClientRequired(): ReturnType<typeof createClient> {
  const client = getSupabaseClient()
  if (!client) {
    throw new Error('Supabase client not available')
  }
  return client
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  })

  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)

  // Initialize supabase client in effect to avoid SSR issues
  useEffect(() => {
    supabaseRef.current = getSupabaseClient()

    if (!supabaseRef.current) {
      // No supabase client available (SSR or initialization failed)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: new Error('Authentication service unavailable')
      }))
      return
    }

    let mounted = true
    const supabase = supabaseRef.current

    const fetchProfile = async (userId: string): Promise<Profile | null> => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role, onboarding_completed')
          .eq('id', userId)
          .maybeSingle()

        if (error) {
          console.error('Error fetching profile:', error)
          return null
        }

        return data as Profile | null
      } catch (err) {
        console.error('Unexpected error fetching profile:', err)
        return null
      }
    }

    const initAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (!mounted) return

        if (sessionError) {
          console.error('Session error:', sessionError)
          setState({
            user: null,
            session: null,
            profile: null,
            isLoading: false,
            isAuthenticated: false,
            error: sessionError,
          })
          return
        }

        if (session?.user) {
          const profile = await fetchProfile(session.user.id)
          if (!mounted) return

          setState({
            user: session.user,
            session,
            profile,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          })
        } else {
          setState({
            user: null,
            session: null,
            profile: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
          })
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
        if (mounted) {
          setState({
            user: null,
            session: null,
            profile: null,
            isLoading: false,
            isAuthenticated: false,
            error: err instanceof Error ? err : new Error('Authentication failed'),
          })
        }
      }
    }

    initAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (!mounted) return

        if (event === 'SIGNED_OUT' || !session) {
          setState({
            user: null,
            session: null,
            profile: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
          })
          return
        }

        if (session?.user) {
          const profile = await fetchProfile(session.user.id)
          if (!mounted) return

          setState({
            user: session.user,
            session,
            profile,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          })
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    const supabase = supabaseRef.current
    if (!state.user || !supabase) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, onboarding_completed')
        .eq('id', state.user.id)
        .maybeSingle()

      if (!error && data) {
        setState(prev => ({ ...prev, profile: data as Profile }))
      }
    } catch (err) {
      console.error('Error refreshing profile:', err)
    }
  }, [state.user])

  const signOut = useCallback(async () => {
    const supabase = supabaseRef.current
    if (!supabase) return

    try {
      await supabase.auth.signOut()
      setState({
        user: null,
        session: null,
        profile: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      })
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * Hook for pages that require authentication
 */
export function useRequireAuth(options?: {
  requiredRole?: 'student' | 'employer'
  redirectTo?: string
}) {
  const auth = useAuth()
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [redirectPath, setRedirectPath] = useState<string | null>(null)

  useEffect(() => {
    if (auth.isLoading) return

    if (!auth.isAuthenticated) {
      setShouldRedirect(true)
      setRedirectPath(options?.redirectTo || '/?login=required')
      return
    }

    if (options?.requiredRole && auth.profile?.role !== options.requiredRole) {
      setShouldRedirect(true)
      if (auth.profile?.role === 'student') {
        setRedirectPath('/student/dashboard')
      } else if (auth.profile?.role === 'employer') {
        setRedirectPath('/employer/dashboard')
      } else {
        setRedirectPath('/')
      }
      return
    }

    if (auth.profile && !auth.profile.onboarding_completed) {
      const onboardingPath = auth.profile.role === 'student'
        ? '/student/onboarding/about'
        : '/employer/onboarding/venue'
      setShouldRedirect(true)
      setRedirectPath(onboardingPath)
      return
    }

    setShouldRedirect(false)
    setRedirectPath(null)
  }, [auth.isLoading, auth.isAuthenticated, auth.profile, options?.requiredRole, options?.redirectTo])

  return {
    ...auth,
    shouldRedirect,
    redirectPath,
  }
}

// Export for use in components that need direct Supabase access
export function getSupabase() {
  return getSupabaseClientRequired()
}
