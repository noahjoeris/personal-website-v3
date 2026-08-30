'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { type ReactNode, type RefObject, useEffect, useRef, useState } from 'react'

import { MaskIcon } from '@/components/mask-icon'

export type FireflyLayout = 'mobile' | 'desktop'

export type FireflyRegion = {
  x: readonly [number, number]
  y: readonly [number, number]
}

export type ViewportSize = {
  width: number
  height: number
}

export type OccupiedMark = {
  x: number
  y: number
  size: number
}

export type FireflyPose = {
  id: number
  x: number
  y: number
  size: number
  rotate: number
  opacity: number
  driftX: number
  driftY: number
  delay: number
  fadeIn: number
  hold: number
  fadeOut: number
}

const DESKTOP_COUNT = 11
const MOBILE_COUNT = 6
const DESKTOP_MIN_WIDTH = 1025
const OVERLAP_GAP = 36
const MAX_PLACEMENT_ATTEMPTS = 48

// Edge columns, bands down the page so density holds after they scroll with the document.
export const DESKTOP_REGIONS: readonly [FireflyRegion, ...FireflyRegion[]] = [
  { x: [6, 16], y: [4, 11] },
  { x: [82, 94], y: [5, 12] },
  { x: [86, 96], y: [14, 22] },
  { x: [5, 14], y: [16, 24] },
  { x: [80, 93], y: [28, 36] },
  { x: [6, 15], y: [32, 42] },
  { x: [84, 95], y: [44, 54] },
  { x: [5, 14], y: [50, 60] },
  { x: [82, 94], y: [62, 72] },
  { x: [6, 16], y: [68, 78] },
  { x: [84, 95], y: [78, 88] },
  { x: [5, 13], y: [82, 92] },
]

export const MOBILE_REGIONS: readonly [FireflyRegion, ...FireflyRegion[]] = [
  { x: [6, 20], y: [3, 10] },
  { x: [80, 94], y: [4, 11] },
  { x: [5, 16], y: [18, 28] },
  { x: [84, 96], y: [32, 42] },
  { x: [6, 18], y: [48, 58] },
  { x: [82, 94], y: [62, 72] },
  { x: [5, 16], y: [76, 88] },
  { x: [84, 96], y: [80, 90] },
]

const STATIC_DESKTOP: readonly Pick<FireflyPose, 'x' | 'y' | 'size' | 'rotate' | 'opacity'>[] = [
  { x: 10, y: 8, size: 34, rotate: -12, opacity: 0.14 },
  { x: 90, y: 14, size: 72, rotate: 8, opacity: 0.12 },
  { x: 88, y: 36, size: 40, rotate: -6, opacity: 0.14 },
  { x: 8, y: 55, size: 28, rotate: 10, opacity: 0.12 },
  { x: 91, y: 78, size: 48, rotate: -8, opacity: 0.16 },
]

const STATIC_MOBILE: readonly Pick<FireflyPose, 'x' | 'y' | 'size' | 'rotate' | 'opacity'>[] = [
  { x: 12, y: 6, size: 28, rotate: -10, opacity: 0.14 },
  { x: 88, y: 22, size: 44, rotate: 12, opacity: 0.12 },
  { x: 10, y: 52, size: 32, rotate: -6, opacity: 0.14 },
]

let poseId = 0

function nextId() {
  poseId += 1
  return poseId
}

function randomBetween(min: number, max: number, rand: () => number) {
  return min + rand() * (max - min)
}

function randomSize(min: number, max: number, rand: () => number) {
  return min + rand() ** 0.58 * (max - min)
}

function sizeRangeFor(layout: FireflyLayout) {
  return layout === 'desktop' ? ([28, 96] as const) : ([24, 56] as const)
}

function regionsFor(layout: FireflyLayout) {
  return layout === 'desktop' ? DESKTOP_REGIONS : MOBILE_REGIONS
}

export function marksOverlap(
  a: OccupiedMark,
  b: OccupiedMark,
  viewport: ViewportSize,
  gap: number = OVERLAP_GAP,
): boolean {
  const ax = (a.x / 100) * viewport.width
  const ay = (a.y / 100) * viewport.height
  const bx = (b.x / 100) * viewport.width
  const by = (b.y / 100) * viewport.height
  const minDist = a.size / 2 + b.size / 2 + gap
  const dx = ax - bx
  const dy = ay - by

  return dx * dx + dy * dy < minDist * minDist
}

function randomPose(layout: FireflyLayout, rand: () => number, slot?: number): Omit<FireflyPose, 'id' | 'delay'> {
  const sizeRange = sizeRangeFor(layout)
  const regions = regionsFor(layout)
  const regionIndex = slot === undefined ? Math.floor(rand() * regions.length) : slot % regions.length
  const region = regions[regionIndex] ?? regions[0]

  return {
    x: randomBetween(region.x[0], region.x[1], rand),
    y: randomBetween(region.y[0], region.y[1], rand),
    size: randomSize(sizeRange[0], sizeRange[1], rand),
    rotate: randomBetween(-22, 22, rand),
    opacity: randomBetween(0.1, 0.18, rand),
    driftX: randomBetween(-12, 12, rand),
    driftY: randomBetween(-10, 10, rand),
    fadeIn: randomBetween(2.8, 4.6, rand),
    hold: randomBetween(5, 9, rand),
    fadeOut: randomBetween(2.8, 4.6, rand),
  }
}

export function createFireflyPose({
  layout,
  viewport,
  occupied = [],
  rand = Math.random,
  slot,
}: {
  layout: FireflyLayout
  viewport: ViewportSize
  occupied?: readonly OccupiedMark[]
  rand?: () => number
  slot?: number
}): Omit<FireflyPose, 'id' | 'delay'> {
  let pose = randomPose(layout, rand, slot)

  for (let attempt = 0; attempt < MAX_PLACEMENT_ATTEMPTS; attempt += 1) {
    if (!occupied.some(mark => marksOverlap(pose, mark, viewport))) {
      return pose
    }
    pose = randomPose(layout, rand)
  }

  return pose
}

export function createFireflyField(
  count: number,
  viewport: ViewportSize,
  layout: FireflyLayout,
  rand: () => number = Math.random,
): Omit<FireflyPose, 'id' | 'delay'>[] {
  const poses: Omit<FireflyPose, 'id' | 'delay'>[] = []

  for (let index = 0; index < count; index += 1) {
    poses.push(createFireflyPose({ layout, viewport, occupied: poses, rand, slot: index }))
  }

  return poses
}

function useFieldSize(ref: RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState<ViewportSize | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) {
      return
    }

    const update = () => setSize({ width: node.clientWidth, height: Math.max(node.clientHeight, window.innerHeight) })
    update()

    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  }, [ref])

  return size
}

function FireflyMark({
  x,
  y,
  size,
  rotate,
  children,
}: {
  x: number
  y: number
  size: number
  rotate: number
  children: ReactNode
}) {
  return (
    <div
      className="absolute text-foreground"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
      }}
    >
      {children}
    </div>
  )
}

function BitcoinLogo() {
  return (
    <MaskIcon
      src="/icons/bitcoin.svg"
      className="h-full w-full drop-shadow-[0_0_6px_rgb(255_255_255_/_0.55)] drop-shadow-[0_0_18px_rgb(255_255_255_/_0.22)]"
    />
  )
}

function StaticFireflies({ layout }: { layout: FireflyLayout }) {
  const poses = layout === 'desktop' ? STATIC_DESKTOP : STATIC_MOBILE

  return (
    <>
      {poses.map(pose => (
        <FireflyMark key={`${pose.x}-${pose.y}`} x={pose.x} y={pose.y} size={pose.size} rotate={pose.rotate}>
          <div className="h-full w-full" style={{ opacity: pose.opacity }}>
            <BitcoinLogo />
          </div>
        </FireflyMark>
      ))}
    </>
  )
}

function Firefly({ pose, onCycle }: { pose: FireflyPose; onCycle: () => void }) {
  const onCycleRef = useRef(onCycle)
  onCycleRef.current = onCycle

  useEffect(() => {
    const durationMs = (pose.delay + pose.fadeIn + pose.hold + pose.fadeOut) * 1000
    const timeout = window.setTimeout(() => onCycleRef.current(), durationMs)
    return () => window.clearTimeout(timeout)
  }, [pose])

  const total = pose.fadeIn + pose.hold + pose.fadeOut

  return (
    <FireflyMark x={pose.x} y={pose.y} size={pose.size} rotate={pose.rotate}>
      <motion.div
        key={pose.id}
        className="h-full w-full"
        initial={{ opacity: 0, x: 0, y: 0 }}
        animate={{
          opacity: [0, pose.opacity, pose.opacity, 0],
          x: [0, pose.driftX],
          y: [0, pose.driftY],
        }}
        transition={{
          duration: total,
          delay: pose.delay,
          ease: 'easeInOut',
          times: [0, pose.fadeIn / total, (pose.fadeIn + pose.hold) / total, 1],
        }}
      >
        <BitcoinLogo />
      </motion.div>
    </FireflyMark>
  )
}

function AnimatedFireflies({ layout, viewport }: { layout: FireflyLayout; viewport: ViewportSize }) {
  const viewportRef = useRef(viewport)
  viewportRef.current = viewport
  const count = layout === 'desktop' ? DESKTOP_COUNT : MOBILE_COUNT

  const [poses, setPoses] = useState(() =>
    createFireflyField(count, viewport, layout).map((pose, slot) => ({
      ...pose,
      id: nextId(),
      delay: 0.35 + slot * 0.55 + Math.random() * 0.8,
    })),
  )

  const recycle = (index: number) => {
    setPoses(current => {
      const occupied = current.filter((_, poseIndex) => poseIndex !== index)
      const next = {
        ...createFireflyPose({ layout, viewport: viewportRef.current, occupied }),
        id: nextId(),
        delay: 0.4 + Math.random() * 1.4,
      }

      return current.map((pose, poseIndex) => (poseIndex === index ? next : pose))
    })
  }

  return (
    <>
      {poses.map((pose, index) => (
        <Firefly key={index} pose={pose} onCycle={() => recycle(index)} />
      ))}
    </>
  )
}

export function BitcoinFireflies() {
  const pathname = usePathname()
  const shouldReduceMotion = useReducedMotion()
  const fieldRef = useRef<HTMLDivElement>(null)
  const fieldSize = useFieldSize(fieldRef)

  if (pathname?.startsWith('/blog/')) {
    return null
  }

  const layout: FireflyLayout = (fieldSize?.width ?? 0) >= DESKTOP_MIN_WIDTH ? 'desktop' : 'mobile'

  return (
    <div
      ref={fieldRef}
      className="pointer-events-none absolute inset-0 z-[var(--z-fireflies)] overflow-hidden"
      aria-hidden
    >
      {fieldSize && shouldReduceMotion ? <StaticFireflies layout={layout} /> : null}
      {fieldSize && !shouldReduceMotion ? (
        <AnimatedFireflies key={`${layout}-${fieldSize.width}`} layout={layout} viewport={fieldSize} />
      ) : null}
    </div>
  )
}
