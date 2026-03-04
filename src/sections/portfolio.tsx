'use client'

import {
  type MotionValue,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useEffect, useRef } from 'react'

import { ProjectCompact } from '@/components/project-compact'
import { type PortfolioProject, portfolioData } from '@/data/portfolio-data'

const LOCK_STEP_DIVISOR = 1500
const WHEEL_STEP_LIMIT = 0.18
const TOUCH_STEP_LIMIT = 0.2
const KEYBOARD_STEP = 0.14
const ACTIVATION_TOP_RATIO = 0.15
const ACTIVATION_BOTTOM_RATIO = 0.85

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

type ProjectParallaxCardProps = {
  project: PortfolioProject
  index: number
  total: number
  progress: MotionValue<number>
  isEnabled: boolean
}

function ProjectParallaxCard({ project, index, total, progress, isEnabled }: ProjectParallaxCardProps) {
  const anchor = total === 1 ? 0.5 : index / (total - 1)
  const direction = index % 2 === 0 ? 1 : -1
  const depth = 0.5 + (index % 3) * 0.18

  const delta = useTransform(progress, value => value - anchor)

  const x = useTransform(delta, value => (isEnabled ? value * -920 : 0))
  const y = useTransform(delta, value => (isEnabled ? Math.sin(value * Math.PI * 0.9) * -120 * direction * depth : 0))
  const scale = useTransform(delta, value => {
    if (!isEnabled) {
      return 1
    }

    return clamp(1 - Math.abs(value) * 0.6 * depth, 0.62, 1.06)
  })
  const rotateY = useTransform(delta, value => (isEnabled ? value * 54 * depth : 0))
  const rotateZ = useTransform(delta, value => (isEnabled ? value * -9 * direction * depth : 0))
  const opacity = useTransform(delta, value => (isEnabled ? clamp(1 - Math.abs(value) * 1.85, 0, 1) : 1))
  const blur = useTransform(delta, value => (isEnabled ? Math.abs(value) * 11 : 0))
  const filter = useMotionTemplate`blur(${blur}px)`
  const zIndex = useTransform(delta, value => 100 - Math.round(Math.abs(value) * 100))

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 w-80 -translate-x-1/2 -translate-y-1/2 lg:w-84"
      style={{ x, y, scale, rotateY, rotateZ, opacity, filter, zIndex, transformStyle: 'preserve-3d' }}
    >
      <ProjectCompact project={project} className="w-full" />
    </motion.div>
  )
}

export function PortfolioSection() {
  const projects = portfolioData.projects
  const shouldReduceMotion = useReducedMotion()
  const progress = useMotionValue(0)

  const desktopSceneRef = useRef<HTMLDivElement>(null)
  const isScrollLockedRef = useRef(false)
  const lockScrollYRef = useRef(0)
  const lastScrollYRef = useRef(0)
  const lastTouchYRef = useRef<number | null>(null)
  const bodyStyleRef = useRef<{
    bodyOverflow: string
    bodyPaddingRight: string
    htmlOverflow: string
  } | null>(null)

  const smoothProgress = useSpring(progress, {
    stiffness: 90,
    damping: 24,
    mass: 0.45,
  })

  const isParallaxEnabled = !shouldReduceMotion
  const titleY = useTransform(() => (isParallaxEnabled ? -smoothProgress.get() * 140 : 0))
  const titleOpacity = useTransform(() => (isParallaxEnabled ? clamp(1 - smoothProgress.get() * 1.1, 0.18, 1) : 1))

  const layerOneX = useTransform(() => (isParallaxEnabled ? (smoothProgress.get() - 0.5) * -420 : 0))
  const layerOneY = useTransform(() => (isParallaxEnabled ? (smoothProgress.get() - 0.5) * 130 : 0))
  const layerTwoX = useTransform(() => (isParallaxEnabled ? (smoothProgress.get() - 0.5) * 300 : 0))
  const layerTwoY = useTransform(() => (isParallaxEnabled ? (smoothProgress.get() - 0.5) * -170 : 0))
  const layerThreeX = useTransform(() => (isParallaxEnabled ? (smoothProgress.get() - 0.5) * -520 : 0))
  const layerThreeY = useTransform(() => (isParallaxEnabled ? (smoothProgress.get() - 0.5) * -110 : 0))
  const progressScale = useTransform(() => (isParallaxEnabled ? 0.08 + smoothProgress.get() * 0.92 : 1))

  useEffect(() => {
    if (!isParallaxEnabled) {
      return
    }

    const sceneElement = desktopSceneRef.current

    if (!sceneElement) {
      return
    }

    const isDesktopViewport = () => window.matchMedia('(min-width: 768px)').matches

    const lockDocumentScroll = () => {
      if (bodyStyleRef.current) {
        return
      }

      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      bodyStyleRef.current = {
        bodyOverflow: document.body.style.overflow,
        bodyPaddingRight: document.body.style.paddingRight,
        htmlOverflow: document.documentElement.style.overflow,
      }

      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'

      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`
      }
    }

    const unlockDocumentScroll = () => {
      const previousStyles = bodyStyleRef.current

      if (!previousStyles) {
        return
      }

      document.body.style.overflow = previousStyles.bodyOverflow
      document.body.style.paddingRight = previousStyles.bodyPaddingRight
      document.documentElement.style.overflow = previousStyles.htmlOverflow
      bodyStyleRef.current = null
    }

    const releaseLockAndContinue = (direction: 'down' | 'up') => {
      isScrollLockedRef.current = false
      unlockDocumentScroll()

      requestAnimationFrame(() => {
        const nextScrollY = lockScrollYRef.current + (direction === 'down' ? 2 : -2)
        window.scrollTo({ top: nextScrollY, behavior: 'auto' })
      })
    }

    const applyInputDelta = (rawDelta: number, source: 'wheel' | 'touch' | 'keyboard') => {
      if (!isScrollLockedRef.current) {
        return
      }

      if (Math.abs(rawDelta) < 0.001) {
        return
      }

      const direction = rawDelta > 0 ? 'down' : 'up'
      const currentProgress = progress.get()

      if (direction === 'down' && currentProgress >= 0.999) {
        releaseLockAndContinue('down')
        return
      }

      if (direction === 'up' && currentProgress <= 0.001) {
        releaseLockAndContinue('up')
        return
      }

      const maxStep = source === 'wheel' ? WHEEL_STEP_LIMIT : source === 'touch' ? TOUCH_STEP_LIMIT : KEYBOARD_STEP
      const nextProgress = clamp(currentProgress + clamp(rawDelta / LOCK_STEP_DIVISOR, -maxStep, maxStep), 0, 1)
      progress.set(nextProgress)
    }

    const shouldLock = (direction: 'down' | 'up') => {
      if (!isDesktopViewport()) {
        return false
      }

      const rect = sceneElement.getBoundingClientRect()
      const topThreshold = window.innerHeight * ACTIVATION_TOP_RATIO
      const bottomThreshold = window.innerHeight * ACTIVATION_BOTTOM_RATIO
      const isSceneInFocus = rect.top <= topThreshold && rect.bottom >= bottomThreshold

      if (!isSceneInFocus) {
        return false
      }

      const currentProgress = progress.get()
      return direction === 'down' ? currentProgress < 0.999 : currentProgress > 0.001
    }

    const engageLock = () => {
      if (isScrollLockedRef.current || !isDesktopViewport()) {
        return
      }

      lockScrollYRef.current = window.scrollY
      lastScrollYRef.current = window.scrollY
      isScrollLockedRef.current = true
      lockDocumentScroll()
    }

    const handleScroll = () => {
      if (isScrollLockedRef.current) {
        if (window.scrollY !== lockScrollYRef.current) {
          window.scrollTo({ top: lockScrollYRef.current, behavior: 'auto' })
        }
        return
      }

      const currentY = window.scrollY
      const scrollDelta = currentY - lastScrollYRef.current
      lastScrollYRef.current = currentY

      if (Math.abs(scrollDelta) < 0.5) {
        return
      }

      const direction = scrollDelta > 0 ? 'down' : 'up'

      if (shouldLock(direction)) {
        engageLock()
      }
    }

    const handleWheel = (event: WheelEvent) => {
      if (!isScrollLockedRef.current) {
        return
      }

      if (event.ctrlKey) {
        return
      }

      if (event.cancelable) {
        event.preventDefault()
      }

      applyInputDelta(event.deltaY, 'wheel')
    }

    const handleTouchStart = (event: TouchEvent) => {
      if (!isScrollLockedRef.current) {
        return
      }

      const touch = event.touches[0]
      lastTouchYRef.current = touch ? touch.clientY : null
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (!isScrollLockedRef.current) {
        return
      }

      const touch = event.touches[0]
      if (!touch) {
        return
      }

      if (event.cancelable) {
        event.preventDefault()
      }

      const previousY = lastTouchYRef.current ?? touch.clientY
      const delta = previousY - touch.clientY
      lastTouchYRef.current = touch.clientY
      applyInputDelta(delta, 'touch')
    }

    const handleTouchEnd = () => {
      lastTouchYRef.current = null
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isScrollLockedRef.current) {
        return
      }

      let delta = 0

      if (event.key === 'ArrowDown' || event.key === 'PageDown' || (event.key === ' ' && !event.shiftKey)) {
        delta = 220
      } else if (event.key === 'ArrowUp' || event.key === 'PageUp' || (event.key === ' ' && event.shiftKey)) {
        delta = -220
      } else if (event.key === 'Home') {
        delta = -LOCK_STEP_DIVISOR
      } else if (event.key === 'End') {
        delta = LOCK_STEP_DIVISOR
      } else {
        return
      }

      event.preventDefault()
      applyInputDelta(delta, 'keyboard')
    }

    const handleResize = () => {
      if (isDesktopViewport()) {
        return
      }

      isScrollLockedRef.current = false
      unlockDocumentScroll()
    }

    lastScrollYRef.current = window.scrollY

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
      isScrollLockedRef.current = false
      unlockDocumentScroll()
    }
  }, [isParallaxEnabled, progress])

  return (
    <section className="relative isolate overflow-hidden bg-background px-6 py-20 md:px-0 md:py-0">
      <div className="mx-auto w-full max-w-9xl md:hidden">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg uppercase">Explore my</p>
          <h2 className="text-6xl leading-none tracking-wide text-foreground uppercase sm:text-7xl lg:text-8xl">
            Portfolio
          </h2>
        </div>

        <div className="mt-10 flex flex-col items-center gap-6 md:hidden">
          {projects.map(project => (
            <ProjectCompact key={`${project.name}-${project.period}`} project={project} />
          ))}
        </div>
      </div>

      <div ref={desktopSceneRef} className="relative z-20 hidden h-[80vh] touch-none md:block">
        <div className="relative z-30 h-full overflow-hidden bg-background">
          <motion.div
            aria-hidden="true"
            style={{ x: layerOneX, y: layerOneY }}
            className="pointer-events-none absolute -left-28 top-24 h-96 w-96 rounded-full bg-foreground/12 blur-3xl"
          />
          <motion.div
            aria-hidden="true"
            style={{ x: layerTwoX, y: layerTwoY }}
            className="pointer-events-none absolute -right-20 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-foreground/10 blur-3xl"
          />
          <motion.div
            aria-hidden="true"
            style={{ x: layerThreeX, y: layerThreeY }}
            className="pointer-events-none absolute bottom-8 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-foreground/8 blur-2xl"
          />

          <div className="mx-auto h-full w-full max-w-9xl">
            <motion.div
              style={{ y: titleY, opacity: titleOpacity }}
              className="pointer-events-none absolute inset-x-0 top-16"
            >
              <div className="mx-auto max-w-3xl px-10 text-center lg:px-16">
                <p className="text-lg uppercase">Explore my</p>
                <h2 className="text-6xl text-foreground uppercase sm:text-7xl lg:text-9xl tracking-tight">Portfolio</h2>
              </div>
            </motion.div>

            <div className="relative h-full" style={{ perspective: 1400 }}>
              {projects.map((project, index) => (
                <ProjectParallaxCard
                  key={`${project.name}-${project.period}`}
                  project={project}
                  index={index}
                  total={projects.length}
                  progress={smoothProgress}
                  isEnabled={isParallaxEnabled}
                />
              ))}
            </div>

            <div className="pointer-events-none absolute inset-x-10 bottom-30 lg:inset-x-20">
              <div className="h-px bg-foreground/25">
                <motion.div style={{ scaleX: progressScale }} className="h-full origin-left bg-foreground/70" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
