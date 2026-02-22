'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Loader2,
  Plus,
  ArrowRight,
  ArrowLeft,
  Pencil,
  Trash2,
} from 'lucide-react'
import { ALL_SKILLS, SKILL_CATEGORIES, SKILLS, PROFICIENCY_LEVELS } from '@/lib/constants'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const ONBOARDING_STEPS = [
  { title: 'About You', description: 'Tell us about yourself' },
  { title: 'Skills', description: 'Add your skills and experience' },
  { title: 'Preferences', description: 'Set your availability and preferences' },
]

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

export default function SkillsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [currentSkill, setCurrentSkill] = useState<Skill>(emptySkill)

  useEffect(() => {
    const loadSkills = async () => {
      const { data: { session } } = await supabase.auth.getSession(); const user = session?.user

      if (!user) {
        router.push('/?login=required')
        return
      }

      setUserId(user.id)

      // Load existing skills
      const { data: existingSkills } = await supabase
        .from('student_skills')
        .select('*')
        .eq('student_id', user.id) as { data: Skill[] | null }

      if (existingSkills) {
        setSkills(existingSkills)
      }

      setIsLoading(false)
    }

    loadSkills()
  }, [supabase, router])

  const handleAddSkill = () => {
    setEditingSkill(null)
    setCurrentSkill(emptySkill)
    setIsDialogOpen(true)
  }

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill)
    setCurrentSkill(skill)
    setIsDialogOpen(true)
  }

  const handleDeleteSkill = async (skillToDelete: Skill) => {
    if (skillToDelete.id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from('student_skills').delete().eq('id', skillToDelete.id)
    }
    setSkills(skills.filter(s => s.id !== skillToDelete.id))
    toast.success('Skill removed')
  }

  const handleSaveSkill = async () => {
    if (!currentSkill.skill_name) {
      toast.error('Please select a skill')
      return
    }

    try {
      if (editingSkill?.id) {
        // Update existing skill
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from('student_skills')
          .update({
            skill_name: currentSkill.skill_name,
            proficiency: currentSkill.proficiency,
            profession_type: currentSkill.profession_type,
            years_experience: currentSkill.years_experience,
            description: currentSkill.description || null,
            portfolio_url: currentSkill.portfolio_url || null,
            tools_software: currentSkill.tools_software || null,
          })
          .eq('id', editingSkill.id)

        if (error) throw error

        setSkills(skills.map(s => s.id === editingSkill.id ? { ...currentSkill, id: editingSkill.id } : s))
        toast.success('Skill updated')
      } else {
        // Add new skill
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from('student_skills')
          .insert({
            student_id: userId,
            skill_name: currentSkill.skill_name,
            proficiency: currentSkill.proficiency,
            profession_type: currentSkill.profession_type,
            years_experience: currentSkill.years_experience,
            description: currentSkill.description || null,
            portfolio_url: currentSkill.portfolio_url || null,
            tools_software: currentSkill.tools_software || null,
          })
          .select()
          .single()

        if (error) throw error

        setSkills([...skills, data as Skill])
        toast.success('Skill added')
      }

      setIsDialogOpen(false)
      setCurrentSkill(emptySkill)
    } catch (error) {
      console.error('Error saving skill:', error)
      toast.error('Failed to save skill')
    }
  }

  const handleContinue = () => {
    if (skills.length === 0) {
      toast.error('Please add at least one skill')
      return
    }
    router.push('/student/onboarding/preferences')
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <OnboardingProgress currentStep={2} steps={ONBOARDING_STEPS} />

      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Your Skills</h3>
            <p className="text-sm text-muted-foreground">
              Add skills that employers might be looking for. The more detail you provide, the better your matches.
            </p>
          </div>

          {/* Skill Categories */}
          <div className="mb-6 space-y-4">
            <p className="text-sm font-medium">Quick add from categories:</p>
            <div className="flex flex-wrap gap-2">
              {ALL_SKILLS.slice(0, 12).map((skill) => {
                const isAdded = skills.some(s => s.skill_name === skill)
                return (
                  <Badge
                    key={skill}
                    variant={isAdded ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer transition-all',
                      isAdded
                        ? 'bg-primary'
                        : 'hover:bg-primary/10 hover:border-primary'
                    )}
                    onClick={() => {
                      if (!isAdded) {
                        setCurrentSkill({ ...emptySkill, skill_name: skill })
                        setEditingSkill(null)
                        setIsDialogOpen(true)
                      }
                    }}
                  >
                    {isAdded && <span className="mr-1">✓</span>}
                    {skill}
                  </Badge>
                )
              })}
            </div>
          </div>

          {/* Added Skills */}
          {skills.length > 0 && (
            <div className="mb-6 space-y-3">
              <p className="text-sm font-medium">Added skills ({skills.length}):</p>
              {skills.map((skill, index) => (
                <div
                  key={skill.id || index}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{skill.skill_name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {skill.proficiency === 'learning' && 'Learning'}
                        {skill.proficiency === 'good' && 'Good'}
                        {skill.proficiency === 'expert' && 'Expert'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {skill.profession_type === 'professional' ? 'Professional' : 'Hobby'}
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
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSkill(skill)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Skill Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full" onClick={handleAddSkill}>
                <Plus className="mr-2 h-4 w-4" />
                Add Skill
              </Button>
            </DialogTrigger>
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

                <div className="space-y-2">
                  <Label>Description (optional)</Label>
                  <Textarea
                    value={currentSkill.description}
                    onChange={(e) =>
                      setCurrentSkill({ ...currentSkill, description: e.target.value })
                    }
                    placeholder="Describe your experience with this skill..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Portfolio/Work Link (optional)</Label>
                  <Input
                    type="url"
                    value={currentSkill.portfolio_url}
                    onChange={(e) =>
                      setCurrentSkill({ ...currentSkill, portfolio_url: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tools/Software (optional)</Label>
                  <Input
                    value={currentSkill.tools_software}
                    onChange={(e) =>
                      setCurrentSkill({ ...currentSkill, tools_software: e.target.value })
                    }
                    placeholder="e.g., Photoshop, Figma, VS Code"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveSkill}>
                  {editingSkill ? 'Update' : 'Add'} Skill
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.push('/student/onboarding/about')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleContinue} disabled={skills.length === 0}>
              Save & Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
