'use client'

import { useEffect, useState } from 'react'
import { listNewsletterSubscribers, sendNewsletter, sendTestNewsletter } from '@/lib/adminApi'
import { PageHeader, StatusBadge, Spinner, ErrorNotice, EmptyState, Pagination } from '@/components/ui'

export default function NewsletterPage() {
  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [sendMessage, setSendMessage] = useState('')
  const [sendError, setSendError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const result = await listNewsletterSubscribers({ page, limit: 20 })
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
  }, [page])

  async function handleSend(isTest) {
    setSending(true)
    setSendError('')
    setSendMessage('')
    try {
      const result = isTest ? await sendTestNewsletter({ subject, content }) : await sendNewsletter({ subject, content })
      setSendMessage(result.data.message)
    } catch (err) {
      setSendError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <PageHeader title="Newsletter" description="Compose an update and send it to active subscribers." />

      <div className="panel mb-6">
        <div className="panel-header">
          <h2 className="font-display text-sm font-semibold text-ink">Compose</h2>
        </div>
        <div className="space-y-4 px-5 py-5">
          <div>
            <label className="field-label">Subject</label>
            <input className="field-input" maxLength={200} value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="This month's LemonTrip deals" />
          </div>
          <div>
            <label className="field-label">Content (HTML supported)</label>
            <textarea rows={8} className="field-input" value={content} onChange={(event) => setContent(event.target.value)} placeholder="<p>Hello traveller…</p>" />
          </div>

          {sendError ? <p className="text-sm text-cherry">{sendError}</p> : null}
          {sendMessage ? <p className="text-sm text-rind">{sendMessage}</p> : null}

          <div className="flex gap-2">
            <button className="btn-ghost" disabled={sending || !subject || !content} onClick={() => handleSend(true)}>
              {sending ? 'Sending…' : 'Send test'}
            </button>
            <button className="btn-primary" disabled={sending || !subject || !content} onClick={() => handleSend(false)}>
              {sending ? 'Sending…' : 'Send to all subscribers'}
            </button>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2 className="font-display text-sm font-semibold text-ink">Subscribers</h2>
        </div>
        {error ? <ErrorNotice message={error} onRetry={load} /> : loading ? <Spinner /> : rows.length === 0 ? (
          <EmptyState title="No subscribers yet" />
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Subscribed</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((subscriber) => (
                  <tr key={subscriber.id}>
                    <td>{subscriber.email}</td>
                    <td className="text-ink-soft">{subscriber.source}</td>
                    <td><StatusBadge status={subscriber.active ? 'active' : 'inactive'} /></td>
                    <td className="text-ink-soft">{new Date(subscriber.subscribedAt).toLocaleDateString('en-IN')}</td>
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
