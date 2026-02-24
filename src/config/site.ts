export type NavItem = {
  label: string
  href: '/' | '/about' | '/portfolio' | '/blog'
}

export type SocialLink = {
  label: 'X' | 'LinkedIn' | 'GitHub'
  href: string
  ariaLabel: string
}

export type SiteConfig = {
  nav: readonly NavItem[]
  social: readonly SocialLink[]
}

export const siteConfig = {
  nav: [
    { label: 'HOME', href: '/' },
    { label: 'ABOUT ME', href: '/about' },
    { label: 'PORTFOLIO', href: '/portfolio' },
    { label: 'BLOG', href: '/blog' },
  ],
  // TODO: Replace placeholder social profile URLs before publishing.
  social: [
    { label: 'X', href: 'https://x.com/', ariaLabel: 'X (Twitter)' },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com/',
      ariaLabel: 'LinkedIn',
    },
    { label: 'GitHub', href: 'https://github.com/', ariaLabel: 'GitHub' },
  ],
} satisfies SiteConfig
