'use client'

import { motion, useReducedMotion } from 'framer-motion'

import { aboutData } from '@/data/about-data'

export function AboutStory() {
  const { title, introduction, chapters } = aboutData.story
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      aria-labelledby="about-story-title"
      className="relative overflow-hidden px-6 py-24 tablet:px-10 tablet:py-32 desktop:px-16"
    >
      <div className="relative mx-auto w-full max-w-[88rem]">
        <div className="grid gap-8 border-b border-foreground/20 pb-12 tablet:grid-cols-12 tablet:items-end tablet:pb-16">
          <h2
            id="about-story-title"
            className="text-balance text-6xl uppercase leading-[0.86] tracking-tight tablet:col-span-7 tablet:text-8xl desktop:text-[8rem]"
          >
            {title}
          </h2>
          <p className="max-w-lg text-xl leading-relaxed text-foreground/70 tablet:col-span-5 tablet:justify-self-end tablet:text-2xl">
            {introduction}
          </p>
        </div>

        <ol>
          {chapters.map((chapter, index) => (
            <motion.li
              key={chapter.number}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: index * 0.08, ease: 'easeOut' }}
              className="group grid gap-7 border-b border-foreground/20 py-10 tablet:grid-cols-12 tablet:gap-8 tablet:py-14"
            >
              <div className="flex items-start justify-between tablet:col-span-2 tablet:block">
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-primary-light">
                  [{chapter.number}]
                </span>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-foreground/45 tablet:mt-6">
                  {chapter.period}
                </p>
              </div>

              <div className="tablet:col-span-3">
                <h3 className="text-5xl uppercase leading-none transition-colors group-hover:text-primary-light tablet:text-4xl desktop:text-6xl">
                  {chapter.title}
                </h3>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50 tablet:text-xs">
                  {chapter.place}
                </p>
              </div>

              <p className="max-w-3xl text-xl leading-relaxed text-foreground/75 tablet:col-span-7 tablet:text-xl desktop:text-2xl">
                {chapter.body}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
