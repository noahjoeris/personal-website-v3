export type PortfolioImageUrl = `/images/portfolio/${string}`

export type PortfolioProject = {
  slug: string
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
      shortDescription: 'Coretime marketplace for the Polkadot ecosystem.',
      description: `**Lastic** is the first **Polkadot coretime marketplace**, empowering users to trade, manage, and coordinate access to blockspace with greater flexibility and efficiency. I contributed to core logic, UX flows, and smart contract development, enabling both advanced coretime trading and collective coretime purchases.
      
      **Key features I worked on:**
      
      - 🧩 **Core interlacing:** Adjust how often a core is used—e.g., utilize every 2nd block and sell the remaining slots on the marketplace.
      - ⚡ **Core partitioning:** Split coretime at a chosen point into two separate NFTs that can be traded independently.
      - 🔐 **Escrow marketplace PoC:** Secure 2-of-3 multisig trading between Lastic, buyer, and seller—ensuring safe fund and coretime exchange.
      - 🚀 **Auto Teleport:** Automatically transfers DOT between the Relaychain and Coretime chain using XCM, reducing fragmentation and improving UX.
      - 🤝 **Coretime crowdfunding smart contract:** Built a production-ready Solidity contract enabling users to collectively crowdfund coretime purchases, fully tested with Foundry, deployed on Moonbeam, and usable to provide Polkadot’s economic security to parachains.`,
      links: ['https://github.com/velocitylabs-org/turtle', 'https://app.turtle.cool'],
      period: '2024-2026',
      projectType: 'Web App, Web3, Polkadot Ecosystem',
      techUsed: 'Typescript, React, Nextjs, Tailwind, Polkadot, XCM, Snowbridge',
      client: 'Velocity Labs',
      gallery: ['/images/portfolio/lastic/gallery1.webp'],
    },
  ],
} as const satisfies PortfolioData
