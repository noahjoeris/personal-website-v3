import 'server-only'

import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { type ComponentType, cache } from 'react'

import type { BlogPostMetadata } from '@/data/blog-data'

type BlogPostModule = {
  default: ComponentType
  metadata: BlogPostMetadata
}

type BlogPostFileName = `${string}.mdx`

const blogPostsDirectoryPath = path.join(process.cwd(), 'src/content')
const blogPostFileExtension = '.mdx'

export type BlogPostSlug = string

export type BlogPostSummary = BlogPostMetadata & {
  slug: BlogPostSlug
}

export type BlogPost = BlogPostSummary & {
  Content: ComponentType
}

export function formatBlogPostDate(date: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'long',
  }).format(new Date(date))
}

function isBlogPostFileName(fileName: string): fileName is BlogPostFileName {
  return fileName.endsWith(blogPostFileExtension)
}

function getSlugFromFileName(fileName: BlogPostFileName): BlogPostSlug {
  return fileName.slice(0, -blogPostFileExtension.length)
}

async function loadBlogPostModule(fileName: BlogPostFileName): Promise<BlogPostModule> {
  return (await import(`@/content/${fileName}`)) as BlogPostModule
}

function comparePostsByPublishDateDescending(firstPost: BlogPostSummary, secondPost: BlogPostSummary) {
  return new Date(secondPost.publishedAt).getTime() - new Date(firstPost.publishedAt).getTime()
}

function isPublishedPost(post: BlogPostSummary) {
  return post.status === 'published'
}

const loadAllBlogPosts = cache(async (): Promise<BlogPost[]> => {
  const fileNames = await readdir(blogPostsDirectoryPath)
  const blogPostFileNames = fileNames.filter(isBlogPostFileName)
  const posts = await Promise.all(
    blogPostFileNames.map(async fileName => {
      const module = await loadBlogPostModule(fileName)

      return {
        slug: getSlugFromFileName(fileName),
        ...module.metadata,
        Content: module.default,
      }
    }),
  )

  return posts.sort(comparePostsByPublishDateDescending)
})

export async function getPublishedBlogPosts(): Promise<BlogPostSummary[]> {
  return (await loadAllBlogPosts()).filter(isPublishedPost).map(({ Content: _content, ...postPreview }) => postPreview)
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const publishedPosts = (await loadAllBlogPosts()).filter(isPublishedPost)

  return publishedPosts.find(post => post.slug === slug) ?? null
}
