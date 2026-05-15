'use client'

import { type MotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { type RefObject, useRef } from 'react'

import { SECTION_SPRING } from '@/lib/motion'

export function useSectionParallax(): {
  sectionRef: RefObject<HTMLElement | null>
  introY: MotionValue<number>
  glowOneX: MotionValue<number>
  glowOneY: MotionValue<number>
  glowTwoX: MotionValue<number>
  glowTwoY: MotionValue<number>
} {
  const sectionRef = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const smooth = useSpring(scrollYProgress, SECTION_SPRING)

  const introY = useTransform(smooth, [0, 1], shouldReduceMotion ? [0, 0] : [0, -18])
  const glowOneX = useTransform(smooth, [0, 1], shouldReduceMotion ? [0, 0] : [-120, 170])
  const glowOneY = useTransform(smooth, [0, 1], shouldReduceMotion ? [0, 0] : [-10, -90])
  const glowTwoX = useTransform(smooth, [0, 1], shouldReduceMotion ? [0, 0] : [80, -120])
  const glowTwoY = useTransform(smooth, [0, 1], shouldReduceMotion ? [0, 0] : [70, -60])

  return { sectionRef, introY, glowOneX, glowOneY, glowTwoX, glowTwoY }
}
