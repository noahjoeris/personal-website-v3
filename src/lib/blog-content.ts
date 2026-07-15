export type BlogHeading = {
  id: string
  level: 2 | 3
  text: string
}

const averageWordsPerMinute = 220

export function slugifyBlogHeading(value: string): string {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/[\s-]+/g, '-')
}

export function estimateBlogReadingMinutes(source: string): number {
  const body = getBlogPostBody(source)
  const words = body.match(/[\p{L}\p{N}]+(?:['’.-][\p{L}\p{N}]+)*/gu) ?? []

  return Math.max(1, Math.ceil(words.length / averageWordsPerMinute))
}

export function extractBlogHeadings(source: string): BlogHeading[] {
  const headings: BlogHeading[] = []
  const headingIds = new Set<string>()

  for (const line of getBlogPostBody(source).split('\n')) {
    const match = /^(##|###)\s+(.+?)\s*$/.exec(line)
    const marker = match?.[1]
    const rawText = match?.[2]
    if (!marker || !rawText) {
      continue
    }

    const text = stripInlineMarkdown(rawText)
    const baseId = slugifyBlogHeading(text)
    if (!baseId) {
      throw new Error(`Blog heading "${text}" must contain a letter or number`)
    }

    if (headingIds.has(baseId)) {
      throw new Error(`Duplicate blog heading ID: ${baseId}`)
    }

    headingIds.add(baseId)

    headings.push({
      id: baseId,
      level: marker === '##' ? 2 : 3,
      text,
    })
  }

  return headings
}

function getBlogPostBody(source: string): string {
  const metadataEnd = source.indexOf('});')
  return metadataEnd === -1 ? source : source.slice(metadataEnd + 3)
}

function stripInlineMarkdown(value: string): string {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .trim()
}
