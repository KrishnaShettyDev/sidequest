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
import { Loader2, ArrowRight } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'
import { toast } from 'sonner'

const ONBOARDING_STEPS = [
  { title: 'Venue Info', description: 'Tell us about your venue' },
  { title: 'Location', description: 'Where are you located?' },
  { title: 'Branding', description: 'Add photos and social links' },
]

export default function VenuePage() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    venue_name: '',
    category: '',
    description: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession(); const user = session?.user

      if (!user) {
        router.push('/?login=required')
        return
      }

      setUserId(user.id)

      // Load existing employer profile
      const { data: profile } = await supabase
        .from('employer_profiles')
        .select('*')
        .eq('id', user.id)
        .single() as { data: Record<string, unknown> | null }

      if (profile) {
        setFormData({
          venue_name: (profile.venue_name as string) || '',
          category: (profile.category as string) || '',
          description: (profile.description as string) || '',
          email: (profile.email as string) || user.email || '',
          phone: (profile.phone as string) || '',
        })
      } else {
        // Pre-fill email from Google
        setFormData(prev => ({
          ...prev,
          email: user.email || '',
        }))
      }

      setIsLoading(false)
    }

    loadProfile()
  }, [supabase, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.venue_name || !formData.category || !formData.phone) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSaving(true)

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('employer_profiles')
        .update({
          venue_name: formData.venue_name,
          category: formData.category,
          description: formData.description || null,
          email: formData.email,
          phone: formData.phone,
        })
        .eq('id', userId)

      if (error) throw error

      toast.success('Venue info saved!')
      router.push('/employer/onboarding/location')
    } catch (error) {
      console.error('Error saving venue info:', error)
      toast.error('Failed to save. Please try again.')
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
            {/* Venue Name */}
            <div className="space-y-2">
              <Label htmlFor="venue_name">
                Venue Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="venue_name"
                value={formData.venue_name}
                onChange={(e) => handleInputChange('venue_name', e.target.value)}
                placeholder="e.g., Roastery Coffee House"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select venue type" />
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

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description{' '}
                <span className="text-muted-foreground">(Tell students about your venue)</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your venue, work culture, and what makes it a great place to work..."
                rows={4}
                maxLength={2000}
              />
              <p className="text-right text-xs text-muted-foreground">
                {formData.description.length}/2000
              </p>
            </div>

            {/* Contact Info */}
            <div className="border-t pt-6">
              <h3 className="mb-4 font-semibold">Contact Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="contact@venue.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
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
