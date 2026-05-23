"use client"

import { useState } from "react"
import { tenants } from "@/lib/tenant-data"
import TenantDetailContent from "@/components/tenant-detail-content"
import { Card } from "@/components/ui/card"

export default function TenantDetailPage() {
  const [selectedId, setSelectedId] = useState("")
  const selectedTenant = tenants.find((t) => t.id === selectedId) ?? null

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">Tenant Detail</h1>
        <p className="text-sm text-muted-foreground">Deep-dive into tenant resources, images, and services</p>
      </div>

      {/* Tenant Selector */}
      <Card className="border border-[var(--border)] bg-[var(--bg2)] p-5">
        <div className="flex items-center gap-4 flex-col sm:flex-row">
          <span className="text-xs font-mono text-[var(--text3)] uppercase tracking-wider font-semibold shrink-0">Select Tenant</span>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="flex-1 h-9 rounded-lg border border-[var(--border)] bg-[var(--bg3)] px-3 py-2 text-sm text-foreground outline-none cursor-pointer appearance-none hover:bg-[var(--bg4)] transition-colors"
          >
            <option value="">— Choose a tenant —</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.id})
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Content */}
      {!selectedTenant ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3 text-center">
          <i className="ti ti-building-skyscraper text-5xl opacity-30" />
          <p className="text-sm">Select a tenant from the dropdown to view its details</p>
        </div>
      ) : (
        <TenantDetailContent tenant={selectedTenant} />
      )}
    </div>
  )
}