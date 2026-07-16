'use client'

import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion'
import { Fragment, useRef } from 'react'

import { quoteData } from '@/data/quote-data'

const REVEAL_EASE = [0.19, 1, 0.22, 1] as const
const WORD_STAGGER = 0.018
const WORD_DURATION = 0.7

const wordVariants: Variants = {
  hidden: { opacity: 0, y: '115%', rotate: 1.5 },
  visible: (wordIndex: number) => {
    const delay = wordIndex * WORD_STAGGER

    return {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        opacity: { duration: 0.18, delay, ease: 'linear' },
        y: { duration: WORD_DURATION, delay, ease: REVEAL_EASE },
        rotate: { duration: WORD_DURATION, delay, ease: REVEAL_EASE },
      },
    }
  },
}

const reducedWordVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
}

export function QuoteSection() {
  const { text, author } = quoteData
  const blockquoteRef = useRef<HTMLQuoteElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const isVisible = useInView(blockquoteRef, { once: true, amount: 0.2 })

  const words = text.split(' ')
  const variants = shouldReduceMotion ? reducedWordVariants : wordVariants
  const animateState = isVisible ? 'visible' : 'hidden'
  const authorDelay = shouldReduceMotion ? 0 : words.length * WORD_STAGGER + 0.25

  return (
    <section
      aria-labelledby="quote-section-title"
      className="relative isolate flex min-h-[80vh] items-center overflow-hidden border-y border-foreground/15 bg-background px-6 py-20 tablet:px-10 tablet:py-24 desktop:min-h-screen desktop:px-16 desktop:py-28"
    >
      <div className="mx-auto w-full max-w-9xl">
        <h2 id="quote-section-title" className="sr-only">
          Quote
        </h2>
        <blockquote
          ref={blockquoteRef}
          className="mx-auto max-w-6xl text-balance text-center text-4xl leading-[1.1] tracking-[0.01em] text-foreground/90 tablet:text-6xl"
        >
          {words.map((word, wordIndex) => (
            <Fragment key={`${wordIndex}-${word}`}>
              <span className="inline-block [clip-path:inset(0)]">
                <motion.span
                  custom={wordIndex}
                  variants={variants}
                  initial="hidden"
                  animate={animateState}
                  className="inline-block will-change-transform"
                >
                  {word}
                </motion.span>
              </span>{' '}
            </Fragment>
          ))}
        </blockquote>

        <motion.footer
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: shouldReduceMotion ? 0.25 : 0.75, delay: authorDelay, ease: REVEAL_EASE }}
          className="mt-10 flex justify-center"
        >
          <cite className="not-italic text-[1.35rem] tracking-wide text-muted-foreground tablet:text-[2rem]">
            {author}
          </cite>
        </motion.footer>
      </div>
    </section>
  )
}
