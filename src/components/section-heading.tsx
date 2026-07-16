import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  id?: string
  eyebrow: string
  title: string
  headingLevel?: 'h1' | 'h2'
  size?: 'default' | 'compact'
  className?: string
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  headingLevel = 'h2',
  size = 'default',
  className,
}: SectionHeadingProps) {
  const HeadingTag = headingLevel
  const isCompact = size === 'compact'

  return (
    <div className={cn('mx-auto max-w-3xl text-center', className)}>
      <p className={isCompact ? 'text-sm uppercase tablet:text-base' : 'text-lg uppercase'}>{eyebrow}</p>
      <HeadingTag
        id={id}
        className={
          isCompact
            ? 'text-5xl leading-none tracking-tight text-foreground uppercase tablet:text-6xl desktop:text-7xl'
            : 'text-6xl leading-none tracking-tight text-foreground uppercase tablet:text-7xl desktop:text-[7.25rem]'
        }
      >
        {title}
      </HeadingTag>
    </div>
  )
}
