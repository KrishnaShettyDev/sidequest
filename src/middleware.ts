import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

interface Profile {
  role: 'student' | 'employer' | null
  onboarding_completed: boolean
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do not write any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  // Define route types
  const pathname = request.nextUrl.pathname
  const isStudentRoute = pathname.startsWith('/student')
  const isEmployerRoute = pathname.startsWith('/employer')
  const isProtectedRoute = isStudentRoute || isEmployerRoute
  const isOnboardingRoute = pathname.includes('/onboarding')

  // Helper to create redirect with cookies preserved
  const createRedirect = (redirectPath: string, searchParams?: Record<string, string>) => {
    const url = request.nextUrl.clone()
    url.pathname = redirectPath
    url.search = '' // Clear existing search params
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        url.searchParams.set(key, value)
      })
    }
    const redirectResponse = NextResponse.redirect(url)
    // Copy cookies from supabaseResponse to redirect response
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  // Handle auth errors gracefully
  if (userError) {
    console.error('Middleware: Auth error:', userError.message)
    if (isProtectedRoute) {
      return createRedirect('/', { login: 'required', error: 'session_expired' })
    }
    return supabaseResponse
  }

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !user) {
    return createRedirect('/', { login: 'required' })
  }

  // If user is authenticated and accessing protected routes, verify their profile
  if (user && isProtectedRoute) {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, onboarding_completed')
        .eq('id', user.id)
        .maybeSingle()

      // Handle profile query errors
      if (profileError) {
        console.error('Middleware: Profile query error:', profileError.message)
        // Allow access but log the error - the page will handle the missing profile
        return supabaseResponse
      }

      // No profile or no role - redirect to role selection
      if (!profile || !profile.role) {
        return createRedirect('/', { new_user: 'true' })
      }

      const typedProfile = profile as Profile

      // Prevent students from accessing employer routes
      if (typedProfile.role === 'student' && isEmployerRoute) {
        return createRedirect('/student/dashboard')
      }

      // Prevent employers from accessing student routes
      if (typedProfile.role === 'employer' && isStudentRoute) {
        return createRedirect('/employer/dashboard')
      }

      // Handle onboarding requirements
      if (!typedProfile.onboarding_completed && !isOnboardingRoute) {
        const onboardingPath = typedProfile.role === 'student'
          ? '/student/onboarding/about'
          : '/employer/onboarding/venue'
        return createRedirect(onboardingPath)
      }

      // If on onboarding route but already completed, redirect to dashboard
      if (typedProfile.onboarding_completed && isOnboardingRoute) {
        const dashboardPath = typedProfile.role === 'student'
          ? '/student/dashboard'
          : '/employer/dashboard'
        return createRedirect(dashboardPath)
      }

    } catch (error) {
      console.error('Middleware: Unexpected error:', error)
      // On error, allow the request but let the page handle authentication
      return supabaseResponse
    }
  }

  // IMPORTANT: You must return the supabaseResponse object as it is.
  // If you're creating a new response object, make sure to:
  // 1. Copy all cookies from supabaseResponse
  // 2. Change the myNewResponse.cookies.set parameters as needed

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
