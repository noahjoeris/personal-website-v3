'use client'

import { usePathname } from 'next/navigation'

export function GrainOverlay() {
  const pathname = usePathname()

  if (pathname?.startsWith('/blog/')) {
    return null
  }

  // Keep dense indexes restrained; the blog landing page gets slightly more texture.
  const isDataHeavyRoute = pathname === '/bitcoin-foss' || pathname?.startsWith('/bitcoin-foss/')
  const opacityClass = pathname === '/blog' ? 'opacity-[0.07]' : isDataHeavyRoute ? 'opacity-[0.05]' : 'opacity-10'

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[var(--z-grain)] bg-repeat ${opacityClass}`}
      style={{ backgroundImage: 'url(/grain.gif)' }}
      aria-hidden
    />
  )
}
