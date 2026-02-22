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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Loader2,
  Save,
  Globe,
  Instagram,
  Image as ImageIcon,
} from 'lucide-react'
import { CATEGORIES, ALL_AREAS } from '@/lib/constants'
import { toast } from 'sonner'

export default function EmployerProfilePage() {
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
      const { data: { session } } = await supabase.auth.getSession(); const user = session?.user

      if (!user) {
        router.push('/?login=required')
        return
      }

      setUserId(user.id)

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
          address: (profile.address as string) || '',
          area: (profile.area as string) || '',
          city: (profile.city as string) || 'Hyderabad',
          google_maps_url: (profile.google_maps_url as string) || '',
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

  const handleSave = async () => {
    if (!formData.venue_name || !formData.category || !formData.phone) {
      toast.error('Please fill in required fields')
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
          address: formData.address || null,
          area: formData.area || null,
          city: formData.city,
          google_maps_url: formData.google_maps_url || null,
          logo_url: formData.logo_url || null,
          cover_photo_url: formData.cover_photo_url || null,
          website_url: formData.website_url || null,
          instagram_url: formData.instagram_url || null,
        })
        .eq('id', userId)

      if (error) throw error

      toast.success('Profile updated!')
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to save profile')
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

      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Venue Profile</h1>
            <p className="text-muted-foreground">
              Update your venue information to attract the best talent
            </p>
          </div>

          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList>
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="branding">Branding & Social</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Venue Name *</Label>
                    <Input
                      value={formData.venue_name}
                      onChange={(e) => handleInputChange('venue_name', e.target.value)}
                      placeholder="e.g., Roastery Coffee House"
                    />
                  </div>

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

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      maxLength={2000}
                      placeholder="Describe your venue and work culture..."
                    />
                    <p className="text-right text-xs text-muted-foreground">
                      {formData.description.length}/2000
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone *</Label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                  </div>

                  <Button onClick={handleSave} disabled={isSaving}>
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

            {/* Location Tab */}
            <TabsContent value="location">
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Full Address</Label>
                    <Input
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Street address"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
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
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Google Maps Link</Label>
                    <Input
                      type="url"
                      value={formData.google_maps_url}
                      onChange={(e) => handleInputChange('google_maps_url', e.target.value)}
                      placeholder="https://maps.google.com/..."
                    />
                  </div>

                  <Button onClick={handleSave} disabled={isSaving}>
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

            {/* Branding Tab */}
            <TabsContent value="branding">
              <Card>
                <CardHeader>
                  <CardTitle>Branding & Social</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Logo */}
                  <div className="space-y-4">
                    <Label>Venue Logo</Label>
                    <div className="flex items-center gap-6">
                      <Avatar className="h-24 w-24 rounded-xl">
                        <AvatarImage src={formData.logo_url} />
                        <AvatarFallback className="rounded-xl text-2xl bg-primary/10 text-primary">
                          {formData.venue_name?.[0]?.toUpperCase() || 'V'}
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
                          Enter a URL for your logo (square image recommended)
                        </p>
                      </div>
                    </div>
                  </div>

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
                        placeholder="https://your-cover-photo.com/cover.jpg"
                      />
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Social & Web</h4>
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

                  <Button onClick={handleSave} disabled={isSaving}>
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

      <Footer />
    </div>
  )
}
