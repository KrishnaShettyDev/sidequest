'use client'

import { useState, useEffect } from 'react'
import { useAuth, getSupabase } from '@/lib/auth'
import { EmployerLayout } from '@/components/employer/EmployerLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Loader2,
  Plus,
  CheckCircle2,
  Mail,
  Phone,
  Instagram,
  MapPin,
  Building2,
  Calendar,
  Users,
  Pencil,
} from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

interface EmployerProfile {
  venue_name: string
  logo_url: string | null
  category: string
  area: string
  email: string
  phone: string
  instagram_url: string | null
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
  skills: {
    skill_name: string
  }[]
}

export default function EmployerDashboard() {
  const { user } = useAuth()

  const [profile, setProfile] = useState<EmployerProfile | null>(null)
  const [recentApplications, setRecentApplications] = useState<Application[]>([])
  const [stats, setStats] = useState({
    totalApplications: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    let isMounted = true
    const supabase = getSupabase()

    const loadDashboard = async () => {
      try {
        // Load profile
        const { data: profileData } = await supabase
          .from('employer_profiles')
          .select('venue_name, logo_url, category, area, email, phone, instagram_url, created_at')
          .eq('id', user.id)
          .maybeSingle()

        if (!isMounted) return

        if (profileData) {
          setProfile(profileData)
        }

        // Load applications
        const { data: applicationsData } = await supabase
          .from('applications')
          .select(`
            id,
            status,
            applied_at,
            student:student_profiles(id, first_name, last_name, photo_url, college),
            gig:gigs(id, title)
          `)
          .eq('employer_id', user.id)
          .order('applied_at', { ascending: false })
          .limit(10)

        if (!isMounted) return

        if (applicationsData && applicationsData.length > 0) {
          // Fetch skills for each student
          const applicationsWithSkills = await Promise.all(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            applicationsData.map(async (app: any) => {
              if (!app.student?.id) return { ...app, skills: [] }
              const { data: skillsData } = await supabase
                .from('student_skills')
                .select('skill_name')
                .eq('student_id', app.student.id)
                .limit(6)

              return {
                ...app,
                skills: skillsData || [],
              }
            })
          )

          if (isMounted) {
            setRecentApplications(applicationsWithSkills)
            setStats({
              totalApplications: applicationsData.length,
            })
          }
        }
      } catch (error) {
        console.error('Employer dashboard error:', error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      isMounted = false
    }
  }, [user])

  const getInstagramHandle = (url: string | null) => {
    if (!url) return null
    const match = url.match(/instagram\.com\/([^/?]+)/)
    return match ? `@${match[1]}` : url
  }

  if (isLoading) {
    return (
      <EmployerLayout>
        <div className="flex flex-1 items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </EmployerLayout>
    )
  }

  return (
    <EmployerLayout>
      <div className="bg-muted/30 min-h-full">
        <div className="container py-8 max-w-6xl">
          {/* Profile Card */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Avatar and Basic Info */}
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="h-20 w-20 rounded-xl border-2 border-border">
                    <AvatarImage src={profile?.logo_url || undefined} />
                    <AvatarFallback className="rounded-xl text-2xl bg-primary/10 text-primary">
                      {profile?.venue_name?.[0]?.toUpperCase() || 'V'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold">{profile?.venue_name}</h1>
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {profile?.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {profile.email}
                        </div>
                      )}
                      {profile?.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          +91 {profile.phone}
                        </div>
                      )}
                      {profile?.instagram_url && (
                        <div className="flex items-center gap-2">
                          <Instagram className="h-4 w-4" />
                          {getInstagramHandle(profile.instagram_url)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edit Profile Button */}
                <Button variant="outline" asChild>
                  <Link href="/employer/profile">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Verified</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Category</p>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium capitalize">{profile?.category || 'Not set'}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Member Since</p>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {profile?.created_at
                        ? format(new Date(profile.created_at), 'MMM yyyy')
                        : 'N/A'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Applications</p>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{stats.totalApplications}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Applicants Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground">
                Review & Shortlist the right ones for your gig!
              </p>
              <Button asChild>
                <Link href="/employer/gigs/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Gig
                </Link>
              </Button>
            </div>

            {recentApplications.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recentApplications.map((app) => (
                  <Card key={app.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      {/* Card Header */}
                      <div className="p-4 pb-3">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-12 w-12 border">
                            <AvatarImage src={app.student?.photo_url || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                              {app.student?.first_name?.[0]?.toUpperCase() || 'S'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">
                              {app.student?.first_name} {app.student?.last_name}
                            </h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Applied: {format(new Date(app.applied_at), 'dd MMM yyyy')}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="px-4 pb-3">
                        <p className="text-xs text-muted-foreground mb-2">Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                          {app.skills?.slice(0, 4).map((skill, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs font-normal"
                            >
                              {skill.skill_name}
                            </Badge>
                          ))}
                          {app.skills && app.skills.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{app.skills.length - 4} more
                            </Badge>
                          )}
                          {(!app.skills || app.skills.length === 0) && (
                            <span className="text-xs text-muted-foreground">No skills listed</span>
                          )}
                        </div>
                      </div>

                      {/* Gig Applied For */}
                      <div className="px-4 pb-3">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          Applied for: {app.gig?.title}
                        </p>
                      </div>

                      {/* Action Button */}
                      <Link
                        href={`/employer/gigs/${app.gig?.id}/applicants`}
                        className="block w-full bg-foreground text-background text-center py-3 text-sm font-medium hover:bg-foreground/90 transition-colors"
                      >
                        View Application
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground mb-4">No applications yet</p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Post a gig to start receiving applications from talented students
                  </p>
                  <Button asChild>
                    <Link href="/employer/gigs/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Post Your First Gig
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </EmployerLayout>
  )
}
