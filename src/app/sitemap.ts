import type { MetadataRoute } from 'next'

import { portfolioData } from '@/data/portfolio-data'
import { getPublishedBlogPosts } from '@/lib/blog'
import { siteUrl } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/bitcoin-foss`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${siteUrl}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/portfolio`, changeFrequency: 'weekly', priority: 0.8 },
  ]

  const portfolioRoutes: MetadataRoute.Sitemap = portfolioData.projects.map(project => ({
    url: `${siteUrl}/portfolio/${project.slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const blogRoutes: MetadataRoute.Sitemap = (await getPublishedBlogPosts()).map(post => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...portfolioRoutes, ...blogRoutes]
}
