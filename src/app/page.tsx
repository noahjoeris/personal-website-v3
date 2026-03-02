import { Navbar } from '@/components/navbar'
import { LandingSection } from '@/sections/landing'

export default function Page() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <LandingSection />
    </main>
  )
}
