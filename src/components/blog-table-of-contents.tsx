import type { BlogHeading } from '@/lib/blog-content'

type BlogTableOfContentsProps = {
  headings: BlogHeading[]
}

export function BlogTableOfContents({ headings }: BlogTableOfContentsProps) {
  return (
    <details className="mx-auto mt-8 max-w-[57ch] border-y border-foreground/15 font-reading text-lg open:pb-5">
      <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold uppercase tracking-[0.16em] text-foreground/75 marker:text-primary-light">
        In this article
      </summary>
      <nav className="mt-4" aria-label="Table of contents">
        <ol className="space-y-2 border-l border-foreground/15 pl-4 text-sm leading-relaxed text-foreground/70">
          {headings.map(heading => (
            <li key={heading.id} className={heading.level === 3 ? 'ml-4' : undefined}>
              <a
                href={`#${heading.id}`}
                className="rounded-sm transition-colors hover:text-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  )
}
