'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useId, useState } from 'react'

import type { BlogHeading } from '@/lib/blog-content'
import { cn } from '@/lib/utils'

type BlogTableOfContentsProps = {
  headings: BlogHeading[]
}

export function BlogTableOfContents({ headings }: BlogTableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const contentsId = useId()

  return (
    <div
      className={cn(
        'mx-auto mt-7 max-w-[50ch] overflow-hidden rounded border border-foreground/12 bg-foreground/[0.025] font-reading',
        isOpen && 'bg-foreground/[0.04]',
      )}
    >
      <button
        type="button"
        aria-controls={contentsId}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(current => !current)}
        className="flex min-h-10 w-full cursor-pointer items-center justify-between gap-3 px-3 text-xs text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <span className="font-semibold">Contents</span>
        <motion.span
          aria-hidden="true"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }}
          className="text-primary-light"
        >
          ↓
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.nav
            id={contentsId}
            aria-label="Table of contents"
            initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden border-t border-foreground/10"
          >
            <ol className="px-3 py-2 text-xs leading-snug text-foreground/60">
              {headings.map(heading => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center rounded-sm px-2 py-1 transition-colors hover:bg-foreground/[0.05] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      heading.level === 3
                        ? 'ml-3 text-foreground/45 before:mr-2 before:text-primary-light/60 before:content-["—"]'
                        : 'font-medium',
                    )}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ol>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
