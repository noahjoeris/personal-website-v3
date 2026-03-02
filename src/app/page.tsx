import { Navbar } from '@/components/navbar'
import { LandingSection } from '@/sections/landing'
import { QuoteSection } from '@/sections/quote'

export default function Page() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <LandingSection />
      <QuoteSection />
    </main>
  )
}
