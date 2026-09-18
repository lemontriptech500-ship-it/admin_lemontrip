import { NextResponse } from 'next/server'

export function middleware(request) {
  const isPresent = request.cookies.get('lt_admin_present')?.value === '1'
  const { pathname } = request.nextUrl

  if (pathname === '/') {
    return NextResponse.redirect(new URL(isPresent ? '/dashboard' : '/login', request.url))
  }
  if (pathname.startsWith('/dashboard') && !isPresent) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (pathname === '/login' && isPresent) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/login'],
}
