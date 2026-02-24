"use client";

import { motion } from "framer-motion";
import { Fragment } from "react";

import { landingData } from "@/data/landing-data";

export function HeroContent() {
  const { intro, tagline, stack } = landingData.hero;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      className="mt-8 space-y-4"
    >
      <p className="max-w-md text-lg leading-relaxed text-foreground/90 md:text-xl">
        <span className="font-bold text-foreground">{intro.highlight}</span>{" "}
        {intro.text}
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
    </motion.div>
  );
}
