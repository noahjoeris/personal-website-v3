'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

import { AnimatedRevealCard } from '@/components/animated-reveal-card'
import { ParallaxGlows } from '@/components/parallax-glows'
import { ProjectCompact } from '@/components/project-compact'
import { Section } from '@/components/section'
import { SectionHeading } from '@/components/section-heading'
import { SeeMoreButton } from '@/components/see-more-button'
import { portfolioData } from '@/data/portfolio-data'
import { useSectionParallax } from '@/lib/hooks/use-section-parallax'

type PortfolioSectionProps = {
  maxProjects?: number
}

export function PortfolioSection({ maxProjects }: PortfolioSectionProps) {
  const { sectionRef, introY, glowOneX, glowOneY, glowTwoX, glowTwoY } = useSectionParallax()
  const allProjects = portfolioData.projects
  const projects = maxProjects ? allProjects.slice(0, maxProjects) : allProjects
  const hasMore = maxProjects != null && allProjects.length > maxProjects

  return (
    <Section ref={sectionRef}>
      <ParallaxGlows oneX={glowOneX} oneY={glowOneY} twoX={glowTwoX} twoY={glowTwoY} />

      <div className="mx-auto w-full max-w-9xl">
        <motion.div style={{ y: introY }} className="mb-12 tablet:mb-16 desktop:mb-20">
          <SectionHeading eyebrow="Explore my" title="Portfolio" />
        </motion.div>

        <div className="mx-auto max-w-3xl space-y-10 tablet:space-y-12 desktop:space-y-16">
          {projects.map((project, index) => (
            <AnimatedRevealCard key={`${project.name}-${project.period}`} index={index}>
              <div className="mb-4 flex items-center justify-between px-1 text-sm uppercase tracking-[0.18em] text-foreground/55">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span>{project.period}</span>
              </div>

              <ProjectCompact
                project={project}
                className="max-w-none shadow-[0_24px_64px_rgba(0,0,0,0.28)] transition-transform duration-500 ease-out"
              />
            </AnimatedRevealCard>
          ))}

          {hasMore && (
            <div className="flex justify-center pt-4">
              <SeeMoreButton asChild>
                <Link href="/portfolio">See more</Link>
              </SeeMoreButton>
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}
