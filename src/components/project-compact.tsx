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
  index: number
  titleLevel?: 'h2' | 'h3'
  priority?: boolean
  className?: string
}

export function ProjectCompact({
  project,
  index,
  titleLevel = 'h3',
  priority = false,
  className,
}: ProjectCompactProps) {
  const titleId = `project-${project.slug}-title`
  const HeadingTag = titleLevel
  const galleryPreview = project.gallery.slice(0, 3)
  const revealFromLeft = index % 2 === 0

  return (
    <Link
      href={`/portfolio/${project.slug}`}
      aria-labelledby={titleId}
      className={cn(
        'group block w-full max-w-[22rem] rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background',
        className,
      )}
    >
      <article>
        <div className="mb-4 flex items-center justify-between gap-4 px-1 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-foreground/55">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <span>{project.period}</span>
        </div>

        <div className="relative aspect-square overflow-hidden border border-foreground/25 bg-black shadow-[0_28px_80px_rgba(0,0,0,0.42)] transition duration-500 ease-out group-hover:border-foreground/50 group-focus-visible:border-primary-light">
          <Image
            src={project.imgUrl}
            alt=""
            fill
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-active:scale-110 group-focus-visible:scale-110"
            sizes="(max-width: 767px) 84vw, 352px"
          />

          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-black/95 via-black/45 to-transparent desktop:hidden"
          />
          <HeadingTag
            id={titleId}
            className="absolute inset-x-5 bottom-5 z-20 text-[clamp(2.5rem,10vw,4rem)] font-bold uppercase leading-[0.86] tracking-[-0.025em] text-foreground drop-shadow-[0_3px_16px_rgba(0,0,0,0.9)] tablet:text-5xl desktop:sr-only"
          >
            {project.name}
          </HeadingTag>

          <div
            className={cn(
              'absolute inset-0 hidden flex-col justify-between bg-black/90 p-6 transition-transform duration-500 ease-out desktop:flex',
              revealFromLeft ? '-translate-x-full' : 'translate-x-full',
              'group-hover:translate-x-0 group-focus-visible:translate-x-0',
            )}
          >
            <div>
              <span aria-hidden="true" className="block text-4xl font-bold uppercase leading-[0.9] text-foreground">
                {project.name}
              </span>
              <p className="mt-4 font-reading text-base leading-relaxed text-foreground/78">
                {project.shortDescription}
              </p>
            </div>

            <div className="flex items-end justify-between gap-4">
              {galleryPreview.length > 0 ? (
                <ul aria-hidden="true" className="flex items-center gap-2">
                  {galleryPreview.map(media => (
                    <li
                      key={media.src}
                      className="relative h-12 w-12 shrink-0 overflow-hidden border border-foreground/30 bg-foreground/10"
                    >
                      <Image
                        src={media.src}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="48px"
                        unoptimized={media.animated}
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
              <span aria-hidden="true" className="ml-auto text-2xl text-primary-light">
                →
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
