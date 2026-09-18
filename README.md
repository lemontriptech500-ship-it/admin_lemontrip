# LemonTrip Admin

Internal operations console for LemonTrip — bookings, users, coupons, blog, visa
applications, contact inbox and newsletter — built with Next.js (App Router)
and talking to the existing `lemontrip-backend` API.

## 1. Apply the backend patch first

This dashboard needs a handful of admin-only endpoints that didn't exist yet
in `lemontrip-backend`. Three files were added/changed there (see the
`lemontrip-backend-admin-patch` you received alongside this project):

- `src/controllers/adminController.js` (new)
- `src/routes/adminRoutes.js` (new)
- `src/app.js` (two lines added: import + `app.use('/api/v1/admin', adminRoutes)`)

Drop those into your existing backend repo, commit, and deploy/restart it as
usual. No database migrations are needed — every new endpoint reads/writes
tables that already exist. Make sure `ADMIN_EMAILS` in the backend's `.env`
lists the email address(es) you'll sign in with here.

## 2. Local development

```bash
npm install
cp .env.local.example .env.local   # point NEXT_PUBLIC_API_BASE_URL at your backend
npm run dev
```

Open http://localhost:3000 — you'll land on `/login`. Sign in with an account
whose email is in the backend's `ADMIN_EMAILS`.

## 3. Deploying for free

This is a low-traffic internal tool, so the free tier of either host is
comfortably enough:

- **Vercel (recommended, matches your existing frontend)**: `vercel` CLI or
  connect the GitHub repo in the dashboard. Set `NEXT_PUBLIC_API_BASE_URL` to
  your deployed backend's URL (e.g. `https://api.lemontrip.in`) in Project →
  Settings → Environment Variables. Vercel's Hobby plan has no cost for this
  kind of usage — a few staff loading pages a day is nowhere near its limits.
- Keep the backend's CORS `FRONTEND_URL` / `VERCEL_FRONTEND_URL` list updated
  (`src/config/env.js`) to include this dashboard's deployed URL, or its
  requests will be blocked by CORS.

Cost/credit-conservation notes:
- Every page here fetches on demand (no polling, no background refresh), so
  it only calls the backend when someone is actually looking at a page.
- Pagination is server-side (20 rows/page) — large tables (bookings, users)
  never pull more than one page at a time.
- No third-party UI/icon libraries are installed — icons are plain inline
  SVG — so the install and build stay small and fast, which matters if
  you're building this via a metered CI/CD or AI coding tool.

## Pages

| Route | What it does |
|---|---|
| `/dashboard` | Stat tiles + recent bookings preview |
| `/dashboard/bookings` | All bookings (flights/hotels/buses/trains/packages), filter + paginate |
| `/dashboard/users` | All signed-up users, search |
| `/dashboard/coupons` | Create/edit/activate/delete discount codes |
| `/dashboard/blog` | Create/edit/delete blog posts |
| `/dashboard/visa` | Review visa applications, view documents, update status |
| `/dashboard/messages` | Contact-form inbox, mark resolved |
| `/dashboard/newsletter` | Compose + send/test newsletters, view subscriber list |

## Notes / known limitations

- Auth is JWT-based like the rest of LemonTrip: the token lives in
  `localStorage` and is sent as `Authorization: Bearer <token>` on every
  request. A small non-secret cookie is also set purely so page navigation
  doesn't flash the wrong screen — the backend's `requireAuth` +
  `requireAdmin` middleware is the actual security boundary, not the cookie.
- Marking a contact message "resolved" requires the backend's
  `contact_messages.status` check constraint to allow that value. If yours
  doesn't yet, the UI will tell you the exact `ALTER TABLE` to run.
