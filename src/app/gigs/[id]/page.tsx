'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Loader2,
  MapPin,
  Clock,
  IndianRupee,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Instagram,
  Globe,
  Briefcase,
} from 'lucide-react'
import { CATEGORIES, COMMON_PERKS } from '@/lib/constants'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import Link from 'next/link'

interface Gig {
  id: string
  title: string
  description: string
  category: string
  area: string
  address: string
  pay_min: number
  pay_max: number
  pay_type: string
  schedule_type: string
  schedule_details: string
  duration: string
  required_skills: string[]
  requirements: string[]
  perks: string[]
  created_at: string
  employer_id: string
  employer?: {
    venue_name: string
    logo_url: string | null
    cover_photo_url: string | null
    description: string
    website_url: string | null
    instagram_url: string | null
    google_maps_url: string | null
  }
}

export default function GigDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [supabase] = useState(() => createClient())

  const [gig, setGig] = useState<Gig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<{ id: string; role?: string } | null>(null)
  const [hasApplied, setHasApplied] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [showApplyDialog, setShowApplyDialog] = useState(false)
  const [profileComplete, setProfileComplete] = useState(false)
  const [hasStudentProfile, setHasStudentProfile] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        // Load gig first
        const { data: gigData, error: gigError } = await supabase
          .from('gigs')
          .select(`
            *,
            employer:employer_profiles(
              venue_name,
              logo_url,
              cover_photo_url,
              description,
              website_url,
              instagram_url,
              google_maps_url
            )
          `)
          .eq('id', params.id)
          .single()

        if (!isMounted) return

        if (gigError || !gigData) {
          console.error('Error loading gig:', gigError)
          router.push('/gigs')
          return
        }

        setGig(gigData as Gig)

        // Check session
        const { data: { session } } = await supabase.auth.getSession()
        const authUser = session?.user

        if (authUser && isMounted) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', authUser.id)
            .maybeSingle()

          if (!isMounted) return
          setUser({ id: authUser.id, role: (profile as { role: string } | null)?.role })

          // Check student-specific data
          if ((profile as { role: string } | null)?.role === 'student') {
            const { data: studentProfile } = await supabase
              .from('student_profiles')
              .select('id, first_name, phone, college')
              .eq('id', authUser.id)
              .maybeSingle()

            if (!isMounted) return

            if (!studentProfile) {
              setHasStudentProfile(false)
              setProfileComplete(false)
            } else {
              setHasStudentProfile(true)
              const sp = studentProfile as { first_name: string; phone: string; college: string }
              setProfileComplete(!!(sp.first_name && sp.phone && sp.college))

              // Check if already applied
              const { data: application } = await supabase
                .from('applications')
                .select('id')
                .eq('gig_id', params.id)
                .eq('student_id', authUser.id)
                .maybeSingle()

              if (isMounted) {
                setHasApplied(!!application)
              }
            }
          }
        }
      } catch (error) {
        console.error('Gig detail error:', error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [params.id, supabase, router])

  const handleApply = async () => {
    if (!user) {
      toast.error('Please sign in to apply')
      return
    }

    if (!hasStudentProfile) {
      toast.error('Please complete your profile first')
      router.push('/student/onboarding/about')
      return
    }

    if (!profileComplete) {
      toast.error('Please complete your profile first')
      router.push('/student/profile')
      return
    }

    setIsApplying(true)

    try {
      // Insert application - conversation is created automatically by database trigger
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('applications')
        .insert({
          gig_id: gig?.id,
          student_id: user.id,
          employer_id: gig?.employer_id,
          status: 'pending',
        })

      if (error) {
        console.error('Application insert error:', error)
        throw error
      }

      setHasApplied(true)
      setShowApplyDialog(false)
      toast.success('Application submitted! The employer will review your profile.')
    } catch (error) {
      console.error('Error applying:', error)
      toast.error('Failed to apply. Please try again.')
    } finally {
      setIsApplying(false)
    }
  }

  const formatPay = () => {
    if (!gig) return ''
    const payTypeLabel = {
      hourly: '/hr',
      daily: '/day',
      monthly: '/mo',
      stipend: ' stipend',
    }[gig.pay_type] || ''

    if (gig.pay_min === gig.pay_max) {
      return `₹${gig.pay_min}${payTypeLabel}`
    }
    return `₹${gig.pay_min}-${gig.pay_max}${payTypeLabel}`
  }

  const scheduleLabel = gig ? {
    weekends: 'Weekends',
    evenings: 'Evenings',
    flexible: 'Flexible',
    fullday: 'Full Day',
  }[gig.schedule_type] || gig.schedule_type : ''

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

  if (!gig) return null

  const category = CATEGORIES.find(c => c.slug === gig.category)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 pt-24">
        {/* Cover Photo */}
        {gig.employer?.cover_photo_url && (
          <div className="h-48 md:h-64 bg-muted overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gig.employer.cover_photo_url}
              alt={gig.employer.venue_name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="container py-8">
          {/* Back button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to gigs
          </Button>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 rounded-xl">
                  <AvatarImage src={gig.employer?.logo_url || undefined} />
                  <AvatarFallback className="rounded-xl bg-primary/10 text-primary text-xl">
                    {gig.employer?.venue_name?.[0]?.toUpperCase() || 'V'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Badge variant="secondary" className="mb-2">
                    {category?.name || gig.category}
                  </Badge>
                  <h1 className="text-2xl md:text-3xl font-bold">{gig.title}</h1>
                  <p className="text-lg text-muted-foreground">
                    {gig.employer?.venue_name}
                  </p>
                </div>
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span>{gig.area}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <span>{scheduleLabel}</span>
                </div>
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <IndianRupee className="h-5 w-5" />
                  <span>{formatPay()}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Posted {formatDistanceToNow(new Date(gig.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>

              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-3">About this gig</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {gig.description}
                  </p>
                </CardContent>
              </Card>

              {/* Schedule Details */}
              {(gig.schedule_details || gig.duration) && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-3">Schedule & Duration</h2>
                    <div className="space-y-2 text-muted-foreground">
                      {gig.schedule_details && (
                        <p><strong>Schedule:</strong> {gig.schedule_details}</p>
                      )}
                      {gig.duration && (
                        <p><strong>Duration:</strong> {gig.duration}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Required Skills */}
              {gig.required_skills && gig.required_skills.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-3">Required Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {gig.required_skills.map((skill, i) => (
                        <Badge key={i} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Requirements */}
              {gig.requirements && gig.requirements.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-3">Requirements</h2>
                    <ul className="space-y-2">
                      {gig.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Perks */}
              {gig.perks && gig.perks.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-3">Perks</h2>
                    <div className="flex flex-wrap gap-2">
                      {gig.perks.map((perk, i) => {
                        const perkInfo = COMMON_PERKS.find(p => p.value === perk)
                        return (
                          <Badge key={i} variant="secondary" className="py-1.5">
                            {perkInfo?.label || perk}
                          </Badge>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {formatPay()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {scheduleLabel} • {gig.area}
                    </div>
                  </div>

                  {user?.role === 'student' ? (
                    hasApplied ? (
                      <Button className="w-full" disabled>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Applied
                      </Button>
                    ) : !hasStudentProfile || !profileComplete ? (
                      <Button
                        className="w-full"
                        size="lg"
                        variant="secondary"
                        asChild
                      >
                        <Link href="/student/onboarding/about">
                          Complete Profile to Apply
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => setShowApplyDialog(true)}
                      >
                        Apply Now
                      </Button>
                    )
                  ) : user?.role === 'employer' ? (
                    <p className="text-sm text-center text-muted-foreground">
                      Sign in as a student to apply
                    </p>
                  ) : (
                    <Button className="w-full" size="lg" asChild>
                      <Link href="/?signup=true">Sign up to Apply</Link>
                    </Button>
                  )}

                </CardContent>
              </Card>

              {/* Venue Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">About the Venue</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12 rounded-lg">
                      <AvatarImage src={gig.employer?.logo_url || undefined} />
                      <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                        {gig.employer?.venue_name?.[0]?.toUpperCase() || 'V'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{gig.employer?.venue_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {category?.name}
                      </p>
                    </div>
                  </div>

                  {gig.employer?.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {gig.employer.description}
                    </p>
                  )}

                  {gig.address && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>{gig.address}</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {gig.employer?.website_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={gig.employer.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Globe className="mr-1 h-4 w-4" />
                          Website
                        </a>
                      </Button>
                    )}
                    {gig.employer?.instagram_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={gig.employer.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Instagram className="mr-1 h-4 w-4" />
                          Instagram
                        </a>
                      </Button>
                    )}
                    {gig.employer?.google_maps_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={gig.employer.google_maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-1 h-4 w-4" />
                          Map
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Apply Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for {gig.title}</DialogTitle>
            <DialogDescription>
              Your profile will be shared with {gig.employer?.venue_name}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <Avatar className="h-12 w-12 rounded-lg">
                <AvatarImage src={gig.employer?.logo_url || undefined} />
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                  {gig.employer?.venue_name?.[0]?.toUpperCase() || 'V'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{gig.title}</p>
                <p className="text-sm text-muted-foreground">
                  {gig.employer?.venue_name} • {gig.area}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              By applying, you agree to share your profile information with the employer.
              They will be able to view your skills, experience, and contact you through the app.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowApplyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply} disabled={isApplying}>
              {isApplying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <Briefcase className="mr-2 h-4 w-4" />
                  Confirm Application
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
