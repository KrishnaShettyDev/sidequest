'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Menu,
  Briefcase,
  User as UserIcon,
  LogOut,
  Settings,
  MessageSquare,
  LayoutDashboard,
  FileText,
  ArrowRight,
} from 'lucide-react'
import type { User } from '@supabase/supabase-js'

interface NavbarProps {
  user?: User | null
  role?: 'student' | 'employer' | null
}

export function Navbar({ user: initialUser, role: initialRole }: NavbarProps) {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(initialUser || null)
  const [role, setRole] = useState<string | null>(initialRole || null)
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      setUser(user || null)

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single() as { data: { role: string } | null }
        setRole(profile?.role || null)
      }
    }

    if (!initialUser) {
      getUser()
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null)
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single() as { data: { role: string } | null }
          setRole(profile?.role || null)
        } else {
          setRole(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, initialUser])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const getInitials = (name: string | undefined | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const dashboardLink = role === 'employer' ? '/employer/dashboard' : '/student/dashboard'
  const profileLink = role === 'employer' ? '/employer/profile' : '/student/profile'
  const messagesLink = role === 'employer' ? '/employer/messages' : '/student/messages'
  const applicationsLink = role === 'student' ? '/student/applications' : null
  const gigsLink = role === 'employer' ? '/employer/gigs' : null

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-subtle'
          : 'bg-transparent'
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-display tracking-tight">
            SideQuest
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-8">
          <Link
            href="/gigs"
            className={`text-[15px] font-medium transition-colors link-underline ${
              pathname === '/gigs' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Browse Gigs
          </Link>
          {!user && (
            <Link
              href="/#how-it-works"
              className="text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground link-underline"
            >
              How It Works
            </Link>
          )}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex md:items-center md:gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-border">
                    <AvatarImage
                      src={user.user_metadata?.avatar_url}
                      alt={user.user_metadata?.full_name}
                    />
                    <AvatarFallback className="bg-secondary text-foreground font-medium">
                      {getInitials(user.user_metadata?.full_name || user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-3">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={dashboardLink} className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={profileLink} className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                {applicationsLink && (
                  <DropdownMenuItem asChild>
                    <Link href={applicationsLink} className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      Applications
                    </Link>
                  </DropdownMenuItem>
                )}
                {gigsLink && (
                  <DropdownMenuItem asChild>
                    <Link href={gigsLink} className="cursor-pointer">
                      <Briefcase className="mr-2 h-4 w-4" />
                      My Gigs
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href={messagesLink} className="cursor-pointer">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Messages
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={role === 'employer' ? '/employer/settings' : '/student/settings'}
                    className="cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/?login=true"
                className="text-[15px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link href="/?signup=true" className="btn-primary">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col gap-6 py-8">
              <Link
                href="/gigs"
                className="text-xl font-display hover:text-muted-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Browse Gigs
              </Link>
              {user ? (
                <>
                  <Link
                    href={dashboardLink}
                    className="text-xl font-display hover:text-muted-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={profileLink}
                    className="text-xl font-display hover:text-muted-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href={messagesLink}
                    className="text-xl font-display hover:text-muted-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Messages
                  </Link>
                  <div className="pt-6 border-t border-border">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={() => {
                        handleSignOut()
                        setIsOpen(false)
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-6 border-t border-border">
                  <Link
                    href="/?login=true"
                    className="btn-secondary w-full text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/?signup=true"
                    className="btn-primary w-full justify-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
