import type { Metadata } from 'next'

import { Navbar } from '@/components/navbar'

export const metadata: Metadata = {
  title: 'About',
  description: 'About Noah Joeris — software engineer building tools for privacy and freedom.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6 pb-16 pt-28 tablet:px-10 desktop:px-16">
        <h1 className="text-4xl font-semibold tracking-tight tablet:text-5xl">About Me</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/80 tablet:text-lg">
          I build software that protects freedom and privacy. This page is a stub and will be expanded with background,
          principles, and the work I am focused on.
        </p>
      </section>
    </main>
  )
}
