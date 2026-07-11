'use client'

import { useId, useMemo, useState } from 'react'

import {
  type ActivityThread,
  allValue,
  eventCountBadge,
  feedDateRange,
  filterEvents,
  filterEventsByProjectAndSearch,
  formatActivityDate,
  formatStatusLabel,
  formatUpdatedAt,
  groupEventsToThreads,
  groupThreadsByMonth,
  overviewCounts,
  overviewTypeOptions,
  pageSize,
  paginateThreads,
  repoOwner,
  repositoryOptionsForOrg,
  resolveRepositoryAfterOrgChange,
  statusTone,
  type TypeFilter,
  typeLabelForThread,
  uniqueSorted,
  visibleActivityEvents,
} from './activity-helpers'
import type { BtcFossEvent, BtcFossEventType } from './types'

type ActivityViewProps = {
  events: BtcFossEvent[]
  generatedAt: string
  profileUrl: string
}

const filterLabelClass = 'font-mono text-xs uppercase tracking-wide text-foreground/65'
const filterControlClass =
  'h-10 rounded-md border border-foreground/12 bg-background px-3 font-mono text-xs text-foreground transition-colors hover:border-foreground/30 focus-visible:border-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
const filterButtonClass = `${filterControlClass} inline-flex items-center justify-center uppercase tracking-wide text-foreground/65 aria-pressed:border-primary-light aria-pressed:text-primary-light`
const metaClass = 'font-mono text-xs uppercase tracking-wide text-foreground/65'

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

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`h-3.5 w-3.5 shrink-0 text-foreground/55 transition-colors group-hover:text-primary-light group-focus-within:text-primary-light ${className ?? ''}`}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 3H3.5A1.5 1.5 0 0 0 2 4.5v8A1.5 1.5 0 0 0 3.5 14h8A1.5 1.5 0 0 0 13 12.5V10" />
      <path d="M9 2h5v5" />
      <path d="M14 2 7.5 8.5" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 3.5h12l-4.5 5.2V13l-3-1.5V8.7L2 3.5z" />
    </svg>
  )
}

function StatusBadge({ status }: { status: string }) {
  const label = formatStatusLabel(status)
  if (label.length === 0) {
    return null
  }

  const tone = statusTone(status)
  const toneClass =
    tone === 'positive'
      ? 'border-primary/40 text-primary-light'
      : tone === 'amber'
        ? 'border-amber-400/40 text-amber-300'
        : 'border-foreground/12 text-foreground/65'

  return (
    <span
      className={`w-fit shrink-0 rounded border px-1.5 py-0.5 font-mono text-xs uppercase tracking-wide ${toneClass}`}
    >
      {label}
    </span>
  )
}

/** Compact type label for narrow meta rows (mobile). */
function shortTypeLabel(thread: ActivityThread): string {
  if (thread.type === 'pull_request') {
    return thread.eventCount > 1 ? 'PRs' : 'PR'
  }
  return typeLabelForThread(thread)
}

function ActivityThreadRow({ thread }: { thread: ActivityThread }) {
  const badge = eventCountBadge(thread)
  const statusLabel = formatStatusLabel(thread.status)
  const typeLabel = typeLabelForThread(thread)
  const hasStatus = statusLabel.length > 0

  return (
    <article className="group relative px-3 py-3 transition-colors hover:bg-foreground/[0.05] focus-within:bg-foreground/[0.05] active:bg-foreground/[0.05]">
      <a
        href={thread.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <span className="sr-only">{thread.title} (opens in new tab)</span>
      </a>

      <div className="pointer-events-none relative z-10 min-w-0">
        <div className="flex items-start gap-2">
          <h2 className="min-w-0 flex-1 break-words text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary-light group-focus-within:text-primary-light tablet:text-xl">
            {thread.title}
            <ExternalLinkIcon className="ml-1.5 inline-block align-[-0.125em]" />
          </h2>
          {hasStatus ? (
            <span className="hidden shrink-0 pt-0.5 tablet:inline-flex">
              <StatusBadge status={thread.status} />
            </span>
          ) : null}
        </div>

        {/* Mobile: facts, then repo on its own line — no free wrap soup. */}
        <div className="mt-1.5 grid gap-1 tablet:hidden">
          {hasStatus ? <StatusBadge status={thread.status} /> : null}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className={`inline-flex shrink-0 items-center gap-1.5 ${metaClass}`}>
              <EventTypeIcon type={thread.type} />
              {shortTypeLabel(thread)}
            </span>
            <span className="text-foreground/25" aria-hidden="true">
              ·
            </span>
            <time className={`shrink-0 ${metaClass}`} dateTime={thread.latestTimestamp}>
              {formatActivityDate(thread.latestTimestamp)}
            </time>
            {badge ? (
              <>
                <span className="text-foreground/25" aria-hidden="true">
                  ·
                </span>
                <span className={`shrink-0 ${metaClass} rounded border border-foreground/12 px-1.5 py-0.5`}>
                  {badge}
                </span>
              </>
            ) : null}
          </div>
          <span className={`min-w-0 break-all ${metaClass} normal-case tracking-normal`}>{thread.repository}</span>
        </div>

        {/* Tablet+: single meta line. */}
        <div className="mt-1.5 hidden min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 tablet:flex">
          <span className={`inline-flex shrink-0 items-center gap-1.5 ${metaClass}`}>
            <EventTypeIcon type={thread.type} />
            {typeLabel}
          </span>
          <span className={`min-w-0 break-all ${metaClass} normal-case tracking-normal`}>{thread.repository}</span>
          <time className={`shrink-0 ${metaClass}`} dateTime={thread.latestTimestamp}>
            {formatActivityDate(thread.latestTimestamp)}
          </time>
          {badge ? (
            <span className={`shrink-0 ${metaClass} rounded border border-foreground/12 px-1.5 py-0.5`}>{badge}</span>
          ) : null}
        </div>
      </div>
    </article>
  )
}

function TypeOverview({
  selected,
  counts,
  onChange,
}: {
  selected: TypeFilter
  counts: ReturnType<typeof overviewCounts>
  onChange: (value: TypeFilter) => void
}) {
  return (
    <div role="group" aria-label="Activity type" className="flex flex-wrap gap-2">
      {overviewTypeOptions.map(option => {
        const count = counts[option.value]

        return (
          <button
            key={option.value}
            type="button"
            aria-label={`${option.label}: ${count}`}
            aria-pressed={selected === option.value}
            onClick={() => onChange(option.value)}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-foreground/12 bg-foreground/[0.03] px-3 transition-colors hover:border-foreground/30 focus-visible:border-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-pressed:border-primary-light aria-pressed:bg-foreground/[0.06]"
          >
            <span
              className={`font-mono text-xs uppercase tracking-wide ${
                selected === option.value ? 'text-primary-light' : 'text-foreground/65'
              }`}
            >
              <span className="tablet:hidden">{option.value === 'pull_request' ? 'PRs' : option.label}</span>
              <span className="hidden tablet:inline">{option.label}</span>
            </span>
            <span className="font-mono text-xs text-foreground">{count}</span>
          </button>
        )
      })}
    </div>
  )
}

export function BitcoinFossActivityView({ events, generatedAt, profileUrl }: ActivityViewProps) {
  const searchId = useId()
  const orgId = useId()
  const repoId = useId()
  const projectDetailsId = useId()

  const [typeFilter, setTypeFilter] = useState<TypeFilter>(allValue)
  const [search, setSearch] = useState('')
  const [orgFilter, setOrgFilter] = useState<string>(allValue)
  const [repoFilter, setRepoFilter] = useState<string>(allValue)
  const [showProjectFilters, setShowProjectFilters] = useState(false)
  const [visibleCount, setVisibleCount] = useState(pageSize)

  const visibleEvents = useMemo(() => visibleActivityEvents(events), [events])
  const orgOptions = useMemo(() => uniqueSorted(visibleEvents.map(event => repoOwner(event.repo))), [visibleEvents])
  const repoOptions = useMemo(() => repositoryOptionsForOrg(visibleEvents, orgFilter), [visibleEvents, orgFilter])

  const projectFilteredEvents = useMemo(
    () =>
      filterEventsByProjectAndSearch(visibleEvents, {
        search,
        organization: orgFilter,
        repository: repoFilter,
      }),
    [visibleEvents, search, orgFilter, repoFilter],
  )

  const typeCounts = useMemo(() => overviewCounts(projectFilteredEvents), [projectFilteredEvents])

  const filteredEvents = useMemo(
    () =>
      filterEvents(visibleEvents, {
        type: typeFilter,
        search,
        organization: orgFilter,
        repository: repoFilter,
      }),
    [visibleEvents, typeFilter, search, orgFilter, repoFilter],
  )

  const threads = useMemo(() => groupEventsToThreads(filteredEvents), [filteredEvents])
  const { visible, hasMore, nextPageSize } = paginateThreads(threads, visibleCount)
  const monthSections = useMemo(() => groupThreadsByMonth(visible), [visible])

  const dateRange = useMemo(() => feedDateRange(visibleEvents), [visibleEvents])
  const updatedLabel = formatUpdatedAt(generatedAt)

  const hasActiveFilters =
    typeFilter !== allValue || search.trim().length > 0 || orgFilter !== allValue || repoFilter !== allValue

  function resetPagination() {
    setVisibleCount(pageSize)
  }

  function selectType(value: TypeFilter) {
    setTypeFilter(value)
    resetPagination()
  }

  function selectSearch(value: string) {
    setSearch(value)
    resetPagination()
  }

  function selectOrg(org: string) {
    setOrgFilter(org)
    setRepoFilter(resolveRepositoryAfterOrgChange(visibleEvents, org, repoFilter))
    resetPagination()
  }

  function selectRepo(repo: string) {
    setRepoFilter(repo)
    resetPagination()
  }

  function resetFilters() {
    setTypeFilter(allValue)
    setSearch('')
    setOrgFilter(allValue)
    setRepoFilter(allValue)
    setShowProjectFilters(false)
    resetPagination()
  }

  const projectSelects = (
    <div className="grid gap-4 tablet:grid-cols-2">
      <label htmlFor={orgId} className={`grid content-start gap-2 ${filterLabelClass}`}>
        Organization
        <select
          id={orgId}
          value={orgFilter}
          onChange={event => selectOrg(event.target.value)}
          className={`${filterControlClass} w-full normal-case tracking-normal`}
        >
          <option value={allValue}>All organizations</option>
          {orgOptions.map(org => (
            <option key={org} value={org}>
              {org}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor={repoId} className={`grid content-start gap-2 ${filterLabelClass}`}>
        Repository
        <select
          id={repoId}
          value={repoFilter}
          onChange={event => selectRepo(event.target.value)}
          className={`${filterControlClass} w-full normal-case tracking-normal`}
        >
          <option value={allValue}>All repositories</option>
          {repoOptions.map(repo => (
            <option key={repo} value={repo}>
              {repo}
            </option>
          ))}
        </select>
      </label>
    </div>
  )

  return (
    <>
      <div className="mt-3 text-center">
        <p className="font-mono text-xs leading-relaxed tracking-wide text-foreground/65">
          {dateRange ? <span className="inline-block">{dateRange.label}</span> : null}
          {dateRange && updatedLabel ? (
            <span className="mx-1.5 inline-block text-foreground/35" aria-hidden="true">
              ·
            </span>
          ) : null}
          {updatedLabel ? <span className="inline-block">Updated {updatedLabel}</span> : null}
          {dateRange || updatedLabel ? (
            <span className="mx-1.5 inline-block text-foreground/35" aria-hidden="true">
              ·
            </span>
          ) : null}
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-primary-light transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            GitHub profile
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        </p>
      </div>

      <section className="mt-6" aria-label="Activity overview and filters">
        <TypeOverview selected={typeFilter} counts={typeCounts} onChange={selectType} />

        <div className="mt-3 border-y border-foreground/12 py-3">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
            <label htmlFor={searchId} className="min-w-0">
              <span className="sr-only">Search activity</span>
              <input
                id={searchId}
                type="search"
                value={search}
                onChange={event => selectSearch(event.target.value)}
                placeholder="Title or repository"
                autoComplete="off"
                className={`${filterControlClass} w-full normal-case tracking-normal placeholder:text-foreground/40`}
              />
            </label>
            <button
              type="button"
              aria-label={
                orgFilter !== allValue || repoFilter !== allValue ? 'Project filters (active)' : 'Project filters'
              }
              aria-expanded={showProjectFilters}
              aria-controls={projectDetailsId}
              onClick={() => setShowProjectFilters(current => !current)}
              className={`${filterButtonClass} relative h-10 w-10 shrink-0 px-0`}
            >
              <FilterIcon />
              {orgFilter !== allValue || repoFilter !== allValue ? (
                <span
                  className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary-light"
                  aria-hidden="true"
                />
              ) : null}
            </button>
          </div>

          {showProjectFilters ? (
            <div id={projectDetailsId} className="mt-3">
              {projectSelects}
            </div>
          ) : null}
        </div>
      </section>

      {hasActiveFilters && threads.length > 0 ? (
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={resetFilters}
            className="font-mono text-xs uppercase tracking-wide text-primary-light transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Clear filters
          </button>
        </div>
      ) : null}

      {threads.length === 0 ? (
        <div className="mt-5 rounded-md border border-foreground/12 bg-foreground/[0.03] px-4 py-8 text-center tablet:px-6">
          <p className="text-base uppercase leading-snug text-foreground tablet:text-lg">
            No activity matches these filters.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 font-mono text-xs uppercase tracking-wide text-primary-light transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="mt-5 grid gap-8">
            {monthSections.map(section => (
              <section key={section.key} aria-labelledby={`month-${section.key}`}>
                <h3
                  id={`month-${section.key}`}
                  className="mb-4 font-mono text-xs uppercase tracking-wide text-foreground/65"
                >
                  {section.heading}
                </h3>
                <ol className="divide-y divide-foreground/12 overflow-hidden rounded-md border border-foreground/12 bg-foreground/[0.03]">
                  {section.threads.map(thread => (
                    <li key={thread.key}>
                      <ActivityThreadRow thread={thread} />
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>

          {hasMore ? (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount(count => Math.min(count + pageSize, threads.length))}
                className="rounded-md border border-foreground/12 px-4 py-3 font-mono text-xs uppercase tracking-wide text-foreground/65 transition-colors hover:border-foreground/30 hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Show next {nextPageSize}
              </button>
            </div>
          ) : null}
        </>
      )}
    </>
  )
}
