'use client'

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useRef } from 'react'

import { ProjectCompact } from '@/components/project-compact'
import { SeeMoreButton } from '@/components/see-more-button'
import { type PortfolioProject, portfolioData } from '@/data/portfolio-data'
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

type PortfolioHeadingProps = {
  titleClassName: string
  wrapperClassName?: string
}

type AnimatedProjectCompactProps = {
  project: PortfolioProject
  index: number
  isAnimated: boolean
}

function getProjectKey(project: PortfolioProject) {
  return `${project.name}-${project.period}`
}

function formatProjectIndex(index: number) {
  return String(index + 1).padStart(2, '0')
}

function PortfolioHeading({ titleClassName, wrapperClassName }: PortfolioHeadingProps) {
  return (
    <div className={cn('mx-auto max-w-3xl text-center', wrapperClassName)}>
      <p className="text-lg uppercase">Explore my</p>
      <h2 className={titleClassName}>Portfolio</h2>
    </div>
  )
}

function AnimatedProjectCompact({ project, index, isAnimated }: AnimatedProjectCompactProps) {
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
        'relative mx-auto w-xs max-w-lg',
        index % 2 === 0 ? 'tablet:ml-0 tablet:mr-auto' : 'tablet:mr-0 tablet:ml-auto',
      )}
    >
      <div className="mb-4 flex items-center justify-between px-1 text-sm uppercase tracking-[0.18em] text-foreground/55">
        <span>{formatProjectIndex(index)}</span>
        <span>{project.period}</span>
      </div>

      <ProjectCompact
        project={project}
        className="max-w-none shadow-[0_24px_64px_rgba(0,0,0,0.28)] transition-transform duration-500 ease-out"
      />
    </motion.div>
  )
}

type PortfolioSectionProps = {
  maxProjects?: number
  standalonePage?: boolean
}

export function PortfolioSection({ maxProjects, standalonePage }: PortfolioSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const allProjects = portfolioData.projects
  const projects = maxProjects ? allProjects.slice(0, maxProjects) : allProjects
  const hasMore = maxProjects != null && allProjects.length > maxProjects
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

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative isolate overflow-hidden bg-background px-6 py-20 tablet:px-10 tablet:py-24 desktop:px-16 desktop:py-28',
        standalonePage && 'pt-32 tablet:pt-36 desktop:pt-40',
      )}
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
          <PortfolioHeading
            wrapperClassName="mx-auto max-w-3xl text-center"
            titleClassName="text-6xl leading-none tracking-tight text-foreground uppercase tablet:text-7xl desktop:text-[7.25rem]"
          />
        </motion.div>

        <div className="mx-auto max-w-3xl space-y-10 tablet:space-y-12 desktop:space-y-16">
          {projects.map((project, index) => (
            <AnimatedProjectCompact
              key={getProjectKey(project)}
              index={index}
              isAnimated={isAnimated}
              project={project}
            />
          ))}

          {hasMore && (
            <div className="flex justify-center pt-4">
              <Link href="/portfolio">
                <SeeMoreButton>See more</SeeMoreButton>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
