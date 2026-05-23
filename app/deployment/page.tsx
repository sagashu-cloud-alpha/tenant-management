"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type DeploymentRow = {
  service: string
  cluster: string
  image: string
  version: string
  status: "Running" | "Stopped"
  cpu: string
  ram: string
  updated: string
}

const rows: DeploymentRow[] = [
  { service: "auth-gateway-svc", cluster: "PROD-CLUSTER-01", image: "gcr.io/acme/auth:latest", version: "v2.4.12", status: "Running", cpu: "1.2 vCPU", ram: "2.4 GB", updated: "2 mins ago" },
  { service: "order-db-proxy", cluster: "PROD-CLUSTER-01", image: "gcr.io/acme/db-proxy:v1", version: "v1.1.0", status: "Stopped", cpu: "0.0 vCPU", ram: "0.0 GB", updated: "1 hour ago" },
  { service: "billing-worker", cluster: "PROD-CLUSTER-02", image: "gcr.io/acme/billing-worker:v3", version: "v3.2.1", status: "Running", cpu: "0.8 vCPU", ram: "1.2 GB", updated: "8 mins ago" },
  { service: "notifications-api", cluster: "PROD-CLUSTER-02", image: "gcr.io/acme/notifications:v5", version: "v5.0.4", status: "Running", cpu: "0.6 vCPU", ram: "1.0 GB", updated: "15 mins ago" },
  { service: "tenant-sync-engine", cluster: "PROD-CLUSTER-03", image: "gcr.io/acme/tenant-sync:v2", version: "v2.7.3", status: "Running", cpu: "1.0 vCPU", ram: "1.8 GB", updated: "24 mins ago" },
  { service: "audit-log-consumer", cluster: "PROD-CLUSTER-03", image: "gcr.io/acme/audit-consumer:v4", version: "v4.3.0", status: "Stopped", cpu: "0.0 vCPU", ram: "0.0 GB", updated: "3 hours ago" },
]

function getBadgeClass(v: string) {
  return v === "running"
    ? "bg-[var(--green-bg)] text-[var(--green)] border border-[var(--green-border)] hover:brightness-110"
    : "bg-[var(--red-bg)] text-[var(--red)] border border-[var(--red-border)] hover:brightness-110"
}

export default function DeploymentPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const filtered = statusFilter === "all" ? rows : rows.filter((r) => r.status.toLowerCase() === statusFilter.toLowerCase())

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">Service Deployments</h1>
        <p className="text-sm text-muted-foreground">Track deployment health, resource usage, and rollout status across services.</p>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Services" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="stopped">Stopped</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="sm">
            <i className="ti ti-refresh mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <i className="ti ti-download mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Service Name</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Docker Image</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Version</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Resources</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Last Updated</th>
                <th className="px-5 py-3.5 text-right text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.service} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[var(--blue-bg)] text-[var(--blue)] flex items-center justify-center text-base">
                        <i className="ti ti-box" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">{row.service}</div>
                        <div className="text-xs text-muted-foreground font-mono truncate">{row.cluster}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs text-muted-foreground truncate block">{row.image}</span>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant="secondary" className="font-mono">
                      {row.version}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge className={getBadgeClass(row.status.toLowerCase())}>
                      {row.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-mono text-xs space-y-0.5">
                      <div className={row.status === "Running" ? "text-foreground" : "text-muted-foreground"}>{row.cpu}</div>
                      <div className="text-muted-foreground">{row.ram}</div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-muted-foreground">{row.updated}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <i className="ti ti-dots-vertical" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-2">
        <div className="text-xs text-muted-foreground">
          Showing 1 - {filtered.length} of {filtered.length} results
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" disabled className="opacity-50">
            <i className="ti ti-chevron-left" />
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            1
          </Button>
          <Button variant="outline" size="sm">
            <i className="ti ti-chevron-right" />
          </Button>
        </div>
      </div>
    </div>
  )
}