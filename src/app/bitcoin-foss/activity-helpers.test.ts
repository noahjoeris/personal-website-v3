import { describe, expect, it } from 'vitest'

import {
  allValue,
  eventCountBadge,
  feedDateRange,
  filterEvents,
  filterEventsByProjectAndSearch,
  formatActivityDate,
  formatStatusLabel,
  formatUpdatedAt,
  groupEventsToThreads,
  groupKey,
  groupThreadsByMonth,
  normalizeThreadTitle,
  overviewCounts,
  pageSize,
  paginateThreads,
  repositoryOptionsForOrg,
  resolveRepositoryAfterOrgChange,
  statusTone,
  visibleActivityEvents,
} from './activity-helpers'
import type { BtcFossEvent } from './types'

function event(partial: Partial<BtcFossEvent> & Pick<BtcFossEvent, 'id' | 'event_type'>): BtcFossEvent {
  return {
    repo: partial.repo ?? 'bitcoindevkit/bdk',
    title: partial.title ?? 'Some title',
    url: partial.url ?? 'https://github.com/bitcoindevkit/bdk/pull/1',
    occurred_at: partial.occurred_at ?? '2026-06-15T12:00:00Z',
    status: partial.status ?? 'OPEN',
    thread_id: partial.thread_id,
    thread_title: partial.thread_title,
    thread_url: partial.thread_url,
    ...partial,
  }
}

describe('visibleActivityEvents', () => {
  it('hides commit events by default', () => {
    const events = [
      event({ id: '1', event_type: 'pull_request' }),
      event({ id: '2', event_type: 'commit', title: 'commit' }),
    ]
    expect(visibleActivityEvents(events)).toHaveLength(1)
    expect(visibleActivityEvents(events)[0]?.event_type).toBe('pull_request')
  })
})

describe('groupKey', () => {
  it('groups reviews by event_type + thread_id', () => {
    const a = event({
      id: 'r1',
      event_type: 'review',
      thread_id: 'org/repo#1',
    })
    const b = event({
      id: 'r2',
      event_type: 'review',
      thread_id: 'org/repo#1',
    })
    expect(groupKey(a)).toBe(groupKey(b))
    expect(groupKey(a)).toBe('review:org/repo#1')
  })

  it('groups comments by event_type + thread_id', () => {
    const a = event({ id: 'c1', event_type: 'comment', thread_id: 'org/repo#2' })
    const b = event({ id: 'c2', event_type: 'comment', thread_id: 'org/repo#2' })
    expect(groupKey(a)).toBe('comment:org/repo#2')
    expect(groupKey(a)).toBe(groupKey(b))
  })

  it('never collapses missing thread_id', () => {
    const a = event({ id: 'r1', event_type: 'review' })
    const b = event({ id: 'r2', event_type: 'review' })
    expect(groupKey(a)).toBe('review:r1')
    expect(groupKey(b)).toBe('review:r2')
    expect(groupKey(a)).not.toBe(groupKey(b))
  })

  it('keeps PRs and issues individual even with thread_id', () => {
    const pr = event({ id: 'pr1', event_type: 'pull_request', thread_id: 'org/repo#1' })
    expect(groupKey(pr)).toBe('pull_request:pr1')
    const issue = event({ id: 'i1', event_type: 'issue', thread_id: 'org/repo#3' })
    expect(groupKey(issue)).toBe('issue:i1')
  })

  it('does not merge review and comment on same thread', () => {
    const review = event({ id: 'r1', event_type: 'review', thread_id: 'org/repo#1' })
    const comment = event({ id: 'c1', event_type: 'comment', thread_id: 'org/repo#1' })
    expect(groupKey(review)).not.toBe(groupKey(comment))
  })
})

describe('normalizeThreadTitle', () => {
  it('prefers thread_title', () => {
    const e = event({
      id: '1',
      event_type: 'review',
      title: 'Reviewed Fix something',
      thread_title: 'Fix something',
    })
    expect(normalizeThreadTitle(e)).toBe('Fix something')
  })

  it('strips Reviewed / Commented on prefixes from title fallback', () => {
    expect(
      normalizeThreadTitle(
        event({ id: '1', event_type: 'review', title: 'Reviewed fix the bug', thread_title: undefined }),
      ),
    ).toBe('fix the bug')
    expect(
      normalizeThreadTitle(
        event({ id: '2', event_type: 'comment', title: 'Commented on open discussion', thread_title: undefined }),
      ),
    ).toBe('open discussion')
  })
})

describe('groupEventsToThreads', () => {
  it('collapses multiple reviews on same thread with latest status and count badge', () => {
    const events = [
      event({
        id: 'r2',
        event_type: 'review',
        thread_id: 'org/repo#1',
        thread_title: 'Add feature',
        thread_url: 'https://github.com/org/repo/pull/1',
        occurred_at: '2026-06-20T10:00:00Z',
        status: 'APPROVED',
        title: 'Reviewed Add feature',
      }),
      event({
        id: 'r1',
        event_type: 'review',
        thread_id: 'org/repo#1',
        thread_title: 'Add feature',
        thread_url: 'https://github.com/org/repo/pull/1',
        occurred_at: '2026-06-18T10:00:00Z',
        status: 'COMMENTED',
        title: 'Reviewed Add feature',
      }),
    ]

    const threads = groupEventsToThreads(events)
    expect(threads).toHaveLength(1)
    expect(threads[0]?.eventCount).toBe(2)
    expect(threads[0]?.status).toBe('APPROVED')
    expect(threads[0]?.latestTimestamp).toBe('2026-06-20T10:00:00Z')
    expect(threads[0]?.title).toBe('Add feature')
    expect(threads[0]?.url).toBe('https://github.com/org/repo/pull/1')
    expect(eventCountBadge(threads[0]!)).toBe('2 reviews')
  })

  it('orders threads by latest activity descending', () => {
    const threads = groupEventsToThreads([
      event({ id: '1', event_type: 'issue', occurred_at: '2026-01-01T00:00:00Z' }),
      event({ id: '2', event_type: 'pull_request', occurred_at: '2026-06-01T00:00:00Z' }),
    ])
    expect(threads.map(t => t.key)).toEqual(['pull_request:2', 'issue:1'])
  })

  it('leaves single PRs and issues ungrouped', () => {
    const threads = groupEventsToThreads([
      event({ id: 'pr1', event_type: 'pull_request', thread_id: 'org/repo#9' }),
      event({ id: 'i1', event_type: 'issue', thread_id: 'org/repo#8' }),
    ])
    expect(threads).toHaveLength(2)
    expect(eventCountBadge(threads[0]!)).toBeNull()
  })
})

describe('filters and counts', () => {
  const sample: BtcFossEvent[] = [
    event({
      id: 'pr1',
      event_type: 'pull_request',
      repo: 'bitcoindevkit/bdk',
      title: 'Fix wallet',
      occurred_at: '2026-06-01T00:00:00Z',
    }),
    event({
      id: 'r1',
      event_type: 'review',
      repo: 'bitcoindevkit/bdk-cli',
      title: 'Reviewed docs',
      thread_id: 't1',
      thread_title: 'Update docs',
      occurred_at: '2026-06-02T00:00:00Z',
    }),
    event({
      id: 'r2',
      event_type: 'review',
      repo: 'lightning/lnd',
      title: 'Reviewed channel',
      thread_id: 't2',
      thread_title: 'Channel open',
      occurred_at: '2026-06-03T00:00:00Z',
    }),
    event({
      id: 'c1',
      event_type: 'comment',
      repo: 'bitcoindevkit/bdk',
      title: 'Commented on fix',
      thread_id: 't3',
      occurred_at: '2026-06-04T00:00:00Z',
    }),
  ]

  it('overview counts ignore type but respect search and project filters', () => {
    const projectFiltered = filterEventsByProjectAndSearch(sample, {
      search: '',
      organization: 'bitcoindevkit',
      repository: allValue,
    })
    const counts = overviewCounts(projectFiltered)
    expect(counts.all).toBe(3)
    expect(counts.pull_request).toBe(1)
    expect(counts.review).toBe(1)
    expect(counts.comment).toBe(1)
    expect(counts.issue).toBe(0)
  })

  it('search matches title and repository', () => {
    const byTitle = filterEventsByProjectAndSearch(sample, {
      search: 'wallet',
      organization: allValue,
      repository: allValue,
    })
    expect(byTitle.map(e => e.id)).toEqual(['pr1'])

    const byRepo = filterEventsByProjectAndSearch(sample, {
      search: 'bdk-cli',
      organization: allValue,
      repository: allValue,
    })
    expect(byRepo.map(e => e.id)).toEqual(['r1'])
  })

  it('type filter applies only to list events; raw event vs thread counts', () => {
    const filtered = filterEvents(sample, {
      type: 'review',
      search: '',
      organization: allValue,
      repository: allValue,
    })
    expect(filtered).toHaveLength(2)
    const threads = groupEventsToThreads(filtered)
    expect(threads).toHaveLength(2)
    expect(threads.reduce((sum, thread) => sum + thread.eventCount, 0)).toBe(filtered.length)
  })

  it('combined org + repo + type filters', () => {
    const filtered = filterEvents(sample, {
      type: 'pull_request',
      search: '',
      organization: 'bitcoindevkit',
      repository: 'bitcoindevkit/bdk',
    })
    expect(filtered.map(e => e.id)).toEqual(['pr1'])
  })
})

describe('repository reset', () => {
  const events = [
    event({ id: '1', event_type: 'issue', repo: 'bitcoindevkit/bdk' }),
    event({ id: '2', event_type: 'issue', repo: 'lightning/lnd' }),
  ]

  it('lists repos for selected organization', () => {
    expect(repositoryOptionsForOrg(events, 'bitcoindevkit')).toEqual(['bitcoindevkit/bdk'])
    expect(repositoryOptionsForOrg(events, allValue)).toEqual(['bitcoindevkit/bdk', 'lightning/lnd'])
  })

  it('resets incompatible repository when org changes', () => {
    expect(resolveRepositoryAfterOrgChange(events, 'lightning', 'bitcoindevkit/bdk')).toBe(allValue)
    expect(resolveRepositoryAfterOrgChange(events, 'bitcoindevkit', 'bitcoindevkit/bdk')).toBe('bitcoindevkit/bdk')
    expect(resolveRepositoryAfterOrgChange(events, allValue, 'lightning/lnd')).toBe('lightning/lnd')
  })
})

describe('pagination', () => {
  it('pages with accurate remaining and next size', () => {
    const threads = groupEventsToThreads(
      Array.from({ length: 30 }, (_, index) =>
        event({
          id: `e${index}`,
          event_type: 'issue',
          occurred_at: `2026-05-${String((index % 28) + 1).padStart(2, '0')}T00:00:00Z`,
        }),
      ),
    )
    const first = paginateThreads(threads, pageSize)
    expect(first.visible).toHaveLength(25)
    expect(first.hasMore).toBe(true)
    expect(first.remaining).toBe(5)
    expect(first.nextPageSize).toBe(5)

    const second = paginateThreads(threads, pageSize + first.nextPageSize)
    expect(second.visible).toHaveLength(30)
    expect(second.hasMore).toBe(false)
  })
})

describe('month headings', () => {
  it('groups threads under UTC month keys in order', () => {
    const threads = groupEventsToThreads([
      event({ id: '1', event_type: 'issue', occurred_at: '2026-06-10T00:00:00Z' }),
      event({ id: '2', event_type: 'issue', occurred_at: '2026-05-10T00:00:00Z' }),
      event({ id: '3', event_type: 'issue', occurred_at: '2026-06-01T00:00:00Z' }),
    ])
    const sections = groupThreadsByMonth(threads)
    expect(sections.map(s => s.key)).toEqual(['2026-06', '2026-05'])
    expect(sections[0]?.threads).toHaveLength(2)
    expect(sections[1]?.threads).toHaveLength(1)
  })
})

describe('dates', () => {
  it('formats short activity dates without year', () => {
    expect(formatActivityDate('2026-07-09T12:00:00Z')).toBe('Jul 9')
    expect(formatActivityDate('2025-12-01T00:00:00Z')).toBe('Dec 1')
  })

  it('falls back for invalid activity dates', () => {
    expect(formatActivityDate('not-a-date')).toBe('Unknown date')
    expect(formatActivityDate('')).toBe('Unknown date')
  })

  it('omits invalid update dates', () => {
    expect(formatUpdatedAt('not-a-date')).toBeNull()
    expect(formatUpdatedAt('')).toBeNull()
    expect(formatUpdatedAt('2026-07-11T07:58:37Z')).toMatch(/2026/)
  })

  it('computes feed date range label', () => {
    const range = feedDateRange([
      event({ id: '1', event_type: 'issue', occurred_at: '2025-01-15T00:00:00Z' }),
      event({ id: '2', event_type: 'issue', occurred_at: '2026-06-15T00:00:00Z' }),
    ])
    expect(range?.label).toMatch(/2025/)
    expect(range?.label).toMatch(/2026/)
  })

  it('returns null range when no valid dates', () => {
    expect(feedDateRange([])).toBeNull()
  })
})

describe('status helpers', () => {
  it('maps labels and tones', () => {
    expect(formatStatusLabel('CHANGES_REQUESTED')).toBe('Changes requested')
    expect(formatStatusLabel('APPROVED')).toBe('Approved')
    expect(statusTone('MERGED')).toBe('positive')
    expect(statusTone('OPEN')).toBe('positive')
    expect(statusTone('APPROVED')).toBe('positive')
    expect(statusTone('CHANGES_REQUESTED')).toBe('positive')
    expect(statusTone('CLOSED')).toBe('neutral')
    expect(statusTone('COMMENTED')).toBe('neutral')
    expect(statusTone('')).toBe('neutral')
  })
})
