export type NavHref = '/' | '/about' | '/portfolio' | '/blog' | '/bitcoin-foss'
export type SocialLabel = 'X' | 'LinkedIn' | 'GitHub'
export type NavItem = LandingData['navigation'][number]
export type SocialLink = LandingData['socials'][number]

export type LandingData = {
  metadata: {
    title: string
    description: string
  }
  navigation: readonly {
    label: string
    href: NavHref
  }[]
  socials: readonly {
    label: SocialLabel
    iconSrc: `/icons/social/${string}.svg`
    href: `https://${string}`
  }[]
  hero: {
    srTitle: string
    signatureImgSrc: `/images/${string}`
    heroImgSrc: `/images/${string}`
    intro: {
      highlight: string
      text: string
    }
    tagline: string
    watermark: string
  }
}

export const landingData = {
  metadata: {
    title: 'Noah Joeris | Bitcoin Software Engineer',
    description: 'Cypherpunk. Open-source. Freedom tech.',
  },
  navigation: [
    {
      label: 'HOME',
      href: '/',
    },
    {
      label: 'ABOUT',
      href: '/about',
    },
    {
      label: 'PORTFOLIO',
      href: '/portfolio',
    },
    {
      label: 'BLOG',
      href: '/blog',
    },
    {
      label: 'Bitcoin OSS',
      href: '/bitcoin-foss',
    },
  ],
  socials: [
    {
      label: 'X',
      iconSrc: '/icons/social/x.svg',
      href: 'https://x.com/noahjoeris',
    },
    {
      label: 'LinkedIn',
      iconSrc: '/icons/social/linkedin.svg',
      href: 'https://www.linkedin.com/in/noahjoeris/',
    },
    {
      label: 'GitHub',
      iconSrc: '/icons/social/github.svg',
      href: 'https://github.com/noahjoeris',
    },
  ],
  hero: {
    srTitle: 'Noah Joeris - Bitcoin Software Engineer',
    signatureImgSrc: '/images/signature.png',
    heroImgSrc: '/images/noah-hero.avif',
    intro: {
      highlight: 'Building',
      text: 'Bitcoin software',
    },
    tagline: 'Cypherpunk. Open-source. Freedom tech.',
    watermark: 'NOAH JOERIS',
  },
} as const satisfies LandingData
