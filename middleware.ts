import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    if (pathname.startsWith('/coach') && token?.role !== 'COACH' && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname
        if (
          pathname.startsWith('/customer') ||
          pathname.startsWith('/coach') ||
          pathname.startsWith('/admin')
        ) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/customer/:path*', '/coach/:path*', '/admin/:path*'],
}
