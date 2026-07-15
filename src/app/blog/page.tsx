import type { Metadata } from 'next'
import Link from 'next/link'

import { BlogPostCompact, BlogPostFeatured } from '@/components/blog-post-compact'
import { Navbar } from '@/components/navbar'
import { SectionHeading } from '@/components/section-heading'
import { type BlogPostCategory, blogData, blogPostCategories, blogPostCategoryLabels } from '@/data/blog-data'
import { getPublishedBlogPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog',
  description: blogData.description,
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    type: 'website',
    title: 'Blog | Noah Joeris',
    description: blogData.description,
    url: '/blog',
    images: [{ url: blogData.socialImageSrc, alt: blogData.author }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Noah Joeris',
    description: blogData.description,
    images: [blogData.socialImageSrc],
  },
}

type BlogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function isBlogPostCategory(value: string | string[] | undefined): value is BlogPostCategory {
  return typeof value === 'string' && blogPostCategories.includes(value as BlogPostCategory)
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const [posts, query] = await Promise.all([getPublishedBlogPosts(), searchParams])
  const selectedTopic = isBlogPostCategory(query.topic) ? query.topic : null
  const featuredPost = posts.find(post => post.featured)
  const archivePosts = selectedTopic
    ? posts.filter(post => post.category === selectedTopic)
    : posts.filter(post => post.slug !== featuredPost?.slug)
  const postsByYear = new Map<number, typeof archivePosts>()
  const topicCounts = new Map<BlogPostCategory, number>()

  for (const post of posts) {
    topicCounts.set(post.category, (topicCounts.get(post.category) ?? 0) + 1)
  }

  for (const post of archivePosts) {
    const year = new Date(post.publishedAt).getUTCFullYear()
    postsByYear.set(year, [...(postsByYear.get(year) ?? []), post])
  }

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="relative isolate mx-auto w-full max-w-5xl px-6 pb-24 pt-28 tablet:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-8 -z-10 h-80 w-[80vw] max-w-4xl -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        />
        <SectionHeading eyebrow="Read my" title="Blog" headingLevel="h1" />
        <p className="mx-auto mt-6 max-w-2xl font-reading text-base leading-relaxed text-foreground/75 tablet:text-center tablet:text-lg">
          {blogData.description}
        </p>

        {posts.length > 0 ? (
          <>
            <div className="mt-10">
              <nav aria-label="Filter posts by topic">
                <ul className="flex flex-wrap gap-2">
                  <li>
                    <Link
                      href="/blog"
                      scroll={false}
                      aria-label={`All topics: ${posts.length} posts`}
                      aria-current={selectedTopic === null ? 'page' : undefined}
                      className="inline-flex h-9 items-center gap-2 rounded-md border border-foreground/12 bg-foreground/[0.03] px-3 transition-colors hover:border-foreground/30 focus-visible:border-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:border-primary-light aria-[current=page]:bg-foreground/[0.06]"
                    >
                      <span
                        className={`font-mono text-xs uppercase tracking-wide ${
                          selectedTopic === null ? 'text-primary-light' : 'text-foreground/65'
                        }`}
                      >
                        All
                      </span>
                      <span className="font-mono text-xs text-foreground">{posts.length}</span>
                    </Link>
                  </li>
                  {blogPostCategories.map(category => {
                    const count = topicCounts.get(category) ?? 0
                    if (count === 0) {
                      return null
                    }

                    return (
                      <li key={category}>
                        <Link
                          href={`/blog?topic=${category}`}
                          scroll={false}
                          aria-label={`${blogPostCategoryLabels[category]}: ${count} ${count === 1 ? 'post' : 'posts'}`}
                          aria-current={selectedTopic === category ? 'page' : undefined}
                          className="inline-flex h-9 items-center gap-2 rounded-md border border-foreground/12 bg-foreground/[0.03] px-3 transition-colors hover:border-foreground/30 focus-visible:border-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:border-primary-light aria-[current=page]:bg-foreground/[0.06]"
                        >
                          <span
                            className={`font-mono text-xs uppercase tracking-wide ${
                              selectedTopic === category ? 'text-primary-light' : 'text-foreground/65'
                            }`}
                          >
                            {blogPostCategoryLabels[category]}
                          </span>
                          <span className="font-mono text-xs text-foreground">{count}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </div>

            {!selectedTopic && featuredPost ? (
              <section className="mt-14" aria-labelledby="featured-post-heading">
                <h2
                  id="featured-post-heading"
                  className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-primary-light"
                >
                  Start here
                </h2>
                <BlogPostFeatured post={featuredPost} />
              </section>
            ) : null}

            <div className="mt-16">
              {[...postsByYear.entries()]
                .sort(([firstYear], [secondYear]) => secondYear - firstYear)
                .map(([year, yearPosts]) => (
                  <section key={year} className="mt-12 first:mt-0" aria-labelledby={`posts-${year}`}>
                    <h2
                      id={`posts-${year}`}
                      className="text-4xl font-semibold tracking-tight text-foreground tablet:text-5xl"
                    >
                      {year}
                    </h2>
                    <ul className="mt-4" aria-label={`Posts from ${year}`}>
                      {yearPosts.map(post => (
                        <li key={post.slug}>
                          <BlogPostCompact post={post} />
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
            </div>

            {archivePosts.length === 0 ? (
              <p className="mt-14 font-reading text-base text-foreground/70">No posts in this topic yet.</p>
            ) : null}
          </>
        ) : (
          <p className="mt-10 font-reading text-base text-foreground/70">{blogData.emptyStateDescription}</p>
        )}
      </section>
    </main>
  )
}
