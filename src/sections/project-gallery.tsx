'use client'

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'

import type { PortfolioImageUrl } from '@/data/portfolio-data'
import { cn } from '@/lib/utils'

const SECTION_SPRING = {
  stiffness: 110,
  damping: 28,
  mass: 0.42,
} as const

const CARD_SPRING = {
  stiffness: 150,
  damping: 26,
  mass: 0.38,
} as const

type AnimatedGalleryItemProps = {
  src: PortfolioImageUrl
  alt: string
  index: number
  isAnimated: boolean
}

function AnimatedGalleryItem({ src, alt, index, isAnimated }: AnimatedGalleryItemProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const direction = index % 2 === 0 ? 1 : -1

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start 0.94', 'end 0.45'],
  })

  const revealProgress = useSpring(scrollYProgress, CARD_SPRING)
  const x = useTransform(revealProgress, [0, 1], isAnimated ? [direction * 56, 0] : [0, 0])
  const y = useTransform(revealProgress, [0, 1], isAnimated ? [72, 0] : [0, 0])
  const scale = useTransform(revealProgress, [0, 1], isAnimated ? [0.94, 1] : [1, 1])
  const opacity = useTransform(revealProgress, [0, 0.5, 1], isAnimated ? [0.2, 0.62, 1] : [1, 1, 1])
  const rotateZ = useTransform(revealProgress, [0, 1], isAnimated ? [direction * 1.6, 0] : [0, 0])

  return (
    <motion.div
      ref={cardRef}
      style={{ x, y, scale, opacity, rotateZ }}
      className={cn(
        'relative mx-auto w-full max-w-lg',
        index % 2 === 0 ? 'tablet:ml-0 tablet:mr-auto' : 'tablet:mr-0 tablet:ml-auto',
      )}
    >
      <div className="overflow-hidden rounded-md border border-foreground/25 bg-black shadow-[0_24px_64px_rgba(0,0,0,0.28)]">
        <Image
          src={src}
          alt={alt}
          width={800}
          height={600}
          className="h-auto w-full"
          sizes="(max-width: 640px) 90vw, 512px"
          unoptimized
        />
      </div>
    </motion.div>
  )
}

type ProjectGallerySectionProps = {
  gallery: readonly PortfolioImageUrl[]
  projectName: string
}

export function ProjectGallerySection({ gallery, projectName }: ProjectGallerySectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const isAnimated = !shouldReduceMotion

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const smoothProgress = useSpring(scrollYProgress, SECTION_SPRING)
  const introY = useTransform(smoothProgress, [0, 1], isAnimated ? [0, -18] : [0, 0])
  const glowOneX = useTransform(smoothProgress, [0, 1], isAnimated ? [-120, 170] : [0, 0])
  const glowOneY = useTransform(smoothProgress, [0, 1], isAnimated ? [-10, -90] : [0, 0])
  const glowTwoX = useTransform(smoothProgress, [0, 1], isAnimated ? [80, -120] : [0, 0])
  const glowTwoY = useTransform(smoothProgress, [0, 1], isAnimated ? [70, -60] : [0, 0])

  if (gallery.length === 0) {
    return null
  }

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-background px-6 py-20 tablet:px-10 tablet:py-24 desktop:px-16 desktop:py-28"
    >
      <motion.div
        aria-hidden="true"
        style={{ x: glowOneX, y: glowOneY }}
        className="pointer-events-none absolute -left-28 top-12 h-80 w-80 rounded-full bg-primary/25 blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        style={{ x: glowTwoX, y: glowTwoY }}
        className="pointer-events-none absolute -right-16 top-1/3 h-96 w-96 rounded-full bg-foreground/10 blur-3xl"
      />

      <div className="mx-auto w-full max-w-9xl">
        <motion.div style={{ y: introY }} className="mb-12 tablet:mb-16 desktop:mb-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-lg uppercase">See the Full</p>
            <h2 className="text-6xl leading-none tracking-tight text-foreground uppercase tablet:text-7xl desktop:text-[7.25rem]">
              Gallery
            </h2>
          </div>
        </motion.div>

        <div className="mx-auto max-w-3xl space-y-10 tablet:space-y-12 desktop:space-y-16">
          {gallery.map((src, index) => (
            <AnimatedGalleryItem
              key={src}
              src={src}
              alt={`${projectName} screenshot ${index + 1}`}
              index={index}
              isAnimated={isAnimated}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
