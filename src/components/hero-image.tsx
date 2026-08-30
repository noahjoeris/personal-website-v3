'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'

import { landingData } from '@/data/landing-data'

export function HeroImage() {
  const { heroImgSrc } = landingData.hero
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="relative h-full w-full overflow-hidden">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
        className="absolute bottom-0 left-1/2 z-20 h-full w-full max-w-[420px] -translate-x-1/2 tablet:max-w-none desktop:h-auto desktop:w-[min(92vh,100%)] desktop:max-w-full"
      >
        <Image
          src={heroImgSrc}
          alt=""
          width={1408}
          height={1408}
          priority
          className="h-full w-full object-contain object-bottom desktop:h-auto desktop:w-full"
          sizes="(max-width: 420px) 100vw, (max-width: 767px) 420px, (max-width: 1023px) 100vw, min(92vh, 100vw)"
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-44 bg-linear-to-b from-transparent via-background/40 to-background tablet:h-52 desktop:h-[30vh] desktop:via-background/32 desktop:to-background" />
    </div>
  )
}
