import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BlogPostCoverImage } from '@/components/blog-post-cover-image'
import { BlogPostFooter } from '@/components/blog-post-footer'
import { BlogTableOfContents } from '@/components/blog-table-of-contents'
import { Navbar } from '@/components/navbar'
import { blogData, blogPostCategoryLabels } from '@/data/blog-data'
import { formatBlogPostDate, getPublishedBlogPostBySlug, getPublishedBlogPosts } from '@/lib/blog'
import { siteUrl } from '@/lib/site'

type BlogPostPageProps = {
  params: Promise<{
    slug: string
  }>
}

export const dynamicParams = false

export async function generateStaticParams() {
  return (await getPublishedBlogPosts()).map(post => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedBlogPostBySlug(slug)

  if (!post) {
    return {}
  }

  const socialImage = post.coverImageSrc ?? blogData.socialImageSrc

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: blogData.author, url: blogData.authorHref }],
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: `/blog/${slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [blogData.author],
      tags: [...post.tags],
      images: [{ url: socialImage, alt: post.coverImageSrc ? post.title : blogData.author }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [socialImage],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const [post, posts] = await Promise.all([getPublishedBlogPostBySlug(slug), getPublishedBlogPosts()])

  if (!post) {
    notFound()
  }

  const currentPostIndex = posts.findIndex(candidate => candidate.slug === post.slug)
  const newerPost = currentPostIndex > 0 ? posts[currentPostIndex - 1] : undefined
  const olderPost = currentPostIndex >= 0 ? posts[currentPostIndex + 1] : undefined
  const shouldShowTableOfContents = post.headings.length >= 4
  const socialImage = post.coverImageSrc ?? blogData.socialImageSrc
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: canonicalUrl,
    headline: post.title,
    description: post.description,
    image: [`${siteUrl}${socialImage}`],
    datePublished: post.publishedAt,
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    author: {
      '@type': 'Person',
      name: blogData.author,
      url: `${siteUrl}${blogData.authorHref}`,
    },
  }
  const serializedArticleJsonLd = JSON.stringify(articleJsonLd).replace(/</g, '\\u003c')
  const { Content } = post

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="mx-auto w-full max-w-6xl px-6 pb-24 pt-28 tablet:px-10">
        <Link
          href="/blog"
          className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium uppercase tracking-[0.2em] text-foreground/60 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          <span aria-hidden="true">←</span> Back to blog
        </Link>

        <article aria-labelledby="post-title">
          <header className="mx-auto mt-6 max-w-5xl border-b border-foreground/12 pb-7">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs uppercase tracking-[0.15em] text-foreground/60 tablet:text-sm">
              <Link
                href={blogData.authorHref}
                className="rounded-sm text-foreground/75 underline decoration-foreground/25 underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {blogData.author}
              </Link>
              <span aria-hidden="true">·</span>
              <time dateTime={post.publishedAt}>{formatBlogPostDate(post.publishedAt)}</time>
              {post.updatedAt ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>
                    Updated <time dateTime={post.updatedAt}>{formatBlogPostDate(post.updatedAt)}</time>
                  </span>
                </>
              ) : null}
              <span aria-hidden="true">·</span>
              <span>{post.readingMinutes} min read</span>
            </div>

            <h1
              id="post-title"
              className="mt-4 text-4xl font-semibold leading-[1.04] tracking-tight text-foreground text-balance tablet:text-[3.5rem]"
            >
              {post.title}
            </h1>
            <p className="mt-4 max-w-2xl font-reading text-base leading-relaxed text-foreground/75 tablet:text-lg">
              {post.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.14em]">
              <Link
                href={`/blog?topic=${post.category}`}
                className="rounded-sm text-primary-light underline decoration-primary/35 underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {blogPostCategoryLabels[post.category]}
              </Link>
              <ul className="flex flex-wrap gap-x-3 gap-y-1 text-foreground/50" aria-label="Post tags">
                {post.tags.map(tag => (
                  <li key={tag}>#{tag}</li>
                ))}
              </ul>
            </div>
          </header>

          {post.coverImageSrc ? (
            <BlogPostCoverImage
              src={post.coverImageSrc}
              priority
              className="mx-auto mt-8 max-w-3xl rounded-xl border-foreground/12"
            />
          ) : null}

          {shouldShowTableOfContents ? <BlogTableOfContents headings={post.headings} /> : null}

          <div className="mx-auto mt-12 max-w-[57ch] font-reading text-lg leading-[1.75] text-foreground/[0.88] [text-wrap:pretty]">
            <Content />
          </div>

          <BlogPostFooter newerPost={newerPost} olderPost={olderPost} />
        </article>

        <script type="application/ld+json">{serializedArticleJsonLd}</script>
      </section>
    </main>
  )
}
