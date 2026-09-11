// BFF proxy: every backend call goes through here so the Auth0 access token is attached server-side, never in browser JS.
import { NextRequest, NextResponse } from "next/server"
import { auth0 } from "@/lib/auth0"

// Server-only — the real Spring Boot backend.
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

async function forward(request: NextRequest, path: string[]) {
  const session = await auth0.getSession()
  if (!session) {
    return NextResponse.json({ status: 401, message: "Not authenticated" }, { status: 401 })
  }

  let accessToken: string
  try {
    const tokenResult = await auth0.getAccessToken()
    accessToken = tokenResult.token
  } catch {
    return NextResponse.json({ status: 401, message: "Unable to obtain an access token" }, { status: 401 })
  }

  const targetUrl = `${BACKEND_BASE_URL}/${path.join("/")}${request.nextUrl.search}`
  const hasBody = !["GET", "HEAD"].includes(request.method)

  let backendRes: Response
  try {
    backendRes = await fetch(targetUrl, {
      method: request.method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": request.headers.get("content-type") ?? "application/json",
      },
      body: hasBody ? await request.text() : undefined,
      cache: "no-store",
    })
  } catch {
    return NextResponse.json(
      { status: 502, message: "Unable to reach the backend service." },
      { status: 502 },
    )
  }

  if (backendRes.status === 204) {
    return new NextResponse(null, { status: 204 })
  }

  const responseBody = await backendRes.text()
  return new NextResponse(responseBody, {
    status: backendRes.status,
    headers: { "Content-Type": backendRes.headers.get("content-type") ?? "application/json" },
  })
}

type RouteContext = { params: Promise<{ path: string[] }> }

export async function GET(request: NextRequest, context: RouteContext) {
  return forward(request, (await context.params).path)
}
export async function POST(request: NextRequest, context: RouteContext) {
  return forward(request, (await context.params).path)
}
export async function PUT(request: NextRequest, context: RouteContext) {
  return forward(request, (await context.params).path)
}
export async function PATCH(request: NextRequest, context: RouteContext) {
  return forward(request, (await context.params).path)
}
export async function DELETE(request: NextRequest, context: RouteContext) {
  return forward(request, (await context.params).path)
}
