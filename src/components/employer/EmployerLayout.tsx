'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  ChevronDown,
  Plus,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface EmployerLayoutProps {
  children: React.ReactNode
}

export function EmployerLayout({ children }: EmployerLayoutProps) {
  const pathname = usePathname()
  const [gigsExpanded, setGigsExpanded] = useState(
    pathname.includes('/employer/gigs')
  )

  const isActive = (path: string) => pathname === path
  const isGigsActive = pathname.includes('/employer/gigs')

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex flex-1 pt-24">
        {/* Sidebar - Hidden on mobile */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:top-24 lg:bottom-0 lg:left-0 lg:border-r lg:border-border lg:bg-background">
          <nav className="flex-1 px-4 py-6 space-y-1">
            {/* Dashboard */}
            <Link
              href="/employer/dashboard"
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive('/employer/dashboard')
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>

            {/* Gigs - Expandable */}
            <div>
              <button
                onClick={() => setGigsExpanded(!gigsExpanded)}
                className={cn(
                  'flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isGigsActive
                    ? 'bg-foreground/10 text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <span className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5" />
                  Gigs
                </span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    gigsExpanded && 'rotate-180'
                  )}
                />
              </button>
              {gigsExpanded && (
                <div className="ml-8 mt-1 space-y-1">
                  <Link
                    href="/employer/gigs"
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                      isActive('/employer/gigs')
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    All Gigs
                  </Link>
                  <Link
                    href="/employer/gigs/new"
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                      isActive('/employer/gigs/new')
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Plus className="h-4 w-4" />
                    Create Gig
                  </Link>
                </div>
              )}
            </div>

            {/* Applications */}
            <Link
              href="/employer/applications"
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive('/employer/applications')
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <FileText className="h-5 w-5" />
              Applications
            </Link>

            {/* Chat */}
            <Link
              href="/employer/messages"
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive('/employer/messages')
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <MessageSquare className="h-5 w-5" />
              Chat
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          <div className="min-h-[calc(100vh-6rem)]">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  )
}
