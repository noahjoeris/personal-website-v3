'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'

import { aboutData } from '@/data/about-data'

const REVEAL_EASE = [0.19, 1, 0.22, 1] as const

export function AboutManifesto() {
  const { title, body, conviction, closer, principles, signoff, imgSrc } = aboutData.manifesto
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      aria-labelledby="about-manifesto-title"
      className="relative isolate overflow-hidden border-y border-foreground/15 bg-[#021d1c]"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(75%_65%_at_70%_35%,var(--color-primary-dark)_0%,transparent_75%)]"
      />

      <div className="mx-auto grid w-full max-w-[96rem] desktop:grid-cols-2">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, ease: REVEAL_EASE }}
          className="relative mx-auto aspect-[2/3] w-[74%] max-w-[26rem] self-start overflow-hidden border-b border-foreground/15 bg-background desktop:mx-0 desktop:w-full desktop:max-w-none desktop:border-b-0 desktop:border-r"
        >
          <Image
            src={imgSrc}
            alt="Illustration of a person carrying a flaming Bitcoin torch"
            fill
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="object-contain grayscale contrast-125"
          />
          <div aria-hidden className="absolute inset-0 bg-primary-dark/45 mix-blend-color" />
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-[#021d1c] via-transparent to-background/20"
          />
          <p className="absolute bottom-6 left-6 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/65 tablet:bottom-10 tablet:left-10 tablet:text-xs">
            Protect financial freedom / Challenge the broken fiat system
          </p>
        </motion.div>

        <div className="flex flex-col px-6 py-20 tablet:px-10 tablet:py-28 desktop:px-16 desktop:py-24">
          <h2 id="about-manifesto-title" className="uppercase leading-[0.8] tracking-[-0.04em]">
            <span className="block text-[clamp(4.5rem,9vw,9rem)]">{title[0]}</span>
            <span className="ml-[0.15em] block text-primary-light text-[clamp(4.5rem,9vw,9rem)]">{title[1]}</span>
          </h2>

          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            className="mt-12 max-w-2xl text-2xl leading-tight text-foreground tablet:text-3xl"
          >
            {body}
          </motion.p>
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.75, delay: 0.1, ease: 'easeOut' }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/70 tablet:text-xl"
          >
            {conviction}
          </motion.p>

          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.75, delay: 0.15, ease: 'easeOut' }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/70 tablet:text-xl"
          >
            {closer}
          </motion.p>

          <ol className="mt-14 grid border-l border-t border-foreground/20 tablet:grid-cols-2">
            {principles.map(principle => (
              <li
                key={principle.number}
                className="min-h-32 border-b border-r border-foreground/20 p-5 last:tablet:col-span-2 tablet:min-h-40 tablet:p-7"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary-light tablet:text-xs">
                  [{principle.number}]
                </span>
                <p className="mt-5 text-2xl uppercase leading-tight tablet:text-3xl">{principle.title}</p>
              </li>
            ))}
          </ol>

          <p className="mt-12 text-4xl uppercase leading-none text-primary-light tablet:text-5xl">{signoff}</p>
        </div>
      </div>
    </section>
  )
}
