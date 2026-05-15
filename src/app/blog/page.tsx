import type { Metadata } from 'next'

import { BlogPostCompact } from '@/components/blog-post-compact'
import { Navbar } from '@/components/navbar'
import { blogData } from '@/data/blog-data'
import { getPublishedBlogPosts } from '@/utils/blog'

export const metadata: Metadata = {
  title: 'Blog',
  description: blogData.description,
}

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts()

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="mx-auto w-full max-w-4xl px-6 pb-20 pt-28 tablet:px-10 desktop:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg uppercase">Read my</p>
          <h1 className="text-6xl leading-none tracking-tight text-foreground uppercase tablet:text-7xl desktop:text-[7.25rem]">
            Blog
          </h1>
        </div>
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
