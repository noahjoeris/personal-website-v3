"use client";

import { Signature } from "@/components/signature";
import { HeroContent } from "@/components/hero-content";
import { HeroImage } from "@/components/hero-image";
import { WatermarkText } from "@/components/watermark-text";

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[hsl(182,30%,14%)] via-[hsl(182,30%,12%)] to-[hsl(185,25%,10%)]"
      aria-label="Hero"
    >
      <div className="absolute inset-0 z-10 md:left-auto md:w-[65%] lg:w-[60%]">
        <HeroImage />
        <div className="absolute inset-y-0 left-0 z-20 hidden w-2/3 bg-gradient-to-r from-background via-background/90 to-transparent md:block" />
        <div className="absolute bottom-0 left-0 right-0 z-20 h-1/2 bg-gradient-to-t from-background via-background/90 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-[8] translate-y-[35%]">
        <WatermarkText />
      </div>

      <div className="relative z-30 flex min-h-screen flex-col justify-end px-6 pb-10 pt-24 md:justify-center md:px-10 md:pb-20 lg:px-16">
        <div className="max-w-xl">
          <Signature />
          <HeroContent />
        </div>
      </div>
    </section>
  );
}
