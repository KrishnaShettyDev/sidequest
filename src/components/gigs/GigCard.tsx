'use client'

import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MapPin, Clock, IndianRupee, ArrowUpRight } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'
import { formatDistanceToNow } from 'date-fns'

interface GigCardProps {
  gig: {
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
}

export function GigCard({ gig }: GigCardProps) {
  const category = CATEGORIES.find(c => c.slug === gig.category)

  const formatPay = () => {
    const payTypeLabel = {
      hourly: '/hr',
      daily: '/day',
      monthly: '/mo',
      stipend: ' stipend',
    }[gig.pay_type] || ''

    if (gig.pay_min === gig.pay_max) {
      return `₹${gig.pay_min}${payTypeLabel}`
    }
    return `₹${gig.pay_min}-${gig.pay_max}${payTypeLabel}`
  }

  const scheduleLabel = {
    weekends: 'Weekends',
    evenings: 'Evenings',
    flexible: 'Flexible',
    fullday: 'Full Day',
  }[gig.schedule_type] || gig.schedule_type

  return (
    <Link href={`/gigs/${gig.id}`} className="group">
      <div className="card-base card-hover h-full p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <Avatar className="h-12 w-12 rounded-xl border border-border">
            <AvatarImage src={gig.employer?.logo_url || undefined} />
            <AvatarFallback className="rounded-xl bg-secondary text-foreground font-medium">
              {gig.employer?.venue_name?.[0]?.toUpperCase() || 'V'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-lg leading-tight line-clamp-1 group-hover:text-foreground/80 transition-colors">
              {gig.title}
            </h3>
            <p className="text-body-sm text-muted-foreground line-clamp-1">
              {gig.employer?.venue_name || 'Unknown Venue'}
            </p>
          </div>
          <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Category Badge */}
        <div className="mb-3">
          <span className="badge text-xs">
            {category?.name || gig.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-body-sm text-muted-foreground line-clamp-2 mb-4">
          {gig.description}
        </p>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center text-body-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="line-clamp-1">{gig.area}</span>
          </div>
          <div className="flex items-center text-body-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{scheduleLabel}</span>
            {gig.schedule_details && (
              <span className="ml-1 text-xs">({gig.schedule_details})</span>
            )}
          </div>
          <div className="flex items-center text-body-sm font-medium text-foreground">
            <IndianRupee className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{formatPay()}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">
            Posted {formatDistanceToNow(new Date(gig.created_at), { addSuffix: true })}
          </span>
        </div>
      </div>
    </Link>
  )
}
