import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import { Big_Shoulders } from 'next/font/google'

import { Footer } from '@/components/footer'
import { GrainOverlay } from '@/components/grain-overlay'
import { landingData } from '@/data/landing-data'
import { siteName, siteUrl } from '@/lib/site'

import './globals.css'

const bigShoulders = Big_Shoulders({
  subsets: ['latin'],
  variable: '--font-big-shoulders',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: landingData.metadata.title,
    template: `%s | ${siteName}`,
  },
  description: landingData.metadata.description,
  openGraph: {
    type: 'website',
    siteName,
    title: landingData.metadata.title,
    description: landingData.metadata.description,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: landingData.metadata.title,
    description: landingData.metadata.description,
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${bigShoulders.variable} font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-background focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Skip to main content
        </a>
        <div className="flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
        <GrainOverlay />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
