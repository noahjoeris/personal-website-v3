import { Navbar } from '@/components/navbar'
import { BlogPreviewSection } from '@/sections/blog-preview'
import { LandingSection } from '@/sections/landing'
import { PortfolioSection } from '@/sections/portfolio'
import { QuoteSection } from '@/sections/quote'
import { WorkHistorySection } from '@/sections/work-history'

export default function Page() {
  return (
    <main id="main-content" className="min-h-screen bg-background">
      <Navbar />
      <LandingSection />
      <QuoteSection />
      <WorkHistorySection />
      <PortfolioSection maxProjects={4} />
      <BlogPreviewSection />
    </main>
  )
}
