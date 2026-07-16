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
  headingLevel?: 'h1' | 'h2'
}

export function PortfolioSection({ maxProjects, headingLevel = 'h2' }: PortfolioSectionProps) {
  const { sectionRef, introY, glowOneX, glowOneY, glowTwoX, glowTwoY } = useSectionParallax()
  const allProjects = portfolioData.projects
  const projects = maxProjects ? allProjects.slice(0, maxProjects) : allProjects
  const hasMore = maxProjects != null && allProjects.length > maxProjects

  return (
    <Section ref={sectionRef}>
      <ParallaxGlows oneX={glowOneX} oneY={glowOneY} twoX={glowTwoX} twoY={glowTwoY} />

      <div className="mx-auto w-full max-w-9xl">
        <motion.div style={{ y: introY }} className="mb-12 tablet:mb-16 desktop:mb-20">
          <SectionHeading eyebrow="Explore my" title="Portfolio" headingLevel={headingLevel} />
        </motion.div>

        <div className="mx-auto max-w-3xl space-y-16 tablet:space-y-24 desktop:space-y-28">
          {projects.map((project, index) => (
            <AnimatedRevealCard
              key={project.slug}
              index={index}
              className={index % 2 === 0 ? 'mr-auto max-w-[22rem]' : 'ml-auto max-w-[22rem]'}
            >
              <ProjectCompact
                project={project}
                index={index}
                titleLevel={headingLevel === 'h1' ? 'h2' : 'h3'}
                priority={index < 2}
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
