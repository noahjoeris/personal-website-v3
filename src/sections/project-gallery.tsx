'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { ParallaxGlows } from '@/components/parallax-glows'
import { Section } from '@/components/section'
import { SectionHeading } from '@/components/section-heading'
import type { PortfolioMedia } from '@/data/portfolio-data'
import { useSectionParallax } from '@/lib/hooks/use-section-parallax'
import { cn } from '@/lib/utils'

type ProjectGallerySectionProps = {
  gallery: readonly PortfolioMedia[]
}

export function ProjectGallerySection(props: ProjectGallerySectionProps) {
  if (props.gallery.length === 0) {
    return null
  }

  return <ProjectGalleryContent {...props} />
}

function ProjectGalleryContent({ gallery }: ProjectGallerySectionProps) {
  const { sectionRef, introY, glowOneX, glowOneY, glowTwoX, glowTwoY } = useSectionParallax()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const activeMedia = activeIndex === null ? null : gallery[activeIndex]

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (activeIndex !== null && !dialog.open) {
      dialog.showModal()
    } else if (activeIndex === null && dialog.open) {
      dialog.close()
    }
  }, [activeIndex])

  function showPreviousMedia() {
    setActiveIndex(current => (current === null ? 0 : (current - 1 + gallery.length) % gallery.length))
  }

  function showNextMedia() {
    setActiveIndex(current => (current === null ? 0 : (current + 1) % gallery.length))
  }

  return (
    <Section ref={sectionRef} aria-labelledby="project-gallery-title">
      <ParallaxGlows oneX={glowOneX} oneY={glowOneY} twoX={glowTwoX} twoY={glowTwoY} />

      <div className="mx-auto w-full max-w-7xl">
        <motion.div style={{ y: introY }} className="mb-12 tablet:mb-16">
          <SectionHeading id="project-gallery-title" eyebrow="See the full" title="Gallery" />
        </motion.div>

        <ul className="grid gap-8 tablet:grid-cols-2 desktop:grid-cols-3 desktop:gap-10">
          {gallery.map((media, index) => (
            <li key={media.src} className={cn(media.layout === 'wide' && 'tablet:col-span-2 desktop:col-span-3')}>
              <figure className="overflow-hidden rounded-md border border-foreground/20 bg-foreground/[0.035] shadow-[0_24px_64px_rgba(0,0,0,0.24)]">
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="group block w-full cursor-zoom-in bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                  aria-label={`Expand image ${index + 1} of ${gallery.length}: ${media.alt}`}
                >
                  <Image
                    src={media.src}
                    alt={media.alt}
                    width={media.width}
                    height={media.height}
                    unoptimized={media.animated}
                    className={cn(
                      'h-auto w-full object-contain transition-transform duration-300 group-hover:scale-[1.01] group-focus-visible:scale-[1.01]',
                      media.animated && 'motion-reduce:hidden',
                    )}
                    sizes={
                      media.layout === 'wide' ? '(max-width: 767px) 90vw, 1100px' : '(max-width: 767px) 90vw, 360px'
                    }
                  />
                  {media.animated ? (
                    <span className="hidden min-h-64 items-center justify-center px-8 font-reading text-sm text-foreground/70 motion-reduce:flex">
                      Animated preview paused. Open it to view the interaction.
                    </span>
                  ) : null}
                </button>
                <figcaption className="border-t border-foreground/15 px-5 py-4 font-reading text-sm leading-relaxed text-foreground/70">
                  <span className="mr-2 font-mono text-xs text-primary-light">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {media.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="gallery-dialog-title"
        onClose={() => setActiveIndex(null)}
        onClick={event => {
          if (event.currentTarget === event.target) {
            event.currentTarget.close()
          }
        }}
        onKeyDown={event => {
          if (event.key === 'ArrowLeft') showPreviousMedia()
          if (event.key === 'ArrowRight') showNextMedia()
        }}
        className="m-auto max-h-[96vh] w-[min(96vw,90rem)] max-w-none overflow-hidden rounded-md border border-foreground/20 bg-black p-0 text-foreground shadow-2xl backdrop:bg-black/90"
      >
        {activeMedia ? (
          <div className="flex max-h-[96vh] flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-foreground/15 px-4 py-3 tablet:px-5">
              <p id="gallery-dialog-title" className="font-reading text-sm text-foreground/75">
                Image {(activeIndex ?? 0) + 1} of {gallery.length}: {activeMedia.caption}
              </p>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm text-2xl text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close expanded image"
              >
                ×
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-auto bg-black p-3 tablet:p-5">
              <Image
                src={activeMedia.src}
                alt={activeMedia.alt}
                width={activeMedia.width}
                height={activeMedia.height}
                unoptimized={activeMedia.animated}
                className="mx-auto h-auto max-h-[calc(96vh-9rem)] w-auto max-w-full object-contain"
                sizes="96vw"
              />
            </div>

            {gallery.length > 1 ? (
              <div className="flex items-center justify-between border-t border-foreground/15 px-4 py-3">
                <button
                  type="button"
                  onClick={showPreviousMedia}
                  className="inline-flex min-h-11 items-center gap-2 rounded-sm px-2 text-sm uppercase tracking-[0.12em] text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span aria-hidden="true">←</span> Previous
                </button>
                <button
                  type="button"
                  onClick={showNextMedia}
                  className="inline-flex min-h-11 items-center gap-2 rounded-sm px-2 text-sm uppercase tracking-[0.12em] text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Next <span aria-hidden="true">→</span>
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </dialog>
    </Section>
  )
}
