export const btcFossEventTypes = ['pull_request', 'issue', 'commit', 'review', 'comment'] as const

export type BtcFossEventType = (typeof btcFossEventTypes)[number]

export type BtcFossEvent = {
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
