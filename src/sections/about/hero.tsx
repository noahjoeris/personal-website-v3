'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'

import { aboutData } from '@/data/about-data'

const REVEAL_EASE = [0.19, 1, 0.22, 1] as const

export function AboutHero() {
  const { section, topic, name, role, portraitImgSrc, figLabel, meta, status } = aboutData.hero
  const shouldReduceMotion = useReducedMotion()
  const [firstName, lastName] = name.split(' ')

  return (
    <section
      aria-labelledby="about-hero-title"
      className="relative isolate overflow-hidden bg-background pb-12 pt-20 tablet:pt-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-20 -z-10 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(closest-side,var(--color-primary)_0%,transparent_70%)] opacity-20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-20 -z-10 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(closest-side,var(--color-primary-dark)_0%,transparent_75%)] opacity-25 blur-3xl"
      />

      <div className="mx-auto w-full max-w-9xl px-6 pt-4 tablet:px-10 tablet:pt-6 desktop:px-16 desktop:pt-6">
        <div className="font-mono text-xs uppercase tracking-[0.28em] text-foreground/55 tablet:text-sm">
          <motion.span
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center gap-3"
          >
            <span className="text-primary">{section}</span>
            <span className="hidden h-px w-8 bg-foreground/40 tablet:inline-block" />
            <span>{topic}</span>
          </motion.span>
        </div>

        <div className="mt-6 grid items-start gap-10 tablet:mt-8 tablet:gap-14 desktop:grid-cols-12 desktop:gap-10">
          <div className="desktop:col-span-8">
            <motion.h1
              id="about-hero-title"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
              }}
              className="uppercase leading-[0.82] tracking-tight text-foreground"
            >
              <motion.span
                variants={{
                  hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 60 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: REVEAL_EASE } },
                }}
                className="block text-[clamp(4.5rem,15vw,17rem)] font-semibold"
              >
                {firstName}
              </motion.span>
              <motion.span
                variants={{
                  hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 60 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: REVEAL_EASE } },
                }}
                className="ml-[0.6em] block text-[clamp(4.5rem,15vw,17rem)] font-semibold text-primary tablet:ml-[0.4em]"
              >
                {lastName}
              </motion.span>
            </motion.h1>

            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: REVEAL_EASE }}
              className="mt-8 max-w-xl border-l-2 border-primary pl-5"
            >
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/55">Role</p>
              <p className="mt-2 text-2xl leading-tight text-foreground/95 tablet:text-3xl">{role}</p>
            </motion.div>
          </div>

          <div className="desktop:col-span-4">
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
              className="relative"
            >
              <div className="absolute -left-3 -top-3 z-10 hidden h-6 w-6 border-l-2 border-t-2 border-primary tablet:block" />
              <div className="absolute -bottom-3 -right-3 z-10 hidden h-6 w-6 border-b-2 border-r-2 border-primary tablet:block" />

              <div className="relative aspect-[4/5] w-full overflow-hidden bg-foreground/5">
                <Image
                  src={portraitImgSrc}
                  alt={`Portrait of ${name}`}
                  fill
                  priority
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 70vw, 32vw"
                  className="object-cover grayscale-[20%] contrast-[1.05]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 mix-blend-color"
                  style={{ background: 'rgba(64,196,192,0.06)' }}
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background/55 to-transparent" />
                <p className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/70 tablet:text-xs">
                  {figLabel}
                </p>
              </div>
            </motion.div>

            <motion.dl
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              className="mt-8 divide-y divide-foreground/15 border-y border-foreground/15"
            >
              {meta.map((row, i) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[auto_1fr] items-baseline gap-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] tablet:text-xs"
                >
                  <dt className="text-foreground/55 tabular-nums">
                    [{String(i + 1).padStart(2, '0')}] {row.label}
                  </dt>
                  <dd className="text-right text-foreground tablet:text-left">{row.value}</dd>
                </div>
              ))}
            </motion.dl>
          </div>
        </div>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
          className="mt-12 border-t border-foreground/15 pt-4 font-mono text-[11px] uppercase tracking-[0.28em] text-foreground/55 tablet:mt-14 tablet:text-xs"
        >
          <span className="inline-flex items-center gap-3">
            <span aria-hidden className="relative inline-flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary/70 motion-reduce:animate-none" />
              <span className="relative inline-block h-2 w-2 rounded-full bg-primary" />
            </span>
            {status}
          </span>
        </motion.div>
      </div>
    </section>
  )
}
