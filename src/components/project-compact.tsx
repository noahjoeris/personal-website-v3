import Image from 'next/image'
import Link from 'next/link'

import type { PortfolioProject } from '@/data/portfolio-data'
import { cn } from '@/lib/utils'

type ProjectCompactProject = Pick<
  PortfolioProject,
  'slug' | 'name' | 'imgUrl' | 'shortDescription' | 'period' | 'gallery'
>

type ProjectCompactProps = {
  project: ProjectCompactProject
  className?: string
}

export function ProjectCompact({ project, className }: ProjectCompactProps) {
  const galleryPreview = project.gallery.slice(0, 3)
  const titleId = `project-${project.slug}-title`

  return (
    <Link href={`/portfolio/${project.slug}`} aria-labelledby={titleId}>
      <article
        className={cn(
          'group relative aspect-square w-full max-w-84 overflow-hidden rounded-md border border-foreground/25 bg-black',
          className,
        )}
      >
        <Image
          src={project.imgUrl}
          alt=""
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-active:scale-105 group-focus-within:scale-105"
          sizes="(max-width: 640px) 90vw, 336px"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-black/90 transition-transform duration-500 ease-out group-hover:translate-x-0 group-active:translate-x-0 group-focus-within:translate-x-0"
        />

        <div className="absolute inset-0 flex -translate-x-full flex-col justify-between p-5 transition-transform duration-500 ease-out group-hover:translate-x-0 group-active:translate-x-0 group-focus-within:translate-x-0">
          <div className="space-y-2">
            <h3 id={titleId} className="text-3xl uppercase text-foreground">
              {project.name}
            </h3>
            <p className="text-lg text-foreground/85">{project.shortDescription}</p>
            <p className="text-md text-foreground/70 uppercase">{project.period}</p>
          </div>

          {galleryPreview.length > 0 ? (
            <ul aria-hidden="true" className="flex items-center gap-3">
              {galleryPreview.map(gallerySrc => (
                <li
                  key={gallerySrc}
                  className="relative h-15 w-19 shrink-0 overflow-hidden rounded-xs border border-foreground/30 bg-foreground/10"
                >
                  <Image src={gallerySrc} alt="" fill className="object-cover" sizes="64px" />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </article>
    </Link>
  )
}
