import Image from 'next/image'

import { cn } from '@/lib/utils'

type BlogPostCoverImageProps = {
  src: `/images/blog/${string}`
  title: string
  priority?: boolean
  className?: string
}

export function BlogPostCoverImage({ src, title, priority = false, className }: BlogPostCoverImageProps) {
  return (
    <div
      className={cn('relative overflow-hidden rounded-md border border-foreground/10 bg-foreground/[0.03]', className)}
    >
      <div>
        <Image
          src={src}
          alt={`${title} cover image`}
          fill
          priority={priority}
          className="object-cover object-center"
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 80vw, 896px"
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-b from-transparent via-background/10 to-background/45" />
    </div>
  )
}
