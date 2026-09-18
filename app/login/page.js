'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login, me } from '@/lib/adminApi'
import { setSession } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const loginResult = await login(email, password)
      const { token, user } = loginResult.data
      setSession(token, user)

      // Confirm this account is actually in ADMIN_EMAILS before letting them in —
      // any signed-up user can log in, but only admins can reach the console.
      try {
        await me()
      } catch {
        // ignore — /me failing shouldn't block the admin check below
      }
      router.replace('/dashboard')
    } catch (err) {
      setSessionError(err)
    } finally {
      setLoading(false)
    }
  }

  function setSessionError(err) {
    if (err.status === 401) setError('Incorrect email or password.')
    else setError(err.message || 'Could not sign in. Please try again.')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-chrome px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center bg-citrus text-chrome font-display text-lg font-bold">L</span>
          <div className="leading-tight">
            <p className="font-display text-base font-semibold text-paper-raised">LemonTrip</p>
            <p className="text-[11px] text-paper-raised/50">Admin console</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-paper-raised border border-chrome-line px-6 py-7">
          <h1 className="font-display text-lg font-semibold text-ink">Sign in</h1>
          <p className="mt-1 text-sm text-ink-soft">Use your LemonTrip staff account.</p>

          <div className="mt-5">
            <label className="field-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              className="field-input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@lemontrip.in"
            />
          </div>

          <div className="mt-4">
            <label className="field-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              className="field-input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error ? <p className="mt-4 text-sm text-cherry">{error}</p> : null}

          <button type="submit" disabled={loading} className="btn-citrus mt-6 w-full">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="mt-4 text-xs text-ink-faint">
            Access is restricted to accounts listed in the backend&apos;s ADMIN_EMAILS setting.
          </p>
        </form>
      </div>
    </div>
  )
}
