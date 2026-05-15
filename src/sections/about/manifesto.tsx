'use client'

import { motion, useReducedMotion } from 'framer-motion'

import { aboutData } from '@/data/about-data'

const REVEAL_EASE = [0.19, 1, 0.22, 1] as const

export function AboutManifesto() {
  const { section, topic, primary, rule, declaration, pillars, closer, signature } = aboutData.manifesto
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      aria-labelledby="about-manifesto-title"
      className="relative isolate overflow-hidden bg-background px-6 py-28 tablet:px-10 tablet:py-36 desktop:px-16 desktop:py-44"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent 0 calc(100% / 12 - 1px), color-mix(in srgb, var(--color-foreground) 60%, transparent) calc(100% / 12 - 1px) calc(100% / 12))',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,var(--color-primary-dark)_0%,transparent_70%)] opacity-25 blur-3xl"
      />

      <div className="mx-auto w-full max-w-7xl">
        <div className="border-b border-foreground/15 pb-5 font-mono text-xs uppercase tracking-[0.28em] text-foreground/55 tablet:text-sm">
          <span className="inline-flex items-center gap-3">
            <span className="text-primary">{section}</span>
            <span className="hidden h-px w-8 bg-foreground/40 tablet:inline-block" />
            <span>{topic}</span>
          </span>
        </div>

        <h2 id="about-manifesto-title" className="sr-only">
          {rule}
        </h2>

        <motion.p
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8, ease: REVEAL_EASE }}
          className="mt-12 font-mono text-xs uppercase tracking-[0.32em] text-foreground/55 tablet:mt-16"
        >
          A mission, not a job.
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
          }}
          className="mt-4 uppercase leading-[0.92] tracking-tight text-foreground"
        >
          {primary.map((line, i) => {
            const isHighlight = line === 'freedom.' || line === 'fiat system.'
            return (
              <motion.p
                key={`${i}-${line}`}
                variants={{
                  hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: REVEAL_EASE } },
                }}
                className={
                  isHighlight
                    ? 'text-primary text-[clamp(3.2rem,9vw,9rem)] tablet:pl-12 desktop:pl-24'
                    : 'text-[clamp(3.2rem,9vw,9rem)]'
                }
              >
                {line}
              </motion.p>
            )
          })}
        </motion.div>

        <div className="my-14 flex items-center gap-6 tablet:my-20">
          <motion.span
            aria-hidden
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-px flex-1 origin-left bg-foreground/30"
          />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/55">§</span>
          <motion.span
            aria-hidden
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-px flex-1 origin-right bg-foreground/30"
          />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid gap-10 tablet:grid-cols-12 tablet:gap-12"
        >
          <div className="tablet:col-span-7">
            {declaration.map((line, i) => (
              <motion.p
                key={`${i}-${line}`}
                variants={{
                  hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: REVEAL_EASE } },
                }}
                className="text-balance uppercase leading-[0.98] tracking-tight text-foreground/95 text-[clamp(2.4rem,5.5vw,5rem)]"
              >
                {line}
              </motion.p>
            ))}
          </div>

          <motion.ul
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
            }}
            className="tablet:col-span-5 tablet:border-l tablet:border-foreground/15 tablet:pl-8"
          >
            {pillars.map((pillar, i) => (
              <motion.li
                key={pillar}
                variants={{
                  hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -12 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
                }}
                className="flex items-baseline gap-4 py-2 text-xl leading-tight text-foreground tablet:text-2xl"
              >
                <span className="font-mono text-xs text-primary tabular-nums">0{i + 1}</span>
                <span>{pillar}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: REVEAL_EASE }}
          className="mt-20 flex flex-col gap-4 border-t border-foreground/15 pt-10 tablet:mt-28 tablet:flex-row tablet:items-end tablet:justify-between"
        >
          <p className="text-balance uppercase leading-[0.95] tracking-tight text-foreground text-[clamp(2.5rem,7vw,6rem)]">
            {closer}
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/55 tablet:text-sm">{signature}</p>
        </motion.div>
      </div>
    </section>
  )
}
