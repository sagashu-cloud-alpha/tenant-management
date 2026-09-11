import Link from "next/link"
import { redirect } from "next/navigation"
import { ShieldAlert, LogOut, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AvatarMark } from "@/components/avatar-mark"
import { serverFetch } from "@/lib/server-fetch"
import type { CurrentUserResponseDto } from "@/lib/api-types"

export const dynamic = "force-dynamic"

function messageFor(me: CurrentUserResponseDto): { title: string; body: string } {
  if (!me.provisioned) {
    return {
      title: "No account found",
      body: "Your sign-in was successful, but there's no Cloud Alpha account for this identity yet. Ask an administrator to create one for you.",
    }
  }
  if (me.status === "INVITED") {
    return {
      title: "Invitation pending",
      body: "Your account has been created but hasn't been activated yet. An administrator needs to activate it before you can sign in.",
    }
  }
  return {
    title: "Account deactivated",
    body: "Your account is no longer active. If you believe this is a mistake, contact an administrator to have it reactivated.",
  }
}

// Reached when GET /api/v1/me reports the caller's account isn't ACTIVE — see
// app/(dashboard)/layout.tsx, which is where every dashboard route gets sent here from.
export default async function UnauthorizedPage() {
  const me = await serverFetch<CurrentUserResponseDto>("/me")
  if (me.active) {
    redirect("/tenants")
  }

  const { title, body } = messageFor(me)

  return (
    <div className="min-h-screen bg-[var(--bg-raised)] bg-secondary/30 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[420px] bg-card border border-border rounded-xl p-10 shadow-lg flex flex-col gap-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <AvatarMark initials="CA" size="sm" variant="brand" shape="rounded" />
            <span className="text-lg font-bold tracking-tight text-foreground">Cloud Alpha</span>
          </div>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--red-bg)] text-[var(--red)]">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1.5">{body}</p>
          {me.email && (
            <p className="text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1.5 font-mono">
              <Mail className="h-3.5 w-3.5" /> {me.email}
            </p>
          )}
        </div>

        <Button asChild variant="outline" className="w-full h-10">
          <Link href="/auth/logout">
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Link>
        </Button>

        <p className="text-center text-[13px] text-muted-foreground">
          Wrong account? <Link href="/auth/logout" className="text-primary font-medium hover:underline">Sign out</Link> and try again.
        </p>
      </div>
    </div>
  )
}
