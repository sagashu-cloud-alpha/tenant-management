// Server-side guard for pages the sidebar hides for non-Owners (Users, Roles,
// Settings) — hiding the nav link doesn't stop someone typing the URL directly,
// and the backend would just 403 the page's data calls, so redirect up front
// instead of letting that page blow up.
import { redirect } from "next/navigation"
import { serverFetch } from "@/lib/server-fetch"
import { canAccessAdmin } from "@/lib/permissions"
import type { CurrentUserResponseDto } from "@/lib/api-types"

export async function requireAdminAccess(): Promise<CurrentUserResponseDto> {
  const me = await serverFetch<CurrentUserResponseDto>("/me")
  if (!canAccessAdmin(me.roles)) {
    redirect("/tenants")
  }
  return me
}
