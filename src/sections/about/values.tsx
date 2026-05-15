'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Fragment } from 'react'

import { aboutData } from '@/data/about-data'

const REVEAL_EASE = [0.19, 1, 0.22, 1] as const

export function AboutValues() {
  const { section, topic, items } = aboutData.values
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      aria-labelledby="about-values-title"
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
            id="about-values-title"
            className="mt-4 text-6xl uppercase leading-[0.88] tracking-tight text-foreground tablet:text-7xl desktop:text-[clamp(5rem,9vw,10rem)]"
          >
            Code of <span className="text-primary">conduct</span>
          </h2>
        </div>

        <ol className="mt-8 tablet:mt-12">
          {items.map((item, index) => (
            <Fragment key={item.numeral}>
              <motion.li
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: index * 0.06, ease: REVEAL_EASE }}
                className="group grid gap-4 py-10 tablet:grid-cols-12 tablet:gap-8 tablet:py-14"
              >
                <div className="flex items-baseline gap-4 tablet:col-span-3 tablet:flex-col tablet:gap-2">
                  <span className="font-mono text-xs uppercase tracking-[0.28em] text-foreground/55">
                    {String(index + 1).padStart(2, '0')} / 04
                  </span>
                  <span className="font-mono text-7xl leading-none text-primary tablet:text-[clamp(5rem,9vw,9rem)]">
                    {item.numeral}
                  </span>
                </div>

                <div className="tablet:col-span-9">
                  <h3 className="text-5xl uppercase leading-[0.88] tracking-tight text-foreground tablet:text-7xl desktop:text-[clamp(4rem,7vw,7.5rem)]">
                    {item.title}
                  </h3>
                  <p className="mt-4 font-mono text-sm uppercase tracking-[0.2em] text-primary tablet:text-base">
                    “{item.epigram}”
                  </p>
                  <p className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground/80 tablet:text-xl">
                    {item.description}
                  </p>
                </div>
              </motion.li>

              {index < items.length - 1 && (
                <motion.div
                  aria-hidden
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  viewport={{ once: true, amount: 0.9 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  className="h-px origin-left bg-foreground/25"
                />
              )}
            </Fragment>
          ))}
        </ol>
      </div>
    </section>
  )
}
