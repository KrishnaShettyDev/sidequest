import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

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
  } = await supabase.auth.getUser()

  // Define protected routes
  const isStudentRoute = request.nextUrl.pathname.startsWith('/student')
  const isEmployerRoute = request.nextUrl.pathname.startsWith('/employer')
  const isProtectedRoute = isStudentRoute || isEmployerRoute

  // Helper to create redirect with cookies preserved
  const createRedirect = (pathname: string, searchParams?: Record<string, string>) => {
    const url = request.nextUrl.clone()
    url.pathname = pathname
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

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !user) {
    return createRedirect('/', { login: 'required' })
  }

  // If user is authenticated, check their role and redirect appropriately
  if (user && isProtectedRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, onboarding_completed')
      .eq('id', user.id)
      .single() as { data: { role: string; onboarding_completed: boolean } | null }

    if (profile) {
      // Check if user is accessing the correct dashboard for their role
      if (profile.role === 'student' && isEmployerRoute) {
        return createRedirect('/student/dashboard')
      }

      if (profile.role === 'employer' && isStudentRoute) {
        return createRedirect('/employer/dashboard')
      }

      // Redirect to onboarding if not completed
      if (!profile.onboarding_completed) {
        const isOnboardingRoute = request.nextUrl.pathname.includes('/onboarding')
        if (!isOnboardingRoute) {
          const onboardingPath = profile.role === 'student'
            ? '/student/onboarding'
            : '/employer/onboarding'
          return createRedirect(onboardingPath)
        }
      }
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
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
