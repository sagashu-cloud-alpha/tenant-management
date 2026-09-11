"use client"

import { Tag } from "lucide-react"
import { type Tenant, COLORS } from "@/lib/tenant-data"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

function getBadgeClass(v: string) {
  if (v === "active" || v === "running") return "bg-[var(--green-bg)] text-[var(--green)] border border-[var(--green-border)] hover:brightness-110"
  if (v === "suspended" || v === "warning") return "bg-[var(--amber-bg)] text-[var(--amber)] border border-[var(--amber-border)] hover:brightness-110"
  if (v === "starter") return "bg-[var(--teal-bg)] text-[var(--teal)] border border-[var(--teal-border)] hover:brightness-110"
  if (v === "pro") return "bg-[var(--blue-bg)] text-[var(--blue)] border border-[var(--blue-bg)] hover:brightness-110"
  if (v === "enterprise") return "bg-[var(--purple-bg)] text-[var(--purple)] border border-[var(--purple-border)] hover:brightness-110"
  return "bg-[var(--bg4)] text-[var(--text2)] border border-[var(--border2)]"
}

export default function TenantDetailContent({ tenant: t }: { tenant: Tenant }) {
  const c = COLORS[t.colorIdx]
  const initials = t.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()

  return (
    <div className="space-y-6">
      {/* Tenant Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold" style={{ background: c.bg, color: c.color }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold font-display text-foreground">{t.name}</h2>
            <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate">{t.id} · {t.subdomain}.cloudaxis.io</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-start sm:ml-auto">
          <Badge className={getBadgeClass(t.status)}>{t.status}</Badge>
          <Badge className={getBadgeClass(t.plan)}>{t.plan}</Badge>
        </div>
      </div>

      {/* Details */}
      <Card className="border border-[var(--border)] bg-[var(--bg2)] p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Tenant ID", value: t.id, mono: true },
            { label: "Environment", value: t.env, mono: false },
            { label: "Admin Email", value: t.email, mono: true },
            { label: "Contact Phone", value: t.phone || "—", mono: true },
            { label: "Billing", value: t.billing, mono: false },
            { label: "Created", value: formatDate(t.created), mono: false },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-xs font-mono text-[var(--text3)] uppercase tracking-wider mb-1 font-semibold">{item.label}</div>
              <div className={`text-sm font-medium text-foreground break-all ${item.mono ? "font-mono text-xs text-muted-foreground" : ""}`}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {t.description && (
        <Card className="border border-[var(--border)] bg-[var(--bg2)] p-4 sm:p-5">
          <div className="text-xs font-mono text-[var(--text3)] uppercase tracking-wider mb-1.5 font-semibold">Description</div>
          <p className="text-sm text-foreground">{t.description}</p>
        </Card>
      )}

      {/* Tags */}
      <Card className="border border-[var(--border)] bg-[var(--bg2)] p-4 sm:p-5">
        <div className="flex items-center gap-2.5 text-sm sm:text-base font-semibold mb-4 sm:mb-5">
          <Tag className="h-4 w-4 text-[var(--color-brand)]" />
          <span className="text-foreground">Tags</span>
        </div>
        {t.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {t.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="font-mono">
                {tag}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">No tags assigned</span>
        )}
      </Card>
    </div>
  )
}
