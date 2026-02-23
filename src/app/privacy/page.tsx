'use client'

import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { Card, CardContent } from '@/components/ui/card'

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 pt-24">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: February 2025</p>

            <Card>
              <CardContent className="p-8 prose prose-neutral dark:prose-invert max-w-none">
                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
                  <p className="text-muted-foreground mb-4">
                    Welcome to SideQuest (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your
                    personal information and your right to privacy. This Privacy Policy explains how
                    we collect, use, disclose, and safeguard your information when you use our
                    platform.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
                  <p className="text-muted-foreground mb-4">
                    We collect information that you provide directly to us, including:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                    <li>Account information (name, email, phone number)</li>
                    <li>Profile information (photo, bio, college, skills)</li>
                    <li>Employment preferences and availability</li>
                    <li>Communication data (messages between users)</li>
                    <li>Application and job posting data</li>
                  </ul>
                  <p className="text-muted-foreground">
                    We also automatically collect certain information when you use our platform,
                    including device information, log data, and usage information.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
                  <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Connect students with employment opportunities</li>
                    <li>Process applications and facilitate communication</li>
                    <li>Send notifications and updates about your account</li>
                    <li>Respond to your comments, questions, and requests</li>
                    <li>Monitor and analyze trends, usage, and activities</li>
                    <li>Detect, investigate, and prevent security incidents</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">4. Information Sharing</h2>
                  <p className="text-muted-foreground mb-4">
                    We may share your information in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>With employers when you apply for gigs (your profile information)</li>
                    <li>With service providers who assist in our operations</li>
                    <li>To comply with legal obligations</li>
                    <li>To protect our rights, privacy, safety, or property</li>
                    <li>With your consent or at your direction</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">5. Data Security</h2>
                  <p className="text-muted-foreground">
                    We implement appropriate technical and organizational security measures to protect
                    your personal information against unauthorized access, alteration, disclosure, or
                    destruction. However, no method of transmission over the Internet is 100% secure,
                    and we cannot guarantee absolute security.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">6. Your Rights</h2>
                  <p className="text-muted-foreground mb-4">You have the right to:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Access and receive a copy of your personal data</li>
                    <li>Rectify or update your personal information</li>
                    <li>Delete your account and associated data</li>
                    <li>Object to or restrict processing of your data</li>
                    <li>Withdraw consent at any time</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">7. Cookies and Tracking</h2>
                  <p className="text-muted-foreground">
                    We use cookies and similar tracking technologies to collect information about your
                    browsing activities. You can control cookies through your browser settings, but
                    disabling cookies may affect the functionality of our platform.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">8. Third-Party Services</h2>
                  <p className="text-muted-foreground">
                    Our platform may contain links to third-party websites or services. We are not
                    responsible for the privacy practices of these third parties. We encourage you
                    to read their privacy policies.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">9. Children&apos;s Privacy</h2>
                  <p className="text-muted-foreground">
                    Our services are not intended for individuals under the age of 16. We do not
                    knowingly collect personal information from children under 16. If you are a
                    parent or guardian and believe your child has provided us with personal
                    information, please contact us.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">10. Changes to This Policy</h2>
                  <p className="text-muted-foreground">
                    We may update this Privacy Policy from time to time. We will notify you of any
                    changes by posting the new Privacy Policy on this page and updating the &quot;Last
                    updated&quot; date. Your continued use of our services after any changes constitutes
                    acceptance of the new Privacy Policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">11. Contact Us</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about this Privacy Policy or our privacy practices,
                    please contact us at:
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
