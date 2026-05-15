import type { Metadata } from 'next'

import { BlogPostCompact } from '@/components/blog-post-compact'
import { Navbar } from '@/components/navbar'
import { SectionHeading } from '@/components/section-heading'
import { blogData } from '@/data/blog-data'
import { getPublishedBlogPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog',
  description: blogData.description,
}

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts()

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="mx-auto w-full max-w-4xl px-6 pb-20 pt-28 tablet:px-10 desktop:px-16">
        <SectionHeading eyebrow="Read my" title="Blog" headingLevel="h1" />
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-foreground/80 tablet:text-center tablet:text-lg">
          {blogData.description}
        </p>

        {posts.length > 0 ? (
          <div className="mt-14 grid gap-6">
            {posts.map(post => (
              <BlogPostCompact key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-foreground/55 tablet:text-base">
            {blogData.emptyStateDescription}
          </p>
        )}
      </section>
    </main>
  )
}
