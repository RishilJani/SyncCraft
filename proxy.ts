import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define paths that are accessible without authentication
    const isPublicPath = ['/login', '/register', '/forgot-password', '/reset-password'].includes(path);

    // Check if the user is authenticated (we look for the userId cookie used in the app)
    const userId = request.cookies.get('userId')?.value || '';

    // Redirect unauthenticated users to the login page if they try to access a protected route
    if (!isPublicPath && !userId && path !== '/') {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    // Similarly, protect the root path if it's not considered public.
    // Our root path redirects to login anyway, but checking it properly is safe.
    if (!isPublicPath && !userId && path === '/') {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    const response = NextResponse.next();

    // If navigating directly to /login, clear existing cookies to ensure safe state
    if (path === '/login') {
        response.cookies.delete('userId');
        response.cookies.delete('userName');
        response.cookies.delete('email');
        response.cookies.delete('role');
        response.cookies.delete('createdAt');
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - .*\\..* (any file with an extension, like .css, .png)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ],
};
