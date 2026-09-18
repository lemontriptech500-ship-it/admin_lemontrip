'use client'

import { useEffect, useState } from 'react'
import { listUsers } from '@/lib/adminApi'
import { PageHeader, Spinner, ErrorNotice, EmptyState, Pagination } from '@/components/ui'

export default function UsersPage() {
  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const result = await listUsers({ search, page, limit: 20 })
      setRows(result.data)
      setMeta(result.meta)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(load, search ? 300 : 0)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page])

  return (
    <div>
      <PageHeader title="Users" description="Everyone who has signed up on LemonTrip." />

      <div className="mb-4">
        <input
          className="field-input max-w-xs"
          placeholder="Search by name or email"
          value={search}
          onChange={(event) => {
            setPage(1)
            setSearch(event.target.value)
          }}
        />
      </div>

      <div className="panel">
        {error ? <ErrorNotice message={error} onRetry={load} /> : loading ? <Spinner /> : rows.length === 0 ? (
          <EmptyState title="No users match this search" />
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Sign-up method</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((user) => (
                  <tr key={user.id}>
                    <td className="text-ink">{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || '—'}</td>
                    <td className="capitalize">{user.provider}</td>
                    <td className="text-ink-soft">{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
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
