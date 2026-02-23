import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { Providers } from '@/components/providers/Providers'

export const metadata: Metadata = {
  title: {
    default: 'SideQuest - Part-Time Gigs for Students in Hyderabad',
    template: '%s | SideQuest',
  },
  description:
    'Find part-time gigs at cafes, bookstores, gyms, and more. SideQuest connects college students with aspirational work opportunities in Hyderabad.',
  keywords: [
    'part-time jobs',
    'student jobs',
    'Hyderabad',
    'gigs',
    'cafes',
    'internships',
    'college students',
    'work',
  ],
  authors: [{ name: 'SideQuest' }],
  creator: 'SideQuest',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://sidequest.in',
    siteName: 'SideQuest',
    title: 'SideQuest - Part-Time Gigs for Students',
    description:
      'Find part-time gigs at cafes, bookstores, gyms, and more in Hyderabad.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SideQuest',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SideQuest - Part-Time Gigs for Students',
    description:
      'Find part-time gigs at cafes, bookstores, gyms, and more in Hyderabad.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  )
}
