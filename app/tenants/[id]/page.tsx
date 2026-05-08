"use client"

import { useState } from "react"
import { tenants } from "@/lib/tenant-data"
import TenantDetailContent from "@/components/tenant-detail-content"
import { Button } from "@/components/ui/button"

export default function TenantDetailPage() {
  const [selectedId, setSelectedId] = useState("")
  const selectedTenant = tenants.find((t) => t.id === selectedId) ?? null

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="font-display text-xl font-bold">Tenant Detail</div>
          <div className="text-xs text-muted-foreground mt-1">Deep-dive into tenant resources, images, and services</div>
        </div>
      </div>
      <div className="flex items-center gap-3 mb-6 rounded-xl border bg-card px-5 py-4">
        <span className="text-xs font-mono text-muted-foreground uppercase shrink-0">Select Tenant</span>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="flex h-9 w-full max-w-xs rounded-lg border border-input bg-background px-3 py-1 text-sm outline-none cursor-pointer"
        >
          <option value="">— Choose a tenant —</option>
          {tenants.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.id})</option>)}
        </select>
      </div>
      {!selectedTenant ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3 text-center">
          <i className="ti ti-building-skyscraper text-5xl opacity-30" />
          <p className="text-sm">Select a tenant from the dropdown to view its details</p>
        </div>
      ) : (
        <TenantDetailContent tenant={selectedTenant} />
      )}
    </>
  )
}