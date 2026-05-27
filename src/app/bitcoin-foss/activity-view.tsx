'use client'

import { type RefObject, useEffect, useMemo, useRef, useState } from 'react'

import { type BtcFossEvent, type BtcFossEventType, btcFossEventTypes } from './types'

type ActivityViewProps = {
  events: BtcFossEvent[]
  generatedAt: string
}

type FilterValue = 'all'
type TypeFilter = BtcFossEventType | FilterValue

type ActivityGroup = {
  kind: 'single' | 'comment_group'
  key: string
  primary: BtcFossEvent
  events: BtcFossEvent[]
  title: string
  href: string
}

type ActivityStats = {
  pullRequests: number
  issues: number
  comments: number
  reviews: number
}

const allValue: FilterValue = 'all'
const pageSize = 25
const showCommitActivity = false
const statItems = [
  ['Pull requests', 'pullRequests'],
  ['Reviews', 'reviews'],
  ['Issues', 'issues'],
  ['Comments', 'comments'],
] as const satisfies readonly [string, keyof ActivityStats][]
const visibleEventTypes = btcFossEventTypes.filter(type => showCommitActivity || type !== 'commit')
const filterLabelClass = 'font-mono text-xs uppercase tracking-[0.18em] text-foreground/55'
const filterControlClass =
  'h-11 rounded-md border border-foreground/12 bg-background px-4 font-mono text-xs text-foreground transition-colors hover:border-foreground/30 focus-visible:border-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
const filterButtonClass = `${filterControlClass} inline-flex items-center justify-center uppercase tracking-[0.14em] text-foreground/65 aria-pressed:border-primary-light aria-pressed:text-primary-light`

// UTC keeps static rendering and hydration stable across server and visitor time zones.
const activityDateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeZone: 'UTC',
})

const updatedDateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'UTC',
})

const typeLabels: Record<BtcFossEventType, string> = {
  pull_request: 'pull request',
  issue: 'issue',
  commit: 'commit',
  review: 'review',
  comment: 'comment',
}

const pluralTypeLabels: Record<BtcFossEventType, string> = {
  pull_request: 'pull requests',
  issue: 'issues',
  commit: 'commits',
  review: 'reviews',
  comment: 'comments',
}

function EventTypeIcon({ type }: { type: BtcFossEventType }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-foreground/15 text-foreground/70"
    >
      <svg
        className="h-3.5 w-3.5"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {type === 'pull_request' ? (
          <>
            <circle cx="4" cy="4" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <path d="M4 5.5v6.5h6.5" />
            <path d="m9 10.5 1.5 1.5L9 13.5" />
          </>
        ) : null}
        {type === 'issue' ? (
          <>
            <circle cx="8" cy="8" r="5.2" />
            <path d="M8 5.2v3.4" />
            <path d="M8 11.2h.01" />
          </>
        ) : null}
        {type === 'commit' ? (
          <>
            <path d="M2.5 8h3" />
            <circle cx="8" cy="8" r="2.5" />
            <path d="M10.5 8h3" />
          </>
        ) : null}
        {type === 'review' ? <path d="m3 8.5 3.2 3.2L13 4.8" /> : null}
        {type === 'comment' ? <path d="M3.2 4.2h9.6v6.5H7.4L4 13.5v-2.8h-.8z" /> : null}
      </svg>
    </span>
  )
}

function getTimestamp(value: string): number {
  const timestamp = Date.parse(value)
  return Number.isNaN(timestamp) ? 0 : timestamp
}

function parseDate(value: string): Date | null {
  const timestamp = Date.parse(value)
  return Number.isNaN(timestamp) ? null : new Date(timestamp)
}

function formatActivityDate(value: string): string {
  const date = parseDate(value)

  if (!date) {
    return 'Unknown date'
  }

  return activityDateFormatter.format(date)
}

function formatUpdatedAt(value: string): string {
  const date = parseDate(value)

  if (!date) {
    return 'Unknown date'
  }

  return `${updatedDateFormatter.format(date)} UTC`
}

function repoOwner(repo: string): string {
  return repo.split('/')[0] ?? repo
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((first, second) => first.localeCompare(second))
}

function baseThreadTitle(event: BtcFossEvent): string {
  return event.thread_title ?? event.title.replace(/^Commented on /, '').replace(/^Reviewed /, '')
}

function groupKey(event: BtcFossEvent): string {
  // Comments collapse by GitHub thread. PRs, reviews, and issues stay visible rows.
  if (event.event_type === 'comment' && event.thread_id) {
    return `thread:${event.thread_id}`
  }

  return `${event.event_type}:${event.id}`
}

function groupTypeLabel(events: BtcFossEvent[], primary: BtcFossEvent): string {
  return events.length > 1 ? pluralTypeLabels[primary.event_type] : typeLabels[primary.event_type]
}

function groupComposition(events: BtcFossEvent[]): string {
  const primary = events[0]

  if (!primary) {
    return ''
  }

  return `${events.length} ${pluralTypeLabels[primary.event_type]}`
}

function groupTitle(events: BtcFossEvent[], primary: BtcFossEvent): string {
  if (events.length === 1) {
    return primary.title
  }

  return `${events.length} ${groupTypeLabel(events, primary)} on ${baseThreadTitle(primary)}`
}

function groupHref(events: BtcFossEvent[], primary: BtcFossEvent): string {
  if (events.length > 1 && primary.thread_url) {
    return primary.thread_url
  }

  return primary.url
}

function groupEvents(events: BtcFossEvent[]): ActivityGroup[] {
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

  return [...groups.entries()].flatMap(([key, group]) => {
    const primary = group[0]

    if (!primary) {
      return []
    }

    return {
      kind: group.length > 1 && primary.event_type === 'comment' ? 'comment_group' : 'single',
      key,
      primary,
      events: group,
      title: groupTitle(group, primary),
      href: groupHref(group, primary),
    }
  })
}

function countByType(events: BtcFossEvent[], type: BtcFossEventType): number {
  return events.reduce((count, event) => count + Number(event.event_type === type), 0)
}

function getActivityStats(events: BtcFossEvent[]): ActivityStats {
  return {
    pullRequests: countByType(events, 'pull_request'),
    issues: countByType(events, 'issue'),
    comments: countByType(events, 'comment'),
    reviews: countByType(events, 'review'),
  }
}

function visibleActivityEvents(events: BtcFossEvent[]): BtcFossEvent[] {
  return showCommitActivity ? events : events.filter(event => event.event_type !== 'commit')
}

function StatusBadge({ status }: { status: string }) {
  if (status.trim().length === 0) {
    return null
  }

  return (
    <p className="w-fit rounded-md border border-foreground/12 px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-foreground/65">
      {status}
    </p>
  )
}

function ActivityGroupCard({ group }: { group: ActivityGroup }) {
  const { primary } = group
  const isCommentGroup = group.kind === 'comment_group'

  return (
    <article className="rounded-md border border-foreground/12 bg-foreground/[0.03] px-5 py-5 transition-colors hover:border-foreground/25 hover:bg-foreground/[0.05]">
      <div className="grid gap-4 tablet:grid-cols-[minmax(0,1fr)_auto] tablet:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs uppercase tracking-[0.16em] text-foreground/55">
            <span className="inline-flex items-center gap-2">
              <EventTypeIcon type={primary.event_type} />
              {groupTypeLabel(group.events, primary)}
            </span>
            <span aria-hidden="true">/</span>
            <span className="normal-case tracking-normal">{primary.repo}</span>
            <span aria-hidden="true">/</span>
            <span>{formatActivityDate(primary.occurred_at)}</span>
          </div>
          <h2 className="mt-3 text-2xl font-semibold leading-tight text-foreground tablet:text-3xl">
            <a
              href={group.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary-light focus-visible:text-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {group.title}
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 tablet:justify-end">
          {isCommentGroup ? (
            <p className="w-fit rounded-md border border-foreground/12 px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-foreground/65">
              {groupComposition(group.events)}
            </p>
          ) : null}
          {!isCommentGroup ? <StatusBadge status={primary.status} /> : null}
        </div>
      </div>
    </article>
  )
}

function ActivityStatsGrid({ stats }: { stats: ActivityStats }) {
  return (
    <dl className="mt-12 grid grid-cols-2 gap-3 tablet:grid-cols-5">
      {statItems.map(([label, key]) => (
        <div key={label} className="rounded-md border border-foreground/12 bg-foreground/[0.03] px-4 py-4 text-center">
          <dt className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-foreground/55 tablet:tracking-[0.18em]">
            {label}
          </dt>
          <dd className="mt-2 text-3xl font-semibold leading-none text-foreground tablet:text-4xl">{stats[key]}</dd>
        </div>
      ))}
    </dl>
  )
}

function ActivityFilters({
  typeFilter,
  orgFilter,
  repoFilter,
  orgOptions,
  repoOptions,
  onTypeChange,
  onOrgChange,
  onRepoChange,
}: {
  typeFilter: TypeFilter
  orgFilter: string
  repoFilter: string
  orgOptions: string[]
  repoOptions: string[]
  onTypeChange: (value: TypeFilter) => void
  onOrgChange: (value: string) => void
  onRepoChange: (value: string) => void
}) {
  return (
    <section className="mt-8 grid gap-5 border-y border-foreground/12 py-5">
      <div>
        <p id="btc-foss-type-filter" className={filterLabelClass}>
          Type
        </p>
        <div role="group" aria-labelledby="btc-foss-type-filter" className="mt-3 flex flex-wrap gap-2">
          {[
            { label: 'All', value: allValue },
            ...visibleEventTypes.map(type => ({ label: pluralTypeLabels[type], value: type })),
          ].map(option => (
            <button
              key={option.value}
              type="button"
              aria-pressed={typeFilter === option.value}
              onClick={() => onTypeChange(option.value)}
              className={filterButtonClass}
            >
              <span className="inline-flex items-center gap-2">
                {option.value === allValue ? null : <EventTypeIcon type={option.value} />}
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 tablet:grid-cols-[minmax(0,1fr)_minmax(14rem,22rem)]">
        <div>
          <p id="btc-foss-org-filter" className={filterLabelClass}>
            Org
          </p>
          <div role="group" aria-labelledby="btc-foss-org-filter" className="mt-3 flex flex-wrap gap-2">
            {[allValue, ...orgOptions].map(org => (
              <button
                key={org}
                type="button"
                aria-pressed={orgFilter === org}
                onClick={() => onOrgChange(org)}
                className={filterButtonClass}
              >
                {org === allValue ? 'All orgs' : <span className="normal-case tracking-normal">{org}</span>}
              </button>
            ))}
          </div>
        </div>

        <label className={`grid content-start gap-3 ${filterLabelClass}`}>
          Repo
          <select
            value={repoFilter}
            onChange={event => onRepoChange(event.target.value)}
            className={`${filterControlClass} w-full normal-case tracking-normal`}
          >
            <option value={allValue}>All repos</option>
            {repoOptions.map(repo => (
              <option key={repo} value={repo}>
                {repo}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  )
}

function ActivityList({
  groups,
  hasMore,
  loadMoreRef,
  onLoadMore,
}: {
  groups: ActivityGroup[]
  hasMore: boolean
  loadMoreRef: RefObject<HTMLDivElement | null>
  onLoadMore: () => void
}) {
  if (groups.length === 0) {
    return (
      <div className="mt-5 rounded-md border border-foreground/12 bg-foreground/[0.03] px-6 py-8 text-center">
        <p className="text-lg uppercase text-foreground">No activity matches these filters.</p>
      </div>
    )
  }

  return (
    <>
      <ol className="mt-5 grid gap-4">
        {groups.map(group => (
          <li key={group.key}>
            <ActivityGroupCard group={group} />
          </li>
        ))}
      </ol>

      {hasMore ? (
        <div ref={loadMoreRef} className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            className="rounded-md border border-foreground/12 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-foreground/65 transition-colors hover:border-foreground/30 hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Load more
          </button>
        </div>
      ) : null}
    </>
  )
}

export function BitcoinFossActivityView({ events, generatedAt }: ActivityViewProps) {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>(allValue)
  const [orgFilter, setOrgFilter] = useState<string>(allValue)
  const [repoFilter, setRepoFilter] = useState<string>(allValue)
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const lastAutoLoadScrollY = useRef(0)

  const orgOptions = useMemo(() => uniqueSorted(events.map(event => repoOwner(event.repo))), [events])
  const repoOptions = useMemo(() => {
    const repos = events
      .filter(event => orgFilter === allValue || repoOwner(event.repo) === orgFilter)
      .map(event => event.repo)

    return uniqueSorted(repos)
  }, [events, orgFilter])

  const visibleEvents = useMemo(() => visibleActivityEvents(events), [events])
  const stats = useMemo(() => getActivityStats(visibleEvents), [visibleEvents])

  const filteredEvents = useMemo(
    () =>
      visibleEvents.filter(event => {
        const matchesType = typeFilter === allValue || event.event_type === typeFilter
        const matchesOrg = orgFilter === allValue || repoOwner(event.repo) === orgFilter
        const matchesRepo = repoFilter === allValue || event.repo === repoFilter

        return matchesType && matchesOrg && matchesRepo
      }),
    [orgFilter, repoFilter, typeFilter, visibleEvents],
  )

  const groups = useMemo(() => groupEvents(filteredEvents), [filteredEvents])
  const visibleGroups = groups.slice(0, visibleCount)
  const hasMore = visibleGroups.length < groups.length
  const hasActiveFilters = typeFilter !== allValue || orgFilter !== allValue || repoFilter !== allValue

  useEffect(() => {
    setVisibleCount(pageSize)
    lastAutoLoadScrollY.current = window.scrollY
  }, [orgFilter, repoFilter, typeFilter])

  useEffect(() => {
    const loadMoreElement = loadMoreRef.current

    if (!loadMoreElement || !hasMore) {
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        if (!entries[0]?.isIntersecting) {
          return
        }

        const currentScrollY = window.scrollY

        if (currentScrollY <= lastAutoLoadScrollY.current + 64) {
          return
        }

        lastAutoLoadScrollY.current = currentScrollY
        setVisibleCount(count => Math.min(count + pageSize, groups.length))
      },
      { rootMargin: '100px' },
    )

    observer.observe(loadMoreElement)

    return () => observer.disconnect()
  }, [groups.length, hasMore])

  function selectOrg(org: string) {
    setOrgFilter(org)
    setRepoFilter(allValue)
  }

  function resetFilters() {
    setTypeFilter(allValue)
    setOrgFilter(allValue)
    setRepoFilter(allValue)
  }

  return (
    <>
      <p className="mt-8 text-center font-mono text-xs uppercase tracking-[0.18em] text-foreground/55">
        Updated {formatUpdatedAt(generatedAt)}
      </p>

      <ActivityStatsGrid stats={stats} />

      <ActivityFilters
        typeFilter={typeFilter}
        orgFilter={orgFilter}
        repoFilter={repoFilter}
        orgOptions={orgOptions}
        repoOptions={repoOptions}
        onTypeChange={setTypeFilter}
        onOrgChange={selectOrg}
        onRepoChange={setRepoFilter}
      />

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        {groups.length > 0 ? (
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-foreground/55">
            Showing {groups.length} contributions
          </p>
        ) : null}
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={resetFilters}
            className="font-mono text-xs uppercase tracking-[0.18em] text-primary-light transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Reset filters
          </button>
        ) : null}
      </div>

      <ActivityList
        groups={visibleGroups}
        hasMore={hasMore}
        loadMoreRef={loadMoreRef}
        onLoadMore={() => setVisibleCount(count => Math.min(count + pageSize, groups.length))}
      />
    </>
  )
}
