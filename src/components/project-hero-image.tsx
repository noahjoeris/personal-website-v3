'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

type ProjectHeroImageProps = {
  src: string
}

const RANGE_PX = 560
const PULL_STRENGTH = 0.45
const SPRING_TENSION = 0.16
const SPRING_FRICTION = 0.78
const MIN_DELTA = 0.05

export function ProjectHeroImage({ src }: ProjectHeroImageProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let targetX = 0
    let targetY = 0
    let curX = 0
    let curY = 0
    let vx = 0
    let vy = 0
    let raf = 0
    let running = false

    const tick = () => {
      vx = (vx + (targetX - curX) * SPRING_TENSION) * SPRING_FRICTION
      vy = (vy + (targetY - curY) * SPRING_TENSION) * SPRING_FRICTION
      curX += vx
      curY += vy

      const settled =
        targetX === 0 &&
        targetY === 0 &&
        Math.abs(curX) < MIN_DELTA &&
        Math.abs(curY) < MIN_DELTA &&
        Math.abs(vx) < MIN_DELTA &&
        Math.abs(vy) < MIN_DELTA

      if (settled) {
        curX = 0
        curY = 0
        vx = 0
        vy = 0
        el.style.transform = ''
        running = false
        return
      }

      el.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0)`
      raf = requestAnimationFrame(tick)
    }

    const ensureRunning = () => {
      if (running) return
      running = true
      raf = requestAnimationFrame(tick)
    }

    const handleMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2

      const dx = event.clientX - cx
      const dy = event.clientY - cy
      const distance = Math.hypot(dx, dy)

      if (distance > RANGE_PX) {
        targetX = 0
        targetY = 0
      } else {
        const falloff = 1 - distance / RANGE_PX
        const factor = PULL_STRENGTH * (0.55 + 0.45 * falloff)
        targetX = dx * factor
        targetY = dy * factor
      }

      ensureRunning()
    }

    const handleLeave = () => {
      targetX = 0
      targetY = 0
      ensureRunning()
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    document.addEventListener('mouseleave', handleLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <div ref={ref} className="relative aspect-square w-[clamp(140px,22vw,280px)] will-change-transform">
        <Image
          src={src}
          alt=""
          fill
          priority
          className="object-contain drop-shadow-2xl"
          sizes="(max-width: 768px) 45vw, 280px"
        />
      </div>
    </div>
  )
}
