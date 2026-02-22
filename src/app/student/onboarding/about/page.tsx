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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, Upload, ArrowRight } from 'lucide-react'
import { GENDERS, STUDENT_YEARS, INDIAN_STATES } from '@/lib/constants'
import { toast } from 'sonner'

const ONBOARDING_STEPS = [
  { title: 'About You', description: 'Tell us about yourself' },
  { title: 'Skills', description: 'Add your skills and experience' },
  { title: 'Preferences', description: 'Set your availability and preferences' },
]

export default function AboutPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Form state
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

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true)
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const user = session?.user

        if (!user) {
          router.push('/?login=required')
          return
        }

        setUserId(user.id)

        // Load existing profile data
        const { data: profile } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('id', user.id)
          .single() as { data: Record<string, unknown> | null }

        if (profile) {
          setFormData({
            first_name: (profile.first_name as string) || user.user_metadata?.full_name?.split(' ')[0] || '',
            last_name: (profile.last_name as string) || user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
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
            photo_url: (profile.photo_url as string) || user.user_metadata?.avatar_url || '',
          })
        } else {
          // Pre-fill from Google profile
          setFormData(prev => ({
            ...prev,
            first_name: user.user_metadata?.full_name?.split(' ')[0] || '',
            last_name: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
            photo_url: user.user_metadata?.avatar_url || '',
          }))
        }
      } catch (error) {
        console.error('Onboarding error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [supabase, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.first_name || !formData.phone || !formData.college || !formData.year) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSaving(true)

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('student_profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          birth_date: formData.birth_date || null,
          gender: formData.gender || null,
          bio: formData.bio || null,
          emergency_contact_name: formData.emergency_contact_name || null,
          emergency_contact_phone: formData.emergency_contact_phone || null,
          address_line: formData.address_line || null,
          city: formData.city || null,
          state: formData.state || null,
          pincode: formData.pincode || null,
          college: formData.college,
          year: formData.year,
          photo_url: formData.photo_url || null,
        })
        .eq('id', userId)

      if (error) throw error

      toast.success('Profile saved!')
      router.push('/student/onboarding/skills')
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to save profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
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
      <OnboardingProgress currentStep={1} steps={ONBOARDING_STEPS} />

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={formData.photo_url} />
                <AvatarFallback className="text-2xl">
                  {formData.first_name?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Upload Photo
              </Button>
            </div>

            {/* Personal Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birth_date">Date of Birth</Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => handleInputChange('birth_date', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map((gender) => (
                    <SelectItem key={gender.value} value={gender.value}>
                      {gender.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Education */}
            <div className="border-t pt-6">
              <h3 className="mb-4 font-semibold">Education</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="college">
                    College/University <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="college"
                    value={formData.college}
                    onChange={(e) => handleInputChange('college', e.target.value)}
                    placeholder="e.g., IIIT Hyderabad"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">
                    Year <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.year}
                    onValueChange={(value) => handleInputChange('year', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {STUDENT_YEARS.map((year) => (
                        <SelectItem key={year.value} value={year.value}>
                          {year.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="border-t pt-6">
              <h3 className="mb-4 font-semibold">Emergency Contact</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_name">Contact Name</Label>
                  <Input
                    id="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                    placeholder="Parent/Guardian name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
                  <Input
                    id="emergency_contact_phone"
                    type="tel"
                    value={formData.emergency_contact_phone}
                    onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="border-t pt-6">
              <h3 className="mb-4 font-semibold">Permanent Address</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address_line">Address</Label>
                  <Input
                    id="address_line"
                    value={formData.address_line}
                    onChange={(e) => handleInputChange('address_line', e.target.value)}
                    placeholder="Street address"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
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
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      placeholder="6 digits"
                      maxLength={6}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="border-t pt-6">
              <div className="space-y-2">
                <Label htmlFor="bio">
                  Bio <span className="text-muted-foreground">(Tell employers about yourself)</span>
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Write a short bio about yourself, your interests, and what you're looking for..."
                  rows={4}
                  maxLength={2000}
                />
                <p className="text-right text-xs text-muted-foreground">
                  {formData.bio.length}/2000
                </p>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSaving} size="lg">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save & Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
