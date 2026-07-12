'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'

import { aboutData } from '@/data/about-data'

export function AboutInterests() {
  const { title, items } = aboutData.interests
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      aria-labelledby="about-interests-title"
      className="relative overflow-hidden px-6 py-24 tablet:px-10 tablet:py-32 desktop:px-16"
    >
      <div className="mx-auto w-full max-w-[88rem]">
        <div className="border-b border-foreground/20 pb-12 tablet:pb-16">
          <div>
            <h2
              id="about-interests-title"
              className="text-balance text-6xl uppercase leading-[0.84] tracking-tight tablet:text-8xl desktop:text-[8.5rem]"
            >
              {title}
            </h2>
          </div>
        </div>

        <div className="mt-16 grid gap-8 tablet:mt-24 tablet:grid-cols-12 tablet:items-start">
          {items.map((item, index) => (
            <motion.article
              key={item.number}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, delay: index * 0.1, ease: 'easeOut' }}
              className={
                index === 0
                  ? 'group mx-auto w-full max-w-[17rem] tablet:col-span-5 tablet:mx-0 tablet:max-w-none'
                  : index === 1
                    ? 'group mx-auto w-full max-w-[15rem] tablet:col-span-3 tablet:mx-0 tablet:mt-24 tablet:max-w-none'
                    : 'group mx-auto w-full max-w-[17rem] tablet:col-span-4 tablet:mx-0 tablet:mt-10 tablet:max-w-none'
              }
            >
              <div
                className={
                  index === 1
                    ? 'relative aspect-[3/5] overflow-hidden border border-foreground/20'
                    : 'relative aspect-[4/5] overflow-hidden border border-foreground/20'
                }
              >
                <Image
                  src={item.imgSrc}
                  alt=""
                  fill
                  sizes="(max-width: 767px) 100vw, 42vw"
                  className="object-cover grayscale-[35%] contrast-110 transition duration-700 ease-out group-hover:scale-[1.035] group-hover:grayscale-0"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent"
                />
                <span className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/70 tablet:text-xs">
                  [{item.number}]
                </span>
                <h3 className="absolute bottom-5 left-5 text-4xl uppercase leading-none tablet:text-5xl">
                  {item.title}
                </h3>
              </div>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-foreground/65">{item.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
