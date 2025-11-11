import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

// Routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/calculator',
  '/api/auth',
  '/auth/google-ads/callback',
  '/_next',
  '/favicon.ico',
  '/api/public',
]

// Routes that should redirect authenticated users
const authRoutes = ['/login', '/signup']

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname.startsWith(route))
}

function isAuthRoute(pathname: string): boolean {
  return authRoutes.some(route => pathname === route)
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authToken = request.cookies.get('auth-token')?.value

  // Allow public routes and API routes
  if (isPublicRoute(pathname)) {
    // If user is authenticated and trying to access login/signup, redirect to dashboard
    if (authToken && isAuthRoute(pathname)) {
      try {
        // Verify token is valid
        jwt.verify(authToken, process.env.JWT_SECRET || 'your-secret-key')
        return NextResponse.redirect(new URL('/dashboard/campaigns', request.url))
      } catch (error) {
        // Token is invalid, allow access to auth routes
        return NextResponse.next()
      }
    }
    return NextResponse.next()
  }

  // Check if user is authenticated for protected routes
  if (!authToken) {
    // Store the original URL to redirect after login
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    // Verify the token
    jwt.verify(authToken, process.env.JWT_SECRET || 'your-secret-key')
    return NextResponse.next()
  } catch (error) {
    // Token is invalid, clear it and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('auth-token')
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}