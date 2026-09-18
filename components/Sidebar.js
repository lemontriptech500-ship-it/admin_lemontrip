'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { clearSession } from '@/lib/api'
import {
  GridIcon,
  TicketIcon,
  UsersIcon,
  CouponIcon,
  BlogIcon,
  PassportIcon,
  MailIcon,
  MegaphoneIcon,
  LogoutIcon,
} from './icons'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: GridIcon, exact: true },
  { href: '/dashboard/bookings', label: 'Bookings', icon: TicketIcon },
  { href: '/dashboard/users', label: 'Users', icon: UsersIcon },
  { href: '/dashboard/coupons', label: 'Coupons', icon: CouponIcon },
  { href: '/dashboard/blog', label: 'Blog', icon: BlogIcon },
  { href: '/dashboard/visa', label: 'Visa applications', icon: PassportIcon },
  { href: '/dashboard/messages', label: 'Contact messages', icon: MailIcon },
  { href: '/dashboard/newsletter', label: 'Newsletter', icon: MegaphoneIcon },
]

export default function Sidebar({ user }) {
  const pathname = usePathname()
  const router = useRouter()

  function handleLogout() {
    clearSession()
    router.replace('/login')
  }

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col bg-chrome text-paper-raised">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="flex h-8 w-8 items-center justify-center bg-citrus text-chrome font-display font-bold">L</span>
        <div className="leading-tight">
          <p className="font-display font-semibold text-[15px] tracking-tight">LemonTrip</p>
          <p className="text-[11px] text-paper-raised/50">Admin console</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          const ItemIcon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 text-[13.5px] transition-colors ${
                active
                  ? 'bg-chrome-raised text-citrus'
                  : 'text-paper-raised/70 hover:bg-chrome-raised hover:text-paper-raised'
              }`}
            >
              <ItemIcon size={17} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-chrome-line px-4 py-4">
        <p className="truncate text-[12px] text-paper-raised/50">{user?.email}</p>
        <button
          onClick={handleLogout}
          className="mt-2 flex items-center gap-2 text-[13px] text-paper-raised/80 hover:text-citrus"
        >
          <LogoutIcon size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
