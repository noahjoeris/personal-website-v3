import Link from 'next/link'
import { type BlogPostSummary, formatBlogPostDate } from '@/lib/blog'
import { cn } from '@/lib/utils'

import { BlogPostCoverImage } from './blog-post-cover-image'

type BlogPostCompactPost = Pick<
  BlogPostSummary,
  'coverImageSrc' | 'description' | 'publishedAt' | 'slug' | 'tags' | 'title'
>

type BlogPostCompactProps = {
  post: BlogPostCompactPost
  className?: string
}

export function BlogPostCompact({ post, className }: BlogPostCompactProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        'block overflow-hidden rounded-md border border-foreground/12 bg-foreground/[0.03] transition-colors hover:border-foreground/25 hover:bg-foreground/[0.05]',
        className,
      )}
    >
      {post.coverImageSrc ? <BlogPostCoverImage src={post.coverImageSrc} title={post.title} /> : null}
      <div className="px-6 py-6">
        <p className="text-sm uppercase tracking-[0.24em] text-foreground/55">{formatBlogPostDate(post.publishedAt)}</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">{post.title}</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/75 tablet:text-lg">{post.description}</p>
        <ul className="mt-6 flex flex-wrap gap-3">
          {post.tags.map(tag => (
            <li
              key={tag}
              className="rounded-full border border-foreground/12 px-3 py-1 text-xs uppercase tracking-[0.2em] text-foreground/60"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  )
}
