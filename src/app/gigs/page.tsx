'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { GigCard } from '@/components/gigs/GigCard'
import { GigFilters } from '@/components/gigs/GigFilters'
import { Loader2, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Gig {
  id: string
  title: string
  description: string
  category: string
  area: string
  pay_min: number
  pay_max: number
  pay_type: string
  schedule_type: string
  schedule_details: string
  created_at: string
  employer?: {
    venue_name: string
    logo_url: string | null
  }
}

export default function GigsPage() {
  const supabase = createClient()
  const [gigs, setGigs] = useState<Gig[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<{ id: string; role?: string } | null>(null)

  // Filter state
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [area, setArea] = useState('all')
  const [scheduleType, setScheduleType] = useState('all')

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check auth status
        const { data: { session } } = await supabase.auth.getSession(); const authUser = session?.user
        if (authUser) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', authUser.id)
            .single() as { data: { role: string } | null }

          setUser({ id: authUser.id, role: profile?.role })
        }

        // Load gigs with employer info
        const { data: gigsData, error } = await supabase
          .from('gigs')
          .select(`
            *,
            employer:employer_profiles(venue_name, logo_url)
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false }) as { data: Gig[] | null, error: Error | null }

        if (error) {
          console.error('Error loading gigs:', error)
        } else {
          setGigs(gigsData || [])
        }
      } catch (error) {
        console.error('Gigs page error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [supabase])

  // Filter gigs
  const filteredGigs = useMemo(() => {
    return gigs.filter(gig => {
      // Search
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch =
          gig.title.toLowerCase().includes(searchLower) ||
          gig.description.toLowerCase().includes(searchLower) ||
          gig.employer?.venue_name?.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Category
      if (category && category !== 'all' && gig.category !== category) {
        return false
      }

      // Area
      if (area && area !== 'all' && gig.area !== area) {
        return false
      }

      // Schedule Type
      if (scheduleType && scheduleType !== 'all' && gig.schedule_type !== scheduleType) {
        return false
      }

      return true
    })
  }, [gigs, search, category, area, scheduleType])

  const clearFilters = () => {
    setSearch('')
    setCategory('all')
    setArea('all')
    setScheduleType('all')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Browse Gigs</h1>
            <p className="text-muted-foreground">
              Find your perfect side quest at amazing venues across Hyderabad
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <GigFilters
              search={search}
              setSearch={setSearch}
              category={category}
              setCategory={setCategory}
              area={area}
              setArea={setArea}
              scheduleType={scheduleType}
              setScheduleType={setScheduleType}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredGigs.length > 0 ? (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                Showing {filteredGigs.length} gig{filteredGigs.length !== 1 ? 's' : ''}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredGigs.map(gig => (
                  <GigCard key={gig.id} gig={gig} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Briefcase className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No gigs found</h3>
              <p className="text-muted-foreground mb-6">
                {search || category !== 'all' || area !== 'all' || scheduleType !== 'all'
                  ? 'Try adjusting your filters or search terms'
                  : 'No gigs are currently available. Check back soon!'}
              </p>
              {(search || category !== 'all' || area !== 'all' || scheduleType !== 'all') && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear all filters
                </Button>
              )}
            </div>
          )}

          {/* CTA for non-logged-in users */}
          {!user && filteredGigs.length > 0 && (
            <div className="mt-12 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 p-8 text-center">
              <h3 className="text-xl font-bold mb-2">Ready to start your side quest?</h3>
              <p className="text-muted-foreground mb-4">
                Create a free account to apply for gigs and connect with venues
              </p>
              <Button asChild size="lg">
                <Link href="/?signup=true">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
