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
      className="pointer-events-none select-none overflow-hidden px-2 tablet:px-3"
      aria-hidden="true"
    >
      <span className="mx-auto block w-full max-w-[95vw] whitespace-nowrap bg-linear-to-b from-foreground/70 via-foreground/46 to-foreground/18 bg-clip-text text-center text-[21vw] text-transparent uppercase leading-[0.85] tracking-[-0.03em] opacity-[0.5] drop-shadow-[0_12px_36px_rgba(0,0,0,0.45)] desktop:[word-spacing:0.1em] desktop:text-[clamp(4.75rem,19vw,22rem)]">
        {watermark}
      </span>
    </motion.div>
  )
}
