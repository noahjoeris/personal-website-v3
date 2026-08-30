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
        'relative z-10 isolate overflow-hidden px-6 py-20 tablet:px-10 tablet:py-24 desktop:px-16 desktop:py-28',
        className,
      )}
      {...props}
    />
  )
}
