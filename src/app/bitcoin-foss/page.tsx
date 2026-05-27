import type { Metadata } from 'next'

import { Navbar } from '@/components/navbar'
import { SectionHeading } from '@/components/section-heading'

const feedUrl = 'https://noahjoeris.github.io/btc_foss/feed.json'
const profileUrl = 'https://github.com/noahjoeris'
const eventLimit = 25
const eventTypes = ['pull_request', 'issue', 'commit', 'review', 'comment'] as const

type BtcFossEventType = (typeof eventTypes)[number]

type BtcFossEvent = {
  id: string
  event_type: BtcFossEventType
  repo: string
  title: string
  url: string
  occurred_at: string
  thread_id?: string
  thread_title?: string
  thread_url?: string
  status: string
}

type BtcFossFeed = {
  generated_at: string
  username: string
  events: BtcFossEvent[]
}

type FeedState =
  | {
      status: 'ok'
      feed: BtcFossFeed
    }
  | {
      status: 'error'
    }

export const metadata: Metadata = {
  title: 'Bitcoin/FOSS',
  description: 'Bitcoin and open-source contribution activity by Noah Joeris.',
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isEventType(value: unknown): value is BtcFossEventType {
  return isString(value) && eventTypes.includes(value as BtcFossEventType)
}

function isGitHubUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.hostname === 'github.com'
  } catch {
    return false
  }
}

function optionalString(value: unknown): string | undefined {
  return isString(value) && value.length > 0 ? value : undefined
}

function optionalGitHubUrl(value: unknown): string | undefined {
  return isString(value) && isGitHubUrl(value) ? value : undefined
}

function parseEvent(value: unknown): BtcFossEvent | null {
  if (!isRecord(value)) {
    return null
  }

  const { id, event_type, repo, title, url, occurred_at, status, thread_id, thread_title, thread_url } = value

  if (
    !isString(id) ||
    !isEventType(event_type) ||
    !isString(repo) ||
    !isString(title) ||
    !isString(url) ||
    !isGitHubUrl(url) ||
    !isString(occurred_at) ||
    !isString(status)
  ) {
    return null
  }

  return {
    id,
    event_type,
    repo,
    title,
    url,
    occurred_at,
    thread_id: optionalString(thread_id),
    thread_title: optionalString(thread_title),
    thread_url: optionalGitHubUrl(thread_url),
    status,
  }
}

function parseFeed(value: unknown): BtcFossFeed | null {
  if (!isRecord(value) || !Array.isArray(value.events)) {
    return null
  }

  const generatedAt = isString(value.generated_at) ? value.generated_at : ''
  const username = isString(value.username) ? value.username : 'noahjoeris'
  const events = value.events.flatMap(event => {
    const parsedEvent = parseEvent(event)
    return parsedEvent ? [parsedEvent] : []
  })

  return {
    generated_at: generatedAt,
    username,
    events,
  }
}

function getTimestamp(value: string): number {
  const timestamp = Date.parse(value)
  return Number.isNaN(timestamp) ? 0 : timestamp
}

function formatDate(value: string): string {
  const timestamp = Date.parse(value)

  if (Number.isNaN(timestamp)) {
    return 'Unknown date'
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp))
}

function formatEventType(value: BtcFossEventType): string {
  return value.replaceAll('_', ' ')
}

async function getFeed(): Promise<FeedState> {
  try {
    const res = await fetch(feedUrl, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return { status: 'error' }
    }

    const feed = parseFeed(await res.json())

    if (!feed) {
      return { status: 'error' }
    }

    return { status: 'ok', feed }
  } catch {
    return { status: 'error' }
  }
}

export default async function BitcoinFossPage() {
  const feedState = await getFeed()
  const events =
    feedState.status === 'ok'
      ? feedState.feed.events
          .slice()
          .sort((first, second) => getTimestamp(second.occurred_at) - getTimestamp(first.occurred_at))
          .slice(0, eventLimit)
      : []

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="mx-auto w-full max-w-5xl px-6 pb-20 pt-28 tablet:px-10 desktop:px-16">
        <SectionHeading eyebrow="Proof of work" title="Bitcoin/FOSS" headingLevel="h1" />
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-foreground/80 tablet:text-center tablet:text-lg">
          Recent Bitcoin and open-source contribution activity, pulled from GitHub and refreshed hourly.
        </p>

        {feedState.status === 'ok' ? (
          <p className="mt-8 text-center font-mono text-xs uppercase tracking-[0.18em] text-foreground/55">
            Updated {formatDate(feedState.feed.generated_at)}
          </p>
        ) : null}

        {feedState.status === 'error' ? (
          <div className="mt-14 rounded-md border border-foreground/12 bg-foreground/[0.03] px-6 py-8 text-center">
            <p className="text-lg uppercase text-foreground">Activity feed unavailable right now.</p>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex text-sm uppercase tracking-[0.18em] text-primary-light transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              View GitHub profile
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </div>
        ) : events.length > 0 ? (
          <ol className="mt-14 grid gap-4">
            {events.map(event => (
              <li key={event.id}>
                <article className="grid gap-4 rounded-md border border-foreground/12 bg-foreground/[0.03] px-5 py-5 transition-colors hover:border-foreground/25 hover:bg-foreground/[0.05] tablet:grid-cols-[minmax(0,1fr)_auto] tablet:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs uppercase tracking-[0.16em] text-foreground/55">
                      <span>{formatEventType(event.event_type)}</span>
                      <span aria-hidden="true">/</span>
                      <span>{event.repo}</span>
                      <span aria-hidden="true">/</span>
                      <span>{formatDate(event.occurred_at)}</span>
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold leading-tight text-foreground tablet:text-3xl">
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-primary-light focus-visible:text-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {event.title}
                        <span className="sr-only"> (opens in new tab)</span>
                      </a>
                    </h2>
                    {event.thread_url && event.thread_url !== event.url ? (
                      <p className="mt-3 text-sm text-foreground/60">
                        Thread:{' '}
                        <a
                          href={event.thread_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground/80 transition-colors hover:text-primary-light focus-visible:text-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {event.thread_title ?? event.thread_id ?? 'GitHub thread'}
                          <span className="sr-only"> (opens in new tab)</span>
                        </a>
                      </p>
                    ) : null}
                  </div>
                  {event.status.trim().length > 0 ? (
                    <p className="w-fit rounded-full border border-foreground/12 px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-foreground/65">
                      {event.status}
                    </p>
                  ) : null}
                </article>
              </li>
            ))}
          </ol>
        ) : (
          <div className="mt-14 rounded-md border border-foreground/12 bg-foreground/[0.03] px-6 py-8 text-center">
            <p className="text-lg uppercase text-foreground">No Bitcoin/FOSS activity found yet.</p>
          </div>
        )}
      </section>
    </main>
  )
}
