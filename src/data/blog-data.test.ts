import { describe, expect, it } from 'vitest'

import { isBlogPostMetadata } from './blog-data'

const validMetadata = {
  title: 'A post',
  description: 'A useful description.',
  category: 'bitcoin',
  publishedAt: '2026-07-15',
  tags: ['bitcoin'],
  status: 'published',
} as const

describe('blog post metadata validation', () => {
  it('accepts valid metadata', () => {
    expect(isBlogPostMetadata(validMetadata)).toBe(true)
  })

  it('rejects impossible calendar dates', () => {
    expect(isBlogPostMetadata({ ...validMetadata, publishedAt: '2026-02-30' })).toBe(false)
  })

  it('rejects update dates before publication', () => {
    expect(isBlogPostMetadata({ ...validMetadata, updatedAt: '2026-07-14' })).toBe(false)
  })

  it('rejects unknown categories, tags, and cover-image paths', () => {
    expect(isBlogPostMetadata({ ...validMetadata, category: 'finance' })).toBe(false)
    expect(isBlogPostMetadata({ ...validMetadata, tags: ['unknown'] })).toBe(false)
    expect(isBlogPostMetadata({ ...validMetadata, coverImageSrc: '/other/image.webp' })).toBe(false)
  })
})
