'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'

import { Section } from '@/components/section'
import { SectionHeading } from '@/components/section-heading'
import { aboutData } from '@/data/about-data'

export function AboutInterests() {
  const { section, eyebrow, title, items } = aboutData.interests
  const shouldReduceMotion = useReducedMotion()

  return (
    <Section aria-labelledby="about-interests-title">
      <div className="mx-auto w-full max-w-9xl">
        <div className="mb-10 border-b border-foreground/15 pb-5 font-mono text-xs uppercase tracking-[0.28em] text-foreground/55 tablet:text-sm">
          <span className="inline-flex items-center gap-3">
            <span className="text-primary">{section}</span>
            <span className="hidden h-px w-8 bg-foreground/40 tablet:inline-block" />
            <span>Off the keyboard</span>
          </span>
        </div>
        <SectionHeading eyebrow={eyebrow} title={title} className="mb-14 tablet:mb-20" />

        <div className="grid gap-10 tablet:grid-cols-3 tablet:gap-8 desktop:gap-12">
          {items.map((item, index) => (
            <motion.article
              key={item.title}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: 'easeOut' }}
              className="group flex flex-col"
            >
              {/* Inline `position` safeguards against Tailwind not applying: a fill image without a
                  positioned ancestor would cover the whole viewport. */}
              <div
                style={{ position: 'relative' }}
                className="relative mx-auto aspect-[4/5] w-3/4 overflow-hidden border border-foreground/15"
              >
                <Image
                  src={item.imgSrc}
                  alt=""
                  fill
                  sizes="(max-width: 767px) 100vw, 32vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/55 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-5 text-3xl uppercase tracking-tight text-foreground tablet:text-4xl">
                  {item.title}
                </span>
              </div>
              <p className="mt-5 text-base leading-relaxed text-foreground/80 tablet:text-lg">{item.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </Section>
  )
}
