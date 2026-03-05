'use client'

import { HeroContent } from '@/components/hero-content'
import { HeroImage } from '@/components/hero-image'
import { LandingBackground } from '@/components/landing-background'
import { WatermarkText } from '@/components/watermark-text'

export function LandingSection() {
  return (
    <section className="relative overflow-hidden bg-background desktop:min-h-screen">
      <LandingBackground />

      <div className="relative mt-3 h-[460px] w-full tablet:mt-0 tablet:h-[620px] desktop:absolute desktop:inset-0 desktop:z-10 desktop:h-full">
        <div className="relative z-20 h-full w-full">
          <HeroImage />
        </div>

        <div className="absolute bottom-4 left-0 right-0 z-10 tablet:bottom-6 desktop:bottom-8">
          <WatermarkText />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-15 h-40 bg-linear-to-b from-transparent via-background/6 to-background/18 tablet:h-48 desktop:h-[24vh] desktop:via-background/8 desktop:to-background/16" />
      </div>

      <div className="relative z-30 px-6 pb-10 pt-8 tablet:px-10 tablet:pb-14 desktop:flex desktop:min-h-screen desktop:flex-col desktop:justify-center desktop:px-16 desktop:pb-20 desktop:pt-24">
        <div className="mx-auto w-full max-w-md desktop:mx-0 desktop:max-w-xl">
          <HeroContent />
        </div>
      </div>
    </section>
  )
}
