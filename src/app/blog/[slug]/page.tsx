import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BlogPostCoverImage } from '@/components/blog-post-cover-image'
import { Navbar } from '@/components/navbar'
import { blogData } from '@/data/blog-data'
import { formatBlogPostDate, getPublishedBlogPostBySlug, getPublishedBlogPosts } from '@/utils/blog'

import styles from './blog-post-content.module.css'

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

  const ogImages = post.coverImageSrc ? [{ url: post.coverImageSrc }] : undefined

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: `/blog/${slug}`,
      publishedTime: post.publishedAt,
      authors: [blogData.author],
      tags: [...post.tags],
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: ogImages,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPublishedBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const { Content } = post

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="mx-auto w-full max-w-4xl px-6 pb-20 pt-28 tablet:px-10 desktop:px-16">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm font-medium uppercase tracking-[0.24em] text-foreground/55 transition-colors hover:text-foreground"
        >
          Back to blog
        </Link>

        {post.coverImageSrc ? (
          <BlogPostCoverImage
            src={post.coverImageSrc}
            title={post.title}
            priority
            className="mx-auto mt-8 max-w-2xl rounded-xl border-foreground/12"
          />
        ) : null}

        <header className="mx-auto mt-6 max-w-3xl border-b border-foreground/10 pb-6">
          <p className="text-sm uppercase tracking-[0.24em] text-foreground/55">
            {formatBlogPostDate(post.publishedAt)}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground tablet:text-[3.25rem]">
            {post.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground/80 tablet:text-lg">
            {post.description}
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <li
                key={tag}
                className="rounded-full border border-foreground/15 px-3 py-1 text-[0.7rem] uppercase tracking-[0.18em] text-foreground/65"
              >
                {tag}
              </li>
            ))}
          </ul>
        </header>

        <article className={styles.content}>
          <Content />
        </article>
      </section>
    </main>
  )
}
