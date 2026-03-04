export type PortfolioImageUrl = `/images/portfolio/${string}`

export type PortfolioProject = {
  name: string
  imgUrl: PortfolioImageUrl
  shortDescription: string
  description: string
  links: readonly string[]
  period: string
  projectType: string
  techUsed: string
  client: string
  gallery: readonly PortfolioImageUrl[]
}

export type PortfolioData = {
  projects: readonly PortfolioProject[]
}

export const portfolioData = {
  projects: [
    {
      name: 'Turtle',
      imgUrl: '/images/portfolio/turtle/turtle.svg',
      shortDescription: 'Universal token transfer app for the Polkadot ecosystem',
      description: `todo`,
      links: ['https://github.com/velocitylabs-org/turtle', 'https://app.turtle.cool'],
      period: '2024-2026',
      projectType: 'Web App, Web3, Polkadot Ecosystem',
      techUsed: 'Typescript, React, Nextjs, Tailwind, Polkadot, XCM, Snowbridge',
      client: 'Velocity Labs',
      gallery: ['/images/portfolio/turtle/gallery1.gif'],
    },
    {
      name: 'Lastic',
      imgUrl: '/images/portfolio/lastic/lastic.png',
      shortDescription: 'Universal token transfer app for the Polkadot ecosystem',
      description: `todo`,
      links: ['https://github.com/velocitylabs-org/turtle', 'https://app.turtle.cool'],
      period: '2024-2026',
      projectType: 'Web App, Web3, Polkadot Ecosystem',
      techUsed: 'Typescript, React, Nextjs, Tailwind, Polkadot, XCM, Snowbridge',
      client: 'Velocity Labs',
      gallery: ['/images/portfolio/lastic/gallery1.webp'],
    },
  ],
} as const satisfies PortfolioData
