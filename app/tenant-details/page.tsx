"use client"

import { useState } from "react"
import { tenants } from "@/lib/tenant-data"
import TenantDetailContent from "@/components/tenant-detail-content"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function TenantDetailPage() {
  const [selectedId, setSelectedId] = useState("")
  const selectedTenant = tenants.find((t) => t.id === selectedId) ?? null

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1.5">
        <h1 className="font-display text-xl sm:text-2xl font-bold">Tenant Detail</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">Deep-dive into tenant resources, images, and services</p>
      </div>
      
      {/* Tenant Selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-xl border bg-card p-4">
        <span className="text-xs font-mono text-muted-foreground uppercase shrink-0">Select Tenant</span>
        <Select value={selectedId} onValueChange={setSelectedId}>
          <SelectTrigger className="w-full sm:max-w-xs">
            <SelectValue placeholder="Choose a tenant..." />
          </SelectTrigger>
          <SelectContent>
            {tenants.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name} ({t.id})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Content */}
      {!selectedTenant ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-muted-foreground gap-3 text-center px-4">
          <i className="ti ti-building-skyscraper text-4xl sm:text-5xl opacity-30" />
          <p className="text-sm">Select a tenant from the dropdown to view its details</p>
        </div>
      ) : (
        <TenantDetailContent tenant={selectedTenant} />
      )}
    </div>
  )
}