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
          className="mx-auto h-auto w-[280px] invert md:w-[380px] lg:mx-0 lg:w-[460px]"
        />
      </motion.div>

      <div className="space-y-4">
        <p className="max-w-md text-lg leading-relaxed text-foreground/90 md:text-xl">
          <span className="font-bold text-foreground">{intro.highlight}</span> {intro.text}
        </p>

        <p className="text-base italic text-foreground/70 md:text-lg">{tagline}</p>

        <p className="text-sm tracking-wide text-primary/80">
          {stack.map((technology, index) => (
            <Fragment key={`${technology}-${index}`}>
              {index > 0 ? <span className="mx-1">·</span> : null}
              {technology}
            </Fragment>
          ))}
        </p>
      </div>
    </motion.div>
  )
}
