'use client'

import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { Card, CardContent } from '@/components/ui/card'

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 pt-24">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: February 2025</p>

            <Card>
              <CardContent className="p-8 prose prose-neutral dark:prose-invert max-w-none">
                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
                  <p className="text-muted-foreground">
                    By accessing or using SideQuest (&quot;Platform&quot;), you agree to be bound by these
                    Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not
                    use our Platform. These Terms apply to all users, including students and
                    employers.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
                  <p className="text-muted-foreground">
                    SideQuest is a platform that connects college students with part-time employment
                    opportunities at various venues in Hyderabad. We facilitate the connection
                    between students seeking work and employers looking for talent, but we are not
                    a party to any employment relationship formed through our Platform.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
                  <p className="text-muted-foreground mb-4">To use our Platform, you must:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Be at least 16 years of age</li>
                    <li>Register for an account using accurate information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Notify us immediately of any unauthorized access</li>
                    <li>Be responsible for all activities under your account</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">4. User Conduct</h2>
                  <p className="text-muted-foreground mb-4">You agree not to:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Provide false or misleading information</li>
                    <li>Impersonate any person or entity</li>
                    <li>Harass, abuse, or harm other users</li>
                    <li>Post inappropriate, offensive, or illegal content</li>
                    <li>Use the Platform for any unlawful purpose</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Interfere with the proper functioning of the Platform</li>
                    <li>Scrape, copy, or harvest user data without permission</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">5. For Students</h2>
                  <p className="text-muted-foreground mb-4">As a student user, you agree to:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Provide accurate information about your skills and experience</li>
                    <li>Honor commitments made to employers</li>
                    <li>Communicate professionally with employers</li>
                    <li>Comply with workplace policies when employed</li>
                    <li>Not misuse employer contact information</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">6. For Employers</h2>
                  <p className="text-muted-foreground mb-4">As an employer user, you agree to:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Provide accurate information about your venue and gigs</li>
                    <li>Comply with all applicable labor laws and regulations</li>
                    <li>Pay students fairly and on time as agreed</li>
                    <li>Provide a safe working environment</li>
                    <li>Not discriminate against applicants</li>
                    <li>Respect student privacy and personal information</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">7. Content and Intellectual Property</h2>
                  <p className="text-muted-foreground">
                    You retain ownership of content you post on the Platform. By posting content,
                    you grant us a non-exclusive, worldwide, royalty-free license to use, display,
                    and distribute your content in connection with our services. The SideQuest name,
                    logo, and all related names, logos, and designs are our trademarks.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">8. Payment and Transactions</h2>
                  <p className="text-muted-foreground">
                    All payment arrangements are made directly between students and employers.
                    SideQuest does not process payments or take responsibility for payment disputes.
                    We encourage all parties to clearly communicate payment terms before starting work.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">9. Disclaimer of Warranties</h2>
                  <p className="text-muted-foreground">
                    THE PLATFORM IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY
                    KIND. WE DO NOT GUARANTEE THE QUALITY, SAFETY, OR LEGALITY OF GIGS POSTED, THE
                    QUALIFICATIONS OF STUDENTS, OR THE ABILITY OF EMPLOYERS TO PAY. WE DO NOT
                    VERIFY THE IDENTITY OF USERS OR THE ACCURACY OF INFORMATION PROVIDED.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">10. Limitation of Liability</h2>
                  <p className="text-muted-foreground">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, SIDEQUEST SHALL NOT BE LIABLE FOR ANY
                    INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT
                    OF OR RELATED TO YOUR USE OF THE PLATFORM, INCLUDING BUT NOT LIMITED TO LOSS
                    OF INCOME, EMPLOYMENT DISPUTES, OR PERSONAL INJURY.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">11. Indemnification</h2>
                  <p className="text-muted-foreground">
                    You agree to indemnify and hold harmless SideQuest and its officers, directors,
                    employees, and agents from any claims, damages, losses, or expenses arising out
                    of your use of the Platform, violation of these Terms, or infringement of any
                    rights of another party.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">12. Termination</h2>
                  <p className="text-muted-foreground">
                    We may suspend or terminate your account at any time for violations of these
                    Terms or for any other reason at our discretion. You may also delete your
                    account at any time. Upon termination, your right to use the Platform will
                    immediately cease.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">13. Dispute Resolution</h2>
                  <p className="text-muted-foreground">
                    Any disputes arising from these Terms or your use of the Platform shall be
                    governed by the laws of India. You agree to submit to the exclusive jurisdiction
                    of the courts in Hyderabad, Telangana for resolution of any disputes.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">14. Changes to Terms</h2>
                  <p className="text-muted-foreground">
                    We reserve the right to modify these Terms at any time. We will notify users
                    of material changes by posting the updated Terms on the Platform. Your continued
                    use of the Platform after changes constitutes acceptance of the modified Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">15. Contact Us</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about these Terms of Service, please contact us at:
                  </p>
                  <ul className="list-none text-muted-foreground mt-4 space-y-1">
                    <li>Email: hello@sidequest.in</li>
                    <li>WhatsApp: +91 7780185418</li>
                    <li>Location: Hyderabad, India</li>
                  </ul>
                </section>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
