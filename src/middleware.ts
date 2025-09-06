import { HOME_PAGE_ROUTE, LOGIN_URL_ROUTE } from '@constants/AppConstant';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware function to handle user authentication and redirection.
 * @param {NextRequest} request The incoming request object.
 * @returns {NextResponse} The response object to be sent.
 */
export function middleware(request: NextRequest) {
  
  const { pathname } = request.nextUrl;
  const tokenValue = request.cookies.get("center_token")?.value || false;

  // Exclude requests to static files from authentication checks
  const isStaticFile = pathname.startsWith('/_next/static') || pathname.startsWith('/images');
  if (isStaticFile) {
    return NextResponse.next();
  }

  // Redirect to login page if token is not present and current page is not login page
  if (!tokenValue && pathname !== LOGIN_URL_ROUTE) {
    return NextResponse.redirect(new URL(LOGIN_URL_ROUTE, request.url));
  }

  // If user is authenticated and pathname is '/', redirect to HOME_PAGE
  if (tokenValue && pathname === '/') {
    return NextResponse.redirect(new URL(HOME_PAGE_ROUTE, request.url));
  }

  // If user is authenticated and pathname is not '/', rewrite the current pathname
  if (tokenValue && pathname !== '/') {
    return NextResponse.rewrite(new URL(pathname, request.url));
  }

  // Redirect to login page for any other unauthorized access
  return NextResponse.rewrite(new URL(LOGIN_URL_ROUTE, request.url));
}

export const config = {
   matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    
    // '/:path',
  ],
};