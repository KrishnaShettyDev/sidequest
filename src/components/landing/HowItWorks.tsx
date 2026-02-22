import { UserCheck, Briefcase, ArrowRight } from 'lucide-react'

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 md:py-36">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-20">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm">
            <span className="text-muted-foreground">Simple & Fast</span>
          </div>
          <h2 className="text-4xl font-bold md:text-5xl mb-6">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you&apos;re a student or an employer, getting started takes just minutes
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          {/* For Students */}
          <div className="glass rounded-3xl p-8 md:p-10 hover-lift">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/50 shadow-lg shadow-primary/25">
                <UserCheck className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">For Students</h3>
                <p className="text-sm text-muted-foreground">Start your side quest</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="group flex gap-4 p-4 rounded-2xl transition-colors hover:bg-white/5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xl font-bold text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  1
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-lg">Create your profile</h4>
                  <p className="text-muted-foreground">
                    Sign up with Google, add your skills, availability, and preferences
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground/30 rotate-90" />
              </div>

              <div className="group flex gap-4 p-4 rounded-2xl transition-colors hover:bg-white/5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xl font-bold text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  2
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-lg">Browse & apply</h4>
                  <p className="text-muted-foreground">
                    Explore gigs at cafes, gyms, bookstores, and more. One-tap to apply.
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground/30 rotate-90" />
              </div>

              <div className="group flex gap-4 p-4 rounded-2xl transition-colors hover:bg-white/5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xl font-bold text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  3
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-lg">Start working</h4>
                  <p className="text-muted-foreground">
                    Get accepted, chat with the employer, and start your side quest!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* For Employers */}
          <div id="employer-how-it-works" className="glass rounded-3xl p-8 md:p-10 hover-lift">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent/50 shadow-lg shadow-accent/25">
                <Briefcase className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">For Employers</h3>
                <p className="text-sm text-muted-foreground">Find your perfect fit</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="group flex gap-4 p-4 rounded-2xl transition-colors hover:bg-white/5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-xl font-bold text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  1
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-lg">Set up your venue</h4>
                  <p className="text-muted-foreground">
                    Create your profile with venue details, photos, and location
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground/30 rotate-90" />
              </div>

              <div className="group flex gap-4 p-4 rounded-2xl transition-colors hover:bg-white/5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-xl font-bold text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  2
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-lg">Post a gig</h4>
                  <p className="text-muted-foreground">
                    Describe the role, requirements, pay, and schedule. It goes live instantly.
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground/30 rotate-90" />
              </div>

              <div className="group flex gap-4 p-4 rounded-2xl transition-colors hover:bg-white/5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-xl font-bold text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  3
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-lg">Review & hire</h4>
                  <p className="text-muted-foreground">
                    Browse applicant profiles, chat with candidates, and find your perfect fit
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
