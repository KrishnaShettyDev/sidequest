'use client'

import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  ArrowUpRight,
} from 'lucide-react'

const contactMethods = [
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    description: 'Chat with us directly',
    value: '+91 7780185418',
    href: 'https://wa.me/917780185418',
    primary: true,
  },
  {
    icon: Mail,
    title: 'Email',
    description: 'Send us an email',
    value: 'hello@sidequest.in',
    href: 'mailto:hello@sidequest.in',
    primary: false,
  },
  {
    icon: MapPin,
    title: 'Location',
    description: 'Based in',
    value: 'Hyderabad, India',
    href: null,
    primary: false,
  },
  {
    icon: Clock,
    title: 'Response Time',
    description: 'We typically respond',
    value: 'Within 24 hours',
    href: null,
    primary: false,
  },
]

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 pt-24">
        {/* Hero */}
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Get in Touch
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Have questions, feedback, or just want to say hi? We&apos;d love to hear from you.
                Reach out and we&apos;ll get back to you as soon as possible.
              </p>
              <Button size="lg" asChild>
                <a
                  href="https://wa.me/917780185418"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16">
          <div className="container">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
              {contactMethods.map((method, i) => (
                <Card key={i} className={method.primary ? 'border-primary' : ''}>
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                      <method.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">{method.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                    {method.href ? (
                      <a
                        href={method.href}
                        target={method.href.startsWith('http') ? '_blank' : undefined}
                        rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                      >
                        {method.value}
                        <ArrowUpRight className="ml-1 h-3 w-3" />
                      </a>
                    ) : (
                      <p className="text-sm font-medium">{method.value}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">I&apos;m a student. How do I sign up?</h3>
                    <p className="text-sm text-muted-foreground">
                      Simply click &quot;Get Started&quot; on our homepage and sign in with your Google account.
                      Complete your profile, and you can start applying to gigs right away!
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">I&apos;m a venue owner. How do I post gigs?</h3>
                    <p className="text-sm text-muted-foreground">
                      Sign up as an employer, complete your venue profile, and you can start posting
                      gigs immediately. Students will be able to discover and apply to your opportunities.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Is SideQuest free to use?</h3>
                    <p className="text-sm text-muted-foreground">
                      Yes! SideQuest is completely free for students. Employers can post gigs and
                      connect with students at no cost during our launch phase.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Which cities do you operate in?</h3>
                    <p className="text-sm text-muted-foreground">
                      We&apos;re currently focused on Hyderabad, with plans to expand to other major
                      cities in India soon. Stay tuned!
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container">
            <Card className="bg-foreground text-background max-w-3xl mx-auto">
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Ready to start your SideQuest?
                </h2>
                <p className="text-background/80 mb-6">
                  Join thousands of students finding amazing opportunities at cool venues.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="secondary" size="lg" asChild>
                    <a href="/?signup=true">Get Started</a>
                  </Button>
                  <Button variant="outline" size="lg" className="border-background/20 text-background hover:bg-background/10" asChild>
                    <a
                      href="https://wa.me/917780185418"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp Us
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
