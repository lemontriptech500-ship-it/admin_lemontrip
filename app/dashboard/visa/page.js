'use client'

import { useEffect, useState } from 'react'
import { listVisaApplications, getVisaApplication, updateVisaApplicationStatus, getVisaDocumentUrl } from '@/lib/adminApi'
import { PageHeader, StatusBadge, Spinner, ErrorNotice, EmptyState, Pagination } from '@/components/ui'
import Modal from '@/components/Modal'

const STATUSES = ['', 'submitted', 'in_review', 'approved', 'rejected']
const DOCUMENT_TYPES = [
  { key: 'passport_front', label: 'Passport (front)' },
  { key: 'passport_back', label: 'Passport (back)' },
  { key: 'photograph', label: 'Photograph' },
]

export default function VisaApplicationsPage() {
  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState(null)
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [docLinks, setDocLinks] = useState({})

  async function load() {
    setLoading(true)
    setError('')
    try {
      const result = await listVisaApplications({ status, page, limit: 20 })
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

  async function openDetail(application) {
    setDetail({ id: application.id })
    setDocLinks({})
    setDetailLoading(true)
    try {
      const result = await getVisaApplication(application.id)
      setDetail(result.data)
    } catch (err) {
      setError(err.message)
      setDetail(null)
    } finally {
      setDetailLoading(false)
    }
  }

  async function handleStatusChange(newStatus) {
    if (!detail) return
    setUpdating(true)
    try {
      await updateVisaApplicationStatus(detail.id, newStatus)
      setDetail({ ...detail, status: newStatus })
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdating(false)
    }
  }

  async function loadDocument(type) {
    if (!detail) return
    try {
      const result = await getVisaDocumentUrl(detail.id, type)
      setDocLinks((prev) => ({ ...prev, [type]: result.data.url }))
      window.open(result.data.url, '_blank', 'noopener')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <PageHeader title="Visa applications" description="Review submissions and update their status." />

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
          <EmptyState title="No visa applications match this filter" />
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Applicant</th>
                  <th>Country</th>
                  <th>Visa type</th>
                  <th>Status</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((application) => (
                  <tr key={application.id} className="cursor-pointer" onClick={() => openDetail(application)}>
                    <td className="font-mono text-xs">{application.id}</td>
                    <td>
                      <p className="text-ink">{application.applicantName}</p>
                      <p className="text-xs text-ink-soft">{application.email}</p>
                    </td>
                    <td>{application.country}</td>
                    <td>{application.visaType}</td>
                    <td><StatusBadge status={application.status} /></td>
                    <td className="text-ink-soft">{application.submittedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination meta={meta} onPageChange={setPage} />
          </>
        )}
      </div>

      {detail ? (
        <Modal title={`Application ${detail.id}`} onClose={() => setDetail(null)}>
          {detailLoading ? <Spinner /> : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-ink-soft">Applicant</p><p className="text-ink">{detail.applicantName}</p></div>
                <div><p className="text-ink-soft">Email</p><p className="text-ink">{detail.email}</p></div>
                <div><p className="text-ink-soft">Passport number</p><p className="font-mono text-ink">{detail.passportNumber}</p></div>
                <div><p className="text-ink-soft">Country / visa type</p><p className="text-ink">{detail.country} · {detail.visaType}</p></div>
                <div><p className="text-ink-soft">Intended entry date</p><p className="text-ink">{detail.intendedEntryDate || '—'}</p></div>
                <div><p className="text-ink-soft">Submitted</p><p className="text-ink">{detail.submittedAt}</p></div>
              </div>

              <div>
                <p className="field-label">Documents</p>
                <div className="flex flex-wrap gap-2">
                  {DOCUMENT_TYPES.map((doc) => (
                    <button key={doc.key} onClick={() => loadDocument(doc.key)} className="btn-ghost !px-3 !py-1.5 text-xs">
                      {doc.label} ↗
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-xs text-ink-faint">Links open a signed URL valid for 5 minutes.</p>
              </div>

              <div>
                <p className="field-label">Update status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.filter(Boolean).map((option) => (
                    <button
                      key={option}
                      disabled={updating || detail.status === option}
                      onClick={() => handleStatusChange(option)}
                      className={`badge capitalize ${detail.status === option ? 'bg-citrus/30 border-citrus-dim text-ink' : 'bg-transparent border-line text-ink-soft hover:border-chrome'}`}
                    >
                      {option.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Modal>
      ) : null}
    </div>
  )
}
