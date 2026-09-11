"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { COLORS } from "@/lib/tenant-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, PauseCircle } from "lucide-react"
import { IconSearch, IconEdit, IconGrid, IconWarning, IconPlus, CheckCircleIcon } from "@/components/icons"
import { TenantFormDrawer } from "@/components/tenant-form-drawer"
import { TenantViewDrawer } from "@/components/tenant-view-drawer"
import { PaginationBar } from "@/components/ui/pagination-bar"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchTenants, hydrateTenants } from "@/store/slices/tenant-slice"
import { hydratePlans } from "@/store/slices/plan-slice"
import { hydrateBillingCycles } from "@/store/slices/billing-cycle-slice"
import { hydrateEnvironments } from "@/store/slices/environment-slice"
import { useCurrentUserRoles } from "@/components/current-user-provider"
import { canManageTenants } from "@/lib/permissions"
import type { ApiPage, BillingCycleResponseDto, EnvironmentResponseDto, PlanResponseDto, TenantResponseDto } from "@/lib/api-types"
import type { Tenant } from "@/lib/tenant-data"

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

interface TenantsPageClientProps {
  initialTenants: ApiPage<TenantResponseDto>
  initialPlans: ApiPage<PlanResponseDto>
  initialBillingCycles: ApiPage<BillingCycleResponseDto>
  initialEnvironments: ApiPage<EnvironmentResponseDto>
}

export function TenantsPageClient({ initialTenants, initialPlans, initialBillingCycles, initialEnvironments }: TenantsPageClientProps) {
  const dispatch = useAppDispatch()
  const hydrated = useRef(false)
  const skipNextFetch = useRef(true)
  const roles = useCurrentUserRoles()
  const canManage = canManageTenants(roles)

  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true
    dispatch(hydrateTenants(initialTenants))
    dispatch(hydratePlans(initialPlans))
    dispatch(hydrateBillingCycles(initialBillingCycles))
    dispatch(hydrateEnvironments(initialEnvironments))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tenantList = useAppSelector((s) => s.tenants.items)
  const tenantsStatus = useAppSelector((s) => s.tenants.status)
  const page = useAppSelector((s) => s.tenants.page)
  const totalPages = useAppSelector((s) => s.tenants.totalPages)
  const totalElements = useAppSelector((s) => s.tenants.totalElements)
  const plans = useAppSelector((s) => s.plans.items)
  const billingCycles = useAppSelector((s) => s.billingCycles.items)
  const environments = useAppSelector((s) => s.environments.items)

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [planFilter, setPlanFilter] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [formTenant, setFormTenant] = useState<Tenant | null>(null)
  const [viewTenant, setViewTenant] = useState<Tenant | null>(null)
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false)

  // Search/status are server-driven filters — re-fetch (from page 0) on change (debounced).
  // Skip the very first run: the SSR-hydrated data already reflects the initial (empty) filters.
  useEffect(() => {
    if (!hydrated.current) return
    if (skipNextFetch.current) {
      skipNextFetch.current = false
      return
    }
    const timer = setTimeout(() => {
      dispatch(
        fetchTenants({
          search: search || undefined,
          status: statusFilter && statusFilter !== "all" ? statusFilter : undefined,
          size: 10,
        }),
      )
    }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter])

  const goToPage = (nextPage: number) => {
    dispatch(
      fetchTenants({
        search: search || undefined,
        status: statusFilter && statusFilter !== "all" ? statusFilter : undefined,
        page: nextPage,
        size: 10,
      }),
    )
  }

  const openTenantView = (tenant: Tenant) => {
    setViewTenant(tenant)
    setViewDrawerOpen(true)
  }

  const openTenantCreate = () => {
    setFormTenant(null)
    setDrawerOpen(true)
  }

  const openTenantEdit = (tenant: Tenant) => {
    setFormTenant(tenant)
    setDrawerOpen(true)
  }

  // Plan has no server-side filter — apply it to the currently loaded page.
  const filtered = useMemo(() => {
    return tenantList.filter((t) => !planFilter || planFilter === "all" || t.plan === planFilter)
  }, [tenantList, planFilter])

  const activeCount = tenantList.filter((t) => t.status === "active").length
  const suspendedCount = tenantList.filter((t) => t.status === "suspended").length
  const inactiveCount = tenantList.filter((t) => t.status === "inactive").length

  const stats = [
    { label: "Total Tenants", value: totalElements, delta: "this month", color: "bg-[var(--primary)]", icon: IconGrid, up: true },
    { label: "Active", value: activeCount, delta: tenantList.length ? `${Math.round((activeCount / tenantList.length) * 100)}% of total` : "—", color: "bg-[var(--green)]", icon: CheckCircleIcon, up: false },
    { label: "Suspended", value: suspendedCount, delta: "need attention", color: "bg-[var(--amber)]", icon: IconWarning, up: false },
    { label: "Inactive", value: inactiveCount, delta: "not currently active", color: "bg-[var(--purple)]", icon: PauseCircle, up: false },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      {canManage && (
        <div className="flex justify-end">
          <button type="button" onClick={openTenantCreate} className="page-action page-action--labeled">
            <IconPlus className="h-3.5 w-3.5" /> New Tenant
          </button>
        </div>
      )}

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
              {plans.map((p) => (
                <SelectItem key={p.id} value={p.name.toLowerCase()}>{p.name}</SelectItem>
              ))}
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
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Environment</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Billing</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Created</th>
                <th className="px-5 py-3.5 text-right text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenantsStatus === "idle" || tenantsStatus === "loading" ? (
                <TableSkeleton columns={7} />
              ) : filtered.length === 0 ? (
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
                  const initials = t.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
                  return (
                    <tr key={t.id} className="border-b row-hover-brand transition-colors duration-150 cursor-pointer">
                      <td className="px-5 py-4">
                        <button type="button" onClick={() => openTenantView(t)} className="flex items-center gap-3 text-left group">
                          <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold group-hover:shadow-md transition-shadow" style={{ background: c.bg, color: c.color }}>
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{t.name}</p>
                            <p className="text-xs text-muted-foreground font-mono truncate">{t.subdomain}.cloudaxis.io</p>
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
                        <span className="text-sm text-muted-foreground">{t.env}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-muted-foreground">{t.billing}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-mono text-muted-foreground">
                          {new Date(t.created).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="View Detail" onClick={() => openTenantView(t)}>
                            <Eye className="size-4" />
                          </Button>
                          {canManage && (
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" onClick={() => openTenantEdit(t)}>
                              <IconEdit className="size-3" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        <PaginationBar page={page} totalPages={totalPages} totalElements={totalElements} onPageChange={goToPage} />
      </Card>

      <TenantFormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        tenant={formTenant}
        plans={plans}
        billingCycles={billingCycles}
        environments={environments}
        onSaved={() => goToPage(page)}
      />

      <TenantViewDrawer tenant={viewTenant} open={viewDrawerOpen} onOpenChange={setViewDrawerOpen} />
    </div>
  )
}
