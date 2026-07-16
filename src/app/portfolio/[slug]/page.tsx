import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Markdown from 'react-markdown'

import { Navbar } from '@/components/navbar'
import { ProjectDetailsAside, ProjectNavigation } from '@/components/project-details'
import { ProjectHeroImage } from '@/components/project-hero-image'
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

  const canonicalPath = `/portfolio/${slug}`
  const ogImages = [{ url: project.imgUrl, alt: project.name }]

  return {
    title: project.name,
    description: project.shortDescription,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: 'article',
      title: `${project.name} — Portfolio`,
      description: project.shortDescription,
      url: canonicalPath,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.name} — Portfolio`,
      description: project.shortDescription,
      images: ogImages,
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const projectIndex = portfolioData.projects.findIndex(candidate => candidate.slug === project.slug)
  const previousProject = projectIndex > 0 ? portfolioData.projects[projectIndex - 1] : undefined
  const nextProject =
    projectIndex < portfolioData.projects.length - 1 ? portfolioData.projects[projectIndex + 1] : undefined

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-background text-foreground">
        <section
          aria-labelledby="project-title"
          className="relative flex min-h-[50vh] items-center justify-center overflow-hidden px-6 pt-20 tablet:min-h-[60vh] tablet:px-10 tablet:pt-24"
        >
          <Link
            href="/portfolio"
            className="absolute left-5 top-20 z-30 inline-flex min-h-11 items-center gap-2 rounded-sm text-xs font-medium uppercase tracking-[0.18em] text-foreground/65 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring tablet:left-10 tablet:top-24 desktop:left-16"
          >
            <span aria-hidden="true">←</span> All projects
          </Link>

          <span
            aria-hidden="true"
            className="z-0 max-w-[96vw] select-none text-center text-[clamp(3.5rem,15vw,15rem)] font-bold uppercase leading-[0.86] tracking-tight text-foreground text-balance"
          >
            {project.name}
          </span>

          <ProjectHeroImage src={project.imgUrl} />

          <h1
            id="project-title"
            className="pointer-events-none absolute z-20 max-w-[96vw] select-none text-center text-[clamp(3.5rem,15vw,15rem)] font-bold uppercase leading-[0.86] tracking-tight text-transparent text-balance [-webkit-text-stroke:2px_rgba(255,255,255,0.9)] [paint-order:stroke_fill]"
          >
            {project.name}
          </h1>
        </section>

        <section
          aria-labelledby="about-project"
          className="mx-auto max-w-6xl px-6 py-16 tablet:px-10 tablet:py-24 desktop:px-16"
        >
          <div className="grid gap-12 desktop:grid-cols-[minmax(0,1fr)_19rem] desktop:gap-20">
            <div>
              <h2 id="about-project" className="text-sm uppercase tracking-[0.2em] text-foreground/50">
                About the project
              </h2>
              <p className="mt-5 max-w-3xl text-3xl leading-[1.08] text-foreground text-balance tablet:text-4xl">
                {project.shortDescription}
              </p>
              {project.description ? (
                <div className="mt-8 max-w-[65ch] font-reading text-base leading-[1.75] text-foreground/76 [text-wrap:pretty] [&_a]:font-medium [&_a]:text-primary-light [&_a]:underline [&_a]:decoration-primary/40 [&_a]:underline-offset-4 [&_a]:transition-colors hover:[&_a]:text-foreground [&_li]:pl-1 [&_p+p]:mt-5 [&_strong]:font-semibold [&_strong]:text-foreground/95 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                  <Markdown>{project.description}</Markdown>
                </div>
              ) : null}
            </div>

            <ProjectDetailsAside project={project} />
          </div>
        </section>

        <ProjectGallerySection gallery={project.gallery} />
        <ProjectNavigation previousProject={previousProject} nextProject={nextProject} />
      </main>
    </>
  )
}
