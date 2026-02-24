"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function Signature() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      className="relative"
    >
      <h1 className="sr-only">Noah Joeris - Software Engineer</h1>
      <Image
        src="/images/signature.png"
        alt="Noah Joeris signature with Software Engineer title"
        width={500}
        height={200}
        priority
        className="h-auto w-[280px] invert md:w-[380px] lg:w-[460px]"
      />
    </motion.div>
  );
}
