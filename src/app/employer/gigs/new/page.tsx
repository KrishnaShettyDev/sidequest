'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, ArrowLeft, Plus, X } from 'lucide-react'
import { CATEGORIES, ALL_AREAS, SCHEDULE_TYPES, PAY_TYPES, ALL_SKILLS, COMMON_PERKS } from '@/lib/constants'
import { toast } from 'sonner'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function NewGigPage() {
  const router = useRouter()
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    area: '',
    address: '',
    pay_min: '',
    pay_max: '',
    pay_type: 'hourly',
    schedule_type: '',
    schedule_details: '',
    duration: '',
  })
  const [requiredSkills, setRequiredSkills] = useState<string[]>([])
  const [requirements, setRequirements] = useState<string[]>([])
  const [perks, setPerks] = useState<string[]>([])
  const [newRequirement, setNewRequirement] = useState('')

  useEffect(() => {
    const loadData = async () => {
      const { data: { session } } = await supabase.auth.getSession(); const user = session?.user

      if (!user) {
        router.push('/?login=required')
        return
      }

      setUserId(user.id)

      // Load employer profile for defaults
      const { data: profile } = await supabase
        .from('employer_profiles')
        .select('category, area, address')
        .eq('id', user.id)
        .single() as { data: { category: string; area: string; address: string } | null }

      if (profile) {
        setFormData(prev => ({
          ...prev,
          category: profile.category || '',
          area: profile.area || '',
          address: profile.address || '',
        }))
      }

      setIsLoading(false)
    }

    loadData()
  }, [supabase, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleSkill = (skill: string) => {
    setRequiredSkills(prev => {
      if (prev.includes(skill)) {
        return prev.filter(s => s !== skill)
      }
      return [...prev, skill]
    })
  }

  const togglePerk = (perk: string) => {
    setPerks(prev => {
      if (prev.includes(perk)) {
        return prev.filter(p => p !== perk)
      }
      return [...prev, perk]
    })
  }

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements(prev => [...prev, newRequirement.trim()])
      setNewRequirement('')
    }
  }

  const removeRequirement = (index: number) => {
    setRequirements(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.title || !formData.description || !formData.category || !formData.area) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!formData.pay_min) {
      toast.error('Please enter minimum pay')
      return
    }

    setIsSaving(true)

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('gigs')
        .insert({
          employer_id: userId,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          area: formData.area,
          address: formData.address || null,
          pay_min: parseInt(formData.pay_min),
          pay_max: formData.pay_max ? parseInt(formData.pay_max) : parseInt(formData.pay_min),
          pay_type: formData.pay_type,
          schedule_type: formData.schedule_type || null,
          schedule_details: formData.schedule_details || null,
          duration: formData.duration || null,
          required_skills: requiredSkills.length > 0 ? requiredSkills : null,
          requirements: requirements.length > 0 ? requirements : null,
          perks: perks.length > 0 ? perks : null,
          is_active: true,
        })

      if (error) throw error

      toast.success('Gig posted successfully!')
      router.push('/employer/dashboard')
    } catch (error) {
      console.error('Error posting gig:', error)
      toast.error('Failed to post gig. Please try again.')
    } finally {
      setIsSaving(false)
    }
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
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/employer/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Post a New Gig</h1>
            <p className="text-muted-foreground">
              Find talented students for your venue
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">
                        Job Title <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="e.g., Weekend Barista, Social Media Intern"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Description <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
                        rows={6}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>
                          Category <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleInputChange('category', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((cat) => (
                              <SelectItem key={cat.slug} value={cat.slug}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>
                          Area <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={formData.area}
                          onValueChange={(value) => handleInputChange('area', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select area" />
                          </SelectTrigger>
                          <SelectContent>
                            {ALL_AREAS.map((area) => (
                              <SelectItem key={area} value={area}>
                                {area}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Full Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Street address"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Pay & Schedule */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pay & Schedule</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label>
                          Minimum Pay (₹) <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          type="number"
                          min={0}
                          value={formData.pay_min}
                          onChange={(e) => handleInputChange('pay_min', e.target.value)}
                          placeholder="e.g., 150"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Maximum Pay (₹)</Label>
                        <Input
                          type="number"
                          min={0}
                          value={formData.pay_max}
                          onChange={(e) => handleInputChange('pay_max', e.target.value)}
                          placeholder="e.g., 200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Pay Type</Label>
                        <Select
                          value={formData.pay_type}
                          onValueChange={(value) => handleInputChange('pay_type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PAY_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Schedule Type</Label>
                        <Select
                          value={formData.schedule_type}
                          onValueChange={(value) => handleInputChange('schedule_type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select schedule" />
                          </SelectTrigger>
                          <SelectContent>
                            {SCHEDULE_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Input
                          value={formData.duration}
                          onChange={(e) => handleInputChange('duration', e.target.value)}
                          placeholder="e.g., 3 months, Ongoing"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Schedule Details</Label>
                      <Input
                        value={formData.schedule_details}
                        onChange={(e) => handleInputChange('schedule_details', e.target.value)}
                        placeholder="e.g., Sat-Sun 10am-6pm"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Skills & Requirements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Required Skills */}
                    <div className="space-y-3">
                      <Label>Required Skills</Label>
                      <div className="flex flex-wrap gap-2">
                        {ALL_SKILLS.slice(0, 16).map((skill) => (
                          <Badge
                            key={skill}
                            variant={requiredSkills.includes(skill) ? 'default' : 'outline'}
                            className={cn(
                              'cursor-pointer transition-all',
                              requiredSkills.includes(skill)
                                ? 'bg-primary'
                                : 'hover:bg-primary/10 hover:border-primary'
                            )}
                            onClick={() => toggleSkill(skill)}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Other Requirements */}
                    <div className="space-y-3">
                      <Label>Other Requirements</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newRequirement}
                          onChange={(e) => setNewRequirement(e.target.value)}
                          placeholder="e.g., Must have own laptop"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addRequirement()
                            }
                          }}
                        />
                        <Button type="button" onClick={addRequirement} variant="outline">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {requirements.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {requirements.map((req, i) => (
                            <Badge key={i} variant="secondary" className="gap-1 pr-1">
                              {req}
                              <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => removeRequirement(i)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Perks */}
                <Card>
                  <CardHeader>
                    <CardTitle>Perks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {COMMON_PERKS.map((perk) => (
                        <Badge
                          key={perk.value}
                          variant={perks.includes(perk.value) ? 'default' : 'outline'}
                          className={cn(
                            'cursor-pointer transition-all',
                            perks.includes(perk.value)
                              ? 'bg-primary'
                              : 'hover:bg-primary/10 hover:border-primary'
                          )}
                          onClick={() => togglePerk(perk.value)}
                        >
                          {perk.label}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Submit Card */}
                <Card className="sticky top-4">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Ready to post?</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Your gig will be visible to all students on SideQuest immediately after posting.
                    </p>
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        'Post Gig'
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => router.back()}
                    >
                      Cancel
                    </Button>
                  </CardContent>
                </Card>

                {/* Tips */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">Tips for a great listing</h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Use a clear, specific title</li>
                      <li>• Describe daily responsibilities</li>
                      <li>• Be transparent about pay</li>
                      <li>• Mention growth opportunities</li>
                      <li>• Highlight unique perks</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
