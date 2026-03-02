'use client'

import { HeroContent } from '@/components/hero-content'
import { HeroImage } from '@/components/hero-image'
import { WatermarkText } from '@/components/watermark-text'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-black lg:min-h-screen">
      <div className="absolute inset-0 hidden bg-gradient-to-br from-[hsl(182,30%,14%)] via-[hsl(182,30%,12%)] to-[hsl(185,25%,10%)] lg:block" />

      <div className="absolute inset-x-0 top-0 h-[460px] bg-gradient-to-br from-[hsl(182,30%,14%)] via-[hsl(182,30%,12%)] to-[hsl(185,25%,10%)] md:h-[620px] lg:hidden" />

      <div className="relative h-[460px] w-full md:h-[620px] lg:absolute lg:inset-0 lg:z-10 lg:h-full">
        <HeroImage />

        <div className="absolute bottom-0 left-0 right-0 z-20">
          <WatermarkText />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-b from-transparent via-black/70 to-black lg:hidden" />
      </div>

      <div className="relative z-30 px-6 pb-10 pt-8 md:px-10 md:pb-14 lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:px-16 lg:pb-20 lg:pt-24">
        <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-xl">
          <HeroContent />
        </div>
      </div>
    </section>
  )
}
