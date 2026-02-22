'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, ArrowLeft, Check } from 'lucide-react'
import { CATEGORIES, ALL_AREAS, SCHEDULE_TYPES, DAYS_OF_WEEK, TIME_SLOTS } from '@/lib/constants'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const ONBOARDING_STEPS = [
  { title: 'About You', description: 'Tell us about yourself' },
  { title: 'Skills', description: 'Add your skills and experience' },
  { title: 'Preferences', description: 'Set your availability and preferences' },
]

interface Availability {
  [day: string]: string[]
}

export default function PreferencesPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Form state
  const [availability, setAvailability] = useState<Availability>({})
  const [preferredCategories, setPreferredCategories] = useState<string[]>([])
  const [preferredAreas, setPreferredAreas] = useState<string[]>([])
  const [preferredScheduleType, setPreferredScheduleType] = useState('')
  const [minPayExpectation, setMinPayExpectation] = useState('')

  useEffect(() => {
    const loadPreferences = async () => {
      const { data: { session } } = await supabase.auth.getSession(); const user = session?.user

      if (!user) {
        router.push('/?login=required')
        return
      }

      setUserId(user.id)

      // Load existing preferences
      const { data: existingPrefs } = await supabase
        .from('student_preferences')
        .select('*')
        .eq('student_id', user.id)
        .single() as { data: Record<string, unknown> | null }

      if (existingPrefs) {
        setAvailability((existingPrefs.availability as Availability) || {})
        setPreferredCategories((existingPrefs.preferred_categories as string[]) || [])
        setPreferredAreas((existingPrefs.preferred_areas as string[]) || [])
        setPreferredScheduleType((existingPrefs.preferred_schedule_type as string) || '')
        setMinPayExpectation(
          existingPrefs.min_pay_expectation
            ? String(existingPrefs.min_pay_expectation)
            : ''
        )
      }

      setIsLoading(false)
    }

    loadPreferences()
  }, [supabase, router])

  const toggleTimeSlot = (day: string, slot: string) => {
    setAvailability(prev => {
      const daySlots = prev[day] || []
      if (daySlots.includes(slot)) {
        return {
          ...prev,
          [day]: daySlots.filter(s => s !== slot)
        }
      } else {
        return {
          ...prev,
          [day]: [...daySlots, slot]
        }
      }
    })
  }

  const isSlotSelected = (day: string, slot: string) => {
    return availability[day]?.includes(slot) || false
  }

  const toggleCategory = (categorySlug: string) => {
    setPreferredCategories(prev => {
      if (prev.includes(categorySlug)) {
        return prev.filter(c => c !== categorySlug)
      } else {
        return [...prev, categorySlug]
      }
    })
  }

  const toggleArea = (area: string) => {
    setPreferredAreas(prev => {
      if (prev.includes(area)) {
        return prev.filter(a => a !== area)
      } else {
        return [...prev, area]
      }
    })
  }

  const handleSubmit = async () => {
    // Validation
    const hasAvailability = Object.values(availability).some(slots => slots.length > 0)
    if (!hasAvailability) {
      toast.error('Please select at least one time slot for availability')
      return
    }

    if (preferredCategories.length === 0) {
      toast.error('Please select at least one preferred category')
      return
    }

    if (!userId) return

    setIsSaving(true)

    try {
      // Check if preferences exist
      const { data: existing } = await supabase
        .from('student_preferences')
        .select('id')
        .eq('student_id', userId)
        .single() as { data: { id: string } | null }

      if (existing) {
        // Update
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from('student_preferences')
          .update({
            availability,
            preferred_categories: preferredCategories,
            preferred_areas: preferredAreas.length > 0 ? preferredAreas : null,
            preferred_schedule_type: preferredScheduleType || null,
            min_pay_expectation: minPayExpectation ? parseInt(minPayExpectation) : null,
          })
          .eq('student_id', userId)

        if (error) throw error
      } else {
        // Insert
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from('student_preferences')
          .insert({
            student_id: userId,
            availability,
            preferred_categories: preferredCategories,
            preferred_areas: preferredAreas.length > 0 ? preferredAreas : null,
            preferred_schedule_type: preferredScheduleType || null,
            min_pay_expectation: minPayExpectation ? parseInt(minPayExpectation) : null,
          })

        if (error) throw error
      }

      // Mark onboarding as complete
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', userId)

      toast.success('Onboarding complete!')
      router.push('/student/dashboard')
    } catch (error) {
      console.error('Error saving preferences:', error)
      toast.error('Failed to save preferences. Please try again.')
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
          {/* Availability Grid */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold">Availability</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Select the times you&apos;re typically available to work
            </p>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="p-2 text-left text-sm font-medium text-muted-foreground">
                      Time
                    </th>
                    {DAYS_OF_WEEK.map(day => (
                      <th
                        key={day.value}
                        className="p-2 text-center text-sm font-medium"
                      >
                        {day.short}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map(slot => (
                    <tr key={slot.value}>
                      <td className="p-2 text-sm text-muted-foreground">
                        <div>{slot.label}</div>
                        <div className="text-xs">{slot.time}</div>
                      </td>
                      {DAYS_OF_WEEK.map(day => (
                        <td key={day.value} className="p-1 text-center">
                          <button
                            type="button"
                            onClick={() => toggleTimeSlot(day.value, slot.value)}
                            className={cn(
                              'h-10 w-10 rounded-lg border-2 transition-all',
                              isSlotSelected(day.value, slot.value)
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-muted hover:border-primary/50 hover:bg-primary/10'
                            )}
                          >
                            {isSlotSelected(day.value, slot.value) && (
                              <Check className="mx-auto h-5 w-5" />
                            )}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Preferred Categories */}
          <div className="mb-8 border-t pt-6">
            <h3 className="text-lg font-semibold">Preferred Gig Categories</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Select the types of places you&apos;d like to work at
            </p>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(category => {
                const isSelected = preferredCategories.includes(category.slug)
                return (
                  <Badge
                    key={category.slug}
                    variant={isSelected ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer px-4 py-2 text-sm transition-all',
                      isSelected
                        ? 'bg-primary'
                        : 'hover:bg-primary/10 hover:border-primary'
                    )}
                    onClick={() => toggleCategory(category.slug)}
                  >
                    {isSelected && <Check className="mr-1 h-3 w-3" />}
                    {category.name}
                  </Badge>
                )
              })}
            </div>
          </div>

          {/* Preferred Areas */}
          <div className="mb-8 border-t pt-6">
            <h3 className="text-lg font-semibold">Preferred Areas</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Select the areas in Hyderabad where you&apos;d prefer to work (optional)
            </p>

            <div className="flex flex-wrap gap-2">
              {ALL_AREAS.map(area => {
                const isSelected = preferredAreas.includes(area)
                return (
                  <Badge
                    key={area}
                    variant={isSelected ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer px-3 py-1.5 text-sm transition-all',
                      isSelected
                        ? 'bg-primary'
                        : 'hover:bg-primary/10 hover:border-primary'
                    )}
                    onClick={() => toggleArea(area)}
                  >
                    {isSelected && <Check className="mr-1 h-3 w-3" />}
                    {area}
                  </Badge>
                )
              })}
            </div>
          </div>

          {/* Schedule Preference & Pay */}
          <div className="mb-8 grid gap-6 border-t pt-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Preferred Schedule Type</Label>
              <Select
                value={preferredScheduleType}
                onValueChange={setPreferredScheduleType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select schedule preference" />
                </SelectTrigger>
                <SelectContent>
                  {SCHEDULE_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Minimum Pay Expectation (per hour)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ₹
                </span>
                <Input
                  type="number"
                  min={0}
                  value={minPayExpectation}
                  onChange={(e) => setMinPayExpectation(e.target.value)}
                  placeholder="e.g., 150"
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Leave blank if flexible
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between border-t pt-6">
            <Button
              variant="outline"
              onClick={() => router.push('/student/onboarding/skills')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving} size="lg">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Complete Onboarding
                  <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
