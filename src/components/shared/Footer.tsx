import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container py-16">
        <div className="flex justify-end">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-16">
            {/* Product */}
            <div className="space-y-4">
              <h3 className="font-semibold text-background">Product</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/?login=true" className="text-background/70 hover:text-background transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/?signup=true" className="text-background/70 hover:text-background transition-colors">
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link href="/gigs" className="text-background/70 hover:text-background transition-colors">
                    Browse Gigs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h3 className="font-semibold text-background">Resources</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/#how-it-works" className="text-background/70 hover:text-background transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/#categories" className="text-background/70 hover:text-background transition-colors">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-background/70 hover:text-background transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-background/70 hover:text-background transition-colors">
                    Contact Sales
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="font-semibold text-background">Company</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/about" className="text-background/70 hover:text-background transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-background/70 hover:text-background transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-background/70 hover:text-background transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-background/70 hover:text-background transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-background/70 hover:text-background transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-background/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-logo text-background">
                <span className="italic">Side</span>quest
              </span>
            </Link>
            <p className="text-sm text-background/50">
              © {new Date().getFullYear()} Sidequest. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
