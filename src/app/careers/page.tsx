'use client'

import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Briefcase,
  MapPin,
  ArrowRight,
  Sparkles,
  Users,
  Rocket,
  Heart
} from 'lucide-react'
import Link from 'next/link'

const openings = [
  {
    title: 'Full Stack Developer',
    type: 'Full-time',
    location: 'Hyderabad / Remote',
    description: 'Help us build the future of student employment in India.',
  },
  {
    title: 'Product Designer',
    type: 'Full-time',
    location: 'Hyderabad',
    description: 'Design beautiful, intuitive experiences for students and employers.',
  },
  {
    title: 'Campus Ambassador',
    type: 'Part-time',
    location: 'Various Colleges',
    description: 'Represent SideQuest at your college and help fellow students find gigs.',
  },
  {
    title: 'Business Development',
    type: 'Full-time',
    location: 'Hyderabad',
    description: 'Partner with amazing venues across the city to bring more opportunities.',
  },
]

const values = [
  {
    icon: Sparkles,
    title: 'Innovation First',
    description: 'We challenge the status quo and build solutions that matter.',
  },
  {
    icon: Users,
    title: 'Student-Centric',
    description: 'Everything we do is designed with students in mind.',
  },
  {
    icon: Rocket,
    title: 'Move Fast',
    description: 'We ship quickly, learn from feedback, and iterate.',
  },
  {
    icon: Heart,
    title: 'Care Deeply',
    description: 'We care about our users, our team, and our impact.',
  },
]

export default function CareersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 pt-24">
        {/* Hero */}
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">We&apos;re Hiring</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Join the SideQuest Team
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Help us revolutionize how college students find meaningful work experiences.
                We&apos;re building something special, and we want you to be part of it.
              </p>
              <Button size="lg" asChild>
                <a href="#openings">
                  View Open Positions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, i) => (
                <Card key={i}>
                  <CardContent className="p-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section id="openings" className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Open Positions</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              We&apos;re looking for passionate people to join our mission. Check out our current openings below.
            </p>
            <div className="max-w-3xl mx-auto space-y-4">
              {openings.map((job, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {job.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{job.description}</p>
                      </div>
                      <Button variant="outline" asChild className="shrink-0">
                        <Link href="/contact">
                          Apply Now
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container">
            <Card className="bg-foreground text-background">
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Don&apos;t see a role that fits?
                </h2>
                <p className="text-background/80 mb-6 max-w-2xl mx-auto">
                  We&apos;re always looking for talented people. Send us your resume and tell us how you can contribute to SideQuest.
                </p>
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/contact">
                    Get in Touch
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
