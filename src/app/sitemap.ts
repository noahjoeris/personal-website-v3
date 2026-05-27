import type { MetadataRoute } from 'next'

import { portfolioData } from '@/data/portfolio-data'
import { getPublishedBlogPosts } from '@/lib/blog'
import { siteUrl } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/bitcoin-foss`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${siteUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/portfolio`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ]

  const portfolioRoutes: MetadataRoute.Sitemap = portfolioData.projects.map(project => ({
    url: `${siteUrl}/portfolio/${project.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const blogRoutes: MetadataRoute.Sitemap = (await getPublishedBlogPosts()).map(post => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...portfolioRoutes, ...blogRoutes]
}
