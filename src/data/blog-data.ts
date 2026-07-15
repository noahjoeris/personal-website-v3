export type ISODate = `${number}-${number}-${number}`

export const blogPostCategories = ['bitcoin', 'open-source', 'self-hosting', 'life', 'technology'] as const

export type BlogPostCategory = (typeof blogPostCategories)[number]

export const blogPostCategoryLabels = {
  bitcoin: 'Bitcoin',
  'open-source': 'Open source',
  'self-hosting': 'Self-hosting',
  life: 'Life',
  technology: 'Technology',
} as const satisfies Record<BlogPostCategory, string>

export const blogPostTags = [
  'architecture',
  'bitcoin',
  'coding',
  'crypto',
  'mdx',
  'nextjs',
  'open-source',
  'personal-growth',
  'tech',
] as const

export type BlogPostTag = (typeof blogPostTags)[number]

export type BlogPostMetadata = {
  title: string
  description: string
  category: BlogPostCategory
  publishedAt: ISODate
  updatedAt?: ISODate
  tags: readonly BlogPostTag[]
  status: 'draft' | 'published'
  featured?: boolean
  coverImageSrc?: `/images/blog/${string}`
}

export type BlogData = {
  author: string
  authorHref: '/about'
  description: string
  emptyStateDescription: string
  socialImageSrc: `/images/${string}`
}

export const blogData = {
  author: 'Noah Joeris',
  authorHref: '/about',
  description: 'Practical notes and opinionated essays on Bitcoin, freedom tech, and living deliberately.',
  emptyStateDescription: 'The first posts will land here soon.',
  socialImageSrc: '/images/about/me.webp',
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
  const hasValidTags =
    Array.isArray(candidate.tags) && candidate.tags.every(tag => blogPostTags.includes(tag as BlogPostTag))
  const hasValidUpdatedAt =
    candidate.updatedAt === undefined ||
    (isISODate(candidate.updatedAt) && isISODate(candidate.publishedAt) && candidate.updatedAt >= candidate.publishedAt)

  return (
    typeof candidate.title === 'string' &&
    candidate.title.trim().length > 0 &&
    typeof candidate.description === 'string' &&
    candidate.description.trim().length > 0 &&
    blogPostCategories.includes(candidate.category as BlogPostCategory) &&
    isISODate(candidate.publishedAt) &&
    hasValidUpdatedAt &&
    hasValidTags &&
    (candidate.status === 'draft' || candidate.status === 'published') &&
    (candidate.featured === undefined || typeof candidate.featured === 'boolean') &&
    (candidate.coverImageSrc === undefined ||
      (typeof candidate.coverImageSrc === 'string' && candidate.coverImageSrc.startsWith('/images/blog/')))
  )
}

function isISODate(value: unknown): value is ISODate {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}
