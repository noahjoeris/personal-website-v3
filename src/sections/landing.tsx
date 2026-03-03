'use client'

import { HeroContent } from '@/components/hero-content'
import { HeroImage } from '@/components/hero-image'
import { LandingBackground } from '@/components/landing-background'
import { WatermarkText } from '@/components/watermark-text'

export function LandingSection() {
  return (
    <section className="relative overflow-hidden bg-background lg:min-h-screen">
      <LandingBackground />

      <div className="relative mt-3 h-[460px] w-full md:mt-0 md:h-[620px] lg:absolute lg:inset-0 lg:z-10 lg:h-full">
        <div className="relative z-20 h-full w-full">
          <HeroImage />
        </div>

        <div className="absolute bottom-4 left-0 right-0 z-10 md:bottom-6 lg:bottom-8">
          <WatermarkText />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-15 h-40 bg-linear-to-b from-transparent via-background/6 to-background/18 md:h-48 lg:h-[24vh] lg:via-background/8 lg:to-background/16" />
      </div>

      <div className="relative z-30 px-6 pb-10 pt-8 md:px-10 md:pb-14 lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:px-16 lg:pb-20 lg:pt-24">
        <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-xl">
          <HeroContent />
        </div>
      </div>
    </section>
  )
}
