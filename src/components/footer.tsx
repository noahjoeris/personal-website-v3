import { AnimatedDivider } from '@/components/animated-divider'
import { MaskIcon } from '@/components/mask-icon'
import { landingData } from '@/data/landing-data'

const CONTACT_SOCIAL_LABELS = ['LinkedIn', 'X'] as const

export function Footer() {
  const contactSocials = CONTACT_SOCIAL_LABELS.flatMap(label => {
    const social = landingData.socials.find(item => item.label === label)
    return social ? [social] : []
  })

  return (
    <footer className="bg-background">
      <div className="px-5 pt-3 tablet:pt-4 tablet:px-10 desktop:px-16">
        <AnimatedDivider className="bg-foreground/20" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 pb-10 pt-7 tablet:px-10 tablet:pb-12 tablet:pt-8 desktop:px-16">
        <div className="flex flex-col gap-6 tablet:flex-row tablet:items-end tablet:justify-between">
          <section aria-labelledby="footer-contact-title" className="space-y-2">
            <h2 id="footer-contact-title" className="text-2xl font-medium uppercase text-foreground tablet:text-3xl">
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
                    <MaskIcon src={profile.iconSrc} className="h-4 w-4" />
                    {profile.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <p className="inline-flex w-fit items-center gap-2 text-xs uppercase tracking-[0.14em] text-foreground/70 tablet:text-sm">
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
