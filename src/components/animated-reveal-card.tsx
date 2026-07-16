'use client'

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { type ReactNode, useRef } from 'react'

import { CARD_SPRING } from '@/lib/motion'
import { cn } from '@/lib/utils'

type AnimatedRevealCardProps = {
  index: number
  className?: string
  children: ReactNode
}

export function AnimatedRevealCard({ index, className, children }: AnimatedRevealCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const direction = index % 2 === 0 ? 1 : -1

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.98', 'start 0.32'],
  })

  const progress = useSpring(scrollYProgress, CARD_SPRING)
  const x = useTransform(progress, [0, 1], shouldReduceMotion ? [0, 0] : [direction * 110, 0])
  const y = useTransform(progress, [0, 1], shouldReduceMotion ? [0, 0] : [110, 0])
  const scale = useTransform(progress, [0, 1], shouldReduceMotion ? [1, 1] : [0.88, 1])
  const opacity = useTransform(progress, [0, 0.45, 1], shouldReduceMotion ? [1, 1, 1] : [0.12, 0.62, 1])
  const rotateZ = useTransform(progress, [0, 1], shouldReduceMotion ? [0, 0] : [direction * 3.5, 0])

  return (
    <motion.div
      ref={ref}
      style={{ x, y, scale, opacity, rotateZ, transformPerspective: 1200 }}
      className={cn('relative w-full', className)}
    >
      {children}
    </motion.div>
  )
}
