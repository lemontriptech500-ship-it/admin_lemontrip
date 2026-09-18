'use client'

import { useEffect, useState } from 'react'
import { listBookings } from '@/lib/adminApi'
import { PageHeader, StatusBadge, Spinner, ErrorNotice, EmptyState, Pagination } from '@/components/ui'

const TYPES = ['all', 'flight', 'hotel', 'bus', 'train', 'package']
const STATUSES = ['', 'pending', 'confirmed', 'failed', 'cancelled', 'CONFIRMED', 'PENDING_PAYMENT', 'CANCELLED']

export default function BookingsPage() {
  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState(null)
  const [type, setType] = useState('all')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const result = await listBookings({ type, status, page, limit: 20 })
      setRows(result.data)
      setMeta(result.meta)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, status, page])

  function updateType(value) {
    setPage(1)
    setType(value)
  }

  function updateStatus(value) {
    setPage(1)
    setStatus(value)
  }

  return (
    <div>
      <PageHeader title="Bookings" description="Every flight, hotel, bus and train booking, across all customers." />

      <div className="mb-4 flex flex-wrap gap-2">
        <select className="field-input !w-auto" value={type} onChange={(event) => updateType(event.target.value)}>
          {TYPES.map((option) => (
            <option key={option} value={option}>{option === 'all' ? 'All types' : option}</option>
          ))}
        </select>
        <select className="field-input !w-auto" value={status} onChange={(event) => updateStatus(event.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.filter(Boolean).map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="panel">
        {error ? <ErrorNotice message={error} onRetry={load} /> : loading ? <Spinner /> : rows.length === 0 ? (
          <EmptyState title="No bookings match these filters" />
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Type</th>
                  <th>Item</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((booking) => (
                  <tr key={`${booking.type}-${booking.id}`}>
                    <td className="font-mono text-xs">{booking.bookingReference}</td>
                    <td className="capitalize">{booking.type}</td>
                    <td>{booking.title}</td>
                    <td>
                      <p className="text-ink">{booking.userName || '—'}</p>
                      <p className="text-xs text-ink-soft">{booking.userEmail}</p>
                    </td>
                    <td>{booking.currency} {Number(booking.amount).toLocaleString('en-IN')}</td>
                    <td><StatusBadge status={booking.status} /></td>
                    <td className="text-ink-soft">{new Date(booking.date).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination meta={meta} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
