import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const role = request.cookies.get('role')?.value

  if (role === 'editor' || role === 'publisher') {
    return NextResponse.next()
  }

  if (!role || role === 'viewer') {
    const url = request.nextUrl.clone()
    url.pathname = '/preview/home'
    return NextResponse.redirect(url)
  }

  return NextResponse.redirect(new URL('/preview/home', request.url))
}

export const config = {
  matcher: ['/studio/:path*'],
}
