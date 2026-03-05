'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

import { landingData } from '@/data/landing-data'

export function HeroImage() {
  const { heroImgSrc } = landingData.hero

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
      className="relative h-full w-full overflow-hidden"
    >
      <Image
        src={heroImgSrc}
        alt="Hero image"
        width={2048}
        height={1152}
        priority
        className="absolute bottom-0 left-1/2 h-auto w-[860px] max-w-none -translate-x-1/2 tablet:w-[1160px] desktop:inset-0 desktop:h-full desktop:w-full desktop:max-w-full desktop:translate-x-0 desktop:object-cover desktop:object-[center_20%]"
        sizes="(max-width: 767px) 860px, (max-width: 1023px) 1160px, 100vw"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-linear-to-b from-transparent via-background/40 to-background tablet:h-52 desktop:h-[30vh] desktop:via-background/32 desktop:to-background" />
    </motion.div>
  )
}
