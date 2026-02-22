'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  Calendar,
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
  const router = useRouter()
  const supabase = createClient()

  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)

  useEffect(() => {
    const loadApplications = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user

      if (!user) {
        router.push('/?login=required')
        return
      }

      // Load all applications for this employer
      const { data: applicationsData } = await supabase
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

      if (applicationsData) {
        // Fetch skills for each student
        const applicationsWithSkills = await Promise.all(
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
  }, [supabase, router])

  const updateApplicationStatus = async (appId: string, newStatus: string) => {
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', appId)

    if (error) {
      toast.error('Failed to update status')
    } else {
      setApplications(
        applications.map((app) =>
          app.id === appId ? { ...app, status: newStatus } : app
        )
      )
      toast.success(`Application ${newStatus}`)
      setSelectedApplication(null)
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Student Applications</h1>
            <p className="text-muted-foreground">
              Manage and review applications from talented students eager to work at your venue.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-600 font-medium uppercase">Total</p>
                    <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-amber-600 font-medium uppercase">Applied</p>
                    <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-amber-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-purple-600 font-medium uppercase">Shortlisted</p>
                    <p className="text-2xl font-bold text-purple-700">{stats.shortlisted}</p>
                  </div>
                  <Star className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-green-600 font-medium uppercase">Accepted</p>
                    <p className="text-2xl font-bold text-green-700">{stats.accepted}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-red-600 font-medium uppercase">Rejected</p>
                    <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
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
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                        Student
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                        Skills
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                        Applied For
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredApplications.map((app) => {
                      const statusConfig = STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG] ||
                        STATUS_CONFIG.pending

                      return (
                        <tr key={app.id} className="hover:bg-muted/30">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border">
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
                                  {app.student?.college}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {app.skills?.slice(0, 2).map((skill, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs font-normal"
                                >
                                  {skill.skill_name}
                                </Badge>
                              ))}
                              {app.skills && app.skills.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{app.skills.length - 2}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <p className="text-sm font-medium">{app.gig?.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(app.applied_at), 'MMM d, yyyy')}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <Badge className={cn('font-normal', statusConfig.color)}>
                              {statusConfig.label}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedApplication(app)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
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
              <div className="border-t px-4 py-3 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  1-{filteredApplications.length} of {filteredApplications.length}
                </p>
              </div>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No applications found</h3>
                <p className="text-muted-foreground">
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
