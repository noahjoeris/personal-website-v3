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
import { matchesMinBreakpoint } from '@/lib/breakpoints'

const LOCK_STEP_DIVISOR = 1500
const STEP_LIMIT_BY_SOURCE = {
  wheel: 0.18,
  touch: 0.2,
  keyboard: 0.14,
} as const
const SCENE_ACTIVATION_BOUNDS = {
  topRatio: 0.15,
  bottomRatio: 0.85,
} as const

const PROGRESS_MIN = 0
const PROGRESS_MAX = 1
const PROGRESS_EDGE_EPSILON = 0.001
const SCROLL_LOCK_NUDGE = 2
const KEYBOARD_DELTA = 220
const MIN_SCROLL_DELTA_TO_LOCK = 0.5

const SPRING_CONFIG = {
  stiffness: 90,
  damping: 24,
  mass: 0.45,
} as const

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

type ScrollDirection = 'down' | 'up'
type InputSource = keyof typeof STEP_LIMIT_BY_SOURCE

type SavedBodyStyles = {
  bodyOverflow: string
  bodyPaddingRight: string
  htmlOverflow: string
}

type UsePortfolioScrollLockArgs = {
  isEnabled: boolean
  sceneRef: { current: HTMLDivElement | null }
  progress: MotionValue<number>
}

type PortfolioHeadingProps = {
  titleClassName: string
  wrapperClassName?: string
}

function isDesktopViewport() {
  return matchesMinBreakpoint('tablet')
}

function toScrollDirection(delta: number): ScrollDirection {
  return delta > 0 ? 'down' : 'up'
}

function canAdvanceProgress(currentProgress: number, direction: ScrollDirection) {
  if (direction === 'down') {
    return currentProgress < PROGRESS_MAX - PROGRESS_EDGE_EPSILON
  }

  return currentProgress > PROGRESS_MIN + PROGRESS_EDGE_EPSILON
}

function getKeyboardDelta(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'PageDown' || (event.key === ' ' && !event.shiftKey)) {
    return KEYBOARD_DELTA
  }

  if (event.key === 'ArrowUp' || event.key === 'PageUp' || (event.key === ' ' && event.shiftKey)) {
    return -KEYBOARD_DELTA
  }

  if (event.key === 'Home') {
    return -LOCK_STEP_DIVISOR
  }

  if (event.key === 'End') {
    return LOCK_STEP_DIVISOR
  }

  return null
}

function getProjectKey(project: PortfolioProject) {
  return `${project.name}-${project.period}`
}

function PortfolioHeading({ titleClassName, wrapperClassName }: PortfolioHeadingProps) {
  const headingWrapperClassName = ['mx-auto max-w-3xl text-center', wrapperClassName].filter(Boolean).join(' ')

  return (
    <div className={headingWrapperClassName}>
      <p className="text-lg uppercase">Explore my</p>
      <h2 className={titleClassName}>Portfolio</h2>
    </div>
  )
}

function usePortfolioScrollLock({ isEnabled, sceneRef, progress }: UsePortfolioScrollLockArgs) {
  const isScrollLockedRef = useRef(false)
  const lockScrollYRef = useRef(0)
  const lastScrollYRef = useRef(0)
  const lastTouchYRef = useRef<number | null>(null)
  const savedBodyStylesRef = useRef<SavedBodyStyles | null>(null)

  useEffect(() => {
    if (!isEnabled) {
      return
    }

    const sceneElement = sceneRef.current

    if (!sceneElement) {
      return
    }

    const lockDocumentScroll = () => {
      if (savedBodyStylesRef.current) {
        return
      }

      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      savedBodyStylesRef.current = {
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
      const previousStyles = savedBodyStylesRef.current

      if (!previousStyles) {
        return
      }

      document.body.style.overflow = previousStyles.bodyOverflow
      document.body.style.paddingRight = previousStyles.bodyPaddingRight
      document.documentElement.style.overflow = previousStyles.htmlOverflow
      savedBodyStylesRef.current = null
    }

    const releaseLockAndContinue = (direction: ScrollDirection) => {
      isScrollLockedRef.current = false
      unlockDocumentScroll()

      requestAnimationFrame(() => {
        const nextScrollY = lockScrollYRef.current + (direction === 'down' ? SCROLL_LOCK_NUDGE : -SCROLL_LOCK_NUDGE)
        window.scrollTo({ top: nextScrollY, behavior: 'auto' })
      })
    }

    const applyInputDelta = (rawDelta: number, source: InputSource) => {
      if (!isScrollLockedRef.current || Math.abs(rawDelta) < PROGRESS_EDGE_EPSILON) {
        return
      }

      const direction = toScrollDirection(rawDelta)
      const currentProgress = progress.get()

      if (!canAdvanceProgress(currentProgress, direction)) {
        releaseLockAndContinue(direction)
        return
      }

      const stepLimit = STEP_LIMIT_BY_SOURCE[source]
      const normalizedDelta = clamp(rawDelta / LOCK_STEP_DIVISOR, -stepLimit, stepLimit)
      const nextProgress = clamp(currentProgress + normalizedDelta, PROGRESS_MIN, PROGRESS_MAX)
      progress.set(nextProgress)
    }

    const shouldLockScene = (direction: ScrollDirection) => {
      if (!isDesktopViewport()) {
        return false
      }

      const rect = sceneElement.getBoundingClientRect()
      const topThreshold = window.innerHeight * SCENE_ACTIVATION_BOUNDS.topRatio
      const bottomThreshold = window.innerHeight * SCENE_ACTIVATION_BOUNDS.bottomRatio
      const isSceneInFocus = rect.top <= topThreshold && rect.bottom >= bottomThreshold

      if (!isSceneInFocus) {
        return false
      }

      return canAdvanceProgress(progress.get(), direction)
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

      if (Math.abs(scrollDelta) < MIN_SCROLL_DELTA_TO_LOCK) {
        return
      }

      if (shouldLockScene(toScrollDirection(scrollDelta))) {
        engageLock()
      }
    }

    const handleWheel = (event: WheelEvent) => {
      if (!isScrollLockedRef.current || event.ctrlKey) {
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
      lastTouchYRef.current = touch?.clientY ?? null
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

      const delta = getKeyboardDelta(event)
      if (delta === null) {
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
  }, [isEnabled, progress, sceneRef])
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
      className="absolute left-1/2 top-1/2 w-80 -translate-x-1/2 -translate-y-1/2 desktop:w-84"
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
  const projectCount = projects.length

  const desktopSceneRef = useRef<HTMLDivElement>(null)
  const isParallaxEnabled = !shouldReduceMotion
  usePortfolioScrollLock({
    isEnabled: isParallaxEnabled,
    sceneRef: desktopSceneRef,
    progress,
  })

  const smoothProgress = useSpring(progress, SPRING_CONFIG)
  const centeredProgress = useTransform(smoothProgress, value => value - 0.5)

  const titleY = useTransform(smoothProgress, value => (isParallaxEnabled ? -value * 140 : 0))
  const titleOpacity = useTransform(smoothProgress, value => (isParallaxEnabled ? clamp(1 - value * 1.1, 0.18, 1) : 1))

  const layerOneX = useTransform(centeredProgress, value => (isParallaxEnabled ? value * -420 : 0))
  const layerOneY = useTransform(centeredProgress, value => (isParallaxEnabled ? value * 130 : 0))
  const layerTwoX = useTransform(centeredProgress, value => (isParallaxEnabled ? value * 300 : 0))
  const layerTwoY = useTransform(centeredProgress, value => (isParallaxEnabled ? value * -170 : 0))
  const layerThreeX = useTransform(centeredProgress, value => (isParallaxEnabled ? value * -520 : 0))
  const layerThreeY = useTransform(centeredProgress, value => (isParallaxEnabled ? value * -110 : 0))
  const progressScale = useTransform(smoothProgress, value => (isParallaxEnabled ? 0.08 + value * 0.92 : 1))

  return (
    <section className="relative isolate overflow-hidden bg-background px-6 py-20 tablet:px-0 tablet:py-0">
      <div className="mx-auto w-full max-w-9xl tablet:hidden">
        <PortfolioHeading titleClassName="text-6xl leading-none tracking-wide text-foreground uppercase tablet:text-7xl desktop:text-8xl" />

        <div className="mt-10 flex flex-col items-center gap-6 tablet:hidden">
          {projects.map(project => (
            <ProjectCompact key={getProjectKey(project)} project={project} />
          ))}
        </div>
      </div>

      <div ref={desktopSceneRef} className="relative z-20 hidden h-[80vh] touch-none tablet:block">
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
              <PortfolioHeading
                wrapperClassName="px-10 desktop:px-16"
                titleClassName="text-6xl text-foreground uppercase tablet:text-7xl desktop:text-9xl tracking-tight"
              />
            </motion.div>

            <div className="relative h-full" style={{ perspective: 1400 }}>
              {projects.map((project, index) => (
                <ProjectParallaxCard
                  key={getProjectKey(project)}
                  project={project}
                  index={index}
                  total={projectCount}
                  progress={smoothProgress}
                  isEnabled={isParallaxEnabled}
                />
              ))}
            </div>

            <div className="pointer-events-none absolute inset-x-10 bottom-30 desktop:inset-x-20">
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
