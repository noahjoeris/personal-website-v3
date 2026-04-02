import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Markdown from 'react-markdown'

import { Navbar } from '@/components/navbar'
import { getProjectBySlug, portfolioData } from '@/data/portfolio-data'
import { ProjectGallerySection } from '@/sections/project-gallery'

type ProjectPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return portfolioData.projects.map(project => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    return { title: 'Project not found' }
  }

  return {
    title: `${project.name} — Portfolio`,
    description: project.shortDescription,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero — three layers: filled text → logo → outline text */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden px-6 pt-20 tablet:min-h-[60vh] tablet:px-10 tablet:pt-24">
        {/* Layer 1: Solid white filled text (behind everything) */}
        <span
          aria-hidden="true"
          className="z-0 select-none text-center text-[clamp(6rem,15vw,15rem)] font-bold uppercase leading-none tracking-tight text-foreground"
        >
          {project.name}
        </span>

        {/* Layer 2: Project logo (on top of filled text) */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="relative aspect-square w-[clamp(140px,22vw,280px)]">
            <Image
              src={project.imgUrl}
              alt={`${project.name} logo`}
              fill
              priority
              className="object-contain drop-shadow-2xl"
              sizes="(max-width: 768px) 45vw, 280px"
            />
          </div>
        </div>

        {/* Layer 3: Outline-only text (on top of logo, shows border over image) */}
        <h1
          className="pointer-events-none absolute z-20 select-none text-center text-[clamp(6rem,15vw,15rem)] font-bold uppercase leading-none tracking-tight text-transparent"
          style={{ WebkitTextStroke: '2px rgba(255,255,255,0.9)', paintOrder: 'stroke fill' }}
        >
          {project.name}
        </h1>
      </section>

      {/* Description & Metadata */}
      <section className="mx-auto max-w-4xl px-6 py-16 tablet:px-10 tablet:py-24 desktop:px-16">
        <div className="grid gap-12 tablet:grid-cols-[1fr_280px] tablet:gap-16">
          <div className="space-y-6">
            <h2 className="text-sm uppercase tracking-[0.2em] text-foreground/50">About the project</h2>
            <p className="text-xl leading-relaxed text-foreground/85 tablet:text-2xl">
              {project.shortDescription}
            </p>
            {project.description !== 'todo' && (
              <div className="text-lg leading-relaxed text-foreground/70 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:text-foreground/70 [&_p]:leading-relaxed [&_p+p]:mt-4 [&_strong]:text-foreground/90">
                <Markdown>{project.description}</Markdown>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div>
              <h3 className="text-sm uppercase tracking-[0.2em] text-foreground/50">Period</h3>
              <p className="mt-1 text-lg">{project.period}</p>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-[0.2em] text-foreground/50">Type</h3>
              <p className="mt-1 text-lg">{project.projectType}</p>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-[0.2em] text-foreground/50">Tech</h3>
              <p className="mt-1 text-lg">{project.techUsed}</p>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-[0.2em] text-foreground/50">Client</h3>
              <p className="mt-1 text-lg">{project.client}</p>
            </div>
            {project.links.length > 0 && (
              <div>
                <h3 className="text-sm uppercase tracking-[0.2em] text-foreground/50">Links</h3>
                <ul className="mt-1 space-y-1">
                  {project.links.map(link => (
                    <li key={link}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg text-primary transition-colors hover:text-primary-light"
                      >
                        {new URL(link).hostname.replace('www.', '')}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      <ProjectGallerySection gallery={project.gallery} projectName={project.name} />
    </main>
  )
}
