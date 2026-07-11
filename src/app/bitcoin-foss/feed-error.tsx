'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

type FeedErrorProps = {
  profileUrl: string
}

export function FeedError({ profileUrl }: FeedErrorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleRetry() {
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div className="mt-14 rounded-md border border-foreground/12 bg-foreground/[0.03] px-6 py-8 text-center">
      <p className="text-lg uppercase text-foreground">Activity feed unavailable right now.</p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={handleRetry}
          disabled={isPending}
          className="rounded-md border border-foreground/12 px-4 py-3 font-mono text-xs uppercase tracking-wide text-foreground/65 transition-colors hover:border-foreground/30 hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          {isPending ? 'Retrying…' : 'Retry'}
        </button>
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs uppercase tracking-wide text-primary-light transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          GitHub profile
          <span className="sr-only"> (opens in new tab)</span>
        </a>
      </div>
    </div>
  )
}
