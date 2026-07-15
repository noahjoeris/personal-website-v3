import { describe, expect, it } from 'vitest'

import { estimateBlogReadingMinutes, extractBlogHeadings, slugifyBlogHeading } from './blog-content'

describe('blog content helpers', () => {
  it('creates stable heading slugs', () => {
    expect(slugifyBlogHeading('3. Pick a project deliberately')).toBe('3-pick-a-project-deliberately')
    expect(slugifyBlogHeading('→ The CBDC Challenge')).toBe('the-cbdc-challenge')
  })

  it('extracts level-two and level-three headings after metadata', () => {
    const source = `export const metadata = defineBlogPostMetadata({});

## First **section**

### Detail

## Final section`

    expect(extractBlogHeadings(source)).toEqual([
      { id: 'first-section', level: 2, text: 'First section' },
      { id: 'detail', level: 3, text: 'Detail' },
      { id: 'final-section', level: 2, text: 'Final section' },
    ])
  })

  it('rejects duplicate heading IDs so table-of-contents links stay valid', () => {
    const source = `export const metadata = defineBlogPostMetadata({});

## Repeated heading

### Repeated heading`

    expect(() => extractBlogHeadings(source)).toThrow('Duplicate blog heading ID: repeated-heading')
  })

  it('estimates reading time from article body rather than metadata', () => {
    const articleWords = Array.from({ length: 221 }, () => 'word').join(' ')
    const source = `export const metadata = defineBlogPostMetadata({ title: 'ignored' });\n\n${articleWords}`

    expect(estimateBlogReadingMinutes(source)).toBe(2)
  })
})
