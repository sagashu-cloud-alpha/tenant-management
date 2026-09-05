"use client"

import { Mail, Phone, AtSign, CalendarClock, Shield, StickyNote } from "lucide-react"
import { type User, COLORS, getStatusBadgeClass, getRoleBadgeClass } from "@/lib/user-data"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function formatDate(dateStr: string) {
  if (!dateStr || dateStr === "—") return "—"
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

export default function UserDetailContent({ user: u }: { user: User }) {
  const c = COLORS[u.colorIdx]
  const initials = `${u.firstName[0] ?? ""}${u.lastName[0] ?? ""}`.toUpperCase()

  return (
    <div className="space-y-6">
      {/* User Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div
            className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold"
            style={{ background: c.bg, color: c.color }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold font-display text-foreground">{u.name}</h2>
            <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate">{u.id} · @{u.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-start sm:ml-auto">
          <Badge className={getStatusBadgeClass(u.status)}>{u.status}</Badge>
        </div>
      </div>

      {/* Contact Info */}
      <Card className="border border-[var(--border)] bg-[var(--bg2)] p-4 sm:p-5">
        <div className="flex items-center gap-2.5 text-sm sm:text-base font-semibold mb-4 sm:mb-5">
          <AtSign className="h-4 w-4 text-[var(--color-brand)]" />
          <span className="text-foreground">Contact Information</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Email", value: u.email, icon: Mail },
            { label: "Phone", value: u.phone || "—", icon: Phone },
            { label: "Created", value: formatDate(u.created), icon: CalendarClock },
            { label: "Last Active", value: formatDate(u.lastActive), icon: CalendarClock },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-2.5">
              <item.icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-mono text-[var(--text3)] uppercase tracking-wider mb-0.5 font-semibold">{item.label}</div>
                <div className="text-sm font-medium text-foreground break-all">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Access */}
      <Card className="border border-[var(--border)] bg-[var(--bg2)] p-4 sm:p-5">
        <div className="flex items-center gap-2.5 text-sm sm:text-base font-semibold mb-4 sm:mb-5">
          <Shield className="h-4 w-4 text-[var(--color-brand)]" />
          <span className="text-foreground">Assigned Roles</span>
        </div>
        {u.roles.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {u.roles.map((r) => (
              <Badge key={r} className={getRoleBadgeClass(r)}>{r}</Badge>
            ))}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">No roles assigned</span>
        )}
      </Card>

      {/* Notes */}
      <Card className="border border-[var(--border)] bg-[var(--bg2)] p-4 sm:p-5">
        <div className="flex items-center gap-2.5 text-sm sm:text-base font-semibold mb-4 sm:mb-5">
          <StickyNote className="h-4 w-4 text-[var(--color-brand)]" />
          <span className="text-foreground">Notes</span>
        </div>
        <p className="text-sm text-muted-foreground">{u.notes || "No notes added."}</p>
      </Card>
    </div>
  )
}
