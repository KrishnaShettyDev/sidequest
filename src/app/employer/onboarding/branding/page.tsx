'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, ArrowLeft, Check, Upload, Image as ImageIcon, Instagram, Globe } from 'lucide-react'
import { toast } from 'sonner'

const ONBOARDING_STEPS = [
  { title: 'Venue Info', description: 'Tell us about your venue' },
  { title: 'Location', description: 'Where are you located?' },
  { title: 'Branding', description: 'Add photos and social links' },
]

export default function BrandingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [venueName, setVenueName] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    logo_url: '',
    cover_photo_url: '',
    website_url: '',
    instagram_url: '',
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
        setVenueName((profile.venue_name as string) || '')
        setFormData({
          logo_url: (profile.logo_url as string) || '',
          cover_photo_url: (profile.cover_photo_url as string) || '',
          website_url: (profile.website_url as string) || '',
          instagram_url: (profile.instagram_url as string) || '',
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

    setIsSaving(true)

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: profileError } = await (supabase as any)
        .from('employer_profiles')
        .update({
          logo_url: formData.logo_url || null,
          cover_photo_url: formData.cover_photo_url || null,
          website_url: formData.website_url || null,
          instagram_url: formData.instagram_url || null,
        })
        .eq('id', userId)

      if (profileError) throw profileError

      // Mark onboarding as complete
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: onboardingError } = await (supabase as any)
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', userId)

      if (onboardingError) throw onboardingError

      toast.success('Onboarding complete! Welcome to SideQuest.')
      router.push('/employer/dashboard')
    } catch (error) {
      console.error('Error saving branding:', error)
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
      <OnboardingProgress currentStep={3} steps={ONBOARDING_STEPS} />

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Logo */}
            <div className="space-y-4">
              <Label>Venue Logo</Label>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={formData.logo_url} />
                  <AvatarFallback className="text-2xl bg-primary/10">
                    {venueName?.[0]?.toUpperCase() || 'V'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Input
                    type="url"
                    value={formData.logo_url}
                    onChange={(e) => handleInputChange('logo_url', e.target.value)}
                    placeholder="https://your-logo-url.com/logo.png"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a URL for your logo image. We recommend a square image (1:1 ratio).
                  </p>
                  <Button type="button" variant="outline" size="sm" disabled>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Logo (Coming Soon)
                  </Button>
                </div>
              </div>
            </div>

            {/* Cover Photo */}
            <div className="space-y-4 border-t pt-6">
              <Label>Cover Photo</Label>
              <div className="space-y-3">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                  {formData.cover_photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={formData.cover_photo_url}
                      alt="Cover"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <ImageIcon className="mx-auto h-12 w-12 mb-2" />
                        <p className="text-sm">No cover photo</p>
                      </div>
                    </div>
                  )}
                </div>
                <Input
                  type="url"
                  value={formData.cover_photo_url}
                  onChange={(e) => handleInputChange('cover_photo_url', e.target.value)}
                  placeholder="https://your-cover-photo.com/cover.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  Enter a URL for your cover photo. Recommended size: 1200x400 pixels.
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-semibold">Social & Web Presence</h3>
              <p className="text-sm text-muted-foreground">
                Help students learn more about your venue
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="website_url" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Website
                  </Label>
                  <Input
                    id="website_url"
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => handleInputChange('website_url', e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram_url" className="flex items-center gap-2">
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </Label>
                  <Input
                    id="instagram_url"
                    type="url"
                    value={formData.instagram_url}
                    onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                    placeholder="https://instagram.com/yourvenue"
                  />
                </div>
              </div>
            </div>

            {/* Skip notice */}
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                You can skip adding photos and links for now and update them later from your profile settings.
              </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/employer/onboarding/location')}
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
                    Complete Setup
                    <Check className="ml-2 h-4 w-4" />
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
