'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'

import { aboutData } from '@/data/about-data'

const REVEAL_EASE = [0.19, 1, 0.22, 1] as const

export function AboutHero() {
  const { name, title, intro, portraitImgSrc, status, signals } = aboutData.hero
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      aria-labelledby="about-hero-title"
      className="relative isolate overflow-hidden bg-background desktop:min-h-screen"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-20 h-[48rem] bg-[radial-gradient(80%_75%_at_72%_35%,var(--color-primary)_0%,var(--color-primary-dark)_30%,#0a5e5c_58%,#042e2e_78%,var(--color-background)_100%)] desktop:inset-0 desktop:h-auto"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-b from-transparent via-background/5 to-background"
      />

      <div className="mx-auto grid w-full max-w-[96rem] items-start gap-8 px-6 pb-16 pt-28 tablet:gap-10 tablet:px-10 tablet:pt-32 desktop:min-h-[calc(100vh-4rem)] desktop:grid-cols-12 desktop:items-center desktop:gap-8 desktop:px-16 desktop:pb-20">
        <div className="relative z-20 desktop:col-span-7">
          <motion.h1
            id="about-hero-title"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { delayChildren: 0.12, staggerChildren: 0.1 } },
            }}
            className="uppercase leading-[0.78] tracking-[-0.055em] text-foreground"
          >
            {title.map((line, index) => (
              <motion.span
                key={line}
                variants={{
                  hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 70 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.95, ease: REVEAL_EASE } },
                }}
                className={
                  index === 1
                    ? 'ml-[0.12em] block text-primary-light text-[clamp(5rem,14vw,13.5rem)]'
                    : 'block text-[clamp(5rem,14vw,13.5rem)]'
                }
              >
                {line}
              </motion.span>
            ))}
          </motion.h1>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.5, ease: REVEAL_EASE }}
            className="mt-9 max-w-xl border-l-2 border-primary-light pl-5 tablet:mt-12 tablet:pl-7"
          >
            <p className="text-balance text-2xl leading-tight text-foreground tablet:text-3xl">{intro}</p>
          </motion.div>
        </div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: 35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.95, delay: 0.2, ease: REVEAL_EASE }}
          className="about-hero-portrait relative mx-auto desktop:col-span-5 desktop:mt-10"
        >
          <div aria-hidden className="absolute -inset-3 border border-foreground/20 tablet:-inset-5" />
          <div className="relative aspect-[4/5] overflow-hidden bg-background/25">
            <Image
              src={portraitImgSrc}
              alt={`Portrait of ${name}`}
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 40vw"
              className="object-cover grayscale contrast-125"
            />
            <div aria-hidden className="absolute inset-0 bg-primary/30 mix-blend-color" />
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent"
            />
          </div>
          <div
            aria-hidden
            className="absolute -bottom-px -right-px h-24 w-24 bg-background [clip-path:polygon(100%_0,100%_100%,0_100%)] tablet:h-36 tablet:w-36"
          />
        </motion.div>
      </div>

      <div className="border-y border-foreground/20 bg-background/45 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-[96rem] flex-wrap items-center gap-x-7 gap-y-3 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/65 tablet:px-10 tablet:text-xs desktop:px-16">
          <span className="inline-flex items-center gap-3 text-primary-light">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary-light/70 motion-reduce:animate-none" />
              <span className="relative h-2 w-2 rounded-full bg-primary-light" />
            </span>
            {status}
          </span>
          {signals.map(signal => (
            <span
              key={signal}
              className="inline-flex items-center gap-7 before:text-foreground/25 before:content-['/']"
            >
              {signal}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
