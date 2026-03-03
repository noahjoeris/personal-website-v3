import { Navbar } from '@/components/navbar'
import { LandingSection } from '@/sections/landing'
import { QuoteSection } from '@/sections/quote'
import { WorkHistorySection } from '@/sections/work-history'

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <LandingSection />
      <QuoteSection />
      <WorkHistorySection />
    </main>
  )
}
