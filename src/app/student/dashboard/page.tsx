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
import { Progress } from '@/components/ui/progress'
import { GigCard } from '@/components/gigs/GigCard'
import {
  Loader2,
  Briefcase,
  MapPin,
  GraduationCap,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface StudentProfile {
  first_name: string
  last_name: string
  photo_url: string | null
  college: string
  year: string
  bio: string
  city: string
}

interface Application {
  id: string
  status: string
  applied_at: string
  gig: {
    id: string
    title: string
    employer: {
      venue_name: string
      logo_url: string | null
    }
  }
}

interface Gig {
  id: string
  title: string
  description: string
  category: string
  area: string
  pay_min: number
  pay_max: number
  pay_type: string
  schedule_type: string
  schedule_details: string
  created_at: string
  employer?: {
    venue_name: string
    logo_url: string | null
  }
}

export default function StudentDashboard() {
  const router = useRouter()
  const supabase = createClient()

  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [recommendedGigs, setRecommendedGigs] = useState<Gig[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [profileCompletion, setProfileCompletion] = useState(0)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session?.user) {
          router.push('/?login=required')
          return
        }

        const user = session.user

        // Load profile
        const { data: profileData, error: profileError } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('id', user.id)
          .single() as { data: StudentProfile | null, error: Error | null }

        if (profileError) {
          console.error('Profile error:', profileError)
        }

        if (profileData) {
          setProfile(profileData)

          // Calculate profile completion
          const fields = [
            profileData.first_name,
            profileData.last_name,
            profileData.photo_url,
            profileData.college,
            profileData.year,
            profileData.bio,
            profileData.city,
          ]
          const filled = fields.filter(Boolean).length
          setProfileCompletion(Math.round((filled / fields.length) * 100))
        }

        // Load skills
        const { data: skillsData } = await supabase
          .from('student_skills')
          .select('skill_name')
          .eq('student_id', user.id)

        if (skillsData) {
          setSkills(skillsData.map((s: { skill_name: string }) => s.skill_name))
        }

        // Load recent applications
        const { data: applicationsData } = await supabase
          .from('applications')
          .select(`
            id,
            status,
            applied_at,
            gig:gigs(
              id,
              title,
              employer:employer_profiles(venue_name, logo_url)
            )
          `)
          .eq('student_id', user.id)
          .order('applied_at', { ascending: false })
          .limit(5)

        if (applicationsData) {
          setApplications(applicationsData as Application[])
        }

        // Load recommended gigs (based on preferences or recent)
        const { data: gigsData } = await supabase
          .from('gigs')
          .select(`
            *,
            employer:employer_profiles(venue_name, logo_url)
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(6)

        if (gigsData) {
          setRecommendedGigs(gigsData as Gig[])
        }
      } catch (error) {
        console.error('Dashboard error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [supabase, router])

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: 'Pending', variant: 'secondary' as const, icon: Clock },
      viewed: { label: 'Viewed', variant: 'secondary' as const, icon: Eye },
      shortlisted: { label: 'Shortlisted', variant: 'default' as const, icon: CheckCircle2 },
      accepted: { label: 'Accepted', variant: 'default' as const, icon: CheckCircle2 },
      rejected: { label: 'Not Selected', variant: 'destructive' as const, icon: XCircle },
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

      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              Welcome back, {profile?.first_name || 'Student'}!
            </h1>
            <p className="text-muted-foreground">
              Here&apos;s what&apos;s happening with your job search
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats */}
              <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{applications.length}</p>
                        <p className="text-sm text-muted-foreground">Applications</p>
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
                        <p className="text-2xl font-bold">
                          {applications.filter(a => a.status === 'accepted').length}
                        </p>
                        <p className="text-sm text-muted-foreground">Accepted</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">0</p>
                        <p className="text-sm text-muted-foreground">Messages</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Applications */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Applications</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/student/applications">
                      View all
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {applications.length > 0 ? (
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <div
                          key={app.id}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 rounded-lg">
                              <AvatarImage src={app.gig?.employer?.logo_url || undefined} />
                              <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                                {app.gig?.employer?.venue_name?.[0]?.toUpperCase() || 'V'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{app.gig?.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {app.gig?.employer?.venue_name}
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
                      <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground mb-4">No applications yet</p>
                      <Button asChild>
                        <Link href="/gigs">Browse Gigs</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recommended Gigs */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Recommended for You</h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/gigs">
                      View all
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                {recommendedGigs.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {recommendedGigs.slice(0, 4).map((gig) => (
                      <GigCard key={gig.id} gig={gig} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <p className="text-muted-foreground">No gigs available right now</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 mb-4">
                      <AvatarImage src={profile?.photo_url || undefined} />
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {profile?.first_name?.[0]?.toUpperCase() || 'S'}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg">
                      {profile?.first_name} {profile?.last_name}
                    </h3>

                    {profile?.college && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <GraduationCap className="h-4 w-4" />
                        <span>{profile.college}</span>
                      </div>
                    )}

                    {profile?.city && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{profile.city}</span>
                      </div>
                    )}

                    {/* Skills */}
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-center mt-4">
                        {skills.slice(0, 4).map((skill, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {skills.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{skills.length - 4}
                          </Badge>
                        )}
                      </div>
                    )}

                    <Button className="w-full mt-4" variant="outline" asChild>
                      <Link href="/student/profile">Edit Profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Completion */}
              {profileCompletion < 100 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">Complete Your Profile</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Profile strength</span>
                        <span className="font-medium">{profileCompletion}%</span>
                      </div>
                      <Progress value={profileCompletion} className="h-2" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      A complete profile increases your chances of getting hired!
                    </p>
                    <Button className="w-full mt-4" size="sm" asChild>
                      <Link href="/student/profile">Complete Profile</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Quick Links */}
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-1">
                    <Link
                      href="/student/applications"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                      <span>My Applications</span>
                    </Link>
                    <Link
                      href="/student/messages"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      <span>Messages</span>
                    </Link>
                    <Link
                      href="/gigs"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                      <span>Browse Gigs</span>
                    </Link>
                  </nav>
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
