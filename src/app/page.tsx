import { Navbar } from '@/components/navbar'
import { LandingSection } from '@/sections/landing'
import { PortfolioSection } from '@/sections/portfolio'
import { QuoteSection } from '@/sections/quote'
import { StatsSection } from '@/sections/stats'
import { WorkHistorySection } from '@/sections/work-history'

export default function Page() {
  return (
    <main id="main-content" className="min-h-screen bg-background">
      <Navbar />
      <LandingSection />
      <QuoteSection />
      <WorkHistorySection />
      <StatsSection />
      <PortfolioSection maxProjects={4} />
    </main>
  )
}
