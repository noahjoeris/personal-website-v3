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
      className="pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      <span className="block w-full whitespace-nowrap text-center font-bold uppercase leading-[0.8] text-foreground/20 text-[clamp(4rem,16vw,20rem)] tracking-[-0.03em]">
        {watermark}
      </span>
    </motion.div>
  )
}
