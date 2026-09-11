import { NextRequest, NextResponse } from "next/server"
import { auth0 } from "@/lib/auth0"

// Routes that don't require a signed-in session; everything else is protected by default.
const PUBLIC_PATHS = ["/", "/login"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // API routes handle their own auth and return JSON 401s — a redirect here would break res.json() in callers.
  if (pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  // Mounts /auth/login, /auth/logout, /auth/callback, etc.
  const authRes = await auth0.middleware(request)

  if (pathname.startsWith("/auth/")) {
    return authRes
  }

  if (PUBLIC_PATHS.includes(pathname)) {
    return authRes
  }

  const session = await auth0.getSession(request)
  if (!session) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("returnTo", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return authRes
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
