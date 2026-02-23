'use client'

import { useState, useEffect } from 'react'
import { useAuth, getSupabase } from '@/lib/auth'
import { RequireAuth } from '@/components/auth/RequireAuth'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Save,
} from 'lucide-react'
import { GENDERS, STUDENT_YEARS, INDIAN_STATES, SKILL_CATEGORIES, SKILLS, PROFICIENCY_LEVELS } from '@/lib/constants'
import { toast } from 'sonner'
import { sanitizeInput, sanitizeUrl, isValidPhone } from '@/lib/utils'

interface Skill {
  id?: string
  skill_name: string
  proficiency: 'learning' | 'good' | 'expert'
  profession_type: 'professional' | 'hobby'
  years_experience: number
  description: string
  portfolio_url: string
  tools_software: string
}

const emptySkill: Skill = {
  skill_name: '',
  proficiency: 'good',
  profession_type: 'professional',
  years_experience: 0,
  description: '',
  portfolio_url: '',
  tools_software: '',
}

function ProfileContent() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Profile form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    birth_date: '',
    gender: '',
    bio: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    address_line: '',
    city: '',
    state: '',
    pincode: '',
    college: '',
    year: '',
    photo_url: '',
  })

  // Skills state
  const [skills, setSkills] = useState<Skill[]>([])
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [currentSkill, setCurrentSkill] = useState<Skill>(emptySkill)

  useEffect(() => {
    if (!user) return

    const supabase = getSupabase()

    const loadProfile = async () => {
      try {
        // Load profile
        const { data: profile } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('id', user.id)
          .single() as { data: Record<string, unknown> | null }

        if (profile) {
          setFormData({
            first_name: (profile.first_name as string) || '',
            last_name: (profile.last_name as string) || '',
            phone: (profile.phone as string) || '',
            birth_date: (profile.birth_date as string) || '',
            gender: (profile.gender as string) || '',
            bio: (profile.bio as string) || '',
            emergency_contact_name: (profile.emergency_contact_name as string) || '',
            emergency_contact_phone: (profile.emergency_contact_phone as string) || '',
            address_line: (profile.address_line as string) || '',
            city: (profile.city as string) || '',
            state: (profile.state as string) || '',
            pincode: (profile.pincode as string) || '',
            college: (profile.college as string) || '',
            year: (profile.year as string) || '',
            photo_url: (profile.photo_url as string) || '',
          })
        }

        // Load skills
        const { data: skillsData } = await supabase
          .from('student_skills')
          .select('*')
          .eq('student_id', user.id) as { data: Skill[] | null }

        if (skillsData) {
          setSkills(skillsData)
        }
      } catch (error) {
        console.error('Profile page error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [user])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async () => {
    if (!formData.first_name || !formData.phone || !formData.college) {
      toast.error('Please fill in required fields')
      return
    }

    // Validate phone number
    if (!isValidPhone(formData.phone)) {
      toast.error('Please enter a valid phone number')
      return
    }

    if (!user) {
      toast.error('Please sign in to update your profile')
      return
    }

    setIsSaving(true)
    const supabase = getSupabase()

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('student_profiles') as any)
        .update({
          first_name: sanitizeInput(formData.first_name),
          last_name: sanitizeInput(formData.last_name),
          phone: sanitizeInput(formData.phone),
          birth_date: formData.birth_date || null,
          gender: formData.gender || null,
          bio: sanitizeInput(formData.bio) || null,
          emergency_contact_name: sanitizeInput(formData.emergency_contact_name) || null,
          emergency_contact_phone: sanitizeInput(formData.emergency_contact_phone) || null,
          address_line: sanitizeInput(formData.address_line) || null,
          city: sanitizeInput(formData.city) || null,
          state: formData.state || null,
          pincode: sanitizeInput(formData.pincode) || null,
          college: sanitizeInput(formData.college),
          year: formData.year,
          photo_url: sanitizeUrl(formData.photo_url) || null,
        })
        .eq('id', user.id)

      if (error) throw error

      toast.success('Profile updated!')
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to save profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddSkill = () => {
    setEditingSkill(null)
    setCurrentSkill(emptySkill)
    setIsSkillDialogOpen(true)
  }

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill)
    setCurrentSkill(skill)
    setIsSkillDialogOpen(true)
  }

  const handleDeleteSkill = async (skillToDelete: Skill) => {
    if (!skillToDelete.id || !user) {
      toast.error('Unable to delete skill')
      return
    }

    setIsDeleting(true)
    const supabase = getSupabase()

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('student_skills') as any)
        .delete()
        .eq('id', skillToDelete.id)
        .eq('student_id', user.id)

      if (error) {
        console.error('Error deleting skill:', error)
        toast.error('Failed to remove skill')
        return
      }

      setSkills(skills.filter(s => s.id !== skillToDelete.id))
      toast.success('Skill removed')
    } catch (err) {
      console.error('Unexpected error:', err)
      toast.error('An unexpected error occurred')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSaveSkill = async () => {
    if (!currentSkill.skill_name) {
      toast.error('Please select a skill')
      return
    }

    if (!user) {
      toast.error('Please sign in to save skills')
      return
    }

    const supabase = getSupabase()

    // Validate years of experience
    const yearsExp = Math.max(0, Math.min(20, currentSkill.years_experience || 0))

    try {
      // Sanitize inputs
      const sanitizedSkill = {
        skill_name: sanitizeInput(currentSkill.skill_name),
        proficiency: currentSkill.proficiency,
        profession_type: currentSkill.profession_type,
        years_experience: yearsExp,
        description: sanitizeInput(currentSkill.description) || null,
        portfolio_url: sanitizeUrl(currentSkill.portfolio_url) || null,
        tools_software: sanitizeInput(currentSkill.tools_software) || null,
      }

      if (editingSkill?.id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase.from('student_skills') as any)
          .update(sanitizedSkill)
          .eq('id', editingSkill.id)
          .eq('student_id', user.id)

        if (error) throw error

        setSkills(skills.map(s => s.id === editingSkill.id ? { ...currentSkill, id: editingSkill.id } : s))
        toast.success('Skill updated')
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase.from('student_skills') as any)
          .insert({
            student_id: user.id,
            ...sanitizedSkill,
          })
          .select()
          .single()

        if (error) throw error

        setSkills([...skills, data as Skill])
        toast.success('Skill added')
      }

      setIsSkillDialogOpen(false)
      setCurrentSkill(emptySkill)
    } catch (error) {
      console.error('Error saving skill:', error)
      toast.error('Failed to save skill')
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <>
      <main className="flex-1 pt-24 bg-muted/30">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Edit Profile</h1>
            <p className="text-muted-foreground">
              Update your information to help employers find you
            </p>
          </div>

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList>
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="address">Address & Contact</TabsTrigger>
            </TabsList>

            {/* Personal Info Tab */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Photo */}
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={formData.photo_url} />
                      <AvatarFallback className="text-2xl">
                        {formData.first_name?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Input
                        type="url"
                        value={formData.photo_url}
                        onChange={(e) => handleInputChange('photo_url', e.target.value)}
                        placeholder="Photo URL"
                        className="max-w-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter a URL for your profile photo
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>First Name *</Label>
                      <Input
                        value={formData.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input
                        value={formData.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Phone *</Label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input
                        type="date"
                        value={formData.birth_date}
                        onChange={(e) => handleInputChange('birth_date', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => handleInputChange('gender', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          {GENDERS.map((g) => (
                            <SelectItem key={g.value} value={g.value}>
                              {g.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>College *</Label>
                      <Input
                        value={formData.college}
                        onChange={(e) => handleInputChange('college', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Year</Label>
                      <Select
                        value={formData.year}
                        onValueChange={(value) => handleInputChange('year', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {STUDENT_YEARS.map((y) => (
                            <SelectItem key={y.value} value={y.value}>
                              {y.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={4}
                      maxLength={2000}
                      placeholder="Tell employers about yourself..."
                    />
                    <p className="text-right text-xs text-muted-foreground">
                      {formData.bio.length}/2000
                    </p>
                  </div>

                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Skills</CardTitle>
                  <Button onClick={handleAddSkill}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Skill
                  </Button>
                </CardHeader>
                <CardContent>
                  {skills.length > 0 ? (
                    <div className="space-y-3">
                      {skills.map((skill, index) => (
                        <div
                          key={skill.id || index}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{skill.skill_name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {skill.proficiency}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {skill.profession_type}
                              </Badge>
                            </div>
                            {skill.years_experience > 0 && (
                              <p className="mt-1 text-sm text-muted-foreground">
                                {skill.years_experience} year{skill.years_experience > 1 ? 's' : ''} experience
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditSkill(skill)}
                              disabled={isDeleting}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteSkill(skill)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      No skills added yet. Click &quot;Add Skill&quot; to get started.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Address Tab */}
            <TabsContent value="address">
              <Card>
                <CardHeader>
                  <CardTitle>Address & Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Permanent Address</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Address</Label>
                        <Input
                          value={formData.address_line}
                          onChange={(e) => handleInputChange('address_line', e.target.value)}
                          placeholder="Street address"
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label>City</Label>
                          <Input
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>State</Label>
                          <Select
                            value={formData.state}
                            onValueChange={(value) => handleInputChange('state', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {INDIAN_STATES.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Pincode</Label>
                          <Input
                            value={formData.pincode}
                            onChange={(e) => handleInputChange('pincode', e.target.value)}
                            maxLength={6}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-4">Emergency Contact</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Contact Name</Label>
                        <Input
                          value={formData.emergency_contact_name}
                          onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                          placeholder="Parent/Guardian name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contact Phone</Label>
                        <Input
                          type="tel"
                          value={formData.emergency_contact_phone}
                          onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Skill Dialog */}
      <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSkill ? 'Edit Skill' : 'Add Skill'}
            </DialogTitle>
            <DialogDescription>
              Provide details about your skill and experience level
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Skill Name *</Label>
              <Select
                value={currentSkill.skill_name}
                onValueChange={(value) =>
                  setCurrentSkill({ ...currentSkill, skill_name: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a skill" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SKILLS).map(([category, categorySkills]) => (
                    <div key={category}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                        {SKILL_CATEGORIES[category as keyof typeof SKILL_CATEGORIES]}
                      </div>
                      {categorySkills.map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Proficiency Level *</Label>
              <Select
                value={currentSkill.proficiency}
                onValueChange={(value: 'learning' | 'good' | 'expert') =>
                  setCurrentSkill({ ...currentSkill, proficiency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROFICIENCY_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select
                  value={currentSkill.profession_type}
                  onValueChange={(value: 'professional' | 'hobby') =>
                    setCurrentSkill({ ...currentSkill, profession_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="hobby">Hobby</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Years Experience</Label>
                <Input
                  type="number"
                  min={0}
                  max={20}
                  value={currentSkill.years_experience}
                  onChange={(e) =>
                    setCurrentSkill({
                      ...currentSkill,
                      years_experience: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsSkillDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSkill}>
              {editingSkill ? 'Update' : 'Add'} Skill
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function StudentProfilePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <RequireAuth requiredRole="student">
        <ProfileContent />
      </RequireAuth>
      <Footer />
    </div>
  )
}
