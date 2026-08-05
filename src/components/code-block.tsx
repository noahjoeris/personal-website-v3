'use client'

import { type HTMLAttributes, type ReactNode, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

type CodeBlockProps = HTMLAttributes<HTMLPreElement> & {
  code: string
  language?: string
  children: ReactNode
}

export function CodeBlock({ children, className, code, language, ...props }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [copied, setCopied] = useState(false)

  function updateScrollHint() {
    const pre = preRef.current
    if (!pre) {
      return
    }

    setCanScrollRight(pre.scrollLeft + pre.clientWidth < pre.scrollWidth - 1)
  }

  useEffect(() => {
    updateScrollHint()
    window.addEventListener('resize', updateScrollHint)

    return () => window.removeEventListener('resize', updateScrollHint)
  }, [])

  async function copyCode() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div className="flex min-h-9 items-center justify-between border-b border-foreground/10 px-3 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-foreground/50 tablet:px-4">
        <span>{language ?? 'Code'}</span>
        <button
          type="button"
          onClick={copyCode}
          className="-mr-2 inline-flex min-h-8 items-center rounded-sm px-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-live="polite"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="relative">
        <pre
          ref={preRef}
          onScroll={updateScrollHint}
          className={cn(
            'm-0 overflow-x-auto overscroll-x-contain rounded-none border-0 bg-transparent py-4 font-mono text-sm leading-relaxed [&_code]:bg-transparent [&_code]:p-0 tablet:text-[0.9em]',
            className,
          )}
          {...props}
        >
          {children}
        </pre>
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-r from-transparent to-background/95 transition-opacity',
            canScrollRight ? 'opacity-100' : 'opacity-0',
          )}
        />
      </div>
    </>
  )
}
