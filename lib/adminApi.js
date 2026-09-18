import { apiFetch, qs } from './api'

// ---- auth ----
export const login = (email, password) =>
  apiFetch('/api/v1/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })

export const me = () => apiFetch('/api/v1/auth/me')

// ---- dashboard ----
export const getStats = () => apiFetch('/api/v1/admin/stats')

// ---- users ----
export const listUsers = (params) => apiFetch(`/api/v1/admin/users${qs(params)}`)
export const getUser = (id) => apiFetch(`/api/v1/admin/users/${id}`)

// ---- bookings ----
export const listBookings = (params) => apiFetch(`/api/v1/admin/bookings${qs(params)}`)

// ---- coupons ----
export const listCoupons = () => apiFetch('/api/v1/admin/coupons')
export const createCoupon = (payload) => apiFetch('/api/v1/admin/coupons', { method: 'POST', body: JSON.stringify(payload) })
export const updateCoupon = (id, payload) => apiFetch(`/api/v1/admin/coupons/${id}`, { method: 'PATCH', body: JSON.stringify(payload) })
export const deleteCoupon = (id) => apiFetch(`/api/v1/admin/coupons/${id}`, { method: 'DELETE' })

// ---- blog ----
export const listBlogPosts = () => apiFetch('/api/v1/admin/blog')
export const createBlogPost = (payload) => apiFetch('/api/v1/admin/blog', { method: 'POST', body: JSON.stringify(payload) })
export const updateBlogPost = (id, payload) => apiFetch(`/api/v1/admin/blog/${id}`, { method: 'PATCH', body: JSON.stringify(payload) })
export const deleteBlogPost = (id) => apiFetch(`/api/v1/admin/blog/${id}`, { method: 'DELETE' })

// ---- visa applications ----
export const listVisaApplications = (params) => apiFetch(`/api/v1/admin/visa-applications${qs(params)}`)
export const getVisaApplication = (id) => apiFetch(`/api/v1/admin/visa-applications/${id}`)
export const updateVisaApplicationStatus = (id, status) =>
  apiFetch(`/api/v1/admin/visa-applications/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
export const getVisaDocumentUrl = (id, documentType) =>
  apiFetch(`/api/v1/admin/visa-applications/${id}/documents/${documentType}`)

// ---- contact messages ----
export const listContactMessages = (params) => apiFetch(`/api/v1/admin/contact-messages${qs(params)}`)
export const updateContactMessageStatus = (id, status) =>
  apiFetch(`/api/v1/admin/contact-messages/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })

// ---- newsletter ----
export const listNewsletterSubscribers = (params) => apiFetch(`/api/v1/admin/newsletter-subscribers${qs(params)}`)
export const sendNewsletter = (payload) => apiFetch('/api/v1/newsletter/send', { method: 'POST', body: JSON.stringify(payload) })
export const sendTestNewsletter = (payload) => apiFetch('/api/v1/newsletter/send-test', { method: 'POST', body: JSON.stringify(payload) })
