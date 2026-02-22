'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Zap } from 'lucide-react'

interface HeroProps {
  onGetStarted: () => void
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm backdrop-blur-sm">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
              <Zap className="h-3 w-3 text-primary" />
            </div>
            <span className="text-muted-foreground">Now live in</span>
            <span className="font-medium text-foreground">Hyderabad</span>
          </div>

          {/* Headline */}
          <h1 className="mb-8 text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
            <span className="block">Your college life.</span>
            <span className="gradient-text font-display">Your side quest.</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
            Find part-time gigs at the coolest cafes, bookstores, gyms, and more.
            Work where you want, when you want, and build real experience.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="btn-gradient h-14 gap-2 rounded-full px-8 text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              Find a Gig
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onGetStarted}
              className="h-14 rounded-full border-white/10 px-8 text-lg hover:bg-white/5 hover:border-white/20"
            >
              List a Gig
            </Button>
          </div>

          {/* Social proof */}
          <div className="mt-20 flex flex-wrap items-center justify-center gap-12 text-muted-foreground">
            <div className="text-center group">
              <p className="text-4xl font-bold text-foreground mb-1 group-hover:gradient-text transition-all">500+</p>
              <p className="text-sm">Students signed up</p>
            </div>
            <div className="hidden h-12 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent sm:block" />
            <div className="text-center group">
              <p className="text-4xl font-bold text-foreground mb-1 group-hover:gradient-text transition-all">50+</p>
              <p className="text-sm">Partner venues</p>
            </div>
            <div className="hidden h-12 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent sm:block" />
            <div className="text-center group">
              <p className="text-4xl font-bold text-foreground mb-1 group-hover:gradient-text transition-all">100+</p>
              <p className="text-sm">Gigs available</p>
            </div>
          </div>

          {/* Floating elements */}
          <div className="absolute top-32 right-[15%] hidden lg:block animate-pulse-slow">
            <div className="glass-light rounded-2xl p-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="absolute bottom-32 left-[10%] hidden lg:block animate-pulse-slow" style={{ animationDelay: '1s' }}>
            <div className="glass-light rounded-2xl p-4">
              <Zap className="h-6 w-6 text-accent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
