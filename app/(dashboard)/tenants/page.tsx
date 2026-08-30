"use client"

import { useState, useMemo } from "react"
import { tenants as initialTenants, COLORS, type Tenant } from "@/lib/tenant-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye } from "lucide-react"
import { IconSearch, IconEdit, IconGrid, IconMenuWidgets, IconPlus, CheckCircleIcon, ServerIcon } from "@/components/icons"
import { TenantCreateDrawer } from "@/components/tenant-create-drawer"
import { TenantViewDrawer } from "@/components/tenant-view-drawer"

function getBadgeClass(v: string) {
  if (v === "active" || v === "running") return "bg-[var(--green-bg)] text-[var(--green)] border border-[var(--green-border)] hover:brightness-110"
  if (v === "suspended" || v === "warning") return "bg-[var(--amber-bg)] text-[var(--amber)] border border-[var(--amber-border)] hover:brightness-110"
  if (v === "starter") return "bg-[var(--teal-bg)] text-[var(--teal)] border border-[var(--teal-border)] hover:brightness-110"
  if (v === "pro") return "bg-[var(--blue-bg)] text-[var(--blue)] border border-[var(--blue-bg)] hover:brightness-110"
  if (v === "enterprise") return "bg-[var(--purple-bg)] text-[var(--purple)] border border-[var(--purple-border)] hover:brightness-110"
  return "bg-[var(--bg4)] text-[var(--text2)] border border-[var(--border2)]"
}

function getDotClass(v: string) {
  if (v === "active" || v === "running") return "bg-[var(--green)]"
  if (v === "suspended" || v === "warning") return "bg-[var(--amber)]"
  return "bg-[var(--text3)]"
}

export default function TenantsPage() {
  const [tenantList, setTenantList] = useState<Tenant[]>(() => [...initialTenants])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [planFilter, setPlanFilter] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [viewTenant, setViewTenant] = useState<Tenant | null>(null)
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false)

  const openTenantView = (tenant: Tenant) => {
    setViewTenant(tenant)
    setViewDrawerOpen(true)
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return tenantList.filter((t) => {
      const matchesSearch = !q || t.name.toLowerCase().includes(q) || t.id.includes(q) || t.subdomain.includes(q)
      const matchesStatus = !statusFilter || statusFilter === "all" || t.status === statusFilter
      const matchesPlan = !planFilter || planFilter === "all" || t.plan === planFilter
      return matchesSearch && matchesStatus && matchesPlan
    })
  }, [tenantList, search, statusFilter, planFilter])

  const activeCount = tenantList.filter((t) => t.status === "active").length
  const totalImages = tenantList.reduce((s, t) => s + t.images.length, 0)
  const totalServices = tenantList.reduce((s, t) => s + t.services.length, 0)
  const servicesRunning = tenantList.reduce((s, t) => s + t.services.filter((sv) => sv.status === "running").length, 0)

  const handleCreated = (tenant: Tenant) => {
    initialTenants.push(tenant)
    setTenantList((prev) => [tenant, ...prev])
  }

  const nextId = "tnx-" + String(tenantList.length + 1).padStart(3, "0")

  const stats = [
    { label: "Total Tenants", value: tenantList.length, delta: "this month", color: "bg-[var(--primary)]", icon: IconGrid, up: true },
    { label: "Active", value: activeCount, delta: `${Math.round((activeCount / tenantList.length) * 100)}% of total`, color: "bg-[var(--green)]", icon: CheckCircleIcon, up: false },
    { label: "Docker Images", value: totalImages, delta: "across all tenants", color: "bg-[var(--amber)]", icon: IconMenuWidgets, up: false },
    { label: "Services Running", value: servicesRunning, delta: `${totalServices - servicesRunning} need attention`, color: "bg-[var(--purple)]", icon: ServerIcon, up: false },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="page-action page-action--labeled"
        >
          <IconPlus className="h-3.5 w-3.5" /> New Tenant
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card size="sm" key={s.label} className="relative py-4 px-[18px] rounded-[var(--radius-lg)] overflow-hidden transition-colors hover:border-border-strong">
            <div className={`absolute top-0 left-0 right-0 h-[2px] ${s.color}`} />
            <s.icon className="absolute top-4 right-4 h-5 w-5 opacity-[0.15] text-foreground" />
            <div className="text-[12px] font-medium text-muted-foreground">{s.label}</div>
            <div className="text-[28px] font-bold text-foreground leading-none tracking-tight">{s.value}</div>
            <div className="text-[12px] text-[var(--text-muted)] flex items-center gap-1">
              {s.up && <span className="text-[var(--green)] font-semibold">↑ 2</span>}
              <span>{s.delta}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Plans" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="starter">Starter</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative sm:ml-auto sm:w-[260px]">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search tenants…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Tenant</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Plan</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Images</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Services</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Created</th>
                <th className="px-5 py-3.5 text-right text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <IconSearch className="h-10 w-10 opacity-30 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No tenants match your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const c = COLORS[t.colorIdx]
                  const initials = t.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
                  return (
                    <tr
                      key={t.id}
                      className="border-b row-hover-brand transition-colors duration-150 cursor-pointer"
                    >
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => openTenantView(t)}
                          className="flex items-center gap-3 text-left group"
                        >
                          <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold group-hover:shadow-md transition-shadow" style={{ background: c.bg, color: c.color }}>
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{t.name}</p>
                            <p className="text-xs text-muted-foreground font-mono truncate">{t.id} · {t.subdomain}.cloudaxis.io</p>
                          </div>
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <Badge className={getBadgeClass(t.status)}>
                          <span className={`w-1.5 h-1.5 rounded-full ${getDotClass(t.status)} mr-1.5`} />
                          {t.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <Badge className={getBadgeClass(t.plan)}>{t.plan}</Badge>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-mono text-muted-foreground">
                          {t.images.length} image{t.images.length !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-mono text-muted-foreground">
                          {t.services.length} service{t.services.length !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-mono text-muted-foreground">
                          {new Date(t.created).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="View Detail" onClick={() => openTenantView(t)}>
                            <Eye className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit">
                            <IconEdit className="size-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <TenantCreateDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        nextId={nextId}
        onCreated={handleCreated}
      />

      <TenantViewDrawer
        tenant={viewTenant}
        open={viewDrawerOpen}
        onOpenChange={setViewDrawerOpen}
      />
    </div>
  )
}
