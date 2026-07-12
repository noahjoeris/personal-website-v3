export type AboutInterest = {
  number: string
  title: string
  description: string
  imgSrc: `/images/about/${string}`
}

export type AboutPrinciple = {
  number: string
  title: string
}

export type AboutValue = {
  numeral: string
  title: string
  epigram: string
  description: string
}

export type AboutChapter = {
  number: string
  period: string
  place: string
  title: string
  body: string
}

export type AboutData = {
  hero: {
    name: string
    title: readonly [string, string]
    intro: string
    portraitImgSrc: `/images/about/${string}`
    status: string
    signals: readonly string[]
  }
  story: {
    title: string
    introduction: string
    chapters: readonly AboutChapter[]
  }
  manifesto: {
    title: readonly [string, string]
    body: string
    conviction: string
    closer: string
    principles: readonly AboutPrinciple[]
    signoff: string
    imgSrc: `/images/about/${string}`
  }
  interests: {
    title: string
    items: readonly AboutInterest[]
  }
  values: {
    title: string
    items: readonly AboutValue[]
    closer: readonly [string, string]
  }
}

export const aboutData = {
  hero: {
    name: 'Noah Joeris',
    title: ['Noah', 'Joeris'],
    intro: 'Bitcoin Software Engineer',
    portraitImgSrc: '/images/about/me.webp',
    status: 'Status: Building',
    signals: ['Bitcoin open source', 'React + Rust'],
  },
  story: {
    title: 'Career path.',
    introduction: 'From Airbus cybersecurity and Web3 to Bitcoin open source.',
    chapters: [
      {
        number: '01',
        period: '2019—2024',
        place: 'Germany',
        title: 'Airbus',
        body: 'Almost five years at Airbus. Built an automated cyber-attack detection tool for the Security Operations Center and a company-wide innovation knowledge platform. Learned to ship serious software inside a serious organisation.',
      },
      {
        number: '02',
        period: '2024—2026',
        place: 'Remote',
        title: 'Polkadot',
        body: 'Polkadot Blockchain Academy graduate. Built Turtle, a universal bridge that moved over $10M, along with early blockspace marketplace tooling. Learned what works, what doesn’t, and where the real signal is. It’s why I’m Bitcoin-only now.',
      },
      {
        number: '03',
        period: 'Since 2026',
        place: 'Open source',
        title: 'Bitcoin',
        body: 'Completed Chaincode Labs’ BOSS Challenge in 2026, which brought me into Bitcoin open-source development. Now contributing to BDK (Bitcoin Dev Kit).',
      },
    ],
  },
  manifesto: {
    title: ['Why', 'Bitcoin.'],
    body: 'Fiat is a crime. Inflation is theft disguised as policy.',
    conviction:
      'It forces people into gambling on markets just to keep up, widens inequality, and punishes anyone without assets. The poor pay first. Bitcoin is the antidote: separation of money and state, predictable monetary policy, incorruptible digital property. It gives people back control that was stolen from them long before they were born.',
    closer:
      'I tried the rest. Smart contract chains promise the world and ship complexity, oracle trust, and an endless parade of exploits. Bitcoin earns its conviction by doing less, harder. That’s the fight worth fighting.',
    principles: [
      { number: '01', title: 'Strengthen Bitcoin' },
      { number: '02', title: 'Contribute to open source' },
      { number: '03', title: 'Live by cypherpunk values' },
    ],
    signoff: 'Everything else is noise.',
    imgSrc: '/images/about/bitcoin1.webp',
  },
  interests: {
    title: 'Interests.',
    items: [
      {
        number: '01',
        title: 'Calisthenics',
        description:
          'I train to do the impossible: handstand push-ups, front levers, endless pull-ups. All to practice discipline. Extraordinary strength is just the side effect.',
        imgSrc: '/images/about/hobby1.webp',
      },
      {
        number: '02',
        title: 'Biohacking',
        description:
          'I like feeling superhuman. Ice baths, Bulletproof diet, supplements, tracking everything. If it boosts my performance, I’m in.',
        imgSrc: '/images/about/hobby3.webp',
      },
      {
        number: '03',
        title: 'Reading',
        description:
          'My curiosity doesn’t shut up: philosophy, Stoicism, Bitcoin, biohacking, tech, personal growth. Books that shaped me: Meditations, Broken Money, Letting Go, The Book of Satoshi.',
        imgSrc: '/images/about/hobby2.webp',
      },
    ],
  },
  values: {
    title: 'Values.',
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
    closer: ['Keep moving.', 'Keep questioning.'],
  },
} as const satisfies AboutData
