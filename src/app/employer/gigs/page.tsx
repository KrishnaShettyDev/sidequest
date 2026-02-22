'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { EmployerLayout } from '@/components/employer/EmployerLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
  Calendar,
  Briefcase,
  Search,
  RefreshCw,
  Eye,
} from 'lucide-react'
import { format } from 'date-fns'
import { CATEGORIES } from '@/lib/constants'
import { toast } from 'sonner'
import Link from 'next/link'
import { cn } from '@/lib/utils'

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
  required_skills: string[]
  created_at: string
}

export default function EmployerGigsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [gigs, setGigs] = useState<Gig[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteGigId, setDeleteGigId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active')
  const [searchQuery, setSearchQuery] = useState('')

  const loadGigs = async () => {
    setIsLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user

    if (!user) {
      router.push('/?login=required')
      return
    }

    const { data, error } = await supabase
      .from('gigs')
      .select('*')
      .eq('employer_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading gigs:', error)
    } else {
      setGigs(data || [])
    }

    setIsLoading(false)
  }

  useEffect(() => {
    loadGigs()
  }, [supabase, router])

  const deleteGig = async () => {
    if (!deleteGigId) return

    const { error } = await supabase
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

  // Filter gigs
  const filteredGigs = gigs.filter((gig) => {
    const matchesTab = activeTab === 'active' ? gig.is_active : !gig.is_active
    const matchesSearch = searchQuery
      ? gig.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchesTab && matchesSearch
  })

  const activeCount = gigs.filter((g) => g.is_active).length
  const inactiveCount = gigs.filter((g) => !g.is_active).length

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
        <div className="container py-8 max-w-5xl">
          {/* Breadcrumb */}
          <div className="text-sm text-muted-foreground mb-2">
            <Link href="/employer/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <span className="mx-2">&gt;</span>
            <span>Gigs</span>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold">Your Gigs</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={loadGigs}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm" asChild>
                <Link href="/employer/gigs/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New
                </Link>
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('active')}
              className={cn(
                'flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2',
                activeTab === 'active'
                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                  : 'bg-card border hover:bg-muted'
              )}
            >
              Active Gigs
              <Badge
                variant="secondary"
                className={cn(
                  'rounded-full',
                  activeTab === 'active' ? 'bg-amber-200 text-amber-900' : ''
                )}
              >
                {activeCount}
              </Badge>
            </button>
            <button
              onClick={() => setActiveTab('inactive')}
              className={cn(
                'flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2',
                activeTab === 'inactive'
                  ? 'bg-red-50 text-red-900 border border-red-200'
                  : 'bg-card border hover:bg-muted'
              )}
            >
              Inactive Gigs
              <Badge
                variant="secondary"
                className={cn(
                  'rounded-full',
                  activeTab === 'inactive' ? 'bg-red-100 text-red-900' : ''
                )}
              >
                {inactiveCount}
              </Badge>
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search gigs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Gig Cards */}
          {filteredGigs.length > 0 ? (
            <div className="space-y-4">
              {filteredGigs.map((gig) => {
                const category = CATEGORIES.find((c) => c.slug === gig.category)

                return (
                  <Card key={gig.id}>
                    <CardContent className="p-5">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        {/* Main Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-semibold text-lg leading-tight">
                                {gig.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-0.5">
                                {category?.name || gig.category}
                              </p>
                            </div>
                            <Badge
                              variant={gig.is_active ? 'default' : 'secondary'}
                              className={cn(
                                gig.is_active
                                  ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                  : ''
                              )}
                            >
                              {gig.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>

                          {/* Meta Info */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {gig.applications_count} applicant
                              {gig.applications_count !== 1 ? 's' : ''}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Posted {format(new Date(gig.created_at), 'MMM d, yyyy')}
                            </div>
                          </div>

                          {/* Skills Tags */}
                          {gig.required_skills && gig.required_skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {gig.required_skills.slice(0, 3).map((skill, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs font-normal"
                                >
                                  {skill}
                                </Badge>
                              ))}
                              {gig.required_skills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{gig.required_skills.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-amber-500 hover:bg-amber-600 text-white"
                            asChild
                          >
                            <Link href={`/employer/gigs/${gig.id}/applicants`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
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
                <h3 className="text-lg font-semibold mb-2">
                  {activeTab === 'active' ? 'No active gigs' : 'No inactive gigs'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {activeTab === 'active'
                    ? 'Post a gig to start finding great talent'
                    : 'Your inactive gigs will appear here'}
                </p>
                {activeTab === 'active' && (
                  <Button asChild>
                    <Link href="/employer/gigs/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Post Your First Gig
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Pagination placeholder */}
          {filteredGigs.length > 0 && (
            <div className="flex justify-center mt-6">
              <p className="text-sm text-muted-foreground">
                Page 1 of 1
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteGigId} onOpenChange={() => setDeleteGigId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this gig?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All applications for this gig will
              also be deleted.
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
    </EmployerLayout>
  )
}
