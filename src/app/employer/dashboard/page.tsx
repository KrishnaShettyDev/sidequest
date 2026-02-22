'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Loader2,
  Briefcase,
  Users,
  Plus,
  ArrowRight,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  MessageSquare,
  Settings,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface EmployerProfile {
  venue_name: string
  logo_url: string | null
  category: string
  area: string
}

interface Gig {
  id: string
  title: string
  is_active: boolean
  applications_count: number
  created_at: string
}

interface Application {
  id: string
  status: string
  applied_at: string
  student: {
    first_name: string
    last_name: string
    photo_url: string | null
    college: string
  }
  gig: {
    id: string
    title: string
  }
}

export default function EmployerDashboard() {
  const router = useRouter()
  const supabase = createClient()

  const [profile, setProfile] = useState<EmployerProfile | null>(null)
  const [gigs, setGigs] = useState<Gig[]>([])
  const [recentApplications, setRecentApplications] = useState<Application[]>([])
  const [stats, setStats] = useState({
    totalGigs: 0,
    activeGigs: 0,
    totalApplications: 0,
    pendingApplications: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      const { data: { session } } = await supabase.auth.getSession(); const user = session?.user

      if (!user) {
        router.push('/?login=required')
        return
      }

      // Load employer profile
      const { data: profileData } = await supabase
        .from('employer_profiles')
        .select('venue_name, logo_url, category, area')
        .eq('id', user.id)
        .single() as { data: EmployerProfile | null }

      if (profileData) {
        setProfile(profileData)
      }

      // Load gigs
      const { data: gigsData } = await supabase
        .from('gigs')
        .select('id, title, is_active, applications_count, created_at')
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false }) as { data: Gig[] | null }

      if (gigsData) {
        setGigs(gigsData)
        setStats(prev => ({
          ...prev,
          totalGigs: gigsData.length,
          activeGigs: gigsData.filter(g => g.is_active).length,
        }))
      }

      // Load recent applications
      const { data: applicationsData } = await supabase
        .from('applications')
        .select(`
          id,
          status,
          applied_at,
          student:student_profiles(first_name, last_name, photo_url, college),
          gig:gigs(id, title)
        `)
        .eq('employer_id', user.id)
        .order('applied_at', { ascending: false })
        .limit(10) as { data: Application[] | null }

      if (applicationsData) {
        setRecentApplications(applicationsData)
        setStats(prev => ({
          ...prev,
          totalApplications: applicationsData.length,
          pendingApplications: applicationsData.filter(a => a.status === 'pending').length,
        }))
      }

      setIsLoading(false)
    }

    loadDashboard()
  }, [supabase, router])

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: 'New', variant: 'secondary' as const, icon: Clock },
      viewed: { label: 'Viewed', variant: 'outline' as const, icon: Eye },
      shortlisted: { label: 'Shortlisted', variant: 'default' as const, icon: CheckCircle2 },
      accepted: { label: 'Accepted', variant: 'default' as const, icon: CheckCircle2 },
      rejected: { label: 'Rejected', variant: 'destructive' as const, icon: XCircle },
    }[status] || { label: status, variant: 'secondary' as const, icon: Clock }

    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 pt-24 bg-muted/30">
        <div className="container py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome, {profile?.venue_name || 'Employer'}!
              </h1>
              <p className="text-muted-foreground">
                Manage your gigs and find great talent
              </p>
            </div>
            <Button asChild>
              <Link href="/employer/gigs/new">
                <Plus className="mr-2 h-4 w-4" />
                Post New Gig
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalGigs}</p>
                    <p className="text-sm text-muted-foreground">Total Gigs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.activeGigs}</p>
                    <p className="text-sm text-muted-foreground">Active Gigs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalApplications}</p>
                    <p className="text-sm text-muted-foreground">Applications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.pendingApplications}</p>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Applicants */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Applicants</CardTitle>
                  {recentApplications.length > 0 && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/employer/gigs">
                        View all
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {recentApplications.length > 0 ? (
                    <div className="space-y-4">
                      {recentApplications.slice(0, 5).map((app) => (
                        <div
                          key={app.id}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={app.student?.photo_url || undefined} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {app.student?.first_name?.[0]?.toUpperCase() || 'S'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {app.student?.first_name} {app.student?.last_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {app.student?.college} • Applied for {app.gig?.title}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {getStatusBadge(app.status)}
                            <span className="text-xs text-muted-foreground hidden sm:block">
                              {formatDistanceToNow(new Date(app.applied_at), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground mb-4">No applications yet</p>
                      <p className="text-sm text-muted-foreground">
                        Post a gig to start receiving applications
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Your Gigs */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Your Gigs</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/employer/gigs">
                      Manage gigs
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {gigs.length > 0 ? (
                    <div className="space-y-3">
                      {gigs.slice(0, 5).map((gig) => (
                        <Link
                          key={gig.id}
                          href={`/employer/gigs/${gig.id}`}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <p className="font-medium">{gig.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {gig.applications_count} applicant{gig.applications_count !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={gig.is_active ? 'default' : 'secondary'}>
                              {gig.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground mb-4">No gigs posted yet</p>
                      <Button asChild>
                        <Link href="/employer/gigs/new">
                          <Plus className="mr-2 h-4 w-4" />
                          Post Your First Gig
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Venue Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 mb-4 rounded-xl">
                      <AvatarImage src={profile?.logo_url || undefined} />
                      <AvatarFallback className="rounded-xl text-2xl bg-primary/10 text-primary">
                        {profile?.venue_name?.[0]?.toUpperCase() || 'V'}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg">
                      {profile?.venue_name}
                    </h3>
                    {profile?.category && (
                      <Badge variant="secondary" className="mt-2">
                        {profile.category}
                      </Badge>
                    )}
                    {profile?.area && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {profile.area}
                      </p>
                    )}
                    <Button className="w-full mt-4" variant="outline" asChild>
                      <Link href="/employer/profile">Edit Profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-1">
                    <Link
                      href="/employer/gigs/new"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Plus className="h-5 w-5 text-muted-foreground" />
                      <span>Post New Gig</span>
                    </Link>
                    <Link
                      href="/employer/gigs"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                      <span>Manage Gigs</span>
                    </Link>
                    <Link
                      href="/employer/messages"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      <span>Messages</span>
                    </Link>
                    <Link
                      href="/employer/settings"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Settings className="h-5 w-5 text-muted-foreground" />
                      <span>Settings</span>
                    </Link>
                  </nav>
                </CardContent>
              </Card>

              {/* Tips Card */}
              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Tips for Success</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Write clear job descriptions</li>
                    <li>• Respond to applicants quickly</li>
                    <li>• Highlight perks and benefits</li>
                    <li>• Keep your venue profile updated</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
