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
  Sparkles,
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
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

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

  const NavLinks = () => (
    <>
      <Link
        href="/gigs"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          pathname === '/gigs' ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        Browse Gigs
      </Link>
      {!user && (
        <Link
          href="/#how-it-works"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          How It Works
        </Link>
      )}
    </>
  )

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 glass">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent glow-sm transition-all group-hover:scale-105">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Side<span className="gradient-text">Quest</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-8">
          <NavLinks />
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex md:items-center md:gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.user_metadata?.avatar_url}
                      alt={user.user_metadata?.full_name}
                    />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {getInitials(user.user_metadata?.full_name || user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass border-white/10" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
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
                <DropdownMenuSeparator className="bg-white/10" />
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
              <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                <Link href="/?login=true">Sign In</Link>
              </Button>
              <Button asChild className="btn-gradient rounded-full px-6">
                <Link href="/?signup=true">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] glass border-white/10">
            <div className="flex flex-col gap-6 py-6">
              <Link
                href="/gigs"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Browse Gigs
              </Link>
              {user ? (
                <>
                  <Link
                    href={dashboardLink}
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={profileLink}
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href={messagesLink}
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Messages
                  </Link>
                  <Button
                    variant="destructive"
                    className="mt-4"
                    onClick={() => {
                      handleSignOut()
                      setIsOpen(false)
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-3 mt-4">
                  <Button variant="outline" asChild className="border-white/10">
                    <Link href="/?login=true" onClick={() => setIsOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild className="btn-gradient">
                    <Link href="/?signup=true" onClick={() => setIsOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
