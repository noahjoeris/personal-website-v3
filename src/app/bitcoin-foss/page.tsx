import type { Metadata } from 'next'

import { Navbar } from '@/components/navbar'
import { SectionHeading } from '@/components/section-heading'
import { BitcoinFossActivityView } from './activity-view'
import { type BtcFossEvent, type BtcFossEventType, btcFossEventTypes } from './types'

const feedUrl = 'https://noahjoeris.github.io/btc_foss/feed.json'
const profileUrl = 'https://github.com/noahjoeris'
const pageTitle = 'Bitcoin Open Source'

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
  title: pageTitle,
  description: 'Bitcoin open-source contribution activity by Noah Joeris.',
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isEventType(value: unknown): value is BtcFossEventType {
  return isString(value) && btcFossEventTypes.includes(value as BtcFossEventType)
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
    !isString(occurred_at)
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
    status: isString(status) ? status : '',
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
  const events = feedState.status === 'ok' ? feedState.feed.events : []

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="mx-auto w-full max-w-5xl px-6 pb-20 pt-28 tablet:px-10 desktop:px-16">
        <SectionHeading eyebrow="Proof of work" title={pageTitle} headingLevel="h1" />

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
          <BitcoinFossActivityView events={events} generatedAt={feedState.feed.generated_at} />
        ) : (
          <div className="mt-14 rounded-md border border-foreground/12 bg-foreground/[0.03] px-6 py-8 text-center">
            <p className="text-lg uppercase text-foreground">No Bitcoin open-source activity found yet.</p>
          </div>
        )}
      </section>
    </main>
  )
}
