import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

interface Profile {
  role: 'student' | 'employer'
  onboarding_completed: boolean
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
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

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Check if user has a profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, onboarding_completed')
        .eq('id', data.user.id)
        .single<Profile>()

      if (!profile) {
        // New user - redirect to home with role selection
        return NextResponse.redirect(`${origin}/?new_user=true`)
      }

      if (!profile.onboarding_completed) {
        // Existing user but onboarding not completed
        const onboardingUrl =
          profile.role === 'student'
            ? '/student/onboarding'
            : '/employer/onboarding'
        return NextResponse.redirect(`${origin}${onboardingUrl}`)
      }

      // Existing user with completed onboarding - redirect to dashboard
      const dashboardUrl =
        profile.role === 'student'
          ? '/student/dashboard'
          : '/employer/dashboard'
      return NextResponse.redirect(`${origin}${dashboardUrl}`)
    }
  }

  // Auth error - redirect to home with error
  return NextResponse.redirect(`${origin}/?error=auth_error`)
}
