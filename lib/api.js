const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '')

const TOKEN_KEY = 'lt_admin_token'
const USER_KEY = 'lt_admin_user'

export function getToken() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null
  try {
    return JSON.parse(window.localStorage.getItem(USER_KEY) || 'null')
  } catch {
    return null
  }
}

// A plain (non-httpOnly) cookie is set alongside localStorage purely so the
// Next.js middleware can do a fast, no-flash redirect for signed-out visitors.
// It carries no secret — the real credential is the JWT, sent only via the
// Authorization header on API calls, and every admin route is still enforced
// server-side by the backend's requireAuth + requireAdmin middleware.
export function setSession(token, user) {
  window.localStorage.setItem(TOKEN_KEY, token)
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
  document.cookie = `lt_admin_present=1; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`
}

export function clearSession() {
  window.localStorage.removeItem(TOKEN_KEY)
  window.localStorage.removeItem(USER_KEY)
  document.cookie = 'lt_admin_present=; path=/; max-age=0'
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

export async function apiFetch(path, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  } catch {
    throw new ApiError(`Could not reach the LemonTrip API at ${API_BASE}. Check NEXT_PUBLIC_API_BASE_URL and that the backend is running.`, 0)
  }

  const contentType = response.headers.get('content-type') || ''
  const body = contentType.includes('application/json') ? await response.json().catch(() => null) : null

  if (!response.ok) {
    const message = body?.error?.message || `Request failed (${response.status})`
    throw new ApiError(message, response.status)
  }

  return body
}

export function qs(params = {}) {
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  if (!entries.length) return ''
  return `?${new URLSearchParams(entries).toString()}`
}
