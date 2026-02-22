'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Loader2,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Users,
  MapPin,
  IndianRupee,
  Clock,
  Briefcase,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { CATEGORIES } from '@/lib/constants'
import { toast } from 'sonner'
import Link from 'next/link'

interface Gig {
  id: string
  title: string
  category: string
  area: string
  pay_min: number
  pay_max: number
  pay_type: string
  schedule_type: string
  is_active: boolean
  applications_count: number
  created_at: string
}

export default function EmployerGigsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [gigs, setGigs] = useState<Gig[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteGigId, setDeleteGigId] = useState<string | null>(null)

  useEffect(() => {
    const loadGigs = async () => {
      const { data: { session } } = await supabase.auth.getSession(); const user = session?.user

      if (!user) {
        router.push('/?login=required')
        return
      }

      const { data, error } = await supabase
        .from('gigs')
        .select('*')
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false }) as { data: Gig[] | null, error: Error | null }

      if (error) {
        console.error('Error loading gigs:', error)
      } else {
        setGigs(data || [])
      }

      setIsLoading(false)
    }

    loadGigs()
  }, [supabase, router])

  const toggleGigStatus = async (gigId: string, isActive: boolean) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('gigs')
      .update({ is_active: isActive })
      .eq('id', gigId)

    if (error) {
      toast.error('Failed to update gig status')
    } else {
      setGigs(gigs.map(g => g.id === gigId ? { ...g, is_active: isActive } : g))
      toast.success(isActive ? 'Gig is now active' : 'Gig is now inactive')
    }
  }

  const deleteGig = async () => {
    if (!deleteGigId) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('gigs')
      .delete()
      .eq('id', deleteGigId)

    if (error) {
      toast.error('Failed to delete gig')
    } else {
      setGigs(gigs.filter(g => g.id !== deleteGigId))
      toast.success('Gig deleted')
    }

    setDeleteGigId(null)
  }

  const formatPay = (gig: Gig) => {
    const payTypeLabel = {
      hourly: '/hr',
      daily: '/day',
      monthly: '/mo',
      stipend: '',
    }[gig.pay_type] || ''

    if (gig.pay_min === gig.pay_max) {
      return `₹${gig.pay_min}${payTypeLabel}`
    }
    return `₹${gig.pay_min}-${gig.pay_max}${payTypeLabel}`
  }

  const scheduleLabel = (type: string) => ({
    weekends: 'Weekends',
    evenings: 'Evenings',
    flexible: 'Flexible',
    fullday: 'Full Day',
  }[type] || type)

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Manage Gigs</h1>
              <p className="text-muted-foreground">
                Create and manage your job listings
              </p>
            </div>
            <Button asChild>
              <Link href="/employer/gigs/new">
                <Plus className="mr-2 h-4 w-4" />
                Post New Gig
              </Link>
            </Button>
          </div>

          {gigs.length > 0 ? (
            <div className="space-y-4">
              {gigs.map((gig) => {
                const category = CATEGORIES.find(c => c.slug === gig.category)

                return (
                  <Card key={gig.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <Link
                              href={`/employer/gigs/${gig.id}`}
                              className="font-semibold text-lg hover:text-primary transition-colors"
                            >
                              {gig.title}
                            </Link>
                            <Badge variant={gig.is_active ? 'default' : 'secondary'}>
                              {gig.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge variant="outline">
                              {category?.name || gig.category}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {gig.area}
                            </div>
                            <div className="flex items-center gap-1">
                              <IndianRupee className="h-4 w-4" />
                              {formatPay(gig)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {scheduleLabel(gig.schedule_type)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {gig.applications_count} applicant{gig.applications_count !== 1 ? 's' : ''}
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground mt-2">
                            Posted {formatDistanceToNow(new Date(gig.created_at), { addSuffix: true })}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Active</span>
                            <Switch
                              checked={gig.is_active}
                              onCheckedChange={(checked) => toggleGigStatus(gig.id, checked)}
                            />
                          </div>

                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/employer/gigs/${gig.id}/applicants`}>
                              <Users className="mr-1 h-4 w-4" />
                              View Applicants
                            </Link>
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/employer/gigs/${gig.id}/edit`}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setDeleteGigId(gig.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
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
                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No gigs yet</h3>
                <p className="text-muted-foreground mb-6">
                  Post your first gig to start finding great talent
                </p>
                <Button asChild>
                  <Link href="/employer/gigs/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Post Your First Gig
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteGigId} onOpenChange={() => setDeleteGigId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this gig?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All applications for this gig will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteGig}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
