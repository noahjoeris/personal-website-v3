import Link from 'next/link'

import type { BlogPostSummary } from '@/lib/blog'

type BlogPostFooterProps = {
  newerPost?: BlogPostSummary
  olderPost?: BlogPostSummary
}

export function BlogPostFooter({ newerPost, olderPost }: BlogPostFooterProps) {
  return (
    <footer className="mx-auto mt-16 max-w-2xl border-t border-foreground/15 pt-10">
      {newerPost || olderPost ? (
        <section aria-labelledby="more-writing-heading">
          <h2 id="more-writing-heading" className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-light">
            More writing
          </h2>
          <nav
            aria-label="Adjacent blog posts"
            className="mt-4 grid gap-3 border-y border-foreground/12 py-5 tablet:grid-cols-2"
          >
            {olderPost ? (
              <Link
                href={`/blog/${olderPost.slug}`}
                className="rounded-sm p-2 transition-colors hover:bg-foreground/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="block text-xs uppercase tracking-[0.16em] text-foreground/50">← Older post</span>
                <span className="mt-1 block text-lg font-semibold leading-tight text-foreground">
                  {olderPost.title}
                </span>
              </Link>
            ) : null}
            {newerPost ? (
              <Link
                href={`/blog/${newerPost.slug}`}
                className="rounded-sm p-2 text-left transition-colors hover:bg-foreground/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring tablet:col-start-2 tablet:text-right"
              >
                <span className="block text-xs uppercase tracking-[0.16em] text-foreground/50">Newer post →</span>
                <span className="mt-1 block text-lg font-semibold leading-tight text-foreground">
                  {newerPost.title}
                </span>
              </Link>
            ) : null}
          </nav>
        </section>
      ) : null}

      <div className="mt-8 text-sm font-semibold uppercase tracking-[0.16em]">
        <Link
          href="/blog"
          className="rounded-sm text-primary-light transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          All posts
        </Link>
      </div>
    </footer>
  )
}
