'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, ArrowRight, ArrowLeft, MapPin } from 'lucide-react'
import { ALL_AREAS } from '@/lib/constants'
import { toast } from 'sonner'

const ONBOARDING_STEPS = [
  { title: 'Venue Info', description: 'Tell us about your venue' },
  { title: 'Location', description: 'Where are you located?' },
  { title: 'Branding', description: 'Add photos and social links' },
]

export default function LocationPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    address: '',
    area: '',
    city: 'Hyderabad',
    google_maps_url: '',
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
          address: (profile.address as string) || '',
          area: (profile.area as string) || '',
          city: (profile.city as string) || 'Hyderabad',
          google_maps_url: (profile.google_maps_url as string) || '',
        })
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
    if (!formData.address || !formData.area) {
      toast.error('Please fill in address and area')
      return
    }

    setIsSaving(true)

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('employer_profiles')
        .update({
          address: formData.address,
          area: formData.area,
          city: formData.city,
          google_maps_url: formData.google_maps_url || null,
        })
        .eq('id', userId)

      if (error) throw error

      toast.success('Location saved!')
      router.push('/employer/onboarding/branding')
    } catch (error) {
      console.error('Error saving location:', error)
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
      <OnboardingProgress currentStep={2} steps={ONBOARDING_STEPS} />

      <Card>
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Venue Location</h3>
              <p className="text-sm text-muted-foreground">
                Help students find your venue easily
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">
                Full Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="e.g., Plot 42, Road No. 12, Banjara Hills"
              />
            </div>

            {/* Area */}
            <div className="space-y-2">
              <Label htmlFor="area">
                Area / Locality <span className="text-destructive">*</span>
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

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Currently available only in Hyderabad
              </p>
            </div>

            {/* Google Maps */}
            <div className="space-y-2">
              <Label htmlFor="google_maps_url">
                Google Maps Link{' '}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="google_maps_url"
                type="url"
                value={formData.google_maps_url}
                onChange={(e) => handleInputChange('google_maps_url', e.target.value)}
                placeholder="https://maps.google.com/..."
              />
              <p className="text-xs text-muted-foreground">
                Share your Google Maps location for easy navigation
              </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/employer/onboarding/venue')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
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
