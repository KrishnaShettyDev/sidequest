'use client'

import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import Link from 'next/link'
import { ArrowRight, Briefcase, GraduationCap, Heart, MapPin, Users, Zap } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="section-spacing bg-secondary/30">
          <div className="container">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                Our Vision
              </p>
              <h1 className="text-display mb-6">
                Welcome to <span className="italic">Sidequest</span>, Your Gateway to Meaningful Work
              </h1>
              <p className="text-body-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                Join Sidequest, where every gig is an opportunity to learn, earn, and grow.
                We're building a community of ambitious students who work at places they love
                while building real-world experience.
              </p>
              <Link href="/?signup=true" className="btn-primary">
                Join Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="section-spacing-sm">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-accent" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Our Vision
                  </p>
                </div>
                <h2 className="text-heading mb-6">
                  Reimagining How Students <span className="italic">Work</span>
                </h2>
                <p className="text-body text-muted-foreground leading-relaxed">
                  We imagine a world where college students don't have to choose between their studies
                  and gaining work experience. At Sidequest, our vision is to build a movement of
                  ambitious young minds who work at aspirational venues—cafes where ideas brew,
                  bookstores where stories live, gyms where energy flows.
                </p>
                <p className="text-body text-muted-foreground leading-relaxed mt-4">
                  We dream of a future where every student in Hyderabad can find flexible work
                  that fits their schedule, builds their skills, and introduces them to incredible
                  people and places.
                </p>
              </div>
              <div className="card-base p-8 bg-gradient-to-br from-accent/10 to-transparent">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4">
                    <p className="text-heading text-foreground">500+</p>
                    <p className="text-body-sm text-muted-foreground">Students Joined</p>
                  </div>
                  <div className="text-center p-4">
                    <p className="text-heading text-foreground">50+</p>
                    <p className="text-body-sm text-muted-foreground">Partner Venues</p>
                  </div>
                  <div className="text-center p-4">
                    <p className="text-heading text-foreground">100+</p>
                    <p className="text-body-sm text-muted-foreground">Gigs Posted</p>
                  </div>
                  <div className="text-center p-4">
                    <p className="text-heading text-foreground">15+</p>
                    <p className="text-body-sm text-muted-foreground">Areas Covered</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Purpose Section */}
        <section className="section-spacing-sm bg-secondary/30">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="card-base p-6">
                    <Briefcase className="h-8 w-8 text-foreground mb-4" />
                    <h3 className="font-medium mb-2">Real Experience</h3>
                    <p className="text-body-sm text-muted-foreground">
                      Work at venues that look great on your resume
                    </p>
                  </div>
                  <div className="card-base p-6">
                    <GraduationCap className="h-8 w-8 text-foreground mb-4" />
                    <h3 className="font-medium mb-2">Student-First</h3>
                    <p className="text-body-sm text-muted-foreground">
                      Flexible hours that work around your classes
                    </p>
                  </div>
                  <div className="card-base p-6">
                    <MapPin className="h-8 w-8 text-foreground mb-4" />
                    <h3 className="font-medium mb-2">Local Focus</h3>
                    <p className="text-body-sm text-muted-foreground">
                      Gigs at the coolest spots across Hyderabad
                    </p>
                  </div>
                  <div className="card-base p-6">
                    <Users className="h-8 w-8 text-foreground mb-4" />
                    <h3 className="font-medium mb-2">Community</h3>
                    <p className="text-body-sm text-muted-foreground">
                      Connect with like-minded students and mentors
                    </p>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-foreground/10 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Our Purpose
                  </p>
                </div>
                <h2 className="text-heading mb-6">
                  Making Work <span className="italic">Accessible</span> for Students
                </h2>
                <p className="text-body text-muted-foreground leading-relaxed">
                  We exist to bridge the gap between education and employment—empowering students
                  to gain real-world experience without sacrificing their academic goals. Whether
                  you're serving coffee at a hip cafe, helping at a fitness studio, or managing
                  social media for a bookstore—our goal is to make it easy for you to use your
                  skills, earn money, and discover what you love.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Approach Section */}
        <section className="section-spacing-sm">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                Our Approach
              </p>
              <h2 className="text-heading mb-6">
                Apply. Work. <span className="italic">Grow.</span>
              </h2>
              <p className="text-body text-muted-foreground">
                We believe in simple, human-first experiences. No complicated applications.
                No endless interviews. Just real opportunities at real venues. Through our
                growing network of verified employers and ambitious students, we create
                work experiences where trust is mutual and every shift is a chance to learn.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-display">1</span>
                </div>
                <h3 className="font-medium mb-2">One-Tap Apply</h3>
                <p className="text-body-sm text-muted-foreground">
                  Create your profile once, then apply to any gig with a single tap
                </p>
              </div>
              <div className="text-center p-6">
                <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-display">2</span>
                </div>
                <h3 className="font-medium mb-2">Direct Chat</h3>
                <p className="text-body-sm text-muted-foreground">
                  Connect directly with employers—no middlemen, no delays
                </p>
              </div>
              <div className="text-center p-6">
                <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-display">3</span>
                </div>
                <h3 className="font-medium mb-2">Flexible Work</h3>
                <p className="text-body-sm text-muted-foreground">
                  Choose gigs that fit your schedule—weekends, evenings, or flexible hours
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Problem/Solution Section */}
        <section className="section-spacing-sm bg-secondary/30">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* The Problem */}
              <div>
                <h2 className="text-subheading mb-6">
                  What's <span className="italic">Happening</span>
                </h2>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <span className="h-2 w-2 rounded-full bg-foreground mt-2 flex-shrink-0" />
                    <p className="text-body text-muted-foreground">
                      College students struggle to find part-time work that respects their
                      academic schedule and doesn't require full-time commitment.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <span className="h-2 w-2 rounded-full bg-foreground mt-2 flex-shrink-0" />
                    <p className="text-body text-muted-foreground">
                      Traditional job platforms are designed for full-time roles, leaving
                      students with limited options for flexible, short-term work.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <span className="h-2 w-2 rounded-full bg-foreground mt-2 flex-shrink-0" />
                    <p className="text-body text-muted-foreground">
                      Meanwhile, cafes, gyms, and retail venues constantly need reliable
                      part-time help but struggle to find quality candidates.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <span className="h-2 w-2 rounded-full bg-foreground mt-2 flex-shrink-0" />
                    <p className="text-body text-muted-foreground">
                      Many students graduate without practical work experience, making
                      the transition to professional life challenging.
                    </p>
                  </li>
                </ul>
              </div>

              {/* The Solution */}
              <div>
                <h2 className="text-subheading mb-6">
                  How We're <span className="italic">Helping</span>
                </h2>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <span className="h-2 w-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <p className="text-body text-muted-foreground">
                      We create a dedicated platform for student-friendly gigs—roles designed
                      for part-time schedules, weekends, and evening availability.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <span className="h-2 w-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <p className="text-body text-muted-foreground">
                      By connecting students directly with verified venues, we remove the
                      friction of traditional hiring and make applying effortless.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <span className="h-2 w-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <p className="text-body text-muted-foreground">
                      We focus on aspirational venues—places students actually want to work
                      at and can proudly add to their resumes.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <span className="h-2 w-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <p className="text-body text-muted-foreground">
                      Our platform is completely free for students—no fees, no catches,
                      just opportunities waiting to be discovered.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-spacing-sm">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-title mb-6">
                Join <span className="italic">Sidequest</span>
              </h2>
              <p className="text-body-lg text-muted-foreground mb-10">
                Where every gig is a chance to learn, earn, and grow. We're creating a
                community of ambitious students who work at places they love—one side quest at a time.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/?signup=true" className="btn-primary">
                  Join as Student
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/?signup=true&role=employer" className="btn-secondary">
                  List Your Venue
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
