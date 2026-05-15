'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

import { AnimatedRevealCard } from '@/components/animated-reveal-card'
import { ParallaxGlows } from '@/components/parallax-glows'
import { Section } from '@/components/section'
import { SectionHeading } from '@/components/section-heading'
import type { PortfolioImageUrl } from '@/data/portfolio-data'
import { useSectionParallax } from '@/lib/hooks/use-section-parallax'

type ProjectGallerySectionProps = {
  gallery: readonly PortfolioImageUrl[]
  projectName: string
}

export function ProjectGallerySection({ gallery, projectName }: ProjectGallerySectionProps) {
  const { sectionRef, introY, glowOneX, glowOneY, glowTwoX, glowTwoY } = useSectionParallax()

  if (gallery.length === 0) {
    return null
  }

  return (
    <Section ref={sectionRef}>
      <ParallaxGlows oneX={glowOneX} oneY={glowOneY} twoX={glowTwoX} twoY={glowTwoY} />

      <div className="mx-auto w-full max-w-9xl">
        <motion.div style={{ y: introY }} className="mb-12 tablet:mb-16 desktop:mb-20">
          <SectionHeading eyebrow="See the Full" title="Gallery" />
        </motion.div>

        <div className="mx-auto max-w-3xl space-y-10 tablet:space-y-12 desktop:space-y-16">
          {gallery.map((src, index) => (
            <AnimatedRevealCard key={src} index={index}>
              <div className="overflow-hidden rounded-md border border-foreground/25 bg-black shadow-[0_24px_64px_rgba(0,0,0,0.28)]">
                <Image
                  src={src}
                  alt={`${projectName} screenshot ${index + 1}`}
                  width={800}
                  height={600}
                  className="h-auto w-full"
                  sizes="(max-width: 640px) 90vw, 512px"
                  unoptimized
                />
              </div>
            </AnimatedRevealCard>
          ))}
        </div>
      </div>
    </Section>
  )
}
