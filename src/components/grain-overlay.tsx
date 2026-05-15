'use client'

import { usePathname } from 'next/navigation'

export function GrainOverlay() {
  const pathname = usePathname()

  if (pathname?.startsWith('/blog/')) {
    return null
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[var(--z-grain)] bg-repeat opacity-10"
      style={{ backgroundImage: 'url(/grain.gif)' }}
      aria-hidden
    />
  )
}
