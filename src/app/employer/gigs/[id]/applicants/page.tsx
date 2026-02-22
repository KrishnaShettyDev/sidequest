'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Loader2,
  ArrowLeft,
  MoreVertical,
  CheckCircle2,
  XCircle,
  MessageSquare,
  GraduationCap,
  MapPin,
  Clock,
  Eye,
  Phone,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import Link from 'next/link'

interface Applicant {
  id: string
  status: string
  applied_at: string
  student: {
    id: string
    first_name: string
    last_name: string
    photo_url: string | null
    college: string
    year: string
    bio: string
    city: string
    phone: string
    email?: string
  }
  skills?: Array<{
    skill_name: string
    proficiency: string
  }>
}

interface Gig {
  id: string
  title: string
  applications_count: number
}

const STATUS_CONFIG = {
  pending: { label: 'New', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
  viewed: { label: 'Viewed', variant: 'outline' as const, color: 'bg-blue-100 text-blue-800' },
  shortlisted: { label: 'Shortlisted', variant: 'default' as const, color: 'bg-green-100 text-green-800' },
  accepted: { label: 'Accepted', variant: 'default' as const, color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
}

export default function ApplicantsPage() {
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  const [gig, setGig] = useState<Gig | null>(null)
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const { data: { session } } = await supabase.auth.getSession(); const user = session?.user

      if (!user) {
        router.push('/?login=required')
        return
      }

      // Load gig
      const { data: gigData } = await supabase
        .from('gigs')
        .select('id, title, applications_count')
        .eq('id', params.id)
        .eq('employer_id', user.id)
        .single() as { data: Gig | null }

      if (!gigData) {
        router.push('/employer/gigs')
        return
      }

      setGig(gigData)

      // Load applicants
      const { data: applicantsData } = await supabase
        .from('applications')
        .select(`
          id,
          status,
          applied_at,
          student:student_profiles(
            id,
            first_name,
            last_name,
            photo_url,
            college,
            year,
            bio,
            city,
            phone
          )
        `)
        .eq('gig_id', params.id)
        .order('applied_at', { ascending: false }) as { data: Applicant[] | null }

      if (applicantsData) {
        // Load skills for each applicant
        const applicantsWithSkills = await Promise.all(
          applicantsData.map(async (app) => {
            const { data: skills } = await supabase
              .from('student_skills')
              .select('skill_name, proficiency')
              .eq('student_id', app.student?.id)
              .limit(5) as { data: Array<{ skill_name: string; proficiency: string }> | null }

            return { ...app, skills: skills || [] }
          })
        )
        setApplicants(applicantsWithSkills)
      }

      setIsLoading(false)
    }

    loadData()
  }, [supabase, router, params.id])

  const updateStatus = async (applicationId: string, newStatus: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('applications')
      .update({ status: newStatus })
      .eq('id', applicationId)

    if (error) {
      toast.error('Failed to update status')
    } else {
      setApplicants(apps =>
        apps.map(a => a.id === applicationId ? { ...a, status: newStatus } : a)
      )
      toast.success(`Applicant ${newStatus}`)
      setSelectedApplicant(null)
    }
  }

  const viewApplicant = async (applicant: Applicant) => {
    // Mark as viewed if pending
    if (applicant.status === 'pending') {
      await updateStatus(applicant.id, 'viewed')
      applicant.status = 'viewed'
    }
    setSelectedApplicant(applicant)
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
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/employer/gigs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Gigs
            </Link>
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold">Applicants for {gig?.title}</h1>
            <p className="text-muted-foreground">
              {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-4 mb-8">
            {Object.entries(STATUS_CONFIG).map(([status, config]) => {
              const count = applicants.filter(a => a.status === status).length
              return (
                <Card key={status}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{config.label}</span>
                      <Badge variant={config.variant}>{count}</Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Applicants List */}
          {applicants.length > 0 ? (
            <div className="space-y-4">
              {applicants.map((applicant) => {
                const statusConfig = STATUS_CONFIG[applicant.status as keyof typeof STATUS_CONFIG]

                return (
                  <Card
                    key={applicant.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => viewApplicant(applicant)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <Avatar className="h-14 w-14 flex-shrink-0">
                          <AvatarImage src={applicant.student?.photo_url || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary text-lg">
                            {applicant.student?.first_name?.[0]?.toUpperCase() || 'S'}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-lg">
                              {applicant.student?.first_name} {applicant.student?.last_name}
                            </span>
                            <Badge variant={statusConfig?.variant}>
                              {statusConfig?.label}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <GraduationCap className="h-4 w-4" />
                              {applicant.student?.college} • {applicant.student?.year}
                            </div>
                            {applicant.student?.city && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {applicant.student.city}
                              </div>
                            )}
                          </div>

                          {applicant.skills && applicant.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {applicant.skills.slice(0, 4).map((skill, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {skill.skill_name}
                                </Badge>
                              ))}
                              {applicant.skills.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{applicant.skills.length - 4}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(applicant.applied_at), { addSuffix: true })}
                          </span>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => viewApplicant(applicant)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateStatus(applicant.id, 'shortlisted')}>
                                <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                                Shortlist
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateStatus(applicant.id, 'accepted')}>
                                <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                                Accept
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateStatus(applicant.id, 'rejected')}>
                                <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                Reject
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No applicants yet</h3>
                <p className="text-muted-foreground">
                  Applications will appear here when students apply
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />

      {/* Applicant Detail Modal */}
      <Dialog open={!!selectedApplicant} onOpenChange={() => setSelectedApplicant(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedApplicant && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedApplicant.student?.photo_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {selectedApplicant.student?.first_name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      {selectedApplicant.student?.first_name} {selectedApplicant.student?.last_name}
                      <Badge variant={STATUS_CONFIG[selectedApplicant.status as keyof typeof STATUS_CONFIG]?.variant}>
                        {STATUS_CONFIG[selectedApplicant.status as keyof typeof STATUS_CONFIG]?.label}
                      </Badge>
                    </div>
                    <p className="text-sm font-normal text-muted-foreground">
                      {selectedApplicant.student?.college} • {selectedApplicant.student?.year}
                    </p>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Applied {formatDistanceToNow(new Date(selectedApplicant.applied_at), { addSuffix: true })}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Contact Info */}
                <div>
                  <h4 className="font-semibold mb-2">Contact Information</h4>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {selectedApplicant.student?.phone && (
                      <a
                        href={`tel:${selectedApplicant.student.phone}`}
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <Phone className="h-4 w-4" />
                        {selectedApplicant.student.phone}
                      </a>
                    )}
                    {selectedApplicant.student?.city && (
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {selectedApplicant.student.city}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {selectedApplicant.student?.bio && (
                  <div>
                    <h4 className="font-semibold mb-2">About</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {selectedApplicant.student.bio}
                    </p>
                  </div>
                )}

                {/* Skills */}
                {selectedApplicant.skills && selectedApplicant.skills.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplicant.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary">
                          {skill.skill_name}
                          <span className="ml-1 text-xs opacity-70">
                            ({skill.proficiency})
                          </span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                {selectedApplicant.status !== 'accepted' && (
                  <Button onClick={() => updateStatus(selectedApplicant.id, 'accepted')}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Accept
                  </Button>
                )}
                {selectedApplicant.status !== 'shortlisted' && selectedApplicant.status !== 'accepted' && (
                  <Button variant="outline" onClick={() => updateStatus(selectedApplicant.id, 'shortlisted')}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Shortlist
                  </Button>
                )}
                {selectedApplicant.status !== 'rejected' && (
                  <Button
                    variant="outline"
                    className="text-destructive"
                    onClick={() => updateStatus(selectedApplicant.id, 'rejected')}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                )}
                <Button variant="outline" asChild>
                  <Link href="/employer/messages">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  </Link>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
