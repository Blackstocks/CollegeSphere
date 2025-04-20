import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Skip middleware for API routes and static files
  if (
    req.nextUrl.pathname.startsWith("/api") ||
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  const res = NextResponse.next()

  // For client-side auth, we should let the auth context handle protected routes
  // The middleware should only handle public routes that require redirection

  // Public routes that don't need auth
  const publicRoutes = ["/login", "/register", "/"]

  // Check if the route is public
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname)

  // Let the client-side auth context handle the rest
  return res
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
