import Link from 'next/link'

import { BlogPostCoverImage } from '@/components/blog-post-cover-image'
import { blogPostTagLabels } from '@/data/blog-data'
import { type BlogPostSummary, formatBlogPostDate } from '@/lib/blog'
import { cn } from '@/lib/utils'

type BlogPostPreview = Pick<
  BlogPostSummary,
  'coverImageSrc' | 'description' | 'publishedAt' | 'readingMinutes' | 'slug' | 'tags' | 'title'
>

type BlogPostCompactProps = {
  post: BlogPostPreview
  headingLevel?: 'h2' | 'h3'
  className?: string
}

type BlogPostCardMetadataProps = {
  post: Pick<BlogPostPreview, 'publishedAt' | 'readingMinutes' | 'tags'>
  className?: string
}

function BlogPostCardMetadata({ post, className }: BlogPostCardMetadataProps) {
  const primaryTag = post.tags[0]

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-2 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-foreground/40',
        className,
      )}
    >
      <time dateTime={post.publishedAt}>{formatBlogPostDate(post.publishedAt, 'medium')}</time>
      <span aria-hidden="true">·</span>
      <span>{post.readingMinutes} min</span>
      <span aria-hidden="true">·</span>
      <Link
        href={`/blog?topic=${primaryTag}`}
        className="rounded-sm transition-colors hover:text-foreground/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {blogPostTagLabels[primaryTag]}
      </Link>
    </div>
  )
}

export function BlogPostCompact({ post, headingLevel = 'h3', className }: BlogPostCompactProps) {
  const Heading = headingLevel

  return (
    <article className={cn('border-t border-foreground/12 py-5 tablet:py-6', className)}>
      <Heading className="text-2xl font-semibold leading-[1.08] tracking-tight text-foreground tablet:text-3xl">
        <Link
          href={`/blog/${post.slug}`}
          className="group inline-flex items-start gap-3 rounded-sm transition-colors hover:text-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          <span>{post.title}</span>
          <span
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-primary-light transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
          >
            →
          </span>
        </Link>
      </Heading>
      <BlogPostCardMetadata post={post} className="mt-2" />
    </article>
  )
}

export function BlogPostFeatured({ post, headingLevel = 'h3', className }: BlogPostCompactProps) {
  const Heading = headingLevel

  return (
    <article
      className={cn(
        'relative border-y border-foreground/20 py-7 before:absolute before:left-0 before:top-0 before:h-px before:w-16 before:bg-primary-light tablet:py-8',
        className,
      )}
    >
      {post.coverImageSrc ? (
        <BlogPostCoverImage src={post.coverImageSrc} priority className="mb-7 rounded-none border-x-0 border-t-0" />
      ) : null}

      <Heading className="max-w-3xl text-3xl font-semibold leading-[1.05] tracking-tight text-foreground tablet:text-4xl">
        <Link
          href={`/blog/${post.slug}`}
          className="group inline-flex items-start gap-3 rounded-sm transition-colors hover:text-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          <span>{post.title}</span>
          <span
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-primary-light transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
          >
            →
          </span>
        </Link>
      </Heading>
      <p className="mt-3 max-w-2xl font-reading text-sm leading-relaxed text-foreground/70 tablet:text-base">
        {post.description}
      </p>
      <BlogPostCardMetadata post={post} className="mt-4" />
    </article>
  )
}
