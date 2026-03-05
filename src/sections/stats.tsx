'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Fragment } from 'react'

import { AnimatedDivider } from '@/components/animated-divider'
import { statsData } from '@/data/stats-data'

export function StatsSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-background px-6 py-20 tablet:px-10 tablet:py-24 desktop:px-16 desktop:py-28">
      <div className="relative max-w-7xl">
        <h2 className="sr-only">{statsData.srTitle}</h2>

        <div>
          {statsData.items.map((item, index) => (
            <Fragment key={item.value}>
              <motion.article
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: shouldReduceMotion ? 0 : index * 0.08,
                  ease: 'easeOut',
                }}
                viewport={{ once: true, amount: 0.35 }}
                className="grid gap-5 py-7 tablet:grid-cols-[minmax(0,clamp(20rem,42vw,30rem))_minmax(0,1fr)] tablet:items-center tablet:gap-8 tablet:py-10"
              >
                <p className="uppercase text-6xl leading-[0.88] tracking-[0.02em] text-foreground tablet:text-[clamp(4.2rem,9vw,7rem)] tablet:whitespace-nowrap">
                  {item.value}
                </p>
                <p className="min-w-0 max-w-4xl text-xl leading-tight text-foreground/70 uppercase tablet:text-2xl">
                  {item.description}
                </p>
              </motion.article>

              <AnimatedDivider delay={shouldReduceMotion ? 0 : index * 0.06} />
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
