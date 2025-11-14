// middleware.js
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { user } } = await supabase.auth.getUser();

  // If user is not signed in and the current path is /chat, redirect to /login
  if (!user && req.nextUrl.pathname.startsWith('/chat')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If user is signed in and the current path is /login, redirect to /chat
  if (user && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/chat', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/chat/:path*', '/login'],
};