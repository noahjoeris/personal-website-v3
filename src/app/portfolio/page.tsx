import type { Metadata } from 'next'

import { Navbar } from '@/components/navbar'
import { PortfolioSection } from '@/sections/portfolio'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Selected projects in web, blockchain, and cybersecurity engineering.',
}

export default function PortfolioPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background pt-12 text-foreground">
      <Navbar />
      <PortfolioSection />
    </main>
  )
}
