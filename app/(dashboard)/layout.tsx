import { redirect } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { CurrentUserProvider } from "@/components/current-user-provider"
import { serverFetch } from "@/lib/server-fetch"
import type { CurrentUserResponseDto } from "@/lib/api-types"

// Every route under here now depends on a live /me call (see below) — never
// statically prerender any of them, same as the individual pages that already
// declared this for their own data dependencies.
export const dynamic = "force-dynamic"

// Gates every dashboard route in one place: an authenticated caller whose local
// account isn't ACTIVE (not provisioned, still INVITED, or deactivated) is sent to
// /unauthorized instead of rendering the app shell — see MeController on the backend.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const me = await serverFetch<CurrentUserResponseDto>("/me")
  if (!me.active) {
    redirect("/unauthorized")
  }

  return (
    <CurrentUserProvider roles={me.roles}>
      <AppLayout>{children}</AppLayout>
    </CurrentUserProvider>
  )
}
