'use client'

import { motion, useReducedMotion } from 'framer-motion'

import { cn } from '@/lib/utils'

type AnimatedDividerProps = {
  className?: string
  delay?: number
}

export function AnimatedDivider({ className, delay = 0 }: AnimatedDividerProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      aria-hidden
      className={cn('h-px w-full origin-left bg-foreground/35', className)}
      initial={shouldReduceMotion ? { opacity: 0.2 } : { opacity: 0.2, scaleX: 0.1 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scaleX: 1 }}
      transition={{
        duration: shouldReduceMotion ? 0.45 : 1.5,
        delay,
        ease: 'easeOut',
      }}
      viewport={{ once: true, amount: 0.95 }}
    />
  )
}
