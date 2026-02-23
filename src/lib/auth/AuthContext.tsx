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

function getSupabase() {
  if (!supabaseInstance) {
    supabaseInstance = createClient()
  }
  return supabaseInstance
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

  // Use ref to prevent multiple initializations
  const isInitialized = useRef(false)
  const supabase = getSupabase()

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, onboarding_completed')
        .eq('id', userId)
        .single()

      if (error) {
        // PGRST116 = no rows returned (new user without profile)
        if (error.code === 'PGRST116') {
          return null
        }
        console.error('Error fetching profile:', error)
        return null
      }

      return data as Profile
    } catch (err) {
      console.error('Unexpected error fetching profile:', err)
      return null
    }
  }, [supabase])

  const refreshProfile = useCallback(async () => {
    if (!state.user) return

    const profile = await fetchProfile(state.user.id)
    setState(prev => ({ ...prev, profile }))
  }, [state.user, fetchProfile])

  const signOut = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

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
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err : new Error('Sign out failed'),
      }))
    }
  }, [supabase])

  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (isInitialized.current) return
    isInitialized.current = true

    let mounted = true

    const initAuth = async () => {
      try {
        // Get initial session from localStorage (fast)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('Session error:', sessionError)
          if (mounted) {
            setState({
              user: null,
              session: null,
              profile: null,
              isLoading: false,
              isAuthenticated: false,
              error: sessionError,
            })
          }
          return
        }

        if (session?.user) {
          // Fetch profile in parallel with setting initial state
          const profile = await fetchProfile(session.user.id)

          if (mounted) {
            setState({
              user: session.user,
              session,
              profile,
              isLoading: false,
              isAuthenticated: true,
              error: null,
            })
          }
        } else {
          if (mounted) {
            setState({
              user: null,
              session: null,
              profile: null,
              isLoading: false,
              isAuthenticated: false,
              error: null,
            })
          }
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

        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
          case 'TOKEN_REFRESHED':
            if (session?.user) {
              const profile = await fetchProfile(session.user.id)
              setState({
                user: session.user,
                session,
                profile,
                isLoading: false,
                isAuthenticated: true,
                error: null,
              })
            }
            break

          case 'SIGNED_OUT':
            setState({
              user: null,
              session: null,
              profile: null,
              isLoading: false,
              isAuthenticated: false,
              error: null,
            })
            break

          case 'USER_UPDATED':
            if (session?.user) {
              setState(prev => ({
                ...prev,
                user: session.user,
                session,
              }))
            }
            break

          case 'INITIAL_SESSION':
            // Already handled in initAuth
            break

          default:
            // For any other events, just update session if available
            if (session?.user) {
              setState(prev => ({
                ...prev,
                user: session.user,
                session,
                isAuthenticated: true,
              }))
            }
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase, fetchProfile])

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
 * Returns auth state and handles redirect logic
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

    // Check role if required
    if (options?.requiredRole && auth.profile?.role !== options.requiredRole) {
      setShouldRedirect(true)
      // Redirect to appropriate dashboard
      if (auth.profile?.role === 'student') {
        setRedirectPath('/student/dashboard')
      } else if (auth.profile?.role === 'employer') {
        setRedirectPath('/employer/dashboard')
      } else {
        setRedirectPath('/')
      }
      return
    }

    // Check onboarding completion
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

/**
 * Get the singleton Supabase client
 * Use this instead of createClient() in components
 */
export { getSupabase }
