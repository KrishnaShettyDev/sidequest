import Link from 'next/link'
import { Instagram, Linkedin, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-display tracking-tight">
                SideQuest
              </span>
            </Link>
            <p className="text-body-sm text-muted-foreground leading-relaxed">
              Connecting college students with part-time gigs at cool spots in Hyderabad.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/sidequest"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com/sidequest"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com/company/sidequest"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* For Students */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm">For Students</h3>
            <ul className="space-y-3 text-body-sm">
              <li>
                <Link href="/gigs" className="text-muted-foreground hover:text-foreground transition-colors">
                  Browse Gigs
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="text-muted-foreground hover:text-foreground transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/?signup=true&role=student" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sign Up as Student
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm">For Employers</h3>
            <ul className="space-y-3 text-body-sm">
              <li>
                <Link href="/?signup=true&role=employer" className="text-muted-foreground hover:text-foreground transition-colors">
                  Post a Gig
                </Link>
              </li>
              <li>
                <Link href="/#employer-how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Sales
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Company</h3>
            <ul className="space-y-3 text-body-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-body-sm text-muted-foreground">
              © {new Date().getFullYear()} SideQuest. All rights reserved.
            </p>
            <p className="text-body-sm text-muted-foreground">
              Made with love in Hyderabad
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
