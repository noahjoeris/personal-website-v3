'use client'

import { usePathname } from 'next/navigation'

export function GrainOverlay() {
  const pathname = usePathname()

  if (pathname?.startsWith('/blog/')) {
    return null
  }

  // Data-heavy activity feed: lower grain for readability (~4% vs default 10%).
  const isDataHeavyRoute = pathname === '/bitcoin-foss' || pathname?.startsWith('/bitcoin-foss/')
  const opacityClass = isDataHeavyRoute ? 'opacity-[0.04]' : 'opacity-10'

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[var(--z-grain)] bg-repeat ${opacityClass}`}
      style={{ backgroundImage: 'url(/grain.gif)' }}
      aria-hidden
    />
  )
}
