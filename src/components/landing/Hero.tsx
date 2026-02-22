'use client'

import { ArrowRight } from 'lucide-react'

interface HeroProps {
  onGetStarted: () => void
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative section-spacing overflow-hidden">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 fade-in-up">
            <span className="badge badge-accent">
              Now live in Hyderabad
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-display mb-8 fade-in-up delay-100">
            <span className="block">Your college life.</span>
            <span className="block">
              Your <span className="highlight italic">side quest</span>.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-12 max-w-2xl text-body-lg text-muted-foreground text-balance fade-in-up delay-200">
            Find part-time gigs at the coolest cafes, bookstores, gyms, and more.
            Work where you want, when you want, and build real experience.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row fade-in-up delay-300">
            <button
              onClick={onGetStarted}
              className="btn-primary"
            >
              Find a Gig
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onGetStarted}
              className="btn-secondary"
            >
              List a Gig
            </button>
          </div>

          {/* Social proof */}
          <div className="mt-24 flex flex-wrap items-center justify-center gap-12 fade-in-up delay-400">
            <div className="text-center">
              <p className="text-heading mb-1">500+</p>
              <p className="text-body-sm text-muted-foreground">Students signed up</p>
            </div>
            <div className="hidden h-12 w-px bg-border sm:block" />
            <div className="text-center">
              <p className="text-heading mb-1">50+</p>
              <p className="text-body-sm text-muted-foreground">Partner venues</p>
            </div>
            <div className="hidden h-12 w-px bg-border sm:block" />
            <div className="text-center">
              <p className="text-heading mb-1">100+</p>
              <p className="text-body-sm text-muted-foreground">Gigs available</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
