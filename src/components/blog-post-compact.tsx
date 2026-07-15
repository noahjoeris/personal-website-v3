import Link from 'next/link'

import { BlogPostCoverImage } from '@/components/blog-post-cover-image'
import { blogPostCategoryLabels } from '@/data/blog-data'
import { type BlogPostSummary, formatBlogPostDate } from '@/lib/blog'
import { cn } from '@/lib/utils'

type BlogPostPreview = Pick<
  BlogPostSummary,
  'category' | 'coverImageSrc' | 'description' | 'publishedAt' | 'readingMinutes' | 'slug' | 'title'
>

type BlogPostCompactProps = {
  post: BlogPostPreview
  headingLevel?: 'h2' | 'h3'
  className?: string
}

export function BlogPostCompact({ post, headingLevel = 'h3', className }: BlogPostCompactProps) {
  const Heading = headingLevel

  return (
    <article
      className={cn(
        'grid gap-3 border-t border-foreground/12 py-6 tablet:grid-cols-[10rem_minmax(0,1fr)] tablet:gap-8 tablet:py-7',
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.16em] text-foreground/55 tablet:block tablet:space-y-2">
        <time dateTime={post.publishedAt} className="block">
          {formatBlogPostDate(post.publishedAt)}
        </time>
        <span className="block">{blogPostCategoryLabels[post.category]}</span>
        <span className="block">{post.readingMinutes} min read</span>
      </div>

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
    </article>
  )
}

export function BlogPostFeatured({ post, headingLevel = 'h3', className }: BlogPostCompactProps) {
  const Heading = headingLevel

  return (
    <article
      className={cn(
        'relative overflow-hidden border-y border-foreground/20 bg-background/30 before:absolute before:left-0 before:top-0 before:h-px before:w-24 before:bg-primary-light',
        className,
      )}
    >
      {post.coverImageSrc ? (
        <BlogPostCoverImage src={post.coverImageSrc} priority className="rounded-none border-x-0 border-t-0" />
      ) : null}
      <div className="grid gap-5 py-8 tablet:grid-cols-[10rem_minmax(0,1fr)] tablet:gap-8 tablet:py-10">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.16em] text-foreground/60 tablet:block tablet:space-y-2 tablet:text-sm">
          <time dateTime={post.publishedAt} className="block">
            {formatBlogPostDate(post.publishedAt)}
          </time>
          <Link
            href={`/blog?topic=${post.category}`}
            className="block rounded-sm underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {blogPostCategoryLabels[post.category]}
          </Link>
          <span className="block">{post.readingMinutes} min read</span>
        </div>

        <div>
          <Heading className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-tight text-foreground tablet:text-5xl">
            {post.title}
          </Heading>
          <p className="mt-4 max-w-2xl font-reading text-base leading-relaxed text-foreground/75 tablet:text-lg">
            {post.description}
          </p>
          <Link
            href={`/blog/${post.slug}`}
            aria-label={`Read ${post.title}`}
            className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold uppercase tracking-[0.18em] text-primary-light transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            Read article <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
