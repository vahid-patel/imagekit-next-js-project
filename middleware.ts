import withAuth from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const { pathname } = req.nextUrl;
        if (
          pathname.startsWith('/api/auth') ||
          pathname === '/login' ||
          pathname === '/register'
        )
          return true;

        if(pathname === '/' || pathname.startsWith('/api/videos'))
            return true

        return !!token
      },
    },
  }
);

export const config = {
  // Apply middleware to all routes except API routes, static files, and images
  matcher: ['/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)'],
};
