import { Navbar } from '@/components/navbar'
import { PortfolioSection } from '@/sections/portfolio'

export default function PortfolioPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <Navbar />
      <PortfolioSection standalonePage />
    </main>
  )
}
