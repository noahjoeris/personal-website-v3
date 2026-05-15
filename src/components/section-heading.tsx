import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  eyebrow: string
  title: string
  headingLevel?: 'h1' | 'h2'
  className?: string
}

export function SectionHeading({ eyebrow, title, headingLevel = 'h2', className }: SectionHeadingProps) {
  const HeadingTag = headingLevel

  return (
    <div className={cn('mx-auto max-w-3xl text-center', className)}>
      <p className="text-lg uppercase">{eyebrow}</p>
      <HeadingTag className="text-6xl leading-none tracking-tight text-foreground uppercase tablet:text-7xl desktop:text-[7.25rem]">
        {title}
      </HeadingTag>
    </div>
  )
}
