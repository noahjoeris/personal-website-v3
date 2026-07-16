import { describe, expect, it } from 'vitest'

import { type PortfolioMedia, portfolioData } from '@/data/portfolio-data'

describe('portfolioData', () => {
  it('uses unique project slugs', () => {
    const slugs = portfolioData.projects.map(project => project.slug)

    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('keeps public links labeled, secure, and assigned to one project', () => {
    const links = portfolioData.projects.flatMap(project =>
      project.links.map(link => ({ project: project.slug, ...link })),
    )

    for (const link of links) {
      expect(link.label.trim()).not.toBe('')
      expect(new URL(link.href).protocol).toBe('https:')
    }

    const hrefs = links.map(link => link.href)
    expect(new Set(hrefs).size).toBe(hrefs.length)
  })

  it('includes project and technology classifications', () => {
    for (const project of portfolioData.projects) {
      expect(project.projectType.length).toBeGreaterThan(0)
      expect(project.techUsed.length).toBeGreaterThan(0)
    }
  })

  it('provides accessible metadata for every gallery item', () => {
    for (const project of portfolioData.projects) {
      for (const media of project.gallery as readonly PortfolioMedia[]) {
        expect(media.alt.trim()).not.toBe('')
        expect(media.caption.trim()).not.toBe('')
        expect(media.width).toBeGreaterThan(0)
        expect(media.height).toBeGreaterThan(0)
      }
    }
  })
})
