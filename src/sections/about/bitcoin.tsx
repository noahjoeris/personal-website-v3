'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'

import { Section } from '@/components/section'
import { aboutData } from '@/data/about-data'

export function AboutBitcoin() {
  const { section, eyebrow, title, lead, body, closer, primaryImgSrc, secondaryImgSrc } = aboutData.bitcoin
  const shouldReduceMotion = useReducedMotion()

  return (
    <Section aria-labelledby="about-bitcoin-title" className="bg-background">
      <div className="mx-auto w-full max-w-9xl">
        <div className="mb-10 border-b border-foreground/15 pb-5 font-mono text-xs uppercase tracking-[0.28em] text-foreground/55 tablet:mb-14 tablet:text-sm">
          <span className="inline-flex items-center gap-3">
            <span className="text-primary">{section}</span>
            <span className="hidden h-px w-8 bg-foreground/40 tablet:inline-block" />
            <span>Conviction</span>
          </span>
        </div>

        <div className="grid items-start gap-12 desktop:grid-cols-12 desktop:gap-16">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="desktop:col-span-5"
          >
            {/* Inline `position` safeguards against Tailwind not applying: a fill image without a
                positioned ancestor would cover the whole viewport. */}
            <div
              style={{ position: 'relative' }}
              className="relative aspect-[4/5] w-full overflow-hidden border border-foreground/15"
            >
              <Image src={primaryImgSrc} alt="" fill sizes="(max-width: 1023px) 100vw, 42vw" className="object-cover" />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent" />
            </div>
          </motion.div>

          <div className="desktop:col-span-7">
            <p className="text-lg uppercase tracking-[0.18em] text-foreground/70">{eyebrow}</p>
            <h2 id="about-bitcoin-title" className="mt-3 uppercase leading-[0.82] tracking-tight text-foreground">
              <span className="block text-7xl tablet:text-[9rem] desktop:text-[clamp(7rem,14vw,16rem)] text-primary">
                {title}
              </span>
            </h2>

            <motion.p
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
              className="mt-10 text-balance text-3xl leading-tight text-foreground tablet:text-4xl"
            >
              {lead}
            </motion.p>

            <motion.p
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/85 tablet:text-xl tablet:leading-[1.7]"
            >
              {body}
            </motion.p>
          </div>
        </div>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="mt-16 grid gap-10 tablet:mt-20 desktop:grid-cols-12 desktop:gap-16"
        >
          <div className="desktop:col-span-5 desktop:col-start-1">
            <p className="text-balance text-2xl leading-snug text-foreground/90 tablet:text-3xl desktop:text-[2.25rem] desktop:leading-[1.15]">
              {closer}
            </p>
          </div>
          <div className="desktop:col-span-7">
            <div
              style={{ position: 'relative' }}
              className="relative aspect-[16/10] w-full overflow-hidden border border-foreground/15"
            >
              <Image
                src={secondaryImgSrc}
                alt=""
                fill
                sizes="(max-width: 1023px) 100vw, 58vw"
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
