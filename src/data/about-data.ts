export type AboutInterest = {
  title: string
  description: string
  imgSrc: `/images/about/${string}`
}

export type AboutValue = {
  numeral: string
  title: string
  epigram: string
  description: string
}

export type AboutMeta = {
  label: string
  value: string
}

export type AboutChapter = {
  num: string
  period: string
  tag: string
  place: string
  body: string
}

export type AboutData = {
  hero: {
    section: string
    topic: string
    name: string
    role: string
    portraitImgSrc: `/images/about/${string}`
    figLabel: string
    meta: readonly AboutMeta[]
    status: string
  }
  story: {
    section: string
    topic: string
    chapters: readonly AboutChapter[]
  }
  manifesto: {
    section: string
    topic: string
    primary: readonly string[]
    rule: string
    declaration: readonly string[]
    pillars: readonly string[]
    closer: string
    signature: string
  }
  bitcoin: {
    section: string
    eyebrow: string
    title: string
    lead: string
    body: string
    closer: string
    primaryImgSrc: `/images/about/${string}`
    secondaryImgSrc: `/images/about/${string}`
  }
  interests: {
    section: string
    eyebrow: string
    title: string
    items: readonly AboutInterest[]
  }
  values: {
    section: string
    topic: string
    items: readonly AboutValue[]
  }
}

export const aboutData = {
  hero: {
    section: '§ 01',
    topic: 'Identity',
    name: 'Noah Joeris',
    role: 'Full-Stack Software Engineer · Bitcoin-only',
    portraitImgSrc: '/images/about/me.webp',
    figLabel: 'Fig. 01 · N.J., on record 2026',
    meta: [
      { label: 'Role', value: 'Full-Stack Software Engineer' },
      { label: 'Field', value: 'Bitcoin Open Source' },
      { label: 'Stack', value: 'React · Rust · Bitcoin' },
    ],
    status: 'Status: Building · Location: Unknown · Mode: Open Source',
  },
  story: {
    section: '§ 02',
    topic: 'The Path',
    chapters: [
      {
        num: '01',
        period: '2019 / 2024',
        tag: 'Pre-crypto',
        place: 'Airbus · Germany',
        body: 'Almost five years at Airbus. Built an automated cyber-attack detection tool for the Security Operations Center and a company-wide innovation knowledge platform. Learned to ship serious software inside a serious organisation.',
      },
      {
        num: '02',
        period: '2024 / 2026',
        tag: 'Web3',
        place: 'Polkadot · Hong Kong / Remote',
        body: 'Polkadot Blockchain Academy graduate. Built Turtle, a universal bridge that moved over $10M, along with early blockspace marketplace tooling. Learned what works, what doesn’t, and where the real signal is. It’s why I’m Bitcoin-only now.',
      },
      {
        num: '03',
        period: 'Since 2026',
        tag: 'Present',
        place: 'Bitcoin · Open Source',
        body: 'Deep in the protocol. Contributing to BDK (Bitcoin Dev Kit) and building Reorg Playground for exploring fork and reorg behavior.',
      },
    ],
  },
  manifesto: {
    section: '§ 03',
    topic: 'Mission Brief',
    primary: ['Protect financial', 'freedom.', 'Challenge the broken', 'fiat system.'],
    rule: 'A mission, not a job',
    declaration: ['Bitcoin is the only chain', 'with a real shot at', 'lasting success.'],
    pillars: ['Strengthen Bitcoin', 'Contribute to open source', 'Live by cypherpunk values'],
    closer: 'Everything else is noise.',
    signature: 'NJ · 2026',
  },
  bitcoin: {
    section: '§ 04',
    eyebrow: 'Why',
    title: 'Bitcoin',
    lead: 'Fiat is a crime. Inflation is theft disguised as policy.',
    body: 'It forces people into gambling on markets just to keep up, widens inequality, and punishes anyone without assets. The poor pay first. Bitcoin is the antidote: separation of money and state, predictable monetary policy, incorruptible digital property. It gives people back control that was stolen from them long before they were born.',
    closer:
      'I tried the rest. Smart contract chains promise the world and ship complexity, oracle trust, and an endless parade of exploits. Bitcoin earns its conviction by doing less, harder. That’s the fight worth fighting.',
    primaryImgSrc: '/images/about/bitcoin1.webp',
    secondaryImgSrc: '/images/about/bitcoin2.webp',
  },
  interests: {
    section: '§ 05',
    eyebrow: 'Off the keyboard',
    title: 'Interests',
    items: [
      {
        title: 'Calisthenics',
        description:
          'I train to do the impossible: handstand push-ups, front levers, endless pull-ups. All to practice discipline. Extraordinary strength is just the side effect.',
        imgSrc: '/images/about/hobby1.webp',
      },
      {
        title: 'Biohacking',
        description:
          'I like feeling superhuman. Ice baths, Bulletproof diet, supplements, tracking everything. If it boosts my performance, I’m in.',
        imgSrc: '/images/about/hobby3.webp',
      },
      {
        title: 'Reading',
        description:
          'My curiosity doesn’t shut up: philosophy, Stoicism, Bitcoin, biohacking, tech, personal growth. Books that shaped me: Meditations, Broken Money, Letting Go, The Book of Satoshi.',
        imgSrc: '/images/about/hobby2.webp',
      },
    ],
  },
  values: {
    section: '§ 06',
    topic: 'Code of Conduct',
    items: [
      {
        numeral: 'I',
        title: 'Curiosity',
        epigram: 'Refuse to stagnate.',
        description: 'Learn aggressively and evolve relentlessly. Stronger, smarter, harder to stop.',
      },
      {
        numeral: 'II',
        title: 'Pragmatism',
        epigram: 'Move fast. Build hard.',
        description:
          'Results talk; everything else is noise. Keep the circle full of people who take action, not make excuses.',
      },
      {
        numeral: 'III',
        title: 'Excellence',
        epigram: 'World-class or nothing.',
        description: 'High standards. Discipline. Mastery. That’s the expectation, not the goal.',
      },
      {
        numeral: 'IV',
        title: 'Justice',
        epigram: 'Virtue is its own reward.',
        description:
          'Living beyond myself, choosing virtue, helping others, doing the right thing even when it’s harder. The Stoic path.',
      },
    ],
  },
} as const satisfies AboutData
