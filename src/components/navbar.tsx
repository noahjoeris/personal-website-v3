'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import { MaskIcon } from '@/components/mask-icon'
import type { NavItem } from '@/data/landing-data'
import { landingData } from '@/data/landing-data'
import { cn } from '@/lib/utils'

const mobileMenuId = 'mobile-nav-menu'
const mobileMenuLabelId = 'mobile-nav-menu-label'

function isActivePath(pathname: string, href: NavItem['href']) {
  if (href === '/') {
    return pathname === '/'
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Navbar() {
  const pathname = usePathname()
  const shouldReduceMotion = useReducedMotion()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mobileMenuPanelRef = useRef<HTMLDivElement>(null)
  const menuToggleRef = useRef<HTMLButtonElement>(null)
  const menuCloseRef = useRef<HTMLButtonElement>(null)
  const wasMobileMenuOpen = useRef(false)

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node | null
      if (!target) {
        return
      }

      if (mobileMenuPanelRef.current?.contains(target)) {
        return
      }

      setIsMobileMenuOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (isMobileMenuOpen) {
      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      menuCloseRef.current?.focus()
      wasMobileMenuOpen.current = true

      return () => {
        document.body.style.overflow = previousOverflow
      }
    }

    if (wasMobileMenuOpen.current) {
      menuToggleRef.current?.focus()
      wasMobileMenuOpen.current = false
    }
  }, [isMobileMenuOpen])

  return (
    <motion.header
      initial={shouldReduceMotion ? false : { opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="absolute inset-x-0 top-0 z-[var(--z-nav)]"
    >
      <div className="px-5 py-3 tablet:py-4 tablet:px-10 desktop:px-16">
        <nav className="relative flex items-center justify-between" aria-label="Main navigation">
          <ul className="hidden items-center gap-5 tablet:flex tablet:gap-7">
            {landingData.navigation.map(link => {
              const isActive = isActivePath(pathname, link.href)

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'text-lg font-medium transition-colors',
                      isActive ? 'text-foreground' : 'text-foreground/70 hover:text-foreground',
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="ml-auto flex items-center gap-3 tablet:gap-4">
            <ul className="hidden items-center gap-3 tablet:flex tablet:gap-4">
              {landingData.socials.map(social => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/70 transition-colors hover:text-foreground focus-visible:text-foreground"
                    aria-label={`${social.label} (opens in new tab)`}
                  >
                    <MaskIcon src={social.iconSrc} className="h-5 w-5" />
                  </a>
                </li>
              ))}
            </ul>

            <button
              ref={menuToggleRef}
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center text-foreground/90 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring tablet:hidden"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls={mobileMenuId}
              onClick={() => {
                setIsMobileMenuOpen(current => !current)
              }}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={isMobileMenuOpen ? 'M5 5l14 14M19 5L5 19' : 'M4 7h16M4 12h16M4 17h16'} />
              </svg>
            </button>
          </div>
        </nav>

        <div className="mt-3 h-px w-full bg-foreground/20 tablet:mt-4" />
      </div>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            id={mobileMenuId}
            ref={mobileMenuPanelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={mobileMenuLabelId}
            className="fixed inset-x-0 top-0 z-[var(--z-mobile-menu)] border-b border-foreground/35 bg-background/25 px-5 pb-8 pt-5 text-foreground backdrop-blur-[1.5px] tablet:hidden"
            initial={shouldReduceMotion ? false : { opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <h2 id={mobileMenuLabelId} className="sr-only">
              Navigation menu
            </h2>

            <div className="flex justify-end">
              <button
                ref={menuCloseRef}
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center text-foreground/90 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close navigation menu"
                aria-expanded={true}
                aria-controls={mobileMenuId}
                onClick={closeMobileMenu}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 5l14 14M19 5L5 19" />
                </svg>
              </button>
            </div>

            <div className="mt-5 h-px w-full bg-foreground/35" />

            <motion.ul
              className="mt-8 space-y-5"
              initial="closed"
              animate="open"
              variants={{
                closed: { opacity: 0 },
                open: {
                  opacity: 1,
                  transition: { delayChildren: 0.03, staggerChildren: 0.045 },
                },
              }}
            >
              {landingData.navigation.map(link => {
                const isActive = isActivePath(pathname, link.href)

                return (
                  <motion.li
                    key={link.href}
                    variants={{
                      closed: { opacity: 0, y: -8 },
                      open: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        'block text-[34px] font-medium leading-[0.98] tracking-[0.035em] transition-colors',
                        isActive ? 'text-foreground' : 'text-foreground/85 hover:text-foreground',
                      )}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={closeMobileMenu}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                )
              })}
            </motion.ul>

            <motion.ul
              className="mt-8 flex items-center gap-6"
              initial={shouldReduceMotion ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut', delay: 0.1 }}
            >
              {landingData.socials.map(social => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/80 transition-colors hover:text-foreground focus-visible:text-foreground"
                    aria-label={`${social.label} (opens in new tab)`}
                  >
                    <MaskIcon src={social.iconSrc} className="h-9 w-9" />
                  </a>
                </li>
              ))}
            </motion.ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  )
}
