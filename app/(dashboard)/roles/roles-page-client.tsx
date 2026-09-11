"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { getRoleBadgeClass, type Role } from "@/lib/role-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Eye, Shield, Users as UsersIcon, ShieldOff, Gauge } from "lucide-react"
import { IconSearch } from "@/components/icons"
import { RoleViewDrawer } from "@/components/role-view-drawer"
import { PaginationBar } from "@/components/ui/pagination-bar"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchRoles, hydrateRoles } from "@/store/slices/role-slice"
import { hydrateUsers } from "@/store/slices/user-slice"
import type { ApiPage, RoleResponseDto, UserResponseDto } from "@/lib/api-types"

interface RolesPageClientProps {
  initialRoles: ApiPage<RoleResponseDto>
  initialUsers: ApiPage<UserResponseDto>
}

export function RolesPageClient({ initialRoles, initialUsers }: RolesPageClientProps) {
  const dispatch = useAppDispatch()
  const hydrated = useRef(false)

  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true
    dispatch(hydrateRoles(initialRoles))
    dispatch(hydrateUsers(initialUsers))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const roles = useAppSelector((s) => s.roles.items)
  const rolesStatus = useAppSelector((s) => s.roles.status)
  const page = useAppSelector((s) => s.roles.page)
  const totalPages = useAppSelector((s) => s.roles.totalPages)
  const totalElements = useAppSelector((s) => s.roles.totalElements)
  const users = useAppSelector((s) => s.users.items)

  const [search, setSearch] = useState("")
  const [viewRole, setViewRole] = useState<Role | null>(null)
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false)

  const goToPage = (nextPage: number) => {
    dispatch(fetchRoles({ page: nextPage, size: 10 }))
  }

  const usersForRole = (name: string) => users.filter((u) => u.roles.includes(name))

  const openRoleView = (role: Role) => {
    setViewRole(role)
    setViewDrawerOpen(true)
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return roles.filter((r) => !q || r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q))
  }, [roles, search])

  const usersCovered = users.filter((u) => u.roles.length > 0).length
  const unassignedRoles = roles.filter((r) => usersForRole(r.name).length === 0).length
  const totalAssignments = roles.reduce((sum, r) => sum + usersForRole(r.name).length, 0)
  const avgAssignments = roles.length ? Math.round(totalAssignments / roles.length) : 0

  const stats = [
    { label: "Total Roles", value: totalElements, delta: "fixed set", color: "bg-[var(--primary)]", icon: Shield },
    { label: "Users Covered", value: usersCovered, delta: "users with at least one role", color: "bg-[var(--green)]", icon: UsersIcon },
    { label: "Unassigned Roles", value: unassignedRoles, delta: "not used by any user", color: "bg-[var(--amber)]", icon: ShieldOff },
    { label: "Avg Assignments", value: avgAssignments, delta: "users per role", color: "bg-[var(--purple)]", icon: Gauge },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card size="sm" key={s.label} className="relative py-4 px-[18px] rounded-[var(--radius-lg)] overflow-hidden transition-colors hover:border-border-strong">
            <div className={`absolute top-0 left-0 right-0 h-[2px] ${s.color}`} />
            <s.icon className="absolute top-4 right-4 h-5 w-5 opacity-[0.15] text-foreground" />
            <div className="text-[12px] font-medium text-muted-foreground">{s.label}</div>
            <div className="text-[28px] font-bold text-foreground leading-none tracking-tight">{s.value}</div>
            <div className="text-[12px] text-[var(--text-muted)]">{s.delta}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative ml-auto w-full sm:w-[260px]">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search roles…"
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
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Role</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Description</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Users</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Created</th>
                <th className="px-5 py-3.5 text-right text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rolesStatus === "idle" || rolesStatus === "loading" ? (
                <TableSkeleton columns={5} rows={3} />
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <IconSearch className="h-10 w-10 opacity-30 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No roles match your search</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const assignedCount = usersForRole(r.name).length
                  return (
                    <tr key={r.id} className="border-b row-hover-brand transition-colors duration-150 cursor-pointer">
                      <td className="px-5 py-4">
                        <button type="button" onClick={() => openRoleView(r)} className="flex items-center gap-3 text-left group">
                          <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center bg-[var(--bg3)] border border-[var(--border)] group-hover:shadow-md transition-shadow">
                            <Shield className="h-4 w-4 text-primary" />
                          </div>
                          <Badge className={getRoleBadgeClass(r.name)}>{r.name}</Badge>
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className="block max-w-[280px] truncate text-sm text-muted-foreground"
                          title={r.description || undefined}
                        >
                          {r.description || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-mono text-muted-foreground">
                          {assignedCount} user{assignedCount !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-mono text-muted-foreground">
                          {new Date(r.created).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="View Detail" onClick={() => openRoleView(r)}>
                            <Eye className="size-4" />
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
        <PaginationBar page={page} totalPages={totalPages} totalElements={totalElements} onPageChange={goToPage} />
      </Card>

      <RoleViewDrawer role={viewRole} open={viewDrawerOpen} onOpenChange={setViewDrawerOpen} users={users} />
    </div>
  )
}
