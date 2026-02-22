import { Briefcase } from 'lucide-react'
import Link from 'next/link'

export default function EmployerOnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Simple header */}
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Briefcase className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">SideQuest</span>
          </Link>
          <span className="ml-4 text-sm text-muted-foreground">
            Employer Setup
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="container py-8 md:py-12">
        <div className="mx-auto max-w-2xl">{children}</div>
      </main>
    </div>
  )
}
