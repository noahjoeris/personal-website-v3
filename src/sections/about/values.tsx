'use client'

import { motion, useReducedMotion } from 'framer-motion'

import { aboutData } from '@/data/about-data'

export function AboutValues() {
  const { title, items, closer } = aboutData.values
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      aria-labelledby="about-values-title"
      className="relative overflow-hidden border-t border-foreground/15 px-6 py-24 tablet:px-10 tablet:py-32 desktop:px-16"
    >
      <div className="relative mx-auto w-full max-w-[88rem]">
        <div className="border-b border-foreground/20 pb-12 tablet:pb-16">
          <h2
            id="about-values-title"
            className="text-6xl uppercase leading-[0.84] tracking-tight tablet:text-8xl desktop:text-[8.5rem]"
          >
            {title}
          </h2>
        </div>

        <ol className="grid border-l border-foreground/20 tablet:grid-cols-2">
          {items.map((item, index) => (
            <motion.li
              key={item.numeral}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: index * 0.08, ease: 'easeOut' }}
              className="relative min-h-80 overflow-hidden border-b border-r border-foreground/20 p-7 tablet:min-h-96 tablet:p-10"
            >
              <span
                aria-hidden
                className="absolute -bottom-8 right-3 font-mono text-[11rem] leading-none text-primary/[0.08] tablet:text-[15rem]"
              >
                {item.numeral}
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-primary-light">
                [{String(index + 1).padStart(2, '0')}]
              </span>
              <h3 className="mt-12 text-5xl uppercase leading-none tablet:text-6xl">{item.title}</h3>
              <p className="mt-5 font-mono text-sm uppercase tracking-[0.16em] text-primary-light">“{item.epigram}”</p>
              <p className="relative mt-6 max-w-xl text-lg leading-relaxed text-foreground/70 tablet:text-xl">
                {item.description}
              </p>
            </motion.li>
          ))}
        </ol>

        <div className="mt-24 border-t border-foreground/20 pt-7 tablet:mt-32">
          <p className="text-balance text-4xl uppercase leading-none text-foreground/90 tablet:text-6xl">
            {closer[0]} <span className="text-primary-light">{closer[1]}</span>
          </p>
        </div>
      </div>
    </section>
  )
}
