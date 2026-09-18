'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { getStats } from '@/lib/adminApi'
import { clearSession, getStoredUser, getToken } from '@/lib/api'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const [status, setStatus] = useState('checking') // checking | ready | denied
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.replace('/login')
      return
    }
    setUser(getStoredUser())

    // /admin/stats is gated by requireAuth + requireAdmin on the backend, so a
    // successful call is our proof this account is really an admin — not just
    // logged in.
    getStats()
      .then(() => setStatus('ready'))
      .catch((error) => {
        if (error.status === 401 || error.status === 403) {
          clearSession()
          router.replace('/login')
        } else {
          setStatus('denied')
        }
      })
  }, [router])

  if (status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-ink/15 border-t-chrome" />
      </div>
    )
  }

  if (status === 'denied') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-6 text-center">
        <div>
          <p className="font-display text-lg font-semibold text-ink">Could not reach the LemonTrip API</p>
          <p className="mt-2 text-sm text-ink-soft">Check that the backend is running and NEXT_PUBLIC_API_BASE_URL is correct, then reload.</p>
        </div>
      </div>
    )
  }

  return (
<div className="flex h-screen overflow-hidden bg-paper">
        <Sidebar user={user} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-8 py-7">{children}</main>
            </div>
  )
}
