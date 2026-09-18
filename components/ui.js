'use client'

const STATUS_STYLES = {
  confirmed: 'bg-rind-soft text-rind border-rind/30',
  CONFIRMED: 'bg-rind-soft text-rind border-rind/30',
  PAYMENT_SUCCESS: 'bg-rind-soft text-rind border-rind/30',
  approved: 'bg-rind-soft text-rind border-rind/30',
  resolved: 'bg-rind-soft text-rind border-rind/30',
  active: 'bg-rind-soft text-rind border-rind/30',
  pending: 'bg-amber-soft text-amber border-amber/30',
  PENDING_PAYMENT: 'bg-amber-soft text-amber border-amber/30',
  submitted: 'bg-amber-soft text-amber border-amber/30',
  in_review: 'bg-amber-soft text-amber border-amber/30',
  received: 'bg-amber-soft text-amber border-amber/30',
  email_sent: 'bg-amber-soft text-amber border-amber/30',
  failed: 'bg-cherry-soft text-cherry border-cherry/30',
  BOOKING_FAILED: 'bg-cherry-soft text-cherry border-cherry/30',
  rejected: 'bg-cherry-soft text-cherry border-cherry/30',
  cancelled: 'bg-ink/5 text-ink-soft border-ink/15',
  CANCELLED: 'bg-ink/5 text-ink-soft border-ink/15',
  inactive: 'bg-ink/5 text-ink-soft border-ink/15',
}

export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-ink/5 text-ink-soft border-ink/15'
  const label = String(status || '—').replace(/_/g, ' ').toLowerCase()
  return <span className={`badge ${style}`}>{label}</span>
}

export function StatTile({ label, value, accent }) {
  return (
    <div className={`stat-tile ${accent ? 'is-accent' : ''}`}>
      <span className="font-display text-2xl font-semibold tabular-nums">{value}</span>
      <span className="text-xs text-ink-soft">{label}</span>
    </div>
  )
}

export function PageHeader({ title, description, action }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink">{title}</h1>
        {description ? <p className="mt-1 text-sm text-ink-soft">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function Pagination({ meta, onPageChange }) {
  if (!meta || meta.totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between border-t border-line px-5 py-3 text-sm text-ink-soft">
      <span>
        Page {meta.page} of {meta.totalPages} · {meta.total} total
      </span>
      <div className="flex gap-2">
        <button
          className="btn-ghost !px-3 !py-1.5"
          disabled={meta.page <= 1}
          onClick={() => onPageChange(meta.page - 1)}
        >
          Previous
        </button>
        <button
          className="btn-ghost !px-3 !py-1.5"
          disabled={meta.page >= meta.totalPages}
          onClick={() => onPageChange(meta.page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export function EmptyState({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 px-5 py-14 text-center">
      <p className="font-display text-sm font-medium text-ink">{title}</p>
      {description ? <p className="max-w-sm text-sm text-ink-soft">{description}</p> : null}
    </div>
  )
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center px-5 py-14">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-ink/15 border-t-chrome" />
    </div>
  )
}

export function ErrorNotice({ message, onRetry }) {
  return (
    <div className="mx-5 my-4 border border-cherry/30 bg-cherry-soft px-4 py-3 text-sm text-cherry">
      <p>{message}</p>
      {onRetry ? (
        <button onClick={onRetry} className="mt-1 font-medium underline underline-offset-2">
          Try again
        </button>
      ) : null}
    </div>
  )
}
