'use client'

import { motion } from 'framer-motion'

import { landingData } from '@/data/landing-data'

export function WatermarkText() {
  const { watermark } = landingData.hero

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
      className="pointer-events-none select-none overflow-hidden px-2 md:px-3 lg:px-0"
      aria-hidden="true"
    >
      <span className="mx-auto block w-full max-w-[95vw] whitespace-nowrap bg-linear-to-b from-white/60 to-white/24 bg-clip-text text-center text-[21vw] text-transparent uppercase leading-[0.85] tracking-[-0.03em] lg:max-w-full lg:text-[clamp(4rem,16vw,20rem)] ">
        {watermark}
      </span>
    </motion.div>
  )
}
