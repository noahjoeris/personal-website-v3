export type ISODate = `${number}-${number}-${number}`
export type BlogPostTag = 'architecture' | 'bitcoin' | 'blockchain' | 'coding' | 'mdx' | 'nextjs' | 'personal-growth' | 'tech'

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
