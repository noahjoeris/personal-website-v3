'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { quoteData } from '@/data/quote-data'

const REVEAL_EASE = [0.19, 1, 0.22, 1] as const
const LINE_STAGGER = 0.14
const WORD_DURATION = 0.85

const wordVariants: Variants = {
  hidden: { y: '120%', opacity: 0 },
  visible: (lineIdx: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: WORD_DURATION,
      delay: lineIdx * LINE_STAGGER,
      ease: REVEAL_EASE,
    },
  }),
}

const reducedWordVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
}

export function QuoteSection() {
  const { text, author } = quoteData
  const blockquoteRef = useRef<HTMLQuoteElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const words = text.split(' ')
  const [wordToLine, setWordToLine] = useState<number[]>(() => words.map(() => 0))
  const [isVisible, setIsVisible] = useState(false)

  useLayoutEffect(() => {
    const node = blockquoteRef.current
    if (!node) return

    const measure = () => {
      const spans = node.querySelectorAll<HTMLSpanElement>('[data-word-wrap]')
      const lineTops: number[] = []
      const next: number[] = []
      spans.forEach(span => {
        const top = Math.round(span.offsetTop)
        let idx = lineTops.indexOf(top)
        if (idx === -1) {
          lineTops.push(top)
          idx = lineTops.length - 1
        }
        next.push(idx)
      })
      setWordToLine(next)
    }

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [text])

  useEffect(() => {
    const node = blockquoteRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
            break
          }
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const totalLines = wordToLine.length > 0 ? Math.max(...wordToLine) + 1 : 1
  const variants = shouldReduceMotion ? reducedWordVariants : wordVariants
  const animateState = isVisible ? 'visible' : 'hidden'

  return (
    <section
      aria-labelledby="quote-section-title"
      className="flex min-h-[80vh] items-center bg-background px-6 py-24 tablet:px-10 tablet:py-28 desktop:min-h-screen desktop:px-16 desktop:py-36"
    >
      <div className="mx-auto w-full max-w-6xl text-center">
        <h2 id="quote-section-title" className="sr-only">
          Quote
        </h2>
        <blockquote
          ref={blockquoteRef}
          className="text-balance text-4xl leading-[1.1] tracking-[0.01em] text-foreground/90 tablet:text-6xl"
        >
          {words.map((word, idx) => {
            const lineIdx = wordToLine[idx] ?? 0
            return (
              <Fragment key={`${idx}-${word}`}>
                <span data-word-wrap className="inline-block" style={{ clipPath: 'inset(0)' }}>
                  <motion.span
                    custom={lineIdx}
                    variants={variants}
                    initial="hidden"
                    animate={animateState}
                    className="inline-block will-change-transform"
                  >
                    {word}
                  </motion.span>
                </span>{' '}
              </Fragment>
            )
          })}
        </blockquote>
        <motion.p
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={isVisible ? (shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }) : undefined}
          transition={{
            duration: shouldReduceMotion ? 0.35 : 0.9,
            delay: shouldReduceMotion ? 0 : totalLines * LINE_STAGGER + 0.3,
            ease: REVEAL_EASE,
          }}
          className="mt-10 text-[1.35rem] tracking-wide text-muted-foreground tablet:text-[2rem]"
        >
          {author}
        </motion.p>
      </div>
    </section>
  )
}
