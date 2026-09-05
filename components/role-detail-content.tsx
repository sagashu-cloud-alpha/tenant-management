"use client"

import { CalendarClock, Shield, Users as UsersIcon } from "lucide-react"
import { type Role, getRoleBadgeClass } from "@/lib/role-data"
import { users, COLORS } from "@/lib/user-data"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function formatDate(dateStr: string) {
  if (!dateStr || dateStr === "—") return "—"
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

export default function RoleDetailContent({ role: r }: { role: Role }) {
  const assignedUsers = users.filter((u) => u.roles.includes(r.name))

  return (
    <div className="space-y-6">
      {/* Role Header */}
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center bg-[var(--bg3)] border border-[var(--border)]">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-bold font-display text-foreground">{r.name}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{r.description || "No description"}</p>
        </div>
        <Badge className={getRoleBadgeClass(r.name)}>{r.name}</Badge>
      </div>

      {/* Meta */}
      <Card className="border border-[var(--border)] bg-[var(--bg2)] p-4 sm:p-5">
        <div className="flex items-center gap-2.5 text-sm sm:text-base font-semibold mb-4 sm:mb-5">
          <CalendarClock className="h-4 w-4 text-[var(--color-brand)]" />
          <span className="text-foreground">Details</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-mono text-[var(--text3)] uppercase tracking-wider mb-0.5 font-semibold">Role ID</div>
            <div className="text-sm font-medium text-foreground font-mono">{r.id}</div>
          </div>
          <div>
            <div className="text-xs font-mono text-[var(--text3)] uppercase tracking-wider mb-0.5 font-semibold">Created</div>
            <div className="text-sm font-medium text-foreground">{formatDate(r.created)}</div>
          </div>
        </div>
      </Card>

      {/* Users with this role */}
      <Card className="border border-[var(--border)] bg-[var(--bg2)] p-4 sm:p-5">
        <div className="flex items-center gap-2.5 text-sm sm:text-base font-semibold mb-4 sm:mb-5">
          <UsersIcon className="h-4 w-4 text-[var(--color-brand)]" />
          <span className="text-foreground">Users with this role</span>
          <span className="text-xs font-mono text-muted-foreground">({assignedUsers.length})</span>
        </div>
        {assignedUsers.length > 0 ? (
          <div className="flex flex-col gap-3">
            {assignedUsers.map((u) => {
              const c = COLORS[u.colorIdx]
              const initials = `${u.firstName[0] ?? ""}${u.lastName[0] ?? ""}`.toUpperCase()
              return (
                <div key={u.id} className="flex items-center gap-3">
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold"
                    style={{ background: c.bg, color: c.color }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{u.name}</p>
                    <p className="text-xs text-muted-foreground font-mono truncate">{u.email}</p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">No users assigned to this role</span>
        )}
      </Card>
    </div>
  )
}
