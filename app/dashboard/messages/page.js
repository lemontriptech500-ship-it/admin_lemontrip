'use client'

import { useEffect, useState } from 'react'
import { listContactMessages, updateContactMessageStatus } from '@/lib/adminApi'
import { PageHeader, StatusBadge, Spinner, ErrorNotice, EmptyState, Pagination } from '@/components/ui'
import Modal from '@/components/Modal'

const STATUSES = ['', 'received', 'email_sent', 'email_failed', 'resolved']

export default function MessagesPage() {
  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState(null)
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [updating, setUpdating] = useState(false)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const result = await listContactMessages({ status, page, limit: 20 })
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
  }, [status, page])

  async function markResolved(message) {
    setUpdating(true)
    try {
      await updateContactMessageStatus(message.id, 'resolved')
      setSelected(null)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div>
      <PageHeader title="Contact messages" description="Messages submitted through the LemonTrip contact form." />

      <div className="mb-4 flex flex-wrap gap-2">
        <select className="field-input !w-auto" value={status} onChange={(event) => { setPage(1); setStatus(event.target.value) }}>
          <option value="">All statuses</option>
          {STATUSES.filter(Boolean).map((option) => (
            <option key={option} value={option}>{option.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      <div className="panel">
        {error ? <ErrorNotice message={error} onRetry={load} /> : loading ? <Spinner /> : rows.length === 0 ? (
          <EmptyState title="No messages match this filter" />
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((message) => (
                  <tr key={message.id} className="cursor-pointer" onClick={() => setSelected(message)}>
                    <td>
                      <p className="text-ink">{message.name}</p>
                      <p className="text-xs text-ink-soft">{message.email}</p>
                    </td>
                    <td>{message.subject}</td>
                    <td><StatusBadge status={message.status} /></td>
                    <td className="text-ink-soft">{new Date(message.createdAt).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination meta={meta} onPageChange={setPage} />
          </>
        )}
      </div>

      {selected ? (
        <Modal title={selected.subject} onClose={() => setSelected(null)}>
          <div className="space-y-3 text-sm">
            <p className="text-ink-soft">
              {selected.name} · {selected.email} · {selected.phone}
            </p>
            <p className="whitespace-pre-wrap text-ink">{selected.message}</p>
            <div className="flex items-center justify-between border-t border-line pt-3">
              <StatusBadge status={selected.status} />
              {selected.status !== 'resolved' ? (
                <button disabled={updating} onClick={() => markResolved(selected)} className="btn-primary !px-3 !py-1.5 text-xs">
                  Mark resolved
                </button>
              ) : null}
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}
