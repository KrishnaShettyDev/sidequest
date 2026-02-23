'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { EmployerLayout } from '@/components/employer/EmployerLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Loader2,
  Search,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  MoreHorizontal,
  MessageSquare,
  GraduationCap,
  Phone,
  MapPin,
  Star,
  FileText,
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Application {
  id: string
  status: string
  applied_at: string
  gig: {
    id: string
    title: string
  }
  student: {
    id: string
    first_name: string
    last_name: string
    photo_url: string | null
    college: string
    year: string
    phone: string
    city: string
    bio: string
  }
  skills: {
    skill_name: string
    proficiency: string
  }[]
}

const STATUS_CONFIG = {
  pending: { label: 'Applied', color: 'bg-amber-100 text-amber-700', icon: Clock },
  viewed: { label: 'Viewed', color: 'bg-blue-100 text-blue-700', icon: Eye },
  shortlisted: { label: 'Shortlisted', color: 'bg-purple-100 text-purple-700', icon: Star },
  accepted: { label: 'Accepted', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
}

export default function EmployerApplicationsPage() {
  const [supabase] = useState(() => createClient())

  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const loadApplications = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        setIsLoading(false)
        if (authError) {
          toast.error('Authentication error. Please sign in again.')
        }
        return
      }

      setUserId(user.id)

      // Load all applications for this employer
      const { data: applicationsData, error: fetchError } = await supabase
        .from('applications')
        .select(`
          id,
          status,
          applied_at,
          gig:gigs(id, title),
          student:student_profiles(id, first_name, last_name, photo_url, college, year, phone, city, bio)
        `)
        .eq('employer_id', user.id)
        .order('applied_at', { ascending: false })

      if (fetchError) {
        toast.error('Failed to load applications')
        setIsLoading(false)
        return
      }

      if (applicationsData) {
        // Fetch skills for each student
        const applicationsWithSkills = await Promise.all(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          applicationsData.map(async (app: any) => {
            const { data: skillsData } = await supabase
              .from('student_skills')
              .select('skill_name, proficiency')
              .eq('student_id', app.student?.id)

            return {
              ...app,
              skills: skillsData || [],
            }
          })
        )

        setApplications(applicationsWithSkills)
      }

      setIsLoading(false)
    }

    loadApplications()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateApplicationStatus = async (appId: string, newStatus: string) => {
    if (!userId) {
      toast.error('Please sign in to update applications')
      return
    }

    // Verify the application belongs to this employer (client-side check)
    const app = applications.find((a) => a.id === appId)
    if (!app) {
      toast.error('Application not found')
      return
    }

    // Validate status value to prevent injection
    const validStatuses = ['pending', 'viewed', 'shortlisted', 'accepted', 'rejected', 'expired']
    if (!validStatuses.includes(newStatus)) {
      toast.error('Invalid status')
      return
    }

    setIsUpdating(true)

    try {
      // The RLS policy ensures only the employer can update their own applications
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('applications')
        .update({ status: newStatus })
        .eq('id', appId)
        .eq('employer_id', userId) // Additional server-side ownership check

      if (error) {
        console.error('Error updating application:', error)
        toast.error('Failed to update status')
        return
      }

      setApplications(
        applications.map((a) =>
          a.id === appId ? { ...a, status: newStatus } : a
        )
      )
      toast.success(`Application ${newStatus}`)
      setSelectedApplication(null)
    } catch (err) {
      console.error('Unexpected error:', err)
      toast.error('An unexpected error occurred')
    } finally {
      setIsUpdating(false)
    }
  }

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch = searchQuery
      ? `${app.student?.first_name} ${app.student?.last_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        app.gig?.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Stats
  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">Student Applications</h1>
            <p className="text-sm text-muted-foreground">
              Manage and review applications from talented students
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                    <p className="text-xs text-muted-foreground">Applied</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Star className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.shortlisted}</p>
                    <p className="text-xs text-muted-foreground">Shortlisted</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.accepted}</p>
                    <p className="text-xs text-muted-foreground">Accepted</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.rejected}</p>
                    <p className="text-xs text-muted-foreground">Rejected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or gig..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-44 h-10">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Applied</SelectItem>
                <SelectItem value="viewed">Viewed</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Applications Table */}
          {filteredApplications.length > 0 ? (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Student
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                        Skills
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Applied For
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredApplications.map((app) => {
                      const statusConfig = STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG] ||
                        STATUS_CONFIG.pending

                      return (
                        <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src={app.student?.photo_url || undefined} />
                                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                  {app.student?.first_name?.[0]?.toUpperCase() || 'S'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-medium text-sm truncate">
                                  {app.student?.first_name} {app.student?.last_name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {app.student?.college}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 hidden md:table-cell">
                            <div className="flex flex-wrap gap-1.5">
                              {app.skills?.slice(0, 2).map((skill, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs font-normal px-2 py-0.5"
                                >
                                  {skill.skill_name}
                                </Badge>
                              ))}
                              {app.skills && app.skills.length > 2 && (
                                <Badge variant="outline" className="text-xs px-2 py-0.5">
                                  +{app.skills.length - 2}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div>
                              <p className="text-sm font-medium truncate max-w-[180px]">{app.gig?.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(app.applied_at), 'MMM d, yyyy')}
                              </p>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <Badge className={cn('font-normal text-xs', statusConfig.color)}>
                              {statusConfig.label}
                            </Badge>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setSelectedApplication(app)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isUpdating}>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => updateApplicationStatus(app.id, 'shortlisted')}
                                  >
                                    <Star className="mr-2 h-4 w-4" />
                                    Shortlist
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => updateApplicationStatus(app.id, 'accepted')}
                                  >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Accept
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => updateApplicationStatus(app.id, 'rejected')}
                                    className="text-destructive"
                                  >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="border-t bg-muted/20 px-5 py-3 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredApplications.length} of {applications.length} applications
                </p>
              </div>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-20 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mx-auto mb-4">
                  <Users className="h-7 w-7 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No applications found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Applications will appear here once students apply to your gigs'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      <Dialog
        open={!!selectedApplication}
        onOpenChange={() => setSelectedApplication(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedApplication && (
            <>
              <DialogHeader>
                <DialogTitle>Application Details</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Student Info */}
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 border-2">
                    <AvatarImage
                      src={selectedApplication.student?.photo_url || undefined}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {selectedApplication.student?.first_name?.[0]?.toUpperCase() ||
                        'S'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">
                      {selectedApplication.student?.first_name}{' '}
                      {selectedApplication.student?.last_name}
                    </h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        {selectedApplication.student?.college}
                      </span>
                      {selectedApplication.student?.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {selectedApplication.student.city}
                        </span>
                      )}
                      {selectedApplication.student?.phone && (
                        <a
                          href={`tel:${selectedApplication.student.phone}`}
                          className="flex items-center gap-1 hover:text-foreground"
                        >
                          <Phone className="h-4 w-4" />
                          {selectedApplication.student.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Applied For */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Applied For
                  </p>
                  <p className="font-medium">{selectedApplication.gig?.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Applied on{' '}
                    {format(new Date(selectedApplication.applied_at), 'MMMM d, yyyy')}
                  </p>
                </div>

                {/* Bio */}
                {selectedApplication.student?.bio && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      About
                    </p>
                    <p className="text-sm">{selectedApplication.student.bio}</p>
                  </div>
                )}

                {/* Skills */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.skills?.map((skill, idx) => (
                      <Badge key={idx} variant="secondary">
                        {skill.skill_name}
                        <span className="ml-1 text-muted-foreground">
                          ({skill.proficiency})
                        </span>
                      </Badge>
                    ))}
                    {(!selectedApplication.skills ||
                      selectedApplication.skills.length === 0) && (
                      <p className="text-sm text-muted-foreground">
                        No skills listed
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button
                    onClick={() =>
                      updateApplicationStatus(selectedApplication.id, 'accepted')
                    }
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      updateApplicationStatus(selectedApplication.id, 'shortlisted')
                    }
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Shortlist
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      updateApplicationStatus(selectedApplication.id, 'rejected')
                    }
                    className="text-destructive hover:text-destructive"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/employer/messages">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </EmployerLayout>
  )
}
