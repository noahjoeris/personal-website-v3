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
      <div className="absolute inset-0 lg:hidden">
        <Image
          src={heroImgSrc}
          alt="Hero image"
          width={2048}
          height={1152}
          priority
          className="absolute bottom-0 left-1/2 h-auto w-[860px] max-w-none -translate-x-1/2 md:w-[1160px]"
          sizes="(max-width: 767px) 860px, 1160px"
        />
      </div>

      <div className="absolute inset-0 hidden lg:block">
        <Image
          src={heroImgSrc}
          alt="Hero image"
          fill
          priority
          className="object-cover object-[center_20%]"
          sizes="100vw"
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent via-black/40 to-black md:h-52 lg:h-[30vh] lg:via-black/32 lg:to-black" />
    </motion.div>
  )
}
