import type { HTMLAttributes, Ref } from 'react'

import { cn } from '@/lib/utils'

type SectionProps = HTMLAttributes<HTMLElement> & {
  ref?: Ref<HTMLElement>
}

export function Section({ className, ref, ...props }: SectionProps) {
  return (
    <section
      ref={ref}
      className={cn(
        'relative isolate overflow-hidden bg-background px-6 py-20 tablet:px-10 tablet:py-24 desktop:px-16 desktop:py-28',
        className,
      )}
      {...props}
    />
  )
}
