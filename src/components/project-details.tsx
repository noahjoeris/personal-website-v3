import Link from 'next/link'
import type { ReactNode } from 'react'

import type { PortfolioProject } from '@/data/portfolio-data'
import { cn } from '@/lib/utils'

type ProjectDetailsAsideProps = {
  project: PortfolioProject
}

export function ProjectDetailsAside({ project }: ProjectDetailsAsideProps) {
  const hasLinks = project.links.length > 0

  return (
    <aside className="desktop:sticky desktop:top-8 desktop:self-start">
      <ProjectLinks project={project} />

      <dl className={cn('space-y-6', hasLinks && 'mt-8 border-t border-foreground/15 pt-8')}>
        <ProjectFact term="Period" description={project.period} />
        <ProjectFact term="Type">
          <TagList values={project.projectType} />
        </ProjectFact>
        <ProjectFact term="Technology">
          <TagList values={project.techUsed} />
        </ProjectFact>
        {project.client ? <ProjectFact term="Client" description={project.client} /> : null}
      </dl>
    </aside>
  )
}

function ProjectLinks({ project }: ProjectDetailsAsideProps) {
  if (project.links.length === 0) {
    return null
  }

  return (
    <div>
      <h2 className="text-sm uppercase tracking-[0.2em] text-foreground/50">Links</h2>
      <ul className="mt-4 space-y-3">
        {project.links.map(link => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex min-h-11 w-full items-center justify-between gap-3 rounded-md px-4 py-2 text-sm font-semibold uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                link.kind === 'live'
                  ? 'bg-primary text-background hover:bg-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-background'
                  : 'border border-foreground/25 text-foreground/80 hover:border-foreground/50 hover:text-foreground',
              )}
            >
              {link.label}
              <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProjectFact({ term, description, children }: { term: string; description?: string; children?: ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.18em] text-foreground/45">{term}</dt>
      <dd className="mt-2 text-lg text-foreground/88">{children ?? description}</dd>
    </div>
  )
}

function TagList({ values }: { values: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {values.map(value => (
        <li
          key={value}
          className="rounded-full border border-foreground/15 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wide text-foreground/65"
        >
          {value}
        </li>
      ))}
    </ul>
  )
}

type ProjectNavigationProps = {
  previousProject?: PortfolioProject
  nextProject?: PortfolioProject
}

export function ProjectNavigation({ previousProject, nextProject }: ProjectNavigationProps) {
  return (
    <nav aria-label="Project navigation" className="px-6 py-16 tablet:px-10 tablet:py-20 desktop:px-16">
      <div className="mx-auto grid max-w-6xl gap-4 border-y border-foreground/15 py-6 tablet:grid-cols-[1fr_auto_1fr] tablet:items-center">
        {previousProject ? (
          <Link
            href={`/portfolio/${previousProject.slug}`}
            className="group rounded-sm py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="block text-xs uppercase tracking-[0.18em] text-foreground/45">Previous project</span>
            <span className="mt-1 block text-2xl uppercase text-foreground/80 transition-colors group-hover:text-foreground">
              <span aria-hidden="true">← </span>
              {previousProject.name}
            </span>
          </Link>
        ) : (
          <span aria-hidden="true" className="hidden tablet:block" />
        )}

        <Link
          href="/portfolio"
          className="inline-flex min-h-11 items-center justify-center rounded-sm px-4 text-sm uppercase tracking-[0.16em] text-primary-light transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          All projects
        </Link>

        {nextProject ? (
          <Link
            href={`/portfolio/${nextProject.slug}`}
            className="group rounded-sm py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring tablet:text-right"
          >
            <span className="block text-xs uppercase tracking-[0.18em] text-foreground/45">Next project</span>
            <span className="mt-1 block text-2xl uppercase text-foreground/80 transition-colors group-hover:text-foreground">
              {nextProject.name} <span aria-hidden="true">→</span>
            </span>
          </Link>
        ) : (
          <span aria-hidden="true" className="hidden tablet:block" />
        )}
      </div>
    </nav>
  )
}
