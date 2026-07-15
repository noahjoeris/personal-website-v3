import Link from 'next/link'

import { BlogPostCompact } from '@/components/blog-post-compact'
import { Section } from '@/components/section'
import { SectionHeading } from '@/components/section-heading'
import { SeeMoreButton } from '@/components/see-more-button'
import { getPublishedBlogPosts } from '@/lib/blog'

export async function BlogPreviewSection() {
  const posts = (await getPublishedBlogPosts()).slice(0, 3)

  if (posts.length === 0) {
    return null
  }

  return (
    <Section aria-label="Latest writing">
      <div className="mx-auto w-full max-w-5xl">
        <SectionHeading eyebrow="Latest" title="Writing" headingLevel="h2" className="mb-12 tablet:mb-16" />
        <ul className="mx-auto max-w-4xl">
          {posts.map(post => (
            <li key={post.slug}>
              <BlogPostCompact post={post} />
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <SeeMoreButton asChild>
            <Link href="/blog">Read all posts</Link>
          </SeeMoreButton>
        </div>
      </div>
    </Section>
  )
}
