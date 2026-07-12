export type PortfolioImageUrl = `/images/portfolio/${string}`

export type PortfolioProject = {
  slug: string
  name: string
  imgUrl: PortfolioImageUrl
  shortDescription: string
  description?: string
  links: readonly string[]
  period: string
  projectType: string
  techUsed: string
  client?: string
  gallery: readonly PortfolioImageUrl[]
}

export type PortfolioData = {
  projects: readonly PortfolioProject[]
}

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  return portfolioData.projects.find(p => p.slug === slug)
}

export const portfolioData = {
  projects: [
    {
      slug: 'reorg-playground',
      name: 'Reorg Playground',
      imgUrl: '/images/portfolio/reorg-playground/reorg.webp',
      shortDescription: 'Bitcoin tool for exploring forks, tip divergence, and reorg behavior.',
      description: `**Reorg Playground** is a **Bitcoin developer tool** for exploring forks, tip divergence, and reorg behavior across multiple node backends. Deeper reorgs are rare on the live network, which lets fork/reorg edge cases slip through pre-production testing in wallets, explorers, and Bitcoin-integrated systems. With Reorg Playground, you can watch network state in near real time and deliberately produce blocks, isolate nodes, and create competing branches in development environments (Regtest and custom Signet).

A hosted view-only deployment is available at [reorgplayground.app](https://reorgplayground.app) for observing live Mainnet and Testnet state.

Key features:
* 🪵 Interactive block-header graph with forks, competing tips, and collapsible sections
* 🔌 Multi-backend node observation: Bitcoin Core, Electrum, Esplora, btcd
* 📈 Observed stale-rate metric with configurable rolling windows
* ⚡ Trigger Reorg button — pick a node and depth, create a reorg in two clicks (Regtest & custom Signet)
* 🕸️ Node Connection Manager — inspect peer links, shape P2P topology, isolate nodes, toggle networking
* ⚙️ Config-driven networks and nodes via \`config.toml\`, header history persisted in SQLite`,
      links: ['https://github.com/noahjoeris/reorg-playground', 'https://reorgplayground.app'],
      period: 'Feb 2026 - Present',
      projectType: 'Bitcoin, Developer Tool, Open Source',
      techUsed: 'Rust, Axum, Tokio, SQLite, Typescript, React, Vite, Tailwind, shadcn/ui, React Flow',
      gallery: [],
    },
    {
      slug: 'bdk',
      name: 'Bitcoin Dev Kit (BDK)',
      imgUrl: '/images/portfolio/bdk/bdk.png',
      shortDescription: 'Open-source contributions to Bitcoin wallet development libraries.',
      description: `Bitcoin Dev Kit (BDK) is an open-source collection of Rust libraries for building Bitcoin wallets and applications. As a contributor, I develop new features and provide ongoing maintenance.`,
      links: ['https://github.com/bitcoindevkit'],
      period: '2026 - Present',
      projectType: 'Bitcoin, Open Source, Wallet Development',
      techUsed: 'Rust, Bitcoin',
      gallery: [],
    },
    {
      slug: 'turtle',
      name: 'Turtle',
      imgUrl: '/images/portfolio/turtle/turtle.svg',
      shortDescription: 'Universal token transfer app for the Polkadot ecosystem',
      description: `Turtle is a universal token transfer app built for the Polkadot ecosystem. It connects Polkadot with Ethereum and Arbitrum, supporting bridging, cross-chain swaps, and on/off ramps through a clean, unified interface. Users can swap and transfer tokens in one go, and dApps can integrate Turtle easily through its embeddable widget.

Key features:
* 🌉 Ethereum ↔ Polkadot ↔ Arbitrum bridging
* 🔁 Cross-parachain XCM transfers
* 💧 Token swaps via Hydration DEX & Chainflip
* 💳 On/off ramps powered by Meld
* ⚙️ Combined swap + transfer in one action
* 🧩 Widget integration for seamless dApp embedding`,
      links: ['https://github.com/velocitylabs-org/turtle', 'https://app.turtle.cool'],
      period: 'Apr 2024 - Jan 2026',
      projectType: 'Web App, Web3, Polkadot Ecosystem',
      techUsed: 'Typescript, React, Nextjs, Tailwind, Polkadot, XCM, Snowbridge',
      client: 'Velocity Labs',
      gallery: [
        '/images/portfolio/turtle/gallery1.gif',
        '/images/portfolio/turtle/gallery2.gif',
        '/images/portfolio/turtle/gallery3.gif',
        '/images/portfolio/turtle/gallery4.webp',
        '/images/portfolio/turtle/gallery5.webp',
        '/images/portfolio/turtle/gallery6.webp',
      ],
    },
    {
      slug: 'lastic',
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
      period: 'Mar 2024 - Jul 2024',
      projectType: 'Web3, Web app, Polkadot Ecosystem, Smart Contract',
      techUsed: 'Typescript, React, Nextjs, Tailwind, Polkadot, XCM, Solidity, Foundry',
      client: 'Velocity Labs',
      gallery: ['/images/portfolio/lastic/gallery1.webp'],
    },
    {
      slug: 'pba',
      name: 'PBA Projects',
      imgUrl: '/images/portfolio/pba/pba.webp',
      shortDescription: 'Projects I built at Polkadot Blockchain Academy',
      description: `**Polkadot Blockchain Academy (Hong Kong)** — an intensive **5-week, project-heavy program** in blockchain engineering, with full-day sessions six days a week covering advanced topics in cryptography, consensus, and Rust-based blockchain development. The program was graded, and I graduated **among the top 10 participants (out of 100+)**. I worked on the following Rust projects:

Key projects:
* 🔓 Many-Time Pad Cracker: Cracked reused OTP encryptions to explore cryptographic vulnerabilities.
* 🔗 Custom Blockchain: Built from scratch with its own consensus and data structure layer.
* 🏗️ UTXO Chain Node: Developed a node supporting chain reorgs, utxo management, and state consistency.
* 🪙 Multi-Token Treasury Pallet (Substrate): Treasury designed for managing multiple tokens and spend proposals.
* 🌳 Merkle Multi-Proof Generator: Built efficient verification proofs for multiple claims in one Merkle tree.`,
      links: [],
      period: 'Jan 2024 - Feb 2024',
      projectType: 'Blockchain Infrastructure, Cryptography',
      techUsed: 'Rust, Substrate, Polkadot, XCM',
      gallery: [],
    },
    {
      slug: 'testing-lab',
      name: 'Testing Lab',
      imgUrl: '/images/portfolio/testing-lab/testing-lab.jpg',
      shortDescription: 'Cyber-attack detection testing tool for Airbus SOC',
      description: `**Use Case Factory Testing Lab** is an internal tool built for the **Airbus Security Operations Center (SOC)** to validate and continuously test cyber-attack detection use cases. It allows SOC analysts to select real-world attack scenarios, execute them on controlled test machines, and verify whether existing detection rules still trigger correctly in **Splunk**. I led the **product and technical design** and developed the **frontend**.

Key features:
* ⚔️ Attack selection & execution: Choose specific cyber-attack scenarios to test SOC detection rules
* 📊 Monitoring dashboard: Track pending and running tests, re-run or skip executions, and download PDF reports
* 🤖 Automated execution: Automatically run supported attacks on dedicated test machines and monitor their detection
* 🎯 Manual execution flows: Step-by-step guidance for attacks requiring human interaction
* 📄 Reporting: Generate PDF reports summarizing detection success and coverage
* 🛡️ MITRE ATT&CK mapping: Test and validate detection rules against standardized attack techniques`,
      links: [],
      period: 'Sep 2020 - Mar 2021',
      projectType: 'Web App, Cybersecurity, Security Operations Center',
      techUsed: 'Typescript, React, MUI, Redux, Go',
      client: 'Airbus',
      gallery: [],
    },
    {
      slug: 'innovation-hub',
      name: 'Innovation Hub',
      imgUrl: '/images/portfolio/innovationhub/innovationhub.webp',
      shortDescription: 'Knowledge-sharing platform for Airbus',
      description: `InnovationHub is an **Airbus internal knowledge-sharing platform** built to connect experts, managers, and innovators across the company around emerging technologies like blockchain, AI, quantum resistance, and VR. It helped teams communicate innovation projects, avoid duplicate efforts, and quickly find the right experts in disruptive fields. I **led the product design** and **developed the React frontend**.

Key features:
* 🚀 Projects, Spaces, and Experts pages for presenting initiatives, locations, and people
* 🔍 Advanced search across Projects, Experts, Spaces, Questions, and Topics
* 🧠 Q&A system for sharing and reusing knowledge on emerging technologies
* 🖥️ Event display mode showing project slideshows at Airbus events
* 🤝 Improved company-wide collaboration and visibility across innovation efforts`,
      links: [],
      period: 'Apr 2023 - Apr 2024',
      projectType: 'Web App, Cloud',
      techUsed: 'AWS, Typescript, React, Nextjs, MUI, Zustand',
      client: 'Airbus',
      gallery: [],
    },
  ],
} as const satisfies PortfolioData
