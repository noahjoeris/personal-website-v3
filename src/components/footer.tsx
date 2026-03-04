import type { CSSProperties } from 'react'

import { AnimatedDivider } from '@/components/animated-divider'
import { landingData, type SocialLink } from '@/data/landing-data'

function getSocialIconMask(iconSrc: SocialLink['iconSrc']): CSSProperties {
  const maskUrl = `url("${iconSrc}")`

  return {
    WebkitMaskImage: maskUrl,
    maskImage: maskUrl,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
  }
}

export function Footer() {
  const contactSocials = (['LinkedIn', 'X'] as const).flatMap(label => {
    const social = landingData.socials.find(item => item.label === label)
    return social ? [social] : []
  })

  return (
    <footer className="bg-background">
      <div className="px-5 pt-3 sm:px-6 sm:pt-4 md:px-10 lg:px-16">
        <AnimatedDivider className="bg-foreground/20" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 pb-10 pt-7 sm:px-6 md:px-10 md:pb-12 md:pt-8 lg:px-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <section aria-labelledby="footer-contact-title" className="space-y-2">
            <h2 id="footer-contact-title" className="text-2xl font-medium uppercase text-foreground md:text-3xl">
              Contact me
            </h2>

            <ul className="flex flex-col items-start gap-1">
              {contactSocials.map(profile => (
                <li key={profile.href}>
                  <a
                    href={profile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-base uppercase tracking-[0.04em] text-foreground/70 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <span
                      className="h-4 w-4 bg-current"
                      style={getSocialIconMask(profile.iconSrc)}
                      aria-hidden="true"
                    />
                    {profile.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <p className="inline-flex w-fit items-center gap-2 text-xs uppercase tracking-[0.14em] text-foreground/70 md:text-sm">
            <span>Made with</span>
            <span className="text-foreground/90" aria-hidden="true">
              ♥
            </span>
            <span>in React</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
