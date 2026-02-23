'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { EmployerLayout } from '@/components/employer/EmployerLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Loader2,
  ArrowRight,
  Globe,
  Instagram,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react'
import { CATEGORIES, ALL_AREAS } from '@/lib/constants'
import { toast } from 'sonner'
import { cn, sanitizeInput, sanitizeUrl, isValidPhone } from '@/lib/utils'

export default function EmployerProfilePage() {
  const [supabase] = useState(() => createClient())
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)

  // Form state
  const [formData, setFormData] = useState({
    venue_name: '',
    category: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    area: '',
    city: 'Hyderabad',
    google_maps_url: '',
    logo_url: '',
    cover_photo_url: '',
    website_url: '',
    instagram_url: '',
  })

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setIsLoading(false)
        return
      }

      setUserId(user.id)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: profile } = await (supabase as any)
        .from('employer_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setFormData({
          venue_name: profile.venue_name || '',
          category: profile.category || '',
          description: profile.description || '',
          email: profile.email || user.email || '',
          phone: profile.phone || '',
          address: profile.address || '',
          area: profile.area || '',
          city: profile.city || 'Hyderabad',
          google_maps_url: profile.google_maps_url || '',
          logo_url: profile.logo_url || '',
          cover_photo_url: profile.cover_photo_url || '',
          website_url: profile.website_url || '',
          instagram_url: profile.instagram_url || '',
        })
      }

      setIsLoading(false)
    }

    loadProfile()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!formData.venue_name || !formData.category || !formData.phone) {
      toast.error('Please fill in required fields')
      return
    }

    // Validate phone number
    if (!isValidPhone(formData.phone)) {
      toast.error('Please enter a valid phone number')
      return
    }

    if (!userId) {
      toast.error('Please sign in to update your profile')
      return
    }

    setIsSaving(true)

    try {
      // Sanitize all inputs before saving
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('employer_profiles')
        .update({
          venue_name: sanitizeInput(formData.venue_name),
          category: formData.category, // From predefined list, no need to sanitize
          description: sanitizeInput(formData.description) || null,
          email: sanitizeInput(formData.email),
          phone: sanitizeInput(formData.phone),
          address: sanitizeInput(formData.address) || null,
          area: formData.area || null, // From predefined list
          city: sanitizeInput(formData.city),
          google_maps_url: sanitizeUrl(formData.google_maps_url) || null,
          logo_url: sanitizeUrl(formData.logo_url) || null,
          cover_photo_url: sanitizeUrl(formData.cover_photo_url) || null,
          website_url: sanitizeUrl(formData.website_url) || null,
          instagram_url: sanitizeUrl(formData.instagram_url) || null,
        })
        .eq('id', userId)

      if (error) throw error

      toast.success('Profile updated!')

      // Move to next step or stay on last
      if (currentStep < 2) {
        setCurrentStep(currentStep + 1)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to save profile')
    } finally {
      setIsSaving(false)
    }
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
        <div className="container py-8 max-w-3xl">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setCurrentStep(1)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
                currentStep === 1
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <span className={cn(
                'flex items-center justify-center w-6 h-6 rounded-full text-xs',
                currentStep >= 1 ? 'bg-foreground text-background' : 'bg-muted'
              )}>
                {currentStep > 1 ? <CheckCircle2 className="h-4 w-4" /> : '1'}
              </span>
              About You
            </button>
            <div className="w-8 h-px bg-border" />
            <button
              onClick={() => setCurrentStep(2)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
                currentStep === 2
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <span className={cn(
                'flex items-center justify-center w-6 h-6 rounded-full text-xs',
                currentStep >= 2 ? 'bg-foreground text-background' : 'bg-muted'
              )}>
                2
              </span>
              Additional Info
            </button>
          </div>

          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold">Personal Info</h2>

                {/* Profile Picture */}
                <div className="space-y-3">
                  <Label>Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-24 w-24 rounded-xl border-2 border-dashed border-border">
                      <AvatarImage src={formData.logo_url} />
                      <AvatarFallback className="rounded-xl text-2xl bg-muted">
                        {formData.venue_name?.[0]?.toUpperCase() || 'V'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Input
                        type="url"
                        value={formData.logo_url}
                        onChange={(e) => handleInputChange('logo_url', e.target.value)}
                        placeholder="Logo URL"
                      />
                    </div>
                  </div>
                </div>

                {/* Venue Name */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Venue Name *</Label>
                    <Input
                      value={formData.venue_name}
                      onChange={(e) => handleInputChange('venue_name', e.target.value)}
                      placeholder="e.g., Roastery Coffee House"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Category *</Label>
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

                {/* Contact Info */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Phone Number *</Label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="9876543210"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="contact@venue.com"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-4">Venue Address</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Street address"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Area</Label>
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
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input
                          value={formData.city}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Country</Label>
                        <Input
                          value="India"
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    maxLength={2000}
                    placeholder="Tell students about your venue and work culture..."
                  />
                  <p className="text-right text-xs text-muted-foreground">
                    {formData.description.length}/2000
                  </p>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Save & next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Additional Info */}
          {currentStep === 2 && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold">Additional Info</h2>

                {/* Cover Photo */}
                <div className="space-y-4">
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
                      placeholder="Cover photo URL"
                    />
                  </div>
                </div>

                {/* Google Maps */}
                <div className="space-y-2">
                  <Label>Google Maps Link</Label>
                  <Input
                    type="url"
                    value={formData.google_maps_url}
                    onChange={(e) => handleInputChange('google_maps_url', e.target.value)}
                    placeholder="https://maps.google.com/..."
                  />
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <h3 className="font-medium">Social & Web</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Website
                      </Label>
                      <Input
                        type="url"
                        value={formData.website_url}
                        onChange={(e) => handleInputChange('website_url', e.target.value)}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Instagram className="h-4 w-4" />
                        Instagram
                      </Label>
                      <Input
                        type="url"
                        value={formData.instagram_url}
                        onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                        placeholder="https://instagram.com/yourvenue"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Back
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Save Changes
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </EmployerLayout>
  )
}
