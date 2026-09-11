// Fetch helper for Server Components (initial page data) — client-triggered calls use lib/http.ts instead.
import { cookies } from "next/headers"
import { normalizeError } from "@/lib/api-error"

const BASE_URL = `${process.env.APP_BASE_URL}/api/backend`

export async function serverFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    // Forward the incoming request's cookies onto this new server-side fetch; filter out getAll()'s phantom undefined-value entries so we don't send literal "name=undefined" cookies.
    const cookieHeader = (await cookies())
      .getAll()
      .filter((c) => typeof c.value === "string")
      .map((c) => `${c.name}=${c.value}`)
      .join("; ")
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      cache: "no-store",
      headers: { "Content-Type": "application/json", Cookie: cookieHeader, ...init?.headers },
    })
  } catch {
    throw normalizeError(new Error("Unable to reach the server. Check your connection and try again."))
  }

  if (!res.ok) {
    const body = await res.json().catch(() => undefined)
    throw normalizeError({
      isAxiosError: true,
      response: { status: res.status, data: body },
    })
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}
