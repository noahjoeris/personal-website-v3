'use client'

import { useEffect } from 'react'

export function HydrationFallback() {
  useEffect(() => {
    document.documentElement.classList.add('js-hydrated')
  }, [])

  return null
}
