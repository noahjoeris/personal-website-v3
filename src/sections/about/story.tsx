'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Fragment } from 'react'

import { aboutData } from '@/data/about-data'

const REVEAL_EASE = [0.19, 1, 0.22, 1] as const

export function AboutStory() {
  const { section, topic, chapters } = aboutData.story
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      aria-labelledby="about-story-title"
      className="relative isolate overflow-hidden bg-background px-6 py-24 tablet:px-10 tablet:py-32 desktop:px-16"
    >
      <div className="mx-auto w-full max-w-9xl">
        <div className="border-b border-foreground/15 pb-6 tablet:pb-8">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-foreground/55 tablet:text-sm">
            <span className="text-primary">{section}</span>
            <span className="mx-3 inline-block h-px w-8 bg-foreground/40 align-middle" />
            <span>{topic}</span>
          </p>
          <h2
            id="about-story-title"
            className="mt-4 text-5xl uppercase leading-[0.88] tracking-tight text-foreground tablet:text-7xl desktop:text-[clamp(5rem,9vw,10rem)]"
          >
            The path to <span className="text-primary">Bitcoin</span>
          </h2>
        </div>

        <ol className="mt-10 tablet:mt-16">
          {chapters.map((chapter, index) => {
            const isOdd = index % 2 === 1
            return (
              <Fragment key={chapter.num}>
                <motion.li
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.8, delay: index * 0.08, ease: REVEAL_EASE }}
                  className="grid gap-6 py-10 tablet:grid-cols-12 tablet:gap-8 tablet:py-14"
                >
                  <div
                    className={
                      isOdd
                        ? 'tablet:col-span-3 tablet:col-start-1 tablet:text-left'
                        : 'tablet:col-span-3 tablet:col-start-1'
                    }
                  >
                    <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-foreground/55 tablet:text-xs">
                      Chapter
                    </p>
                    <p className="mt-1 font-mono text-6xl tabular-nums leading-none text-primary tablet:text-7xl">
                      {chapter.num}
                    </p>
                    <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-foreground/70">
                      {chapter.period}
                    </p>
                    <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-foreground/55">
                      {chapter.place}
                    </p>
                  </div>

                  <div
                    className={isOdd ? 'tablet:col-span-8 tablet:col-start-5' : 'tablet:col-span-8 tablet:col-start-5'}
                  >
                    <span className="inline-flex items-center gap-2 border border-foreground/20 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/85 tablet:text-[11px]">
                      <span aria-hidden className="h-1 w-1 bg-primary" />
                      {chapter.tag}
                    </span>
                    <p className="mt-5 text-balance text-2xl leading-[1.2] text-foreground/95 tablet:text-3xl desktop:text-[clamp(1.65rem,2.4vw,2.5rem)] desktop:leading-[1.15]">
                      {chapter.body}
                    </p>
                  </div>
                </motion.li>

                {index < chapters.length - 1 && (
                  <motion.div
                    aria-hidden
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true, amount: 0.9 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    className="origin-left border-t border-dashed border-foreground/25"
                  />
                )}
              </Fragment>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
