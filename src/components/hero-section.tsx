"use client";

import { Signature } from "@/components/signature";
import { HeroContent } from "@/components/hero-content";
import { HeroImage } from "@/components/hero-image";
import { WatermarkText } from "@/components/watermark-text";
import { landingData } from "@/data/landing-data";

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[hsl(182,30%,14%)] via-[hsl(182,30%,12%)] to-[hsl(185,25%,10%)]"
    >
      <div className="absolute inset-0 z-10">
        <HeroImage />
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-8">
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
