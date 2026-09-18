'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getStats, listBookings } from '@/lib/adminApi'
import { PageHeader, StatTile, StatusBadge, Spinner, ErrorNotice, EmptyState } from '@/components/ui'

export default function OverviewPage() {
  const [stats, setStats] = useState(null)
  const [bookings, setBookings] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [statsResult, bookingsResult] = await Promise.all([
        getStats(),
        listBookings({ page: 1, limit: 8 }),
      ])
      setStats(statsResult.data)
      setBookings(bookingsResult.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div>
      <PageHeader title="Overview" description="Platform activity across every booking channel." />

      {error ? <ErrorNotice message={error} onRetry={load} /> : null}

      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <StatTile label="Users" value={stats.totalUsers} />
            <StatTile label="Confirmed bookings" value={stats.totalBookings} accent />
            <StatTile label="Confirmed revenue" value={`₹${Number(stats.confirmedRevenue).toLocaleString('en-IN')}`} />
            <StatTile label="Active coupons" value={stats.activeCoupons} />
            <StatTile label="Visa applications pending" value={stats.pendingVisaApplications} />
            <StatTile label="Unread messages" value={stats.unreadContactMessages} />
          </div>

          <div className="panel mt-6">
            <div className="panel-header">
              <h2 className="font-display text-sm font-semibold text-ink">Recent bookings</h2>
              <Link href="/dashboard/bookings" className="text-sm font-medium text-ink-soft hover:text-ink">
                View all
              </Link>
            </div>
            {bookings.length === 0 ? (
              <EmptyState title="No bookings yet" description="Confirmed and pending bookings across flights, hotels, buses and trains will show up here." />
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Type</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={`${booking.type}-${booking.id}`}>
                      <td className="font-mono text-xs">{booking.bookingReference}</td>
                      <td className="capitalize">{booking.type}</td>
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
            )}
          </div>
        </>
      )}
    </div>
  )
}
