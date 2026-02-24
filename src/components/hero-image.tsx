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
      className="relative h-full w-full"
    >
      <Image
        src={heroImgSrc}
        alt="Hero image"
        fill
        priority
        className="object-cover object-[center_20%]"
        sizes="(max-width: 768px) 100vw, 60vw"
      />
    </motion.div>
  )
}
