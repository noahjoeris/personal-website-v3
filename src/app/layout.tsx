import type { Metadata, Viewport } from 'next'
import { Big_Shoulders } from 'next/font/google'

import { Footer } from '@/components/footer'
import { landingData } from '@/data/landing-data'

import './globals.css'

const bigShoulders = Big_Shoulders({
  subsets: ['latin'],
  variable: '--font-big-shoulders',
})

export const metadata: Metadata = {
  title: landingData.metadata.title,
  description: landingData.metadata.description,
}

export const viewport: Viewport = {
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${bigShoulders.variable} font-sans antialiased`}>
        <div className="flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  )
}
