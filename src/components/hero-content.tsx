'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Fragment } from 'react'

import { landingData } from '@/data/landing-data'

export function HeroContent() {
  const { intro, tagline, stack, signatureImgSrc, srTitle } = landingData.hero

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
      className="space-y-8 text-left"
    >
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        className="relative"
      >
        <h1 className="sr-only">{srTitle}</h1>
        <Image
          src={signatureImgSrc}
          alt="Signature"
          width={500}
          height={200}
          priority
          className="mx-auto h-auto w-[280px] invert tablet:w-[380px] desktop:mx-0"
        />
      </motion.div>

      <div className="space-y-1">
        <p className="max-w-sm text-3xl text-foreground">
          <span className="font-bold">{intro.highlight}</span> {intro.text}
        </p>

        <p className="text-foreground/90 text-xl pb-3">{tagline}</p>

        <p className="text-md tracking-wide text-foreground/70">
          {stack.map((technology, index) => (
            <Fragment key={`${technology}-${index}`}>
              {index > 0 ? (
                <span className="mx-1 inline-block h-1 w-1 rounded-full bg-foreground/70 align-middle" aria-hidden />
              ) : null}
              {technology}
            </Fragment>
          ))}
        </p>
      </div>
    </motion.div>
  )
}
