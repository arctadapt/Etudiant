import { NextRequest, NextResponse } from 'next/server';
import { verify } from '@/lib/session';

export async function middleware(req: NextRequest) {
  const s = await verify(req.cookies.get('session')?.value);
  if (s?.role !== 'admin') {
    const url = new URL('/login', req.url);
    url.searchParams.set('next', req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
}

export const config = { matcher: ['/admin/:path*'] };
