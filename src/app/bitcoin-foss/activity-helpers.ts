import { type BtcFossEvent, type BtcFossEventType, btcFossEventTypes } from './types'

export type TypeFilter = BtcFossEventType | 'all'

export type ActivityThread = {
  key: string
  type: BtcFossEventType
  repository: string
  title: string
  url: string
  latestTimestamp: string
  status: string
  events: BtcFossEvent[]
  eventCount: number
}

export type ActivityFilters = {
  type: TypeFilter
  search: string
  organization: string
  repository: string
}

export type TypeOverviewCounts = Record<TypeFilter, number>

export const allValue = 'all' as const
export const pageSize = 25
export const showCommitActivity = false

export const visibleEventTypes = btcFossEventTypes.filter(
  type => showCommitActivity || type !== 'commit',
) as BtcFossEventType[]

export const typeLabels: Record<BtcFossEventType, string> = {
  pull_request: 'pull request',
  issue: 'issue',
  commit: 'commit',
  review: 'review',
  comment: 'comment',
}

export const pluralTypeLabels: Record<BtcFossEventType, string> = {
  pull_request: 'pull requests',
  issue: 'issues',
  commit: 'commits',
  review: 'reviews',
  comment: 'comments',
}

export const overviewTypeOptions: { label: string; value: TypeFilter }[] = [
  { label: 'All', value: allValue },
  ...visibleEventTypes.map(type => ({
    label: pluralTypeLabels[type].charAt(0).toUpperCase() + pluralTypeLabels[type].slice(1),
    value: type,
  })),
]

const statusLabels: Record<string, string> = {
  MERGED: 'Merged',
  OPEN: 'Open',
  CLOSED: 'Closed',
  APPROVED: 'Approved',
  CHANGES_REQUESTED: 'Changes requested',
  COMMENTED: 'Commented',
}

/** Positive statuses — teal/primary. */
const positiveStatuses = new Set(['MERGED', 'OPEN', 'APPROVED'])
/** Attention statuses — amber. */
const amberStatuses = new Set(['CHANGES_REQUESTED'])

export type StatusTone = 'positive' | 'amber' | 'neutral'

// UTC keeps static rendering and hydration stable across server and visitor time zones.
// Short form for row metadata; month headings already supply year context.
const activityDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})

const monthHeadingFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

const updatedDateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  hour: '2-digit',
  hourCycle: 'h23',
  minute: '2-digit',
  month: 'short',
  timeZone: 'UTC',
  year: 'numeric',
})

const feedRangeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

export function getTimestamp(value: string): number {
  const timestamp = Date.parse(value)
  return Number.isNaN(timestamp) ? 0 : timestamp
}

export function parseDate(value: string): Date | null {
  const timestamp = Date.parse(value)
  return Number.isNaN(timestamp) ? null : new Date(timestamp)
}

export function formatActivityDate(value: string): string {
  const date = parseDate(value)
  if (!date) {
    return 'Unknown date'
  }
  return activityDateFormatter.format(date)
}

/** Returns null for invalid dates so callers can omit the update line. */
export function formatUpdatedAt(value: string): string | null {
  const date = parseDate(value)
  if (!date) {
    return null
  }
  return `${updatedDateFormatter.format(date).replace(' at ', ', ')} UTC`
}

export function formatMonthHeading(value: string): string {
  const date = parseDate(value)
  if (!date) {
    return 'Unknown date'
  }
  return monthHeadingFormatter.format(date)
}

/** YYYY-MM key for grouping under month headings (UTC). */
export function monthKey(value: string): string {
  const date = parseDate(value)
  if (!date) {
    return 'unknown'
  }
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export function repoOwner(repo: string): string {
  return repo.split('/')[0] ?? repo
}

export function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((first, second) => first.localeCompare(second))
}

export function visibleActivityEvents(events: BtcFossEvent[]): BtcFossEvent[] {
  return showCommitActivity ? events : events.filter(event => event.event_type !== 'commit')
}

/** Strip redundant action prefixes; prefer thread_title when present. */
export function normalizeThreadTitle(event: BtcFossEvent): string {
  if (event.thread_title && event.thread_title.trim().length > 0) {
    return event.thread_title.trim()
  }

  return event.title
    .replace(/^Reviewed\s+/i, '')
    .replace(/^Commented on\s+/i, '')
    .trim()
}

/**
 * Reviews and comments group by event_type + thread_id.
 * PRs and issues stay individual. Missing thread_id never collapses.
 */
export function groupKey(event: BtcFossEvent): string {
  if ((event.event_type === 'review' || event.event_type === 'comment') && event.thread_id) {
    return `${event.event_type}:${event.thread_id}`
  }

  return `${event.event_type}:${event.id}`
}

function threadUrl(events: BtcFossEvent[], primary: BtcFossEvent): string {
  if (events.length > 1 && primary.thread_url) {
    return primary.thread_url
  }
  return primary.url
}

export function groupEventsToThreads(events: BtcFossEvent[]): ActivityThread[] {
  const groups = new Map<string, BtcFossEvent[]>()
  const sortedEvents = events
    .slice()
    .sort((first, second) => getTimestamp(second.occurred_at) - getTimestamp(first.occurred_at))

  for (const event of sortedEvents) {
    const key = groupKey(event)
    const group = groups.get(key)
    if (group) {
      group.push(event)
    } else {
      groups.set(key, [event])
    }
  }

  const threads: ActivityThread[] = []

  for (const [key, group] of groups) {
    const primary = group[0]
    if (!primary) {
      continue
    }

    threads.push({
      key,
      type: primary.event_type,
      repository: primary.repo,
      title: normalizeThreadTitle(primary),
      url: threadUrl(group, primary),
      latestTimestamp: primary.occurred_at,
      status: primary.status,
      events: group,
      eventCount: group.length,
    })
  }

  return threads.sort((first, second) => getTimestamp(second.latestTimestamp) - getTimestamp(first.latestTimestamp))
}

export function formatStatusLabel(status: string): string {
  const key = status.trim().toUpperCase()
  if (key.length === 0) {
    return ''
  }

  return (
    statusLabels[key] ??
    key
      .toLowerCase()
      .split('_')
      .filter(part => part.length > 0)
      .map(part => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`)
      .join(' ')
  )
}

export function statusTone(status: string): StatusTone {
  const key = status.trim().toUpperCase()
  if (positiveStatuses.has(key)) {
    return 'positive'
  }
  if (amberStatuses.has(key)) {
    return 'amber'
  }
  return 'neutral'
}

export function eventCountBadge(thread: ActivityThread): string | null {
  if (thread.eventCount <= 1) {
    return null
  }
  return `${thread.eventCount} ${pluralTypeLabels[thread.type]}`
}

export function typeLabelForThread(thread: ActivityThread): string {
  return thread.eventCount > 1 ? pluralTypeLabels[thread.type] : typeLabels[thread.type]
}

function matchesSearch(event: BtcFossEvent, search: string): boolean {
  const query = search.trim().toLowerCase()
  if (query.length === 0) {
    return true
  }

  const haystacks = [event.title, event.repo, event.thread_title ?? ''].map(value => value.toLowerCase())
  return haystacks.some(value => value.includes(query))
}

/** Search + org + repo filters (type ignored). Used for overview counts and as base for the list. */
export function filterEventsByProjectAndSearch(
  events: BtcFossEvent[],
  filters: Pick<ActivityFilters, 'search' | 'organization' | 'repository'>,
): BtcFossEvent[] {
  return events.filter(event => {
    const matchesOrg = filters.organization === allValue || repoOwner(event.repo) === filters.organization
    const matchesRepo = filters.repository === allValue || event.repo === filters.repository
    return matchesOrg && matchesRepo && matchesSearch(event, filters.search)
  })
}

export function filterEvents(events: BtcFossEvent[], filters: ActivityFilters): BtcFossEvent[] {
  return filterEventsByProjectAndSearch(events, filters).filter(
    event => filters.type === allValue || event.event_type === filters.type,
  )
}

/**
 * Overview counts for a project/search-filtered event set (type ignored).
 * Pass output of `filterEventsByProjectAndSearch` so counts stay in sync with those filters.
 */
export function overviewCounts(events: BtcFossEvent[]): TypeOverviewCounts {
  const counts: TypeOverviewCounts = {
    all: events.length,
    pull_request: 0,
    issue: 0,
    commit: 0,
    review: 0,
    comment: 0,
  }

  for (const event of events) {
    counts[event.event_type] += 1
  }

  return counts
}

/** Repositories available for the given organization selection. */
export function repositoryOptionsForOrg(events: BtcFossEvent[], organization: string): string[] {
  const repos = events
    .filter(event => organization === allValue || repoOwner(event.repo) === organization)
    .map(event => event.repo)
  return uniqueSorted(repos)
}

/**
 * When organization changes, drop repository if it no longer belongs to that org.
 * Returns the repository filter that should be applied.
 */
export function resolveRepositoryAfterOrgChange(
  events: BtcFossEvent[],
  organization: string,
  currentRepository: string,
): string {
  if (currentRepository === allValue) {
    return allValue
  }

  const options = repositoryOptionsForOrg(events, organization)
  return options.includes(currentRepository) ? currentRepository : allValue
}

export type FeedDateRange = {
  earliest: string
  latest: string
  label: string
}

/** Min/max activity dates for feed context. Null if no valid dates. */
export function feedDateRange(events: BtcFossEvent[]): FeedDateRange | null {
  let earliestTs = Number.POSITIVE_INFINITY
  let latestTs = Number.NEGATIVE_INFINITY
  let earliest = ''
  let latest = ''

  for (const event of events) {
    const ts = getTimestamp(event.occurred_at)
    if (ts === 0 && !parseDate(event.occurred_at)) {
      continue
    }
    if (ts < earliestTs) {
      earliestTs = ts
      earliest = event.occurred_at
    }
    if (ts > latestTs) {
      latestTs = ts
      latest = event.occurred_at
    }
  }

  if (!earliest || !latest) {
    return null
  }

  const earliestDate = parseDate(earliest)
  const latestDate = parseDate(latest)
  if (!earliestDate || !latestDate) {
    return null
  }

  const startLabel = feedRangeFormatter.format(earliestDate)
  const endLabel = feedRangeFormatter.format(latestDate)
  const label = startLabel === endLabel ? startLabel : `${startLabel} – ${endLabel}`

  return { earliest, latest, label }
}

export type MonthSection = {
  key: string
  heading: string
  threads: ActivityThread[]
}

/** Group visible threads under month headings (latest first). */
export function groupThreadsByMonth(threads: ActivityThread[]): MonthSection[] {
  const sections = new Map<string, ActivityThread[]>()
  const order: string[] = []

  for (const thread of threads) {
    const key = monthKey(thread.latestTimestamp)
    const existing = sections.get(key)
    if (existing) {
      existing.push(thread)
    } else {
      sections.set(key, [thread])
      order.push(key)
    }
  }

  return order.map(key => {
    const sectionThreads = sections.get(key) ?? []
    const first = sectionThreads[0]
    return {
      key,
      heading: first ? formatMonthHeading(first.latestTimestamp) : 'Unknown date',
      threads: sectionThreads,
    }
  })
}

export function paginateThreads(
  threads: ActivityThread[],
  visibleCount: number,
): {
  visible: ActivityThread[]
  hasMore: boolean
  remaining: number
  nextPageSize: number
} {
  const visible = threads.slice(0, visibleCount)
  const remaining = Math.max(0, threads.length - visible.length)
  return {
    visible,
    hasMore: remaining > 0,
    remaining,
    nextPageSize: Math.min(pageSize, remaining),
  }
}
