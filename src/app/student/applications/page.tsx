'use client'

import { useState, useEffect } from 'react'
import { useAuth, getSupabase } from '@/lib/auth'
import { RequireAuth } from '@/components/auth/RequireAuth'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Loader2,
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
  IndianRupee,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface Application {
  id: string
  status: string
  applied_at: string
  gig: {
    id: string
    title: string
    area: string
    pay_min: number
    pay_max: number
    pay_type: string
    schedule_type: string
    employer: {
      venue_name: string
      logo_url: string | null
    }
  }
}

const STATUS_CONFIG = {
  pending: { label: 'Pending', variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600' },
  viewed: { label: 'Viewed', variant: 'outline' as const, icon: Eye, color: 'text-blue-600' },
  shortlisted: { label: 'Shortlisted', variant: 'default' as const, icon: CheckCircle2, color: 'text-green-600' },
  accepted: { label: 'Accepted', variant: 'default' as const, icon: CheckCircle2, color: 'text-green-600' },
  rejected: { label: 'Not Selected', variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
}

function ApplicationsContent() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    if (!user) return

    const supabase = getSupabase()

    const loadApplications = async () => {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select(`
            id,
            status,
            applied_at,
            gig:gigs(
              id,
              title,
              area,
              pay_min,
              pay_max,
              pay_type,
              schedule_type,
              employer:employer_profiles(venue_name, logo_url)
            )
          `)
          .eq('student_id', user.id)
          .order('applied_at', { ascending: false }) as { data: Application[] | null, error: Error | null }

        if (error) {
          console.error('Error loading applications:', error)
        } else {
          setApplications(data || [])
        }
      } catch (error) {
        console.error('Applications page error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadApplications()
  }, [user])

  const filteredApplications = applications.filter(app => {
    if (activeTab === 'all') return true
    if (activeTab === 'active') return ['pending', 'viewed', 'shortlisted'].includes(app.status)
    if (activeTab === 'accepted') return app.status === 'accepted'
    if (activeTab === 'rejected') return app.status === 'rejected'
    return true
  })

  const formatPay = (app: Application) => {
    const payTypeLabel = {
      hourly: '/hr',
      daily: '/day',
      monthly: '/mo',
      stipend: '',
    }[app.gig.pay_type] || ''

    if (app.gig.pay_min === app.gig.pay_max) {
      return `₹${app.gig.pay_min}${payTypeLabel}`
    }
    return `₹${app.gig.pay_min}-${app.gig.pay_max}${payTypeLabel}`
  }

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending
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
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <main className="flex-1 bg-muted/30 pt-24">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Applications</h1>
          <p className="text-muted-foreground">
            Track the status of your job applications
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">
              All ({applications.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({applications.filter(a => ['pending', 'viewed', 'shortlisted'].includes(a.status)).length})
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Accepted ({applications.filter(a => a.status === 'accepted').length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Not Selected ({applications.filter(a => a.status === 'rejected').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredApplications.length > 0 ? (
              <div className="space-y-4">
                {filteredApplications.map((app) => (
                  <Card key={app.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <Avatar className="h-14 w-14 rounded-lg flex-shrink-0">
                          <AvatarImage src={app.gig?.employer?.logo_url || undefined} />
                          <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-lg">
                            {app.gig?.employer?.venue_name?.[0]?.toUpperCase() || 'V'}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <Link
                              href={`/gigs/${app.gig?.id}`}
                              className="font-semibold text-lg hover:text-primary transition-colors"
                            >
                              {app.gig?.title}
                            </Link>
                            {getStatusBadge(app.status)}
                          </div>

                          <p className="text-muted-foreground mb-2">
                            {app.gig?.employer?.venue_name}
                          </p>

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {app.gig?.area}
                            </div>
                            <div className="flex items-center gap-1">
                              <IndianRupee className="h-4 w-4" />
                              {formatPay(app)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Applied {formatDistanceToNow(new Date(app.applied_at), { addSuffix: true })}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 sm:flex-col">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/gigs/${app.gig?.id}`}>
                              View Gig
                            </Link>
                          </Button>
                          {(app.status === 'shortlisted' || app.status === 'accepted') && (
                            <Button size="sm" asChild>
                              <Link href="/student/messages">
                                <MessageSquare className="mr-1 h-4 w-4" />
                                Message
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No applications found</h3>
                  <p className="text-muted-foreground mb-6">
                    {activeTab === 'all'
                      ? "You haven't applied to any gigs yet"
                      : `No ${activeTab} applications`}
                  </p>
                  <Button asChild>
                    <Link href="/gigs">Browse Gigs</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

export default function ApplicationsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <RequireAuth requiredRole="student">
        <ApplicationsContent />
      </RequireAuth>
      <Footer />
    </div>
  )
}
