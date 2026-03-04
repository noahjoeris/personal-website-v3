import { Navbar } from '@/components/navbar'
import { PortfolioSection } from '@/sections/portfolio'

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-20 md:pt-24">
        <PortfolioSection />
      </div>
    </main>
  )
}
