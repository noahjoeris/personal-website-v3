export type ISODate = `${number}-${number}-${number}`

export type BlogPostTag =
  | 'architecture'
  | 'bitcoin'
  | 'blockchain'
  | 'coding'
  | 'mdx'
  | 'nextjs'
  | 'open-source'
  | 'personal-growth'
  | 'tech'

export type BlogPostMetadata = {
  title: string
  description: string
  publishedAt: ISODate
  tags: readonly BlogPostTag[]
  status: 'draft' | 'published'
  coverImageSrc?: `/images/blog/${string}`
}

export type BlogData = {
  author: string
  description: string
  emptyStateDescription: string
}

export const blogData = {
  author: 'Noah Joeris',
  description: 'Write-ups on Bitcoin, software engineering, tech, and personal growth.',
  emptyStateDescription: 'The first posts will land here soon.',
} as const satisfies BlogData

/**
 * Keeps post metadata colocated with each MDX file while preserving a single,
 * shared contract for the blog loader and index pages.
 */
export function defineBlogPostMetadata(metadata: BlogPostMetadata): BlogPostMetadata {
  return metadata
}

export function isBlogPostMetadata(value: unknown): value is BlogPostMetadata {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.title === 'string' &&
    typeof candidate.description === 'string' &&
    typeof candidate.publishedAt === 'string' &&
    Array.isArray(candidate.tags) &&
    (candidate.status === 'draft' || candidate.status === 'published') &&
    (candidate.coverImageSrc === undefined || typeof candidate.coverImageSrc === 'string')
  )
}
