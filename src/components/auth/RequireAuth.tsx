'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRequireAuth } from '@/lib/auth'
import { Loader2, AlertCircle, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface RequireAuthProps {
  children: React.ReactNode
  requiredRole?: 'student' | 'employer'
  fallback?: React.ReactNode
}

/**
 * Wrapper component for pages that require authentication.
 * Handles loading states, redirects, and error display.
 */
export function RequireAuth({
  children,
  requiredRole,
  fallback,
}: RequireAuthProps) {
  const router = useRouter()
  const {
    isLoading,
    isAuthenticated,
    error,
    shouldRedirect,
    redirectPath,
    profile,
  } = useRequireAuth({ requiredRole })

  useEffect(() => {
    if (shouldRedirect && redirectPath) {
      router.push(redirectPath)
    }
  }, [shouldRedirect, redirectPath, router])

  // Show loading state
  if (isLoading) {
    return (
      fallback || (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      )
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Authentication Error</CardTitle>
            <CardDescription>
              We couldn&apos;t verify your session. Please try signing in again.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/?login=required">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">Go to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show sign in prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <LogIn className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/?login=required">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In with Google
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/gigs">Browse Gigs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show wrong role message
  if (requiredRole && profile?.role !== requiredRole) {
    const correctDashboard = profile?.role === 'student'
      ? '/student/dashboard'
      : '/employer/dashboard'

    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              This page is for {requiredRole}s only. You&apos;re signed in as {profile?.role || 'a user without a role'}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href={correctDashboard}>Go to Your Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // All checks passed, render children
  return <>{children}</>
}

/**
 * HOC version for wrapping page components
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: { requiredRole?: 'student' | 'employer' }
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <RequireAuth requiredRole={options?.requiredRole}>
        <Component {...props} />
      </RequireAuth>
    )
  }
}
