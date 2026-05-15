'use client'

import { type MotionValue, motion } from 'framer-motion'

type ParallaxGlowsProps = {
  oneX: MotionValue<number>
  oneY: MotionValue<number>
  twoX: MotionValue<number>
  twoY: MotionValue<number>
}

export function ParallaxGlows({ oneX, oneY, twoX, twoY }: ParallaxGlowsProps) {
  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{ x: oneX, y: oneY }}
        className="pointer-events-none absolute -left-28 top-12 h-80 w-80 rounded-full bg-primary/25 blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        style={{ x: twoX, y: twoY }}
        className="pointer-events-none absolute -right-16 top-1/3 h-96 w-96 rounded-full bg-foreground/10 blur-3xl"
      />
    </>
  )
}
