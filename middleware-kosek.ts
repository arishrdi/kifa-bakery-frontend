import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This is a simplified middleware for demo purposes
// In a real application, you would implement proper authentication checks
export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.has("auth") // Check for auth cookie

  // Define public paths that don't require authentication
  const publicPaths = ["/login", "/forgot-password", "/register"]
  const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  // Redirect to login if trying to access protected routes while not logged in
  if (!isLoggedIn && !isPublicPath && !request.nextUrl.pathname.startsWith("/_next")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect to dashboard if trying to access login page while already logged in
  if (isLoggedIn && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Configure the paths that should trigger this middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

