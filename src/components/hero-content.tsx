"use client";

import { motion } from "framer-motion";

export function HeroContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      className="mt-8 space-y-4"
    >
      <p className="max-w-md text-lg leading-relaxed text-foreground/90 md:text-xl">
        <span className="font-bold text-foreground">Cypherpunk</span>{" "}
        protecting human freedom with software
      </p>

      <p className="text-base italic text-foreground/70 md:text-lg">- leading by example through discipline</p>

      <p className="text-sm tracking-wide text-primary/80">
        React <span className="mx-1">·</span> Rust <span className="mx-1">·</span> Bitcoin
      </p>
    </motion.div>
  );
}
