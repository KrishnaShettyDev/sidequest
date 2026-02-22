import { ArrowDown } from 'lucide-react'

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-spacing-sm bg-secondary/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-title mb-6">
            How It <span className="italic">Works</span>
          </h2>
          <p className="text-body-lg text-muted-foreground">
            Whether you&apos;re a student or an employer, getting started takes just minutes
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* For Students */}
          <div className="card-base p-8 md:p-10">
            <div className="mb-8">
              <span className="badge mb-4">For Students</span>
              <h3 className="text-subheading">Start your side quest</h3>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background font-medium">
                  1
                </div>
                <div>
                  <h4 className="mb-1 font-medium">Create your profile</h4>
                  <p className="text-body-sm text-muted-foreground">
                    Sign up with Google, add your skills, availability, and preferences
                  </p>
                </div>
              </div>

              <div className="flex justify-center pl-5">
                <ArrowDown className="h-5 w-5 text-border" />
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background font-medium">
                  2
                </div>
                <div>
                  <h4 className="mb-1 font-medium">Browse & apply</h4>
                  <p className="text-body-sm text-muted-foreground">
                    Explore gigs at cafes, gyms, bookstores, and more. One-tap to apply.
                  </p>
                </div>
              </div>

              <div className="flex justify-center pl-5">
                <ArrowDown className="h-5 w-5 text-border" />
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background font-medium">
                  3
                </div>
                <div>
                  <h4 className="mb-1 font-medium">Start working</h4>
                  <p className="text-body-sm text-muted-foreground">
                    Get accepted, chat with the employer, and start your side quest!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* For Employers */}
          <div id="employer-how-it-works" className="card-base p-8 md:p-10">
            <div className="mb-8">
              <span className="badge mb-4">For Employers</span>
              <h3 className="text-subheading">Find your perfect fit</h3>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-foreground font-medium">
                  1
                </div>
                <div>
                  <h4 className="mb-1 font-medium">Set up your venue</h4>
                  <p className="text-body-sm text-muted-foreground">
                    Create your profile with venue details, photos, and location
                  </p>
                </div>
              </div>

              <div className="flex justify-center pl-5">
                <ArrowDown className="h-5 w-5 text-border" />
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-foreground font-medium">
                  2
                </div>
                <div>
                  <h4 className="mb-1 font-medium">Post a gig</h4>
                  <p className="text-body-sm text-muted-foreground">
                    Describe the role, requirements, pay, and schedule. It goes live instantly.
                  </p>
                </div>
              </div>

              <div className="flex justify-center pl-5">
                <ArrowDown className="h-5 w-5 text-border" />
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-foreground font-medium">
                  3
                </div>
                <div>
                  <h4 className="mb-1 font-medium">Review & hire</h4>
                  <p className="text-body-sm text-muted-foreground">
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
