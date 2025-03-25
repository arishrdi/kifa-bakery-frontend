import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value
  const userRole = request.cookies.get("role")?.value // Assuming you store user role in cookies

  const publicPaths = ["/login",]
  const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  // Redirect to login if not authenticated and trying to access protected routes
  if (!accessToken && !isPublicPath && !request.nextUrl.pathname.startsWith("/_next")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect to dashboard if authenticated and trying to access public paths
  if (accessToken && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Role-based route restrictions
  if (accessToken) {
    const isAdmin = userRole === "admin"
    const isKasir = userRole === "kasir"

    // Admin can only access /dashboard/*
    if (isAdmin && !request.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // Kasir can only access /pos/*
    if (isKasir && !request.nextUrl.pathname.startsWith("/pos")) {
      return NextResponse.redirect(new URL("/pos", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}