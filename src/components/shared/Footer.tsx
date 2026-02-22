import Link from 'next/link'
import { Sparkles, Instagram, Linkedin, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent transition-all group-hover:scale-105">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Side<span className="gradient-text">Quest</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connecting college students with part-time gigs at cool spots in Hyderabad.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/sidequest"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/sidequest"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/company/sidequest"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* For Students */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">For Students</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/gigs" className="text-foreground/80 hover:text-primary transition-colors">
                  Browse Gigs
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-foreground/80 hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="text-foreground/80 hover:text-primary transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/?signup=true&role=student" className="text-foreground/80 hover:text-primary transition-colors">
                  Sign Up as Student
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">For Employers</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/?signup=true&role=employer" className="text-foreground/80 hover:text-primary transition-colors">
                  Post a Gig
                </Link>
              </li>
              <li>
                <Link href="/#employer-how-it-works" className="text-foreground/80 hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-foreground/80 hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-foreground/80 hover:text-primary transition-colors">
                  Contact Sales
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-foreground/80 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-foreground/80 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-foreground/80 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-foreground/80 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/5 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SideQuest. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Made with <span className="text-primary">♥</span> in Hyderabad
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
