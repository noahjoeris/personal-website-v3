import type { Metadata } from 'next'

import { Navbar } from '@/components/navbar'
import { AboutHero } from '@/sections/about/hero'
import { AboutInterests } from '@/sections/about/interests'
import { AboutManifesto } from '@/sections/about/manifesto'
import { AboutStory } from '@/sections/about/story'
import { AboutValues } from '@/sections/about/values'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Noah Joeris. Full-stack software engineer building on Bitcoin. Cypherpunk values, financial freedom, open-source contribution.',
}

export default function AboutPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <Navbar />
      <AboutHero />
      <AboutStory />
      <AboutManifesto />
      <AboutInterests />
      <AboutValues />
    </main>
  )
}
