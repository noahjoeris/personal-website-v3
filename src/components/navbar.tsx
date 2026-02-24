"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import { siteConfig } from "@/config/site";

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const socialIconMap = {
  X: XIcon,
  LinkedIn: Linkedin,
  GitHub: Github,
} as const;

export function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-10 lg:px-16"
    >
      <nav className="flex items-center justify-between" aria-label="Main navigation">
        <ul className="hidden items-center gap-6 sm:flex md:gap-8">
          {siteConfig.nav.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-xs font-medium tracking-widest text-foreground/80 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="flex items-center gap-4">
          {siteConfig.social.map((social) => {
            const Icon = socialIconMap[social.label];

            return (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 transition-colors hover:text-foreground"
                  aria-label={social.ariaLabel}
                >
                  <Icon className="h-5 w-5" />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-4 h-px w-full bg-foreground/20" />
    </motion.header>
  );
}
