import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/'

  if (!code) {
    // No code provided - redirect with error
    console.error('Auth callback: No code provided')
    return NextResponse.redirect(`${origin}/?error=missing_code`)
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  try {
    // Exchange code for session
    const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

    if (sessionError) {
      console.error('Auth callback: Session exchange error:', sessionError.message)
      return NextResponse.redirect(`${origin}/?error=session_error&message=${encodeURIComponent(sessionError.message)}`)
    }

    if (!sessionData.user) {
      console.error('Auth callback: No user in session data')
      return NextResponse.redirect(`${origin}/?error=no_user`)
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, onboarding_completed')
      .eq('id', sessionData.user.id)
      .maybeSingle()

    // Handle profile query error (not the same as no profile)
    if (profileError) {
      console.error('Auth callback: Profile query error:', profileError.message)
      // Still let the user in, but redirect to home where the role selector will show
      return NextResponse.redirect(`${origin}/?new_user=true`)
    }

    // No profile exists - new user needs to select role
    if (!profile) {
      return NextResponse.redirect(`${origin}/?new_user=true`)
    }

    // Profile exists but role is null/undefined - needs role selection
    if (!profile.role) {
      console.warn('Auth callback: User has profile but no role set')
      return NextResponse.redirect(`${origin}/?new_user=true`)
    }

    // Profile exists with role but onboarding not completed
    if (!profile.onboarding_completed) {
      const onboardingUrl = profile.role === 'student'
        ? '/student/onboarding/about'
        : '/employer/onboarding/venue'
      return NextResponse.redirect(`${origin}${onboardingUrl}`)
    }

    // Fully onboarded user - redirect to dashboard or requested path
    if (next !== '/' && !next.startsWith('/?')) {
      // User was trying to access a specific page
      return NextResponse.redirect(`${origin}${next}`)
    }

    // Default: redirect to appropriate dashboard
    const dashboardUrl = profile.role === 'student'
      ? '/student/dashboard'
      : '/employer/dashboard'
    return NextResponse.redirect(`${origin}${dashboardUrl}`)

  } catch (error) {
    console.error('Auth callback: Unexpected error:', error)
    return NextResponse.redirect(`${origin}/?error=unexpected_error`)
  }
}
