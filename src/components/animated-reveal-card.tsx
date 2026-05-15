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
    offset: ['start 0.94', 'end 0.45'],
  })

  const progress = useSpring(scrollYProgress, CARD_SPRING)

  const x = useTransform(progress, [0, 1], shouldReduceMotion ? [0, 0] : [direction * 56, 0])
  const y = useTransform(progress, [0, 1], shouldReduceMotion ? [0, 0] : [72, 0])
  const scale = useTransform(progress, [0, 1], shouldReduceMotion ? [1, 1] : [0.94, 1])
  const opacity = useTransform(progress, [0, 0.5, 1], shouldReduceMotion ? [1, 1, 1] : [0.2, 0.62, 1])
  const rotateZ = useTransform(progress, [0, 1], shouldReduceMotion ? [0, 0] : [direction * 1.6, 0])

  return (
    <motion.div
      ref={ref}
      style={{ x, y, scale, opacity, rotateZ }}
      className={cn(
        'relative mx-auto w-full max-w-lg',
        index % 2 === 0 ? 'tablet:ml-0 tablet:mr-auto' : 'tablet:mr-0 tablet:ml-auto',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}
