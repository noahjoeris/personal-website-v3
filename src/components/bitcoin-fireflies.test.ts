import { describe, expect, it } from 'vitest'

import { createFireflyField, createFireflyPose, DESKTOP_REGIONS, marksOverlap } from './bitcoin-fireflies'

function sequence(values: number[]) {
  let index = 0
  return () => {
    const value = values[index % values.length] ?? 0
    index += 1
    return value
  }
}

function incrementing(step = 0.19) {
  let value = 0.07
  return () => {
    value = (value + step) % 1
    return value
  }
}

const viewport = { width: 1440, height: 900 }

describe('marksOverlap', () => {
  it('treats coincident marks as overlapping', () => {
    expect(marksOverlap({ x: 50, y: 50, size: 40 }, { x: 50, y: 50, size: 40 }, viewport)).toBe(true)
  })

  it('treats distant marks as separate', () => {
    expect(marksOverlap({ x: 10, y: 10, size: 40 }, { x: 90, y: 90, size: 40 }, viewport)).toBe(false)
  })
})

describe('createFireflyPose', () => {
  it('keeps desktop poses in atmosphere regions and the size range', () => {
    const pose = createFireflyPose({
      layout: 'desktop',
      viewport,
      slot: 0,
      rand: sequence([0, 0, 0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]),
    })

    expect(pose.x).toBeGreaterThanOrEqual(DESKTOP_REGIONS[0].x[0])
    expect(pose.x).toBeLessThanOrEqual(DESKTOP_REGIONS[0].x[1])
    expect(pose.y).toBeGreaterThanOrEqual(DESKTOP_REGIONS[0].y[0])
    expect(pose.y).toBeLessThanOrEqual(DESKTOP_REGIONS[0].y[1])
    expect(pose.size).toBeGreaterThanOrEqual(28)
    expect(pose.size).toBeLessThanOrEqual(96)
    expect(pose.opacity).toBeGreaterThanOrEqual(0.1)
    expect(pose.opacity).toBeLessThanOrEqual(0.18)
  })

  it('uses the smaller mobile size range', () => {
    const pose = createFireflyPose({
      layout: 'mobile',
      viewport: { width: 390, height: 844 },
      slot: 0,
      rand: sequence([0, 0, 1, 1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]),
    })

    expect(pose.size).toBe(56)
  })

  it('stays out of the center content column', () => {
    const field = createFireflyField(11, viewport, 'desktop', incrementing())

    for (const pose of field) {
      const inCenterColumn = pose.x > 22 && pose.x < 78 && pose.y > 28 && pose.y < 68
      expect(inCenterColumn).toBe(false)
    }
  })

  it('avoids occupied marks', () => {
    const occupied = [{ x: 10, y: 18, size: 80 }]
    const collidingRand = sequence([
      0, 0, 0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.9, 0.9, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2,
    ])
    const pose = createFireflyPose({ layout: 'desktop', viewport, occupied, rand: collidingRand, slot: 0 })

    expect(marksOverlap(pose, occupied[0], viewport)).toBe(false)
  })
})

describe('createFireflyField', () => {
  it('places a set of marks that do not overlap', () => {
    const field = createFireflyField(11, viewport, 'desktop', incrementing())

    expect(field).toHaveLength(11)

    for (let i = 0; i < field.length; i += 1) {
      for (let j = i + 1; j < field.length; j += 1) {
        expect(marksOverlap(field[i]!, field[j]!, viewport)).toBe(false)
      }
    }
  })
})
